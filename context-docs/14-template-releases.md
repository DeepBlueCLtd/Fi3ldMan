# Publishing template releases

The publishing template under `publications/pub-5/template-2026/` is the thing
that actually travels to the air-gapped network. Until now it had no version
identity: no version field in `f13ldMan.opt`, no tags in the repository, no
changelog. The only way to say which template was installed on a target was to
quote a git commit hash into the transfer record — accurate, but not something
anyone can say out loud or match against what is in front of them.

This document describes the release mechanism that gives it a version number.

> Packaging by hand still works and is still documented — see Phase B of
> `12-template-transfer-air-gapped-network.md`. A release is a convenience and
> a naming scheme, not a new dependency.

## What happens on a push to `main`

`.github/workflows/template-release.yml` runs when a push to `main` touches
anything under `publications/pub-5/template-2026/`. It:

1. works out the next version number (below);
2. zips the template folder;
3. creates the git tag and a GitHub release carrying that zip.

A push that touches only `site/`, the tests or the docs makes no release, so
version numbers map one-to-one onto real template changes. That is exactly what
the transfer record needs: if the number has not moved, the payload has not
moved either.

## The version number

Semantic versioning, in tags of the form:

```
pub-5-template-2026-v1.4.0
```

The prefix names the publication and the template generation, so when the year
rolls over to `template-2028` it starts its own `v1.0.0` series and the two
coexist. Changing generation means editing the three constants at the top of
`.github/scripts/template-release.sh` and the path filter in the workflow.

The first release is `1.0.0` — the template is complete and in service, so `0.x`
would understate it.

### How the digit is chosen

**Patch is the default.** Every qualifying push increments the last digit with
no author effort at all.

**Major and minor are opt-in, via a marker in a commit message.** Put `[minor]`
or `[major]` anywhere in a commit subject or body — a PR title works for both
merge strategies, since a merge commit body carries the PR title and a squash
commit subject *is* the PR title. `[major]` wins if both appear. Matching is
case-insensitive.

The marker is looked for across every commit since the previous release tag, not
only the commits in the triggering push. That way a marker written in a commit
that happened to touch nothing in the template, or one whose release run failed,
is honoured on the next release rather than silently lost. The flip side: a
marker means "the next template release is a minor one", so do not use those two
words in brackets for anything else.

### When to use which

`12-template-transfer-air-gapped-network.md` already sorts template edits into
"needs a full re-transfer" and "no re-transfer needed". That table is the rule
behind the marker:

| Digit | Marker | Meaning for the target |
| --- | --- | --- |
| Patch | none | Cosmetic or internal. The target can stay as it is. |
| Minor | `[minor]` | Worth re-transferring: new behaviour, changed rendering, new file. |
| Major | `[major]` | The target **must** re-transfer, and the receiving procedure itself changed — a new Oxygen base, a changed file count, a renamed or removed payload file. |

Without that discipline `v1.0.14` tells the receiving operator nothing about
whether they need to act, which is most of the point of having a number.

## Reading the version off a published output

The tag is where the version is *decided*, but a tag is no use to someone
holding a published publication. So the release also **stamps the version into
the template**, at:

```
resources/template-version.txt
```

`resources/` is the only part of the template Oxygen copies into the output (the
`<fileset>` in `f13ldMan.opt`), so every publish carries the stamp at:

```
<publish>/oxygen-webhelp/template/resources/template-version.txt
```

Open it and it names the version, the tag, the source commit and the packaging
time. That answers "which template built this?" from the published output
alone — no repository access, no asking whoever ran the publish.

The file is **committed with an `(unreleased)` placeholder**, and the release
script overwrites it in a staging copy at packaging time — the working tree is
never dirtied by a build. Two consequences worth knowing:

- A publish built straight from a working-tree checkout says
  `Version: (unreleased)` rather than saying nothing. That is the honest
  answer, and it is distinguishable at a glance from a real version.
- The payload is **41 files**, not 40, and it is 41 whether the package came
  from a release or was built by hand. There is no divergence between the two
  routes to keep track of.

The file is plain text and small, and it is covered by `MANIFEST.sha256` like
everything else, so a stamp corrupted in transit is caught by the Phase D check.

## What is in a release

One asset: `fi3ldman-pub5-template-2026-v<version>.zip`. The archive root is
`template-2026/`, byte-for-byte the same shape as the hand-built Phase B
package, so the documented transfer procedure applies to it unchanged. The only
difference from a hand-built package is that `resources/template-version.txt`
carries a real version rather than the placeholder.

The release notes record the source commit, the file count and the template
commits since the previous release — the values the transfer record wants.

**The release does not contain `MANIFEST.sha256`.** The integrity manifest is a
per-transfer artefact that has to be generated on the trusted side of the
gateway, immediately before the payload crosses; see Phase B. Generate it from
the extracted folder:

```bash
cd template-2026
find . -type f -not -name 'MANIFEST*' | sort | xargs sha256sum -b > MANIFEST.sha256
```

The `-b` is required — `verify-integrity.ps1` cannot parse the other form.

## Building a package locally

The workflow runs a script rather than inline YAML precisely so that the same
package can be produced without CI — on a machine with no network, or when
checking what a release will contain before pushing:

```bash
.github/scripts/template-release.sh --dry-run --out dist
```

It prints the version it would use and writes the zip and the release notes to
`dist/` (gitignored). `--dry-run` only tells the caller not to tag or publish;
the archive is identical either way.

## Testing a change to the workflow

The workflow and its script are deliberately **not** in the push path filter:
editing CI is not a template change and must not mint a version. Exercise
changes to them with the manual `workflow_dispatch` run, leaving `dry_run`
ticked — it builds the package and uploads it as an Actions artifact without
creating a tag or a release.
