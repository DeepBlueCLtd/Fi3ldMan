# Fi3ldMan - Repository Architecture & Structure

## Overview

Fi3ldMan is a Field Service Manual system with advanced data exploitation capabilities. It produces web-based technical publications using DITA XML as the source format and Oxygen WebHelp Responsive as the publishing engine. The project is supported by Oxygen XML.

The repository hosts three publications:
- **Pub-5**: The original and largest publication - regional field service documentation
- **Pub-9**: The redacted edition of Pub-10 — same DITA source, one `audience` filter, published to `site/pub-9/current/`
- **Pub-10**: A specialized publication focused on spectral analysis ("Grams")

plus an archived **legacy regions** publication, built on a custom DITA
specialization that is no longer developed.

## Four top-level concerns

The tree separates four things, each with one home: **sources**
(`publications/`), the **published site** (`site/`), **tests** (`tests/`), and
**project docs** (`context-docs/`). Anything that does not belong to one of
those four is either repo-level config or `archive/`.

```
Fi3ldMan/
├── README.md              # Map of the repository
├── LICENSE
├── package.json           # Node config; `npm start` serves site/
├── playwright.config.js   # Publish styling test suite config
├── .github/workflows/
│   └── pages.yml          # Deploys site/ to GitHub Pages
├── context-docs/          # Claude Project enrichment documents (this folder)
│
├── publications/          # All DITA source and publishing templates
│   ├── pub-5/
│   ├── pub-10/
│   └── legacy-regions/
│
├── site/                  # Everything GitHub Pages serves - and nothing else
│   ├── index.html         # The hub page
│   ├── pub-5/
│   ├── pub-10/
│   ├── legacy-regions/
│   └── mockups/
│
├── archive/               # Kept but unused; see archive/README.md
└── tests/publish/         # Browser tests against a published output
```

Two rules follow from this shape and are worth stating plainly:

- **Nothing outside `site/` is published.** Before the reorganisation, Pages
  served the whole repository from the branch root, so DITA sources, publish
  baselines, lockfiles and tests were all part of the deployed surface.
- **`publications/` holds no build output.** Oxygen writes to a gitignored
  `out/` inside each publication; the verified result is copied into `site/`.

## Key Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Content authoring | DITA XML (v1.2) | Structured technical documentation source format |
| Authoring tool | Oxygen XML Editor | DITA editing, profiling, and transformation |
| Publishing engine | Oxygen WebHelp Responsive (v28.1; pub-10 still on 25.1) | DITA-to-HTML5 transformation |
| Templating | XSLT + HTML page templates | Custom layout and branding |
| Styling | CSS (f13ldman.css, notes.css, oxygen.css) | Visual presentation |
| Interactivity | Vanilla JavaScript | Harmonic calculator, gram viewer, sortable tables |
| Static hosting | GitHub Pages (`site/`), or `serve` locally | Serves published output |
| Publish verification | Playwright + `check-publish.py` | Styling and reference checks on the output |
| Version control | Git | Source management |

## Publications

### Pub-5 (`publications/pub-5/`)
```
pub-5/
├── dita/                        # DITA source content
│   ├── index.ditamap            # Master map: "Field Manual v5 Mar 2025"
│   ├── countryFilters.ditamap   # Subject scheme for country filtering
│   ├── DITA_project_pub5.xpr    # Oxygen project file
│   ├── Britain.Legacy/          # Britain legacy equipment
│   ├── Britain1/                # Britain modern equipment
│   ├── Britain_Cmplx/           # Britain complex configurations
│   ├── Fr_Legacy/               # France legacy equipment
│   ├── France1/                 # France modern equipment
│   ├── Spain/                   # Spain standard
│   ├── Spain.Legacy/            # Spain legacy
│   ├── Spain_Cmplx/            # Spain complex
│   ├── Wales/                   # Wales standard
│   ├── Wales.Legacy/            # Wales legacy
│   ├── Wales_Cmplx/            # Wales complex
│   ├── Wales_Composite/         # Wales composite/hybrid
│   ├── WightandMan/             # Wight and Man region
│   ├── Transducers/             # Transducer component documentation
│   ├── Brush_Noise/             # Brush noise predictive maintenance
│   ├── PlatformData/            # Regional platform maps and data
│   ├── QuickLinksData/          # Abbreviations, contents, reference data
│   ├── Introduction/            # Cover page, admin, what's new
│   └── Content/                 # Shared images and resources
├── template-2026/               # Current template, on the Oxygen 28.1 base
├── template-2024/               # Superseded template, on the 25.1 base
├── check-publish.py             # Verifies a publish: pages, refs, scripts
├── project.ditaval              # DITA conditional filtering (audience/country)
├── author_layout.layout         # Oxygen XML author layout
└── clear_yellow_icons.txt       # Icon audit regex
```

`template-2024/` is kept because it is what `site/pub-5/oxygen-26/` was built
with — the last known-good publish before the move to 28.1. See
`publications/pub-5/template-2024/README.md` for why that copy, and not the
near-duplicate that used to sit beside it, is the one that survived.

### Pub-10 (`publications/pub-10/`)
```
pub-10/
└── dita/                        # DITA source content
    ├── index.ditamap            # Master map: "Field Manual Pub-10 Mar 2025"
    ├── DITA_project_pub10.xpr   # Oxygen project file
    ├── gram-index.dita          # Gram navigation landing page
    ├── Welcome.dita             # Cover/entry page
    ├── Grams/                   # Gram analysis content
    │   ├── gram1.dita           # Gram 1 data
    │   ├── gram2.dita           # Gram 2 data
    │   ├── gram1-2.dita         # Gram 1 variant 2
    │   ├── gram2-2.dita         # Gram 2 variant 2
    │   ├── gram1 analysis.dita  # Gram 1 analysis questions
    │   └── gram2 analysis.dita  # Gram 2 analysis questions
    ├── Introduction/
    │   └── Security.dita        # Security classification page
    └── Content/                 # Shared images
```

No `template/` here: pub-10 publishes from `publications/pub-5/template-2026/`,
through two scenarios in `DITA_project_pub10.xpr` that differ only by the
`audience` filter — the full edition and the redacted Pub-9 one. Its fork of the
2024 template was deleted once both had been published and verified. See
`15-shared-publishing-template.md`.

### Legacy regions (`publications/legacy-regions/`)
```
legacy-regions/
├── FieldMan.ditamap             # Specialized map
├── FieldMan_Simple.ditamap      # Plain-DITA map
├── FieldMan.xpr                 # Oxygen project file
├── dtd/                         # Custom DITA specialization DTDs
├── regions/                     # Specialized DITA content (uses custom DTD)
├── regions_simple/              # Plain DITA content (no specialization)
├── template/oxygen/             # Legacy Oxygen publishing templates
└── project.ditaval
```

Archived: kept for reference, not developed. Its published output is at
`site/legacy-regions/`. See `08-legacy-migration-strategy.md`.

### Pub-9 (an edition of Pub-10, not a separate source)
```
site/mockups/p9-10/
├── index.html           # Navigation hub for P9 and P10 mockups
├── p9/                  # Pub-9 mockup HTML
│   ├── Grams/
│   ├── Introduction/
│   ├── gram-index.html
│   └── index.html
├── p10/                 # Pub-10 mockup HTML
│   ├── Grams/
│   ├── Introduction/
│   ├── gram-index.html
│   └── index.html
└── to_convert.html      # Sample HTML for DITA conversion testing
```

Pub-9 has no DITA source of its own and needs none: it is `publications/pub-10/dita/`
published through a scenario filter that excludes `audience="-trainee"`, which
removes the vessel identifications and the worked-analysis links. Published to
`site/pub-9/current/`; the mockups here are the original hand-built previews.
See `15-shared-publishing-template.md`.

## The published site (`site/`)

```
site/
├── index.html            # Hub: a section per publication
├── pub-5/
│   ├── current/          # The browsable publish - overwritten on republish
│   ├── oxygen-28/        # Frozen: Oxygen 28.1, template-2026
│   ├── oxygen-26/        # Frozen: Oxygen 26, template-2024
│   ├── oxygen-25/        # Frozen: the 2023-era publish
│   └── README.md         # What each folder is, and how to diff a new publish
├── pub-10/current/
├── legacy-regions/
├── mockups/
│   ├── dynamic-tables/   # Dynamic-table prototypes
│   └── p9-10/            # Pub-9 / Pub-10 mockups
└── oxygen/, out/, mockup/  # Refresh stubs for pre-reorganisation URLs
```

`current/` is the only pub-5 folder a publish overwrites. The `oxygen-NN/`
folders are **frozen**: byte-exact snapshots of a verified publish, one per
Oxygen version, kept so that a publish from a different Oxygen version can be
diffed against a known-good reference. They double as browsable pages, so the
per-version history of the publication has URLs rather than living only in
git. `.gitattributes` marks them `-text` so `core.autocrlf` cannot rewrite
their line endings on a Windows checkout and make every file look changed.

## Build and Deployment

The publishing workflow is:
1. Author DITA XML content in Oxygen XML Editor
2. Run the Oxygen WebHelp Responsive transformation using the `.opt` template
3. XSLT transformations apply custom header/footer, protection banner, and search
4. Output is generated to the gitignored `publications/<pub>/dita/out/`
5. Verify it: `python publications/pub-5/check-publish.py <output>` and `npm test`
6. Copy the verified output over `site/pub-5/current/` and commit

When Oxygen is upgraded, the first verified publish on the new version is
committed twice: as a new frozen `site/pub-5/oxygen-NN/` and over `current/`.

Deployment is GitHub Pages, from `site/` only, via
`.github/workflows/pages.yml`. There is no build step in CI — Oxygen runs on an
author's machine and the verified HTML is committed, so the workflow just
uploads the folder. `npm start` serves the same folder locally.
