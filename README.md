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
| `publications/` | All DITA source and publishing templates — one self-contained folder per publication |
| `site/` | Everything GitHub Pages serves, and nothing else |
| `tests/publish/` | Browser tests that assert a published output is correctly styled |
| `context-docs/` | Project knowledge: architecture, content model, templates, workflows |
| `archive/` | Kept but unused — see `archive/README.md` |

### `publications/`

| | |
| --- | --- |
| `pub-5/` | The main publication. `dita/` source, `template-2026/` (current, Oxygen 28.1), `template-2024/` (what the oxygen-26 publish was built with), `check-publish.py`, and pub-5's ditaval / author layout / icon-audit config |
| `pub-10/` | Spectral analysis ("Grams"). `dita/` source and its template |
| `legacy-regions/` | Archived DITA specialization with a custom DTD. Kept for reference, not developed |

Oxygen writes each publish to a gitignored `out/` inside the publication.
Nothing under `publications/` is served.

### `site/`

| | |
| --- | --- |
| `index.html` | The hub page — a section per publication |
| `pub-5/current/` | The browsable pub-5 publish. The only pub-5 folder a publish overwrites |
| `pub-5/oxygen-28/`, `oxygen-26/`, `oxygen-25/` | **Frozen** publishes, one per Oxygen version — byte-exact snapshots to diff a new publish against, and browsable pages in their own right. See `site/pub-5/README.md` |
| `pub-10/current/` | The pub-10 publish |
| `legacy-regions/` | The legacy publication's output |
| `mockups/` | Dynamic-table prototypes, and the pub-9 / pub-10 mockups |

`.github/workflows/pages.yml` deploys `site/` and nothing else. There is no
build step in CI — the workflow just uploads the folder.

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
4. Copy the verified output over `site/pub-5/current/` and commit. Merging to
   `main` deploys it.

`npm start` serves `site/` locally — the same folder Pages serves.

When Oxygen is upgraded, the first verified publish on the new version is
committed twice: as a new frozen `site/pub-5/oxygen-NN/`, and over `current/`.

## Supported by

The development of Fi3ldMan templates has been supported by
[Oxygen XML](http://www.oxygenxml.com)

![Oxygen Logo](http://www.oxygenxml.com/img/resources/oxygen190x62.png)
