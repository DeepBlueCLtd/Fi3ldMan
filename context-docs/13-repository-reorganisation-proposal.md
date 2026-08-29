# Fi3ldMan — Repository Reorganisation

**Status: implemented.** Everything below has been carried out. The document is
kept as the record of *why* the tree has the shape it does, and of what the
repository looked like before — the inventory in §1 is the state as of August
2026, not the state today. For the current layout see
`01-repository-architecture.md` and the root `README.md`.

Two things were decided while implementing it, against the defaults in §6:

- `archive/oxygen-webhelp-mockup/` was kept for one cycle, with a README
  saying to delete it if nobody claims it.
- The March 2025 pub-5 publish stays deleted; the `oxygen-26` frozen publish
  represents that era.

Two things remain outstanding:

- **The repository's Pages source must be switched to "GitHub Actions"**
  (Settings → Pages → Build and deployment → Source). Until that happens Pages
  still serves the branch root, where `index.html` no longer exists.
- **Pub-5 has not been republished from the moved project.** The move keeps
  every `${pd}`-relative path valid and the machine-absolute `templateRoot` was
  updated, but that needs Oxygen to confirm. `check-publish.py` and the styling
  suite both pass against the committed output.

This document proposes a new layout for the repository, including the content
published to GitHub Pages. It exists because the repository has accreted
structure over three years of real work — a 2023 publish at the root, a 2025
publish location (`out/`, now partly deleted), per-Oxygen-version baselines,
two drifted copies of the 25.1 template, and pub-5 configuration files loose at
the root — and the roles of the pieces are no longer discoverable from the
tree itself.

Three things are explicitly valued and are preserved (and made more visible)
by this proposal:

1. **The legacy published HTML** — the 2023 pub-5 publish and the legacy
   "regions" publication.
2. **The DITA sources for the different publications** — pub-5, pub-10, and
   the legacy specialization.
3. **The published HTML for different versions of Oxygen** — today the
   `oxygen-26` and `oxygen-28` baselines.

## 1. What the repository actually contains today

An inventory, with the evidence for each item's role:

| Path | What it is | Evidence |
| --- | --- | --- |
| `oxygen/` (root) | **Pub-5 publish from October 2023** (Oxygen 25.x era) | `buildId=2023100622` stamped in `index.html`; last touched Jan 2025 |
| `out/pub-10/` | Pub-10 publish, March 2024 build (`buildId=2024031515`), committed Sep 2025 | git log: "publish pub-10" |
| `out/oxygen/` | *Deleted* Aug 2026 ("drop legacy published version") — was the March 2025 pub-5 publish | commit `03fdfd7` |
| `dita-parent/pub-5/` | **Active pub-5**: DITA source, the 25.1-era template, `template-2026` (28.1 base), `baselines/` (byte-exact `oxygen-26` and `oxygen-28` publishes), `check-publish.py` | `baselines/README.md`, `template-2026/README.md` |
| `dita-parent/pub-10/` | **Active pub-10**: DITA source and its template | |
| `dita-legacy/` | Archived DITA specialization (custom DTD), `regions`/`regions_simple` content, its own Oxygen template, **and its published output in `dita-legacy/out/`** | `dita-legacy/readme.md` |
| `template/` (root) | The 2024/Oxygen-25.1 pub-5 template — the one the `oxygen-26` baseline was actually built with | `baselines/README.md` table |
| `dita-parent/pub-5/template/` | A **drifted near-duplicate** of root `template/` (`.opt` and CSS differ, logo placed differently) | `diff -rq` |
| `mockup/britain-legacy/` | Dynamic-table prototypes (linked from the live hub page) | root `index.html` |
| `mockup/p9_10_mock/` | Pub-9 / Pub-10 HTML mockups (pub-9 exists only here) | context-doc 01 |
| `mockup/oxygen-webhelp/` | An old WebHelp app/template mockup, not linked from anywhere | |
| `index.html` (root) | The GitHub Pages hub page | live at `deepbluecltd.github.io/Fi3ldMan/` |
| `project.ditaval`, `author_layout.layout`, `clear_yellow_icons.txt` | Pub-5 authoring/publishing config, loose at the root | |
| `tests/publish/`, `playwright.config.js`, `package.json` | The publish styling test suite (browser tests against a published output) | `tests/publish/README.md` |
| `context-docs/` | Project knowledge docs 01–12 | |

### The problems this inventory reveals

- **The live site is broken.** GitHub Pages serves the *entire* `main` branch
  from the root. The hub page still links pub-5 to `out/oxygen/index.html`,
  which commit `03fdfd7` deleted — so the headline "View published pub-5" link
  404s today. There is currently *no* browsable current pub-5 on the site at
  all; the only committed 28.1 output is hidden in `baselines/`.
- **Published output lives in three unrelated places** (`oxygen/`, `out/`,
  `dita-parent/pub-5/baselines/`) with three naming schemes, and nothing in
  the tree says which publish is which Oxygen version except a README two
  levels down.
- **Everything is published.** Pages serving the repo root means DITA
  sources, baselines, tests and lockfiles are all part of the deployed site.
  Harmless for a public repo, but it makes the published surface impossible
  to reason about.
- **Two copies of the 25.1 template have drifted apart**, and the root copy —
  not the one inside `pub-5/` — is the one the known-good baseline was built
  with. A newcomer would guess exactly wrong.
- **Pub-5's config is scattered**: its ditaval, Oxygen layout and icon-audit
  regex sit at the repo root next to `package.json`.

## 2. Proposed structure

Four top-level concerns, each with one home: **sources**, **published site**,
**tests**, **project docs**.

```
Fi3ldMan/
├── README.md                        # expanded: map of the repo (see §5)
├── LICENSE
├── package.json / yarn.lock / playwright.config.js
├── .github/
│   └── workflows/pages.yml          # deploys site/ to GitHub Pages (see §3)
├── context-docs/                    # unchanged — project knowledge docs
│
├── publications/                    # was dita-parent/ — all DITA + templates
│   ├── pub-5/
│   │   ├── dita/                    # source (unchanged internally)
│   │   ├── template-2024/           # was root template/ — 25.1 base, canonical
│   │   ├── template-2026/           # 28.1 base (unchanged internally)
│   │   ├── check-publish.py
│   │   ├── project.ditaval          # from repo root
│   │   ├── author_layout.layout     # from repo root
│   │   └── clear_yellow_icons.txt   # from repo root
│   ├── pub-10/
│   │   ├── dita/
│   │   └── template/
│   └── legacy-regions/              # was dita-legacy/ minus its out/
│       ├── dtd/  regions/  regions_simple/  template/
│       └── readme.md
│
├── site/                            # everything GitHub Pages serves — nothing else
│   ├── index.html                   # the hub, with corrected + extended links
│   ├── pub-5/
│   │   ├── current/                 # the browsable publish (today: the 28.1 build)
│   │   ├── oxygen-28/               # frozen baseline, was baselines/oxygen-28
│   │   ├── oxygen-26/               # frozen baseline, was baselines/oxygen-26
│   │   └── oxygen-25/               # frozen 2023 publish, was root oxygen/
│   ├── pub-10/
│   │   └── current/                 # was out/pub-10
│   ├── legacy-regions/              # was dita-legacy/out
│   └── mockups/
│       ├── dynamic-tables/          # was mockup/britain-legacy
│       └── p9-10/                   # was mockup/p9_10_mock
│
├── archive/
│   └── oxygen-webhelp-mockup/       # was mockup/oxygen-webhelp — unlinked; delete
│                                    # instead if nobody remembers its purpose
└── tests/
    └── publish/                     # unchanged
```

### Why this shape

**`publications/` mirrors what the repo is for.** One folder per publication,
each self-contained: source, template(s), tooling, config. The legacy
specialization becomes just another publication (`legacy-regions/`) rather
than a differently-shaped sibling of `dita-parent/`. The name `dita-parent`
described an implementation detail; `publications` describes the role.

**Templates are named by year, matching the existing convention.** The repo
already says "template-2026"; the old template becomes `template-2024`
(that is when it was built, per `template-2026/README.md`). The stale
duplicate at `dita-parent/pub-5/template/` is **deleted** — the root copy is
the one the `oxygen-26` baseline was built with, so it is the one that
survives. Before deleting, the `corp_logo.png` difference should be
reconciled (the stale copy carries it at template root; the canonical copy
under `resources/`).

**`site/` is the whole published surface, and version-named publishes are the
baselines.** Today the repo stores the browsable copy and the diff baseline
as *separate* trees (and, since `03fdfd7`, has lost the browsable pub-5
copy entirely). Merging the roles removes the duplication and makes the
valued per-Oxygen-version publishes first-class, browsable pages:

- `site/pub-5/current/` is the only pub-5 folder a publish ever overwrites.
  Refreshing it is step 5 of the existing workflow (publish to the gitignored
  `dita/out/`, verify with `check-publish.py` + `npm test`, copy in).
- `site/pub-5/oxygen-NN/` folders are **frozen**. They keep exactly the role
  `baselines/README.md` defines — byte-exact known-good snapshots to diff a
  new publish against — and gain a URL. The `.gitattributes` `-text` rule
  moves with them (`site/pub-5/oxygen-*/** -text`). They still sit outside
  every Oxygen output directory, so `clean.output=yes` still cannot touch
  them. `baselines/README.md` moves to `site/pub-5/README.md` with its
  paths updated.
- When Oxygen is next upgraded, the first verified publish on the new
  version is committed as a new frozen `oxygen-NN/` folder *and* copied to
  `current/` — the same two-snapshot upgrade story the baselines README
  describes, now self-evident in the tree.

**The hub page finally tells the whole story.** `site/index.html` gains a
section per publication with its current publish first and dated,
version-labelled links to each frozen publish — including the 2023 legacy
pub-5 and the legacy regions publication, which today are committed but
linked from nowhere.

## 3. GitHub Pages

Today: Pages deploys `main` from `/ (root)`, so the site *is* the repo.
Proposed: deploy **only `site/`**, via the standard Pages workflow
(`actions/upload-pages-artifact` on `site/` + `actions/deploy-pages`, and the
Pages source switched to "GitHub Actions" in repo settings). No build step —
the workflow just uploads the folder, so the committed-HTML model is
unchanged and nothing needs Oxygen in CI.

Fallback if a workflow is unwanted: GitHub's branch-deploy mode also accepts
a `/docs` folder — naming the site folder `docs/` instead of `site/` gets the
same isolation with zero workflow. The workflow route is preferred only
because it frees the folder name and shows deploy status per commit.

**URL impact** (site root URL is unchanged): every deep URL moves once —
e.g. `/oxygen/...` → `/pub-5/oxygen-25/...`, `/out/pub-10/...` →
`/pub-10/current/...`, `/mockup/...` → `/mockups/...`. If any external
bookmarks matter, a handful of `<meta http-equiv="refresh">` stubs at the old
entry-page paths can be added to `site/`; deep links are not worth
preserving.

## 4. Everything that references a path (the real migration cost)

The moves themselves are `git mv` (history follows). The work is in the
references:

| File | Change |
| --- | --- |
| `site/index.html` (hub) | Rewrite links; add legacy + per-version sections. Fixes the currently-broken pub-5 link |
| `.gitattributes` | `dita-parent/pub-5/baselines/**` → `site/pub-5/oxygen-*/**` |
| `.gitignore` | Update the `dita-parent/...` output/temp/MANIFEST paths to `publications/...` |
| `package.json` | `start`: `serve site` (serves the hub, matching what Pages serves) |
| `playwright.config.js` | Candidate list: publish output under `publications/pub-5/dita/out/...`, fallback `site/pub-5/oxygen-28` |
| `publications/pub-5/dita/DITA_project_pub5.xpr` and `*.opt` files | Re-point template/ditaval references (relative paths change; verify by publishing once) |
| `check-publish.py` / `site/pub-5/README.md` | Update the diff/verify example paths |
| `context-docs/01`, `02`, `04`, `08`, `10`, `11`, `12` | Path references; doc 01 gets rewritten to describe the new tree |
| `template-2026/verify-integrity.ps1` + doc 12 | Confirm the air-gapped transfer procedure carries no absolute repo paths (it hashes the template folder itself, so it should be move-safe) |

## 5. Migration plan — three PRs, site never broken

Order matters because Pages tracks `main` continuously.

**PR 1 — build `site/` and switch Pages.** Pure moves plus the hub rewrite:
`oxygen/` → `site/pub-5/oxygen-25/`, `baselines/*` → `site/pub-5/oxygen-2X/`,
copy of `oxygen-28` → `site/pub-5/current/`, `out/pub-10/` →
`site/pub-10/current/`, `dita-legacy/out/` → `site/legacy-regions/`,
`mockup/{britain-legacy,p9_10_mock}` → `site/mockups/...`, `index.html` →
`site/index.html` (links fixed), add `pages.yml`, update `.gitattributes`.
Merging this and flipping the Pages source in settings is one atomic
changeover — and it un-breaks the pub-5 link.

**PR 2 — consolidate sources.** `dita-parent/` → `publications/`, root
`template/` → `publications/pub-5/template-2024/`, delete the stale
`pub-5/template/` (after reconciling `corp_logo.png`), move the three loose
pub-5 config files in, `dita-legacy/` (minus `out/`) →
`publications/legacy-regions/`, `mockup/oxygen-webhelp/` → `archive/`.
Update every reference in §4, then prove it: publish pub-5 once from the
moved project, run `check-publish.py` and `npm test` against it.

**PR 3 — documentation.** Rewrite `context-docs/01`, sweep the remaining
context-docs for stale paths, and expand the root `README.md` from four lines
into a map: what each top-level folder is, where the site is served from, and
the publish-and-commit workflow.

## 6. Open questions

1. **Keep or delete `archive/oxygen-webhelp-mockup/`?** It is unlinked and
   its purpose is undocumented. Default: keep one PR cycle, then delete.
2. **Should the March 2025 pub-5 publish be resurrected?** `03fdfd7` deleted
   it, but it is one `git revert` away. Under this structure it would slot in
   as a frozen `site/pub-5/oxygen-26-2025-03/` (it was the publish the
   Oxygen-26 era actually served). Default: leave it deleted — the
   `oxygen-26` baseline already represents that era.
3. **Redirect stubs for old URLs?** Only if someone has distributed deep
   links to the current site. Default: stub the four old entry pages
   (`/index.html` is unchanged; `/oxygen/index.html`, `/out/pub-10/index.html`,
   `/mockup/p9_10_mock/index.html`), skip everything else.
