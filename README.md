# Fi3ldMan

Field Service Manual with advanced data exploitation.

Fi3ldMan authors technical publications in DITA XML and publishes them as
static WebHelp sites with Oxygen XML Editor. Oxygen runs on an author's
machine; the verified HTML output is committed to this repository and served
from it.

**Published site:** <https://deepbluecltd.github.io/Fi3ldMan/>

## Map of the repository

| Folder | What it holds |
| --- | --- |
| `publications/` | All DITA source and publishing templates — one self-contained folder per publication, plus `compare-classes.py` |
| `site/` | Everything GitHub Pages serves, and nothing else |
| `tests/publish/` | Browser tests that assert a published output is correctly styled |
| `context-docs/` | Project knowledge: architecture, content model, templates, workflows |
| `archive/` | Kept but unused — see `archive/README.md` |

### `publications/`

| | |
| --- | --- |
| `pub-5/` | The main publication. `dita/` source, `template-2026/` (current, Oxygen 28.1, and now **shared with pub-10**), `template-2024/` (what the oxygen-26 publish was built with), `check-publish.py`, `audit-classes.py`, and pub-5's ditaval / author layout / icon-audit config |
| `pub-10/` | Spectral analysis ("Grams"). `dita/` source only — it has no template of its own. Published twice from `pub-5/template-2026/`: the full edition to `site/pub-10/current/`, and the redacted one to `site/pub-9/current/` via a single `audience` filter |
| `legacy-regions/` | Archived DITA specialization with a custom DTD. Kept for reference, not developed |

Oxygen writes each publish to a gitignored `out/` inside the publication.
Nothing under `publications/` is served.

### `site/`

| | |
| --- | --- |
| `index.html` | The hub page — a section per publication |
| `pub-5/current/` | The browsable pub-5 publish. The only pub-5 folder a publish overwrites |
| `pub-5/oxygen-28/`, `oxygen-26/`, `oxygen-25/` | **Frozen** publishes, one per Oxygen version — byte-exact snapshots to diff a new publish against, and browsable pages in their own right. See `site/pub-5/README.md` |
| `pub-10/current/` | The pub-10 publish — the full "Grams" edition |
| `pub-9/current/` | The pub-9 publish — the same source with the answers filtered out |
| `legacy-regions/` | The legacy publication's output |
| `mockups/` | Dynamic-table prototypes, and the original hand-built pub-9 / pub-10 previews |

`.github/workflows/pages.yml` deploys `site/` and nothing else. There is no
build step in CI — the workflow just uploads the folder.

### Workflows

| | |
| --- | --- |
| `pages.yml` | Uploads `site/` to GitHub Pages on a push to `main` |
| `template-release.yml` | Versions and publishes `publications/pub-5/template-2026/` as a release zip when a push to `main` changes it. See `context-docs/14-template-releases.md` |

## Publishing a change

1. Author DITA in Oxygen and run the publication's WebHelp scenario. Output
   lands in the gitignored `publications/<pub>/dita/out/`.
2. Verify it:
   ```bash
   python publications/pub-5/check-publish.py <output-dir>   # pages, refs, scripts
   PUBLISH_DIR=<output-dir> npm test                         # styling suite
   ```
   First time on a machine, install the suite — see
   `tests/publish/README.md`. In short: `yarn install --frozen-lockfile`
   (the lockfile is `yarn.lock`, so `npm ci` will not work) then
   `npx playwright install chromium`. Behind TLS interception, prefix every
   Node command with `NODE_OPTIONS=--use-system-ca`.
3. Diff it against the frozen publish for the Oxygen version you built with —
   `site/pub-5/README.md` explains how, and why `buildId` must be normalised
   first or every page looks changed.
4. Copy the verified output over the publication's `site/` folder and commit —
   `site/pub-5/current/`, `site/pub-10/current/` for the full Grams edition, or
   `site/pub-9/current/` for the redacted one. Merging to `main` deploys it.

`npm start` serves `site/` locally — the same folder Pages serves.

## Deciding what a stylesheet still needs to carry

`publications/pub-5/audit-classes.py` reads a set of DITA source materials and
a publishing template and sorts every class into three:

```bash
python publications/pub-5/audit-classes.py publications/pub-5/dita \
    --output site/pub-5/current
```

- **used, styled** — an `outputclass` with a rule behind it.
- **used, no rule** — an `outputclass` no stylesheet defines, so it renders as
  if it were not there. `colorDarkBlue` sat here for years, which is why
  "This title is in blue" came out black.
- **styled, unused** — a rule nothing asks for, with columns showing whether a
  script, the page templates or a published build can still apply it. Only a
  class with no evidence in any of them is offered as a deletion candidate,
  because most of `f13ldman.css` exists to restyle Oxygen's own markup rather
  than to serve an `outputclass`.

Standard library only, so it runs anywhere Python does — including on a client
machine with a source tree and nothing installed. Point it at every source
tree that matters before deleting anything: both lists are relative to the
material given, and a rule unused by one publication may be load-bearing in
another.

### Can one template serve several publications?

`publications/compare-classes.py` asks the question the other way round: across
every publication at once, against a single candidate template.

```bash
python publications/compare-classes.py pub-5 pub-10
```

It prints each `outputclass` with a per-publication count and a SHARED /
`<pub>`-ONLY tag, then the classes the candidate fails to style — the migration
blockers — and the rules it styles for nobody. Run it before adopting a shared
template, and re-run it whenever a publication gains source.

`context-docs/15-shared-publishing-template.md` records what it found for pub-5
and pub-10 — the 2026 template already styled every pub-10 class, and pub-10's
own template was `template-2024` plus one script tag — and the change that
followed: one template, one scenario, both publications.

When Oxygen is upgraded, the first verified publish on the new version is
committed twice: as a new frozen `site/pub-5/oxygen-NN/`, and over `current/`.

## Supported by

The development of Fi3ldMan templates has been supported by
[Oxygen XML](http://www.oxygenxml.com)

![Oxygen Logo](http://www.oxygenxml.com/img/resources/oxygen190x62.png)
