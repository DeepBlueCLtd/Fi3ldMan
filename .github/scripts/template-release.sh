#!/usr/bin/env bash
#
# Build a versioned release package for the pub-5 publishing template.
#
# Version numbers live in git tags, not in the tree, so the payload file count
# quoted throughout context-docs/12-template-transfer-air-gapped-network.md
# stays correct. See context-docs/14-template-releases.md for the scheme.
#
# Usage:
#   .github/scripts/template-release.sh [--dry-run] [--out DIR]
#
# Writes the zip and a release-notes file to DIR (default ./dist), and prints
# shell-style KEY=VALUE lines the workflow reads back:
#
#   VERSION=1.0.1
#   TAG=pub-5-template-2026-v1.0.1
#   ZIP=dist/fi3ldman-pub5-template-2026-v1.0.1.zip
#   NOTES=dist/release-notes.md
#
# --dry-run changes nothing here; it is passed through to the caller, which
# uses it to decide whether to tag and publish.

set -euo pipefail

# --- The template being released ------------------------------------------
# Change these three together when the template year rolls over (e.g. to
# template-2028). A new TAG_PREFIX starts a fresh v1.0.0 series without
# disturbing the old one; the two series coexist. The push path filter in
# .github/workflows/template-release.yml has to move at the same time.
TEMPLATE_DIR="publications/pub-5/template-2026"
TAG_PREFIX="pub-5-template-2026-v"
ASSET_STEM="fi3ldman-pub5-template-2026"
# Template-relative. Must stay under resources/, the only part of the template
# Oxygen copies into the published output (see the <fileset> in f13ldMan.opt).
VERSION_FILE="resources/template-version.txt"
# --------------------------------------------------------------------------

DRY_RUN=0
OUT_DIR="dist"

while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --out)     OUT_DIR="${2:?--out needs a directory}"; shift 2 ;;
    -h|--help) sed -n '2,25p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

[ -d "$TEMPLATE_DIR" ] || { echo "no such template: $TEMPLATE_DIR" >&2; exit 1; }

# Deleting the placeholder would silently produce publishes with no version
# marker at all, which is the one thing this file exists to prevent.
[ -f "$TEMPLATE_DIR/$VERSION_FILE" ] || {
  echo "missing $TEMPLATE_DIR/$VERSION_FILE — it must be committed, see context-docs/14-template-releases.md" >&2
  exit 1
}

TEMPLATE_PARENT="$(dirname "$TEMPLATE_DIR")"
TEMPLATE_NAME="$(basename "$TEMPLATE_DIR")"

# --- Work out the next version --------------------------------------------
# sort -V orders 1.9.0 before 1.10.0, which plain sort does not.
# The trailing `|| true` matters: under `set -o pipefail` an empty tag list
# makes grep exit 1, which would otherwise abort the script on a first release.
PREV_VERSION="$(git tag --list "${TAG_PREFIX}*" \
  | sed "s|^${TAG_PREFIX}||" \
  | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' \
  | sort -V | tail -1 || true)"

if [ -z "$PREV_VERSION" ]; then
  # First release. The template is complete and already in service, so it
  # starts at 1.0.0 rather than 0.x — and there is no commit range to scan.
  VERSION="1.0.0"
  PREV_TAG=""
  BUMP="initial"
else
  PREV_TAG="${TAG_PREFIX}${PREV_VERSION}"

  # Scan every commit since the last release, not just the pushed ones: a
  # marker in a commit that touched nothing in the template, or one whose
  # release run failed, is then still honoured next time round instead of
  # being silently lost.
  RANGE_LOG="$(git log --format=%B "${PREV_TAG}..HEAD")"

  if printf '%s' "$RANGE_LOG" | grep -qiE '\[major\]'; then
    BUMP="major"
  elif printf '%s' "$RANGE_LOG" | grep -qiE '\[minor\]'; then
    BUMP="minor"
  else
    BUMP="patch"
  fi

  IFS='.' read -r MAJOR MINOR PATCH <<< "$PREV_VERSION"
  case "$BUMP" in
    major) VERSION="$((MAJOR + 1)).0.0" ;;
    minor) VERSION="${MAJOR}.$((MINOR + 1)).0" ;;
    patch) VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))" ;;
  esac
fi

TAG="${TAG_PREFIX}${VERSION}"

if git rev-parse -q --verify "refs/tags/${TAG}" >/dev/null; then
  echo "tag ${TAG} already exists — refusing to overwrite a published release" >&2
  exit 1
fi

# --- Build the archive ----------------------------------------------------
mkdir -p "$OUT_DIR"
OUT_ABS="$(cd "$OUT_DIR" && pwd)"
ZIP="${OUT_ABS}/${ASSET_STEM}-v${VERSION}.zip"
rm -f "$ZIP"

SOURCE_COMMIT="$(git rev-parse HEAD)"

# Staged into a temporary copy rather than stamped in place: a release build
# must not dirty the working tree, and the committed placeholder has to survive
# a local run untouched.
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
cp -a "$TEMPLATE_DIR" "$STAGE/$TEMPLATE_NAME"
rm -f "$STAGE/$TEMPLATE_NAME"/MANIFEST*

# Stamp the version into the file Oxygen copies into every published output, at
# oxygen-webhelp/template/resources/template-version.txt. That is the only way
# to tell, from a published publication alone, which template built it. The
# file is committed with an "(unreleased)" placeholder so a working-tree build
# says so rather than saying nothing; this overwrites it for the release.
cat > "$STAGE/$TEMPLATE_NAME/$VERSION_FILE" <<EOF
Fi3ldMan publishing template — pub-5 / template-2026
====================================================

Version:        ${VERSION}
Tag:            ${TAG}
Source commit:  ${SOURCE_COMMIT}
Packaged:       $(date -u '+%Y-%m-%dT%H:%M:%SZ')

Oxygen copies this file into every published output, at
  oxygen-webhelp/template/resources/template-version.txt
so the version of the template a publication was built with can be read off
the published output itself.

Record the version above in the transfer record, alongside the source commit.
See context-docs/14-template-releases.md.
EOF

# Zipped from the staging parent so the archive root is template-2026/ — the
# same shape as the hand-built package in Phase B of
# context-docs/12-template-transfer-air-gapped-network.md. -X drops extra file
# attributes.
( cd "$STAGE" && zip -q -r -X "$ZIP" "$TEMPLATE_NAME" )

FILE_COUNT="$(find "$STAGE/$TEMPLATE_NAME" -type f | wc -l | tr -d ' ')"

# --- Release notes --------------------------------------------------------
NOTES="${OUT_ABS}/release-notes.md"
{
  echo "Publishing template \`${TEMPLATE_DIR}\`, packaged as \`$(basename "$ZIP")\`."
  echo
  echo "| | |"
  echo "| --- | --- |"
  echo "| Template version | \`${VERSION}\` |"
  echo "| Source commit | \`${SOURCE_COMMIT}\` |"
  echo "| Files in payload | ${FILE_COUNT} |"
  echo "| Bump | ${BUMP} |"
  echo

  if [ -n "$PREV_TAG" ]; then
    echo "### Template changes since \`${PREV_TAG}\`"
    echo
    git log --format='- %s' "${PREV_TAG}..HEAD" -- "$TEMPLATE_DIR" || true
    echo
  fi

  echo "### Using this package"
  echo
  echo "Download the zip and take it through Phase C onwards of"
  echo "\`context-docs/12-template-transfer-air-gapped-network.md\`. The archive"
  echo "root is \`${TEMPLATE_NAME}/\`, identical to the hand-built package, so the"
  echo "documented procedure applies unchanged."
  echo
  echo "**The integrity manifest is not included.** Generate it from the extracted"
  echo "folder before the payload crosses the gateway, per Phase B:"
  echo
  echo '```bash'
  echo "cd ${TEMPLATE_NAME}"
  echo "find . -type f -not -name 'MANIFEST*' | sort | xargs sha256sum -b > MANIFEST.sha256"
  echo '```'
  echo
  echo "Record the template version above in the transfer record alongside the"
  echo "source commit."
  echo
  echo "### Reading the version off a published output"
  echo
  echo "A publication built with this template carries the stamp at"
  echo "\`oxygen-webhelp/template/resources/template-version.txt\`, so the template"
  echo "version behind any published instance can be read without asking anyone."
} > "$NOTES"

# --- Report back ----------------------------------------------------------
echo "VERSION=${VERSION}"
echo "TAG=${TAG}"
echo "PREV_TAG=${PREV_TAG}"
echo "BUMP=${BUMP}"
echo "ZIP=${ZIP}"
echo "NOTES=${NOTES}"
echo "FILE_COUNT=${FILE_COUNT}"
echo "DRY_RUN=${DRY_RUN}"
