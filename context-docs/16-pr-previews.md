# Per-PR previews of the published site

`site/` is the deliverable. It is also the only part of this repository whose
correctness is a matter of what it *looks like* — and until now the only way to
review a change to it was to read a diff of generated HTML, or to fetch the
branch and run `npm start`. A pull request that changes `site/` now gets a
browsable copy of itself, and a link to it in a comment on the PR.

```
https://deepbluecltd.github.io/Fi3ldMan/           the live site, from main
https://deepbluecltd.github.io/Fi3ldMan/pr/193/    PR #193, updated on every push
```

The preview is deleted when the PR closes, merged or not.

## What had to change, and the one thing you have to do by hand

GitHub Pages serves **one** source per repository. It used to be "GitHub
Actions" here, which serves exactly one deployment — there is nowhere for a
second copy of the site to live, so per-PR previews are impossible under it at
any price. The source is now a branch:

> **Settings → Pages → Build and deployment → Source: Deploy from a branch,
> Branch: `gh-pages` / `(root)`**

That setting is not in the repository and cannot be changed by a workflow. Flip
it **after** the first push to `main` has created and populated `gh-pages`,
which the workflow does on its own. Between merging and flipping, the live site
keeps serving the last Actions deployment — stale, but whole. Flipping first
would serve an empty branch.

The old `upload-pages-artifact` / `deploy-pages` pair is gone. Nothing else
about publishing changes: Oxygen still writes to `publications/<pub>/dita/out/`,
the verified output is still copied over `site/` and committed, and merging to
`main` still deploys it.

## How it works

`.github/workflows/pages.yml` has three jobs, all of them thin wrappers around
`.github/scripts/gh-pages-publish.sh`:

| Job | Fires on | Does |
| --- | --- | --- |
| `deploy-main` | push to `main` touching `site/` | Rebuilds the branch root from `site/` |
| `preview` | PR opened / pushed / reopened | Rebuilds `pr/<n>/`, then comments |
| `cleanup` | PR closed | Deletes `pr/<n>/` and retires the comment |

The script is ours rather than a published action, for three reasons that are
each worth more than the convenience of a one-line `uses:`.

**A Fi3ldMan publish replaces a tree.** `site/pub-5/current/` is overwritten
wholesale by the next Oxygen run, so a page the publication has dropped must
stop being served. Every preview scheme built on `peaceiris/actions-gh-pages`
needs `keep_files: true` — without it, a push to `main` wipes every open PR's
preview — and that flag would leave the dropped page live for good. Neither
`check-publish.py` nor the styling suite would catch it: both read the
repository, not the deployment. So each mode replaces the tree it owns and
leaves the trees it does not alone. `deploy-main` rebuilds the root but never
touches `pr/`; `preview` rebuilds one `pr/<n>/`.

**Coreutils only, no `rsync`.** It runs the same on a runner and on a
maintainer's machine. You can point it at a throwaway remote and watch what it
does:

```bash
git init --bare /tmp/pages-test.git
git remote add testpages /tmp/pages-test.git
GH_PAGES_REMOTE=testpages PREVIEW_SHA=$(git rev-parse HEAD) \
  .github/scripts/gh-pages-publish.sh preview 999
```

**Concurrency is handled where it happens.** A repository-wide `concurrency`
group would look right and be wrong: GitHub keeps only the most recent *pending*
run in a group and cancels the rest, so one busy PR could cancel another PR's
preview outright. The group is per PR instead, and pushes that collide at the
remote are retried — the script refetches and rebuilds from the new tip, which
is safe precisely because every mode derives its content from scratch.

## What a preview leaves out, and why

| Left out | Size | Why |
| --- | --- | --- |
| `pub-5/oxygen-25`, `-26`, `-28` | 46 MB | Byte-exact records of a past Oxygen version. Frozen means frozen: no PR can change one |
| `legacy-regions/` | 26 MB | Archived, not developed |

That takes a preview from 113 MB to about 44 MB, which is what makes several
open at once comfortable: GitHub Pages serves at most **1 GB** per site, and
that budget covers the live site and every live preview together. The hub
page's links into those two folders are rewritten to absolute live-site URLs,
so nothing 404s, and the banner on the preview's front page says so.

Two other limits worth knowing: branch-served Pages allows roughly **10 builds
an hour**, and `gh-pages` accumulates a commit per deploy. The commits are
cheap — git stores one copy of a blob however many trees point at it, and a
preview is mostly files identical to `main` — but the branch is not free
forever. If it ever needs resetting, the content is fully derived: an orphan
commit of `site/` plus the open PRs' previews reproduces it.

## The case this is designed around: a PR with nothing to preview

Most pull requests here change `publications/` and not `site/`. A template,
stylesheet, script or DITA edit reaches the published output only when someone
republishes from Oxygen and commits the result — so a preview built from such
a PR would be **byte-identical to the live site**, while appearing to a
reviewer to show the change in context. That is worse than no preview: it
invites the conclusion that the change was seen working when nothing of it was
on screen.

So the workflow compares `site/` across the PR (three-dot, so a busy `main`
does not register as this branch's doing) and, when nothing there changed,
deploys nothing and says why in the comment.

The tempting next step is to overlay the PR's changed `template-2026`
stylesheets and scripts onto a copy of `site/pub-5/current/` — which is exactly
what Oxygen does for those files, and what verifying issue #192 by hand
amounted to. It would cover most template PRs honestly. It is not here yet
because it cannot represent an XSLT or page-template change, both of which
alter the generated HTML, and a simulation that silently stops simulating is
the same trap in a different place. If it is built, the label has to be
impossible to miss.

## Forks

A `pull_request` run from a fork gets a read-only token, so it cannot push to
`gh-pages`. The `preview` job skips those rather than failing. Every PR in this
repository comes from a branch in this repository.
