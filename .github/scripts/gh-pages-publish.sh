#!/usr/bin/env bash
#
# Publishes onto the gh-pages branch, which is what GitHub Pages serves for
# this repository.
#
#   gh-pages-publish.sh site                 the live site, at the branch root
#   gh-pages-publish.sh preview <pr-number>  a PR preview, at pr/<n>/
#   gh-pages-publish.sh remove  <pr-number>  delete a closed PR's preview
#
# Written out rather than handed to a published action because of one detail
# the usual actions get wrong for this repository: a Fi3ldMan publish
# *replaces* a tree. `site/pub-5/current/` is overwritten wholesale by the next
# Oxygen run, so a page the publication has dropped must stop being served.
# The common `keep_files: true` setting — which a preview scheme needs, or a
# push to main wipes every open PR's preview — would leave that page live for
# good, and neither `check-publish.py` nor the styling suite would notice,
# because both read the repository rather than the deployment.
#
# So each mode replaces the tree it owns and does not touch the trees it does
# not: `site` rebuilds the branch root but leaves `pr/` alone, `preview`
# rebuilds one `pr/<n>/`, `remove` deletes one. Coreutils only — no rsync, so
# this runs the same on a runner and on a maintainer's machine.
#
# Re-deriving from scratch every time is also what makes the retry loop safe:
# two runs racing cannot half-apply each other's work, and a rejected push just
# means starting again from the new tip.

set -euo pipefail

MODE=${1:?usage: gh-pages-publish.sh site|preview|remove [pr-number]}
PR_NUMBER=${2:-}

REPO_ROOT=$(git rev-parse --show-toplevel)
LIVE_SITE="https://deepbluecltd.github.io/Fi3ldMan"
BRANCH=gh-pages
ATTEMPTS=5
# Overridable so this can be exercised against a throwaway local remote before
# it is ever pointed at the repository. Always `origin` in CI.
REMOTE=${GH_PAGES_REMOTE:-origin}
# Somewhere to land the fetch that is not FETCH_HEAD, which two runs in one
# repository would overwrite under each other.
REMOTE_REF="refs/gh-pages-publish/$BRANCH"
# Exit code meaning "someone else pushed first", as distinct from any real
# failure: only this one is retried.
REJECTED=9

log() { echo "==> $*"; }

# Checks out the current gh-pages into a fresh worktree, creating the branch
# on the first ever run.
#
# The worktree is left on a detached HEAD and the push names its target
# explicitly. Checking the branch out by name looks tidier and is a trap: git
# refuses to check out a branch that another worktree already holds, so two
# runs sharing a repository would fight over it.
prepare_worktree() {
  WORKTREE=$(mktemp -d)
  ORPHAN_BRANCH=
  git worktree prune

  # "The branch is not there yet" and "the fetch failed" must not be confused.
  # Treating any failure as absence — which is what a bare `git fetch ||` does
  # — turns a flaky network into an orphan commit containing one PR preview and
  # none of the site. That push would be rejected rather than destructive, but
  # only by luck, and it would look like an unexplained failure rather than a
  # transient one. `ls-remote --exit-code` distinguishes them: 2 means no such
  # ref, anything else non-zero means we could not ask.
  local lookup=0
  git ls-remote --exit-code --heads "$REMOTE" "$BRANCH" >/dev/null 2>&1 || lookup=$?

  case "$lookup" in
    0)
      git fetch --depth 1 --force "$REMOTE" "refs/heads/$BRANCH:$REMOTE_REF"
      git worktree add -f --detach "$WORKTREE" "$REMOTE_REF" >/dev/null
      ;;
    2)
      log "$BRANCH does not exist yet — creating it"
      # A unique name: this is only ever a staging post for the first commit,
      # and a fixed one would collide with a concurrent run.
      ORPHAN_BRANCH="gh-pages-init-$$"
      git worktree add -f --detach "$WORKTREE" HEAD >/dev/null
      git -C "$WORKTREE" checkout --orphan "$ORPHAN_BRANCH" >/dev/null 2>&1
      git -C "$WORKTREE" rm -rqf . >/dev/null 2>&1 || true
      ;;
    *)
      echo "cannot read $BRANCH from $REMOTE (git ls-remote exited $lookup)" >&2
      exit "$lookup"
      ;;
  esac

  git -C "$WORKTREE" config user.name 'github-actions[bot]'
  git -C "$WORKTREE" config user.email 'github-actions[bot]@users.noreply.github.com'
}

discard_worktree() {
  git worktree remove --force "$WORKTREE" >/dev/null 2>&1 || rm -rf "$WORKTREE"
  if [[ -n "${ORPHAN_BRANCH:-}" ]]; then
    git branch -D "$ORPHAN_BRANCH" >/dev/null 2>&1 || true
  fi
}

# The branch root, less `pr/` and the bookkeeping files that are not ours.
apply_site() {
  find "$WORKTREE" -mindepth 1 -maxdepth 1 \
    ! -name .git ! -name pr ! -name .nojekyll \
    -exec rm -rf {} +
  cp -a "$REPO_ROOT/site/." "$WORKTREE/"

  # Branch-served Pages runs the content through Jekyll unless told not to.
  # Nothing here is a Jekyll site and the publication is 2,000 files.
  touch "$WORKTREE/.nojekyll"
}

apply_preview() {
  local target="$WORKTREE/pr/$PR_NUMBER"
  rm -rf "$target"
  mkdir -p "$target"
  cp -a "$REPO_ROOT/site/." "$target/"

  # Frozen snapshots and the archived legacy publication: 72MB of the site's
  # 113MB, and neither can change in a pull request — a `pub-5/oxygen-NN/`
  # folder is a byte-exact record of a past Oxygen version, and
  # `legacy-regions/` is not developed. Leaving them out is what keeps a
  # preview near 44MB, which is what makes several open at once comfortable
  # against the 1GB GitHub Pages limit.
  rm -rf "$target"/pub-5/oxygen-* "$target/legacy-regions"

  # The hub page links to both. Point those links at the live site rather than
  # leaving a reviewer to discover the gap by clicking into it.
  sed -i -E \
    "s#href=\"(legacy-regions/|pub-5/oxygen-[^\"/]+/)#href=\"$LIVE_SITE/\1#g" \
    "$target/index.html"

  # Say which build this is, on the page a reviewer lands on. A preview that
  # looks exactly like the live site is the thing to avoid.
  python3 - "$target/index.html" "$PR_NUMBER" "${PREVIEW_SHA:-unknown}" <<'PY'
import html, sys
path, pr, sha = sys.argv[1], sys.argv[2], sys.argv[3]
banner = (
    '<div style="background:#fff3cd;border-bottom:1px solid #e0c97f;'
    'padding:10px 16px;font:14px/1.5 Arial,sans-serif;color:#5c4500">'
    f'<strong>Preview of pull request #{html.escape(pr)}</strong> '
    f'&middot; commit <code>{html.escape(sha[:7])}</code> &middot; '
    'not the live site. Frozen <code>oxygen-NN</code> snapshots and '
    '<code>legacy-regions</code> are not copied into a preview; those links '
    'lead to the live site.</div>'
)
source = open(path, encoding='utf-8').read()
marker = '<body>'
if marker not in source:
    raise SystemExit(f'{path}: no {marker} to put the preview banner after')
open(path, 'w', encoding='utf-8').write(source.replace(marker, marker + banner, 1))
PY
}

apply_remove() {
  rm -rf "$WORKTREE/pr/$PR_NUMBER"
}

commit_message() {
  case "$MODE" in
    site)    echo "Publish site (${GITHUB_SHA:-unknown})" ;;
    preview) echo "Preview for PR #$PR_NUMBER (${PREVIEW_SHA:-unknown})" ;;
    remove)  echo "Remove the preview for PR #$PR_NUMBER" ;;
  esac
}

# Runs in a subshell and exits it: 0 published (or nothing to do), $REJECTED
# if someone else got there first, anything else a real failure. See the call
# site for why it is invoked the way it is.
publish_once() {
  prepare_worktree

  case "$MODE" in
    site)    apply_site ;;
    preview) apply_preview ;;
    remove)  apply_remove ;;
    *)       echo "unknown mode: $MODE" >&2; exit 2 ;;
  esac

  git -C "$WORKTREE" add --all
  if git -C "$WORKTREE" diff --cached --quiet; then
    log "nothing to publish"
    discard_worktree
    exit 0
  fi

  git -C "$WORKTREE" commit -q -m "$(commit_message)"
  if git -C "$WORKTREE" push "$REMOTE" "HEAD:refs/heads/$BRANCH"; then
    discard_worktree
    exit 0
  fi

  discard_worktree
  exit "$REJECTED"
}

# Digits only. The number comes from the event payload and is always an
# integer, but it is interpolated straight into a path that `rm -rf` is pointed
# at, and a guard is cheaper than trusting that forever: empty would delete
# every preview, `..` would climb out of `pr/`.
if [[ "$MODE" != "site" ]]; then
  if [[ ! "$PR_NUMBER" =~ ^[0-9]+$ ]]; then
    echo "mode $MODE needs a PR number, got '${PR_NUMBER}'" >&2
    exit 2
  fi
fi

for attempt in $(seq "$ATTEMPTS"); do
  # Three things here are load-bearing, and the obvious spellings of this loop
  # get it wrong. Bash ignores errexit inside anything used as a condition, so
  # `if publish_once` or `publish_once || status=$?` would carry blithely on
  # past a failed copy and publish whatever it had managed — and that
  # suppression is inherited by a subshell, so wrapping it in one does not help
  # either. What works is calling it outside any condition, reading `$?`
  # afterwards, and re-arming errexit *inside* the subshell — because the
  # `set +e` that stops a failure killing this loop is itself inherited.
  set +e
  ( set -e; publish_once )
  status=$?
  set -e
  case "$status" in
    0)           exit 0 ;;
    "$REJECTED") log "push rejected (attempt $attempt of $ATTEMPTS) — refetching"
                 sleep $((attempt * 3)) ;;
    *)           exit "$status" ;;
  esac
done

echo "could not push to $BRANCH after $ATTEMPTS attempts" >&2
exit 1
