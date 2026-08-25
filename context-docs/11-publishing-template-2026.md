# Fi3ldMan - The 2026 Publishing Template

## Overview

`dita-parent/pub-5/template-2026/` is the Fi3ldMan WebHelp Responsive publishing
template, rebuilt on the **Oxygen 28.1 (2026)** base. It replaces
`dita-parent/pub-5/template/`, which was built in 2024 on the Oxygen 25.1 base
and produces broken, unstyled output under Oxygen 2026.

This document explains how the template works as a system: what it is, how
Oxygen consumes it, which parts are ours, and how to change it safely. For the
change-by-change rationale and the archaeology of the 25.1 → 28.1 breakage, see
`dita-parent/pub-5/template-2026/README.md`, which travels with the template
itself. For moving the template to the air-gapped network, see
`12-template-transfer-air-gapped-network.md`.

`04-publishing-templates-build-system.md` describes the older 2024 template and
is retained for reference to the Pub-10 and legacy templates.

## The central constraint: version coupling

A WebHelp publishing template is **coupled to the Oxygen version it was built
against**. Oxygen ships its own CSS and JavaScript bundles alongside the
generated pages; a template that names those bundles explicitly breaks whenever
Oxygen renames or re-splits them.

That is precisely what happened between 25.1 and 28.1:

| Oxygen 25.1 (2024) | Oxygen 28.1 (2026) |
| --- | --- |
| `app/commons.css` | `app/bootstrap.css` + `app/main.css` |
| `app/commons.js` | `app/jquery.js`, `app/bootstrap.js`, `app/popperjs-core.js`, `app/main.js`, … |
| `<whc:page_libraries>` emitted CSS *and* JS | `<whc:page_css>` emits CSS, `<whc:page_libraries>` emits JS |

The 2024 template overrode `<whc:page_libraries>` to inject a hard-coded list
containing `app/commons.css`, `app/commons.js` and `app/topic.js`. Under 2026
two of those three files no longer exist, so topic pages 404'd on their base CSS
and JavaScript — no Bootstrap, no skin, no jQuery, and therefore no working
menu, TOC or search. Separately, the 25.1 layouts never called
`<whc:page_css>`, so the main page linked no `app/*.css` at all.

**The design rule that follows, and the single most important thing to preserve:
nothing in this template names an Oxygen asset.** Oxygen emits its own assets;
we only ever *add* ours on top. Oxygen can re-bundle freely in future without
breaking us.

**Both sides must run Oxygen 28.1.** This template will produce broken output on
25.1, which is the same failure in reverse. Check via `Help > About` in Oxygen.

## How Oxygen consumes the template

`f13ldMan.opt` is the contract. It is a plain XML descriptor that tells Oxygen
which extension points to apply. Despite the unusual extension, it is ordinary
XML — relevant when a file-type filter inspects it in transit.

The template uses five extension points:

| `.opt` section | What it does |
| --- | --- |
| `<html-page-layout-files>` | Supplies the four page layouts (main, topic, search, index-terms) |
| `<html-fragments>` | Injects our scripts into the topic-page `<head>` |
| `<parameters>` | Sets WebHelp transformation parameters |
| `<xslt>` | Registers three XSLT extensions against Oxygen extension-point IDs |
| `<resources>` | Declares CSS load order and copies `resources/**/*` into the output |

### Page layouts

Four layouts under `page-templates/`, all copies of the Oxygen 28.1 stock files:

| File | Page | Fi3ldMan delta |
| --- | --- | --- |
| `wt_index.html` | Main / tiles landing page | One deletion: stock body-level search input |
| `wt_topic.html` | Content topic pages | One deletion: stock body-level search input |
| `wt_search.html` | Search results | One deletion: stock body-level search input |
| `wt_terms.html` | Index terms | None — byte-identical to stock |

Each deletion is marked in place with a `FI3LDMAN DELTA` comment. Fi3ldMan
renders the search box in the navigation bar instead, so the stock body-level
input would be a visible duplicate.

Stock sources for comparison live at:

```
C:\Program Files\Oxygen XML Editor 28\frameworks\dita\DITA-OT\plugins\com.oxygenxml.webhelp.responsive\oxygen-webhelp\page-templates\
```

### Script injection

`page-templates-fragments/topic-page-head.xml` adds the three Fi3ldMan scripts
to every topic page, via the `webhelp.fragment.head.topic.page` placeholder:

- `current-handler.js`
- `sorttable.js`
- `harmonics.js`

They are referenced through Oxygen's own variables — `${oxygen-webhelp-assets-dir}`
for the path and `${oxygen-webhelp-build-number}` for the cache-busting query —
so no absolute or version-specific path is baked in. The `<head>` wrapper
element is ignored; only its children are copied into the output.

This mechanism replaces the old `topic-page-libraries.xml` + `whc:page_libraries`
override. It is the one genuinely new thing in this template and therefore the
first thing to verify after a build.

### XSLT extensions

Three stylesheets, registered against Oxygen extension-point IDs:

| File | Extension point |
| --- | --- |
| `xslt/customMainPage.xsl` | `com.oxygenxml.webhelp.xsl.createMainPage` |
| `xslt/customTopicPage.xsl` | `com.oxygenxml.webhelp.xsl.dita2webhelp` |
| `xslt/customSearchPage.xsl` | `com.oxygenxml.webhelp.xsl.createSearchPage` |

`xslt/inc/customHeader.xsl` and `xslt/inc/customFooter.xsl` fill in the
protection bars. Both are unchanged from 2024 — every hook they rely on still
exists in 28.1.

The 2024 template also carried `xslt/inc/customSearch.xsl`, which forked an
Oxygen stylesheet purely to add a `c-menu` class to the top menu. It is gone;
`f13ldman.css` targets Oxygen's own `.wh_top_menu` instead. Same result, one
less fork to re-apply on every upgrade.

### CSS load order

Declared in `<resources>`, and the order is deliberate:

| Order | File | Owner | Notes |
| --- | --- | --- | --- |
| 1 | `oxygen-theme.css` | Stock 2026 | **New in 2026.** Defines the `wh-*` CSS custom properties that `oxygen.css` reads, so it must load first |
| 2 | `oxygen.css` | Stock 2026 | No longer forked — the 2024 copy contained zero Fi3ldMan edits |
| 3 | `notes.css` | Stock | DITA note-box styling. **Stock, despite the name** — see below |
| 4 | `f13ldman.css` | Fi3ldMan | Branding and overrides. The only stylesheet here that is ours |

`f13ldman.css` now loads **last**; under the 2024 template `notes.css` loaded
after it, so overrides did not reliably win.

> **Put all overrides in `f13ldman.css`.** Never edit `oxygen-theme.css`,
> `oxygen.css`, `oxygen-print.css` or `notes.css` — they are stock and are
> replaced wholesale on the next Oxygen upgrade.

`notes.css` reads as a Fi3ldMan file and is not one. Oxygen generates it from
the note-styling options chosen when a publishing template is created, which is
why it carries markers like `/*notes-colors-colorful*/`. Verified: the copy in
repo-root `template/` is byte-identical to the `notes.css` in every stock
template shipped with Oxygen 26. The `template-2026/` copy differs from Oxygen
26's by a single line — the `note_restriction` background — which is a change
between Oxygen versions, not a Fi3ldMan edit.

Two things follow. Note-box appearance is not ours to defend, so the test suite
does not assert it. And on the next upgrade `notes.css` gets replaced from
stock along with the other three, not carried across.

## Parameters

Set in the `<parameters>` block of `f13ldMan.opt`:

| Parameter | Value | Purpose |
| --- | --- | --- |
| `webhelp.show.protection` | `yes` | Master switch for both protection bars |
| `webhelp.protection.text` | `COMMERCIALLY SENSITIVE` | Banner text |
| `webhelp.protection.background.color` | *(empty)* | Banner colour — see below |
| `webhelp.logo.image` | `oxygen-webhelp/template/resources/corp_logo.png` | Header logo, relative to the output root — see below |
| `webhelp.show.main.page.tiles` | `yes` | Tile-based landing page |
| `webhelp.show.main.page.toc` | `no` | Hide TOC on the main page |
| `webhelp.top.menu.depth` | `3` | Three levels of navigation |
| `args.figurelink.style` | `TITLE` | Link to figures by title |
| `args.tablelink.style` | `TITLE` | Link to tables by title |
| `force-unique` | `true` | Unique generated filenames |
| `webhelp.show.print.link` | `no` | Hide print button |
| `webhelp.show.publication.toc` | `no` | Hide publication-level TOC |
| `webhelp.enable.dark.mode` | `no` | Dark mode off — see Known limitations |

### The logo

`webhelp.logo.image` is declared **in the template**, not as an absolute path in
the transformation scenario. Under the old arrangement the build emitted:

```html
src="C:\git\Fi3ldMan\dita-parent\pub-5\dita/template/corp_logo.png"
```

into every page — a path that resolves on no machine, including the one that
built it. Confirmed against the 2026-08-25 Oxygen 26 publish: this was the only
broken reference in the entire output, on 97 of 98 pages.

The value that replaces it looks wrong, and the two obvious "corrections" both
put the bug back:

```xml
<parameter name="webhelp.logo.image" value="oxygen-webhelp/template/resources/corp_logo.png"/>
```

**It is relative to the WebHelp output root, not to the template folder.**
Oxygen resolves the parameter in its `whr-copy-logo-image` Ant target
(`com.oxygenxml.webhelp.responsive/build_dita.xml`):

```xml
<available type="file" file="${webhelp.logo.image}" property="webhelp.logo.image.file"/>
<if>
  <isset property="webhelp.logo.image.file"/>
  <then> <copy file="${webhelp.logo.image}" todir="${output.dir}"/> …
  <else> <condition property="webhelp.logo.image.output" value="${webhelp.logo.image}"/>
```

Ant resolves a relative path against **its own basedir**, not the template
folder, so a template-relative value is never found:

| Value | What happens |
| --- | --- |
| Absolute (`C:/git/...`) | Found → copied to the output root → works **only on the build machine**. The original bug. |
| Template-relative (`corp_logo.png`) | Not found → no copy → emitted verbatim as an output-root-relative URL → **relative `src` pointing at nothing**. |
| Output-relative (current) | Not found → no copy → emitted verbatim → and the file *is* there, because `<resources>` put it there. **Works.** |

That is why `corp_logo.png` lives in the template's `resources/` folder rather
than at its root: the `<fileset>` copies `resources/**/*` to
`<out>/oxygen-webhelp/template/resources/`, and the parameter names where it
lands. Nothing in the value is machine-specific.

> **Any `webhelp.logo.image` override in a transformation scenario must be
> deleted.** A scenario-level value overrides the template and reintroduces the
> bug. This is the single most common way to break a working setup.

Two related traps:

- **Moving `corp_logo.png` out of `resources/` breaks the logo silently.** The
  build still succeeds and the `src` still looks plausible; it just 404s.
- **A relative `src` is not proof of a fix.** The intermediate state — scenario
  override deleted, value template-relative — produces a clean-looking
  `src="../corp_logo.png"` on every page with no file behind it. Check that the
  image loads, not just that the path looks right.

The same arrangement is in repo-root `template/`, where it was verified on
Oxygen 26. The Ant target has the same shape in 28.1, but confirm it on the
first 28.1 build rather than assuming.

`corp_logo.png` in this repo is a **placeholder**, copied from
`dita/Content/Images/image020.png`. It must be replaced with the real logo.

### Protection banner colour

Two mechanisms, and it matters which one you use:

- **Default (parameter empty):** the bars are green `#bfebb9`, from the
  `.wh_header_protection` and `.wh_footer_protection` rules in `f13ldman.css`
  (lines 74 and 83).
- **Per-export override:** set `webhelp.protection.background.color` to a colour
  in the transformation scenario. `customHeader.xsl` then emits an inline
  `style` attribute, which outranks the CSS.

The parameter route is the right one for per-partner or per-classification
exports (see `10-content-authoring-publishing-workflows.md`), because it varies
per scenario without touching the shared template. Changing the CSS changes the
default for every export.

## Content couplings

The template is content-independent with three deliberate exceptions. Anything
else that looks content-specific is a bug.

### Image heights

Rows of linked images rendered at wildly inconsistent sizes. The cause is
Oxygen's own `.image { height: auto }`, which outranks the HTML `height`
attribute DITA emits from `<image height="...">`. The `width` attribute is *not*
overridden, so each image scales to its own declared width at its own aspect
ratio.

`f13ldman.css` sets an explicit height and lets width follow the aspect ratio —
nothing is cropped, and no content changes are needed. Two variables in the
`:root` block (`f13ldman.css:388-394`) control it:

| Variable | Default | Applies to |
| --- | --- | --- |
| `--f13-image-row-height` | `177px` | Rows of linked images in a plain DITA `<div>` |
| `--f13-image-link-height` | `150px` | Linked images inside a table cell |

> **These defaults are starting points, not measured values.** They were read
> off the representative sample content in this repo, not the real publication.
> CSS cannot read the author's declared height, so a number has to be chosen
> somewhere. Expect to tune them against the real content on the target network
> — it is one edit in the `:root` block and it applies everywhere.

The row rule is guarded with `:has(> a.xref + a.xref)` so it only matches divs
holding a *row* of two or more linked images. Without the guard it would also
catch lone linked images — country flags in page titles, standalone figures —
and resize those too. The guard is structural rather than tuned to particular
content, so it carries over to the real publication.

`:has()` requires Chrome/Edge 105+, Safari 15.4+ or Firefox 121+. On anything
older the rule is ignored entirely and images fall back to uneven rendering —
the failure mode is cosmetic, not broken.

### The Regions tile

`[data-id="PD_1"] { width: 100% !important }` makes the "Regions" tile
full-width. This is **pre-existing**, carried over unchanged from the 2024
template. It keys off a DITA filename prefix; `PD_1` is confirmed as the real
filename. Renaming that source file breaks the rule silently.

## Known limitations

- **Dark mode is off.** `webhelp.enable.dark.mode` = `no`. `f13ldman.css` uses
  hard-coded colours throughout, so a dark theme would render inconsistently.
  Enabling it means converting those to the `wh-*` custom properties defined in
  `oxygen-theme.css` — a self-contained follow-up job.
- **Three inert selectors.** `.wh_tiles-container`, `.wh_tiles-item` and
  `.breadcrumb-sticky` in `f13ldman.css` match nothing in the generated output
  under either Oxygen 2024 or 2026. Left in place and commented rather than
  deleted.
- **Stale `${pd}`-relative scenario paths.** `DITA_project_pub5.xpr` was
  originally a repo-root project; after the move to `dita-parent/pub-5/dita/`,
  `${pd}/template` points at a folder that no longer exists. The
  `${pd}/template/corp_logo.png` case is resolved — see "The logo" — but the
  scenario is still worth a tidy-up pass, independently of this template.
- **The DITA content in this repo is representative sample data**, not the real
  publication. The real publications live on the air-gapped network.

## Building it in this repo

Already configured in `dita-parent/pub-5/dita/DITA_project_pub5.xpr`: the
project registers `${pd}/../template-2026` as a publishing template gallery
directory, and the **`Fieldman Webhelp 2026`** scenario is associated with
`index.ditamap`. Open the map and run that scenario.

The older `FieldMan DITA Map WebHelp Responsive` scenario remains alongside it,
pointing at repo-root `template/`, so the two can be built and compared. The
reference build to compare against is `dita-parent/pub-5/baselines/oxygen-26/` —
the last known-good output before this template, published on Oxygen 26 and
verified at zero broken references. `dita-parent/pub-5/baselines/README.md`
covers how to diff against it; in particular, Oxygen stamps a fresh
`buildId=<timestamp>` into every asset reference on every run, so an untreated
diff reports all 98 pages changed and hides the real difference.

To set up a scenario from scratch:

1. **Register the template folder** — `Options > Preferences > DITA > Publishing
   Templates`, or the project's own settings, pointing at
   `${pd}/../template-2026`. Alternatively skip the gallery and browse straight
   to `f13ldMan.opt` in step 3.
2. Open `dita-parent/pub-5/dita/index.ditamap`.
3. `Configure Transformation Scenario` → duplicate the existing
   `webhelp-responsive` scenario. On the **Templates** tab pick **f13ldMan
   2026**, or `Browse for publishing template file` → `f13ldMan.opt`.
4. On the **Output** tab set the output directory — use something separate from
   an existing build if you want to compare side by side.
5. On the **Parameters** tab, **delete any `webhelp.logo.image` override.**
   Leave the rest alone.
6. Apply and run.

## Verification checklist

### On the development side: run the tests

```
npm test
```

`tests/publish/` loads the published output in a headless browser and asserts
computed style and asset status codes — 37 checks. Run it before anything is
packaged for transfer.

It exists because **this failure mode is invisible in the HTML.** The 25.1 →
28.1 breakage changed no markup at all: Oxygen renamed its bundles, the
template kept asking for the old names, and every page 404'd on its base
styling while still containing exactly the right elements and classes. Only
computed style and network status distinguish that from a good build, and the
suite is verified to fail when the breakage is deliberately reintroduced.

**It tests only what we own** — the `f13ldman.css` rules, the three Fi3ldMan
scripts, and that every referenced asset resolves. No assertion pins a value
that a stock Oxygen stylesheet produces, so Oxygen restyling its own output
does not turn the suite red. A failure should always mean we broke something.
That is verified too: a build with Oxygen's fonts, colours and navbar layout
deliberately altered still passes all 37.

See `tests/publish/README.md`, including its coverage gaps. It does not replace
the manual checks below, which cover appearance the suite deliberately leaves
alone.

### On the air-gapped side: work through these by hand

Node and npm are not available there, so the manual checks remain the only
feedback loop. Work through all five — and note that check 2 is the one people
get wrong, because a broken logo looks correct in the page source.

| # | Check | How | If it fails |
| --- | --- | --- | --- |
| 1 | Fi3ldMan scripts load on topic pages | Open a topic, check the browser Network tab for `template/resources/harmonics.js`, `sorttable.js`, `current-handler.js`. **No 404s**, and no reference to `commons.css` / `commons.js` | Add the scripts via the scenario's `webhelp.fragment.head.topic.page` parameter, pointing at `page-templates-fragments/topic-page-head.xml` |
| 2 | Logo shows, and the image actually loads | View source: expect `src=".../oxygen-webhelp/template/resources/corp_logo.png"`, `../`-prefixed per page depth, **not** a `C:\...` path. Then confirm it is not a 404 | A `C:\...` path means a `webhelp.logo.image` override is still set in the scenario — delete it. A tidy relative path that 404s means the value is template-relative, or `corp_logo.png` is not under the template's `resources/` — see "The logo" |
| 3 | Search box is in the nav bar and works | Visual + run a search | Two search boxes means one of the three `FI3LDMAN DELTA` deletions did not take |
| 4 | Protection bars present, green, top and bottom, reading the expected text | Visual | Exercises `customHeader.xsl` / `customFooter.xsl` and the protection parameters |
| 5 | Top menu sits correctly | Visual | Exercises the `.c-menu` → `.wh_top_menu` retarget in `f13ldman.css` |

Check 1 is the most important: it exercises the `webhelp.fragment.head.topic.page`
mechanism, which is the one genuinely new thing in this template.

## Upgrading to a future Oxygen version

1. Diff this folder's `page-templates/*` against the new version's stock
   `oxygen-webhelp/page-templates/*`.
2. Take the new stock files and re-apply the deltas from the table above — all
   three are commented in place with `FI3LDMAN DELTA`.
3. Replace `oxygen.css`, `oxygen-theme.css`, `oxygen-print.css` and `notes.css`
   with the new stock versions. **Do not merge** — all four are stock and carry
   no Fi3ldMan edits.
4. Leave `f13ldman.css`, `xslt/` and `page-templates-fragments/` alone.
5. Rebuild and work through the verification checklist.

Because nothing in the template names an Oxygen asset, an upgrade should be
confined to steps 1–3. If you find yourself hard-coding an Oxygen filename to
make an upgrade work, that is the 2024 mistake repeating — find the placeholder
or extension point instead.
