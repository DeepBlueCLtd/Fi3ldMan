# Fi3ldMan WebHelp publishing template (Oxygen 2026 / 28.1 base)

This is the Fi3ldMan publishing template rebuilt on the Oxygen 28.1 WebHelp
Responsive base. It replaces `../template`, which was built in 2024 on the
Oxygen 25.1 base and produces broken output under Oxygen 2026.

> **Releases.** Every push to `main` that changes this folder publishes a
> versioned zip, tagged `pub-5-template-2026-v<major>.<minor>.<patch>`. Patch is
> automatic; put `[minor]` or `[major]` in a commit message to bump further. The
> version lives only in the tag — nothing in this folder records it, so the
> payload stays at 40 files. See `context-docs/14-template-releases.md`.

> This file records **why** the template is built the way it is. For the
> system-level description — how Oxygen consumes it, the parameter reference and
> the upgrade procedure — see `context-docs/11-publishing-template-2026.md`. For
> transferring it to the air-gapped network, see
> `context-docs/12-template-transfer-air-gapped-network.md`;
> `verify-integrity.ps1` in this folder is part of that procedure.

## Why the 2024 template broke under Oxygen 2026

Not CSS class names — those are almost entirely unchanged between 25.1 and 28.1.
The output was unstyled because **the base stylesheets and scripts never loaded**.

Oxygen 28.1 renamed and re-split its own asset bundles:

| Oxygen 25.1 (2024)                       | Oxygen 28.1 (2026)                                          |
| ---------------------------------------- | ----------------------------------------------------------- |
| `app/commons.css`                        | `app/bootstrap.css` + `app/main.css`                         |
| `app/commons.js`                         | `app/jquery.js`, `app/bootstrap.js`, `app/popperjs-core.js`, `app/main.js`, … |
| `<whc:page_libraries>` emitted CSS *and* JS | `<whc:page_css>` emits CSS, `<whc:page_libraries>` emits JS |

Two things followed from that:

1. **Topic pages 404'd on the base CSS and JS.** The old
   `xslt/customTopicPage.xsl` overrode `<whc:page_libraries>` so that it injected
   `page-templates-fragments/libraries/topic-page-libraries.xml`, which hard-coded
   `app/commons.css`, `app/commons.js` and `app/topic.js`. Under 2026, two of
   those three files no longer exist. No Bootstrap, no base skin, no jQuery —
   so no working menu, TOC or search either.
2. **The main page got no CSS at all.** The 25.1 page layouts only call
   `<whc:page_libraries>` and never `<whc:page_css>`, so `index.html` linked zero
   `app/*.css` files.

Secondary factors: the layouts declared `whc:version="25.1"`, and their markup was
Bootstrap 4 (`data-toggle`, `sr-only`, `col-lg-*`) against Bootstrap 5 in 2026
(`data-bs-toggle`, `visually-hidden-focusable`, `col-xxl-*`).

## What this template does differently

- **No `<whc:page_libraries>` override.** Oxygen emits its own assets; this
  template only *adds* the three Fi3ldMan scripts, via the
  `webhelp.fragment.head.topic.page` placeholder
  (`page-templates-fragments/topic-page-head.xml`). Nothing here hard-codes an
  Oxygen asset name, so Oxygen can re-bundle freely in future without breaking us.
  `page-templates-fragments/libraries/topic-page-libraries.xml` is gone.
- **Page layouts are 28.1 stock**, with one deletion in three of them (see below).
- **`oxygen.css` is no longer forked.** The 2024 template shipped a copy of
  Oxygen's stock 2024 `oxygen.css` with no Fi3ldMan edits in it at all, so it has
  simply been replaced by the stock 2026 pair: `oxygen-theme.css` (new — defines
  the `wh-*` CSS custom properties) plus `oxygen.css`. Put overrides in
  `f13ldman.css`, never in these two.
- **`xslt/inc/customSearch.xsl` is gone.** It forked an Oxygen template purely to
  add a `c-menu` class to the top menu. `f13ldman.css` now targets Oxygen's own
  `.wh_top_menu` instead — same result, one less thing to break on upgrade.
- **Linked images are now equal height** — see "Equal-height linked images"
  below. Everything else in `f13ldman.css` is unchanged apart from that retarget
  and some explanatory comments.
- **CSS load order changed** so that `f13ldman.css` now loads *last* (previously
  `notes.css` loaded after it). Overrides now reliably win.
- **`webhelp.logo.image` is set in the template**, not as an absolute path in
  the transformation scenario. The 2024 build emitted
  `src="C:\git\Fi3ldMan\dita-parent\pub-5\dita/template/corp_logo.png"` into
  every page — a path that resolves on no machine, including the one that built
  it. The value is an **output-relative** path, and `corp_logo.png` lives under
  `resources/`; see "The logo" below for why it cannot be template-relative.

## Fi3ldMan deltas against stock 28.1

Everything else in this folder is stock. These are the only customisations:

| File | Delta |
| --- | --- |
| `page-templates/header.xml` | Adds the `wh_header_protection` bar; adds `c-nav-bar` / `c-full-width` / `c-no-wrap` hook classes; keeps the search box in the nav bar |
| `page-templates/footer.xml` | Replaces the stock footer with the `wh_footer_protection` bar |
| `page-templates/wt_index.html` | Removes the stock body-level search input (marked `FI3LDMAN DELTA`) |
| `page-templates/wt_topic.html` | Removes the stock body-level search input (marked `FI3LDMAN DELTA`) |
| `page-templates/wt_search.html` | Removes the stock body-level search input (marked `FI3LDMAN DELTA`) |
| `page-templates/wt_terms.html` | None — byte-identical to stock |
| `xslt/`, `page-templates-fragments/`, `f13ldman.css`, `resources/corp_logo.png`, `resources/*.js`, `resources/images/*` | Fi3ldMan-owned |
| `oxygen.css`, `oxygen-theme.css`, `oxygen-print.css`, `notes.css` | Stock — replaced wholesale on upgrade, never edited. `notes.css` looks like ours and is not: Oxygen generates it from the note-styling options picked when a template is created |

Stock 28.1 sources live in:

```
C:\Program Files\Oxygen XML Editor 28\frameworks\dita\DITA-OT\plugins\com.oxygenxml.webhelp.responsive\oxygen-webhelp\page-templates\
```

## Page layouts

> **Keep comments in these files to one short line.** Oxygen copies HTML
> comments from the page layouts verbatim into **every published page**. The
> explanatory notes that used to live in `header.xml` and `footer.xml` were
> adding ~2 KB to all 98 pages — 193 KB across the build — and put internal
> implementation detail in front of the reader of a document marked
> commercially sensitive. The prose lives here instead; the files carry a
> pointer back. Anything longer than a line belongs in this section.

### `header.xml`

Based on the stock Oxygen 28.1 `header.xml`, with two Fi3ldMan additions:

1. The `wh_header_protection` bar above the navigation bar, emitted
   conditionally by `xslt/inc/customHeader.xsl` and driven by the
   `webhelp.show.protection` / `webhelp.protection.text` parameters.
2. The `c-nav-bar` / `c-full-width` / `c-no-wrap` hook classes, used by
   `f13ldman.css` to widen the navigation bar.

Everything else is stock. On upgrade, diff against the stock `header.xml` and
re-apply those two.

The header also keeps `<whc:webhelp_search_input>` in the navigation bar. Stock
28.1 moved the search box into the page body, which is why the matching block
is deleted from `wt_index.html`, `wt_topic.html` and `wt_search.html` — leaving
both would emit two search forms with duplicate ids.

### `footer.xml`

Replaces the stock Oxygen footer with a single protection bar, emitted
conditionally by `xslt/inc/customFooter.xsl` from the same two parameters.

Because the stock `wh_footer` element is not present, **the standard
`webhelp.fragment.footer` extension point has no effect.** If a real footer is
ever needed, restore the stock markup:

```html
<footer class="navbar navbar-default wh_footer">
    <div class=" footer-container mx-auto ">
        <whc:include_html href="${webhelp.fragment.footer}"/>
    </div>
</footer>
```

### `wt_index.html`, `wt_topic.html`, `wt_search.html`

One deletion each — the stock body-level `<whc:webhelp_search_input>` block —
marked in place with a one-line `FI3LDMAN DELTA` comment. `wt_terms.html` is
byte-identical to stock.

## Equal-height linked images

Rows of linked images, and the image link tables on the country pages, rendered
at wildly different sizes. This is **not** a 2026 regression — the markup and the
relevant CSS are byte-identical between the 2024 and 2026 builds, and no copy of
`f13ldman.css` anywhere in the repo has ever sized these images. It was simply
less noticeable before.

The cause: Oxygen's own stylesheet contains `.image { height: auto }`, which
outranks the HTML `height` attribute that DITA emits from `<image height="...">`.
The `width` attribute is *not* overridden, so each image ends up scaled to its
own declared width at its own aspect ratio. That is why images an author sized
to a common height render at different heights.

`f13ldman.css` now sets an explicit height and lets the width follow the aspect
ratio, so nothing is cropped and no content or image changes are needed. Two
variables control it:

| Variable | Default | Applies to |
| --- | --- | --- |
| `--f13-image-row-height` | `177px` | Rows of linked images in a plain DITA `<div>` |
| `--f13-image-link-height` | `150px` | Linked images inside a table cell |

> **The defaults are starting points, not measured values.** They were read off
> the representative sample content in this repo rather than the real
> publication, but the real images are expected to be roughly the same size, so
> they should be about right. CSS cannot read the author's declared height, so a
> number has to be chosen somewhere; if the real rows turn out to sit at a
> different height, it is one edit in the `:root` block of `f13ldman.css` and it
> applies everywhere.

Two things worth knowing about the row rule:

- It is guarded with `:has(> a.xref + a.xref)` so it only applies to divs holding
  a *row* of two or more linked images. Without that guard the selector also
  catches lone linked images — country flags in page titles, standalone figures —
  and would resize those too. The guard is structural rather than tuned to
  particular content, so it should carry over to the real publication.
- `:has()` needs Chrome/Edge 105+, Safari 15.4+ or Firefox 121+. On anything
  older the rule is ignored entirely and images fall back to today's uneven
  rendering, so the failure mode is safe rather than broken.

The table rule deliberately targets the generic "linked image in a table cell"
shape rather than `.ImageLinksTable`, so any future image link table is covered.

## The logo

`webhelp.logo.image` looks wrong at first glance. It is neither relative to this
template folder nor a path that exists on disk:

```xml
<parameter name="webhelp.logo.image" value="oxygen-webhelp/template/resources/corp_logo.png"/>
```

**It is relative to the WebHelp output root**, and both of the obvious
"corrections" reintroduce a bug that shipped in the 2024 template.

Oxygen resolves the parameter in its `whr-copy-logo-image` Ant target
(`build_dita.xml`):

```xml
<available type="file" file="${webhelp.logo.image}" property="webhelp.logo.image.file"/>
<if>
  <isset property="webhelp.logo.image.file"/>
  <then> <copy file="${webhelp.logo.image}" todir="${output.dir}"/> …
  <else> <condition property="webhelp.logo.image.output" value="${webhelp.logo.image}"/>
```

Ant resolves a relative path against **its own basedir**, not this folder. So:

| Value | What happens |
| --- | --- |
| Absolute (`C:/git/...`) | Found → copied to the output root → works **only on the build machine**. The 2024 bug. |
| Template-relative (`corp_logo.png`) | Not found → no copy → value emitted verbatim as an output-root-relative URL → **relative `src` pointing at nothing**. |
| Output-relative (current) | Not found → no copy → value emitted verbatim → and the file *is* there, because `<resources>` put it there. **Works.** |

That is why `corp_logo.png` lives in `resources/` rather than at the template
root: the `<fileset>` in `<resources>` copies `resources/**/*` to
`<out>/oxygen-webhelp/template/resources/`, and the parameter simply names where
it lands. Nothing about the value is machine-specific.

Two consequences worth knowing:

- **Never set `webhelp.logo.image` in a transformation scenario.** Scenario
  parameters override template ones, and the natural thing to type there is an
  absolute path — straight back to the 2024 bug on every topic page.
- **Moving `corp_logo.png` out of `resources/` breaks the logo silently.** The
  build still succeeds and the `src` still looks plausible; it just 404s.

Verified against an Oxygen 26 publish of pub-5 — 309 files, zero broken
references. The Ant target is the same shape in 28.1, but confirm it on the
first 28.1 build rather than assuming.

## How to build it

This is already set up in `DITA_project_pub5.xpr`: the project registers
`${pd}/../template-2026` as a publishing template gallery directory, and the
`Fieldman Webhelp 2026` scenario is associated with `index.ditamap`. Open the
map and run that scenario.

To recreate it from scratch, or to set up a second scenario:

1. **Register the template folder** — `Options > Preferences > DITA >
   Publishing Templates`, or the project's own settings. Point it at
   `${pd}/../template-2026`. Alternatively skip the gallery and browse straight
   to `f13ldMan.opt` in step 3.
2. Open `publications/pub-5/dita/index.ditamap`.
3. `Configure Transformation Scenario` → duplicate the existing
   `webhelp-responsive` scenario. On the **Templates** tab pick
   **f13ldMan 2026** (or `Browse for publishing template file` → this folder's
   `f13ldMan.opt`).
4. On the **Output** tab set the output directory — use something separate from
   an existing build if you want to compare the two side by side.
5. On the **Parameters** tab, **delete any `webhelp.logo.image` override** —
   the template supplies it, and a scenario override reintroduces the
   machine-absolute path. Leave the rest alone.
6. Apply and run.

The reference build to compare against is `site/pub-5/oxygen-26/` — the last
known-good output before this template, published on Oxygen 26. See
`site/pub-5/README.md` for how to diff against it; note in
particular that Oxygen's per-run `buildId` cache-buster makes every page look
changed until it is normalised.

## What to check first, and why

These are the parts I could not verify without running Oxygen:

1. **Do the Fi3ldMan scripts load on topic pages?** Open any topic, check the
   Network tab for `template/resources/harmonics.js`, `sorttable.js` and
   `current-handler.js`, and confirm there are **no 404s** and no reference to
   `commons.css` / `commons.js`. This exercises the `webhelp.fragment.head.topic.page`
   mechanism, which is the one genuinely new thing here.
   *If it fails:* the scripts can instead be added in the transformation
   scenario's `webhelp.fragment.head.topic.page` parameter, pointing at
   `page-templates-fragments/topic-page-head.xml`.
2. **Is the logo showing, and does the file exist?** View source and confirm
   `src=".../oxygen-webhelp/template/resources/corp_logo.png"`, prefixed with
   `../` per page depth — not a `C:\...` path. Then confirm the image actually
   loads: a relative `src` that 404s is the specific failure this arrangement
   exists to prevent, and it looks correct in the source. See "The logo".
   *Note:* `resources/corp_logo.png` here is currently the **placeholder**
   copied from `dita/Content/Images/image020.png`. Replace it with the real
   logo.
3. **Is the search box in the nav bar**, and does searching still work? If two
   search boxes appear, one of the three `FI3LDMAN DELTA` deletions didn't take.
4. **Are the protection bars present**, green, top and bottom, reading
   "COMMERCIALLY SENSITIVE"? That exercises `customHeader.xsl` / `customFooter.xsl`.
5. **Does the top menu still sit right?** This is the `.c-menu` → `.wh_top_menu`
   retarget in `f13ldman.css`.

## Known issues / deferred

- **Dark mode is off** (`webhelp.enable.dark.mode` = `no`). `f13ldman.css` uses
  hard-coded colours throughout, so a dark theme would render inconsistently.
  Enabling it means converting those to the `wh-*` custom properties defined in
  `oxygen-theme.css`. That's a self-contained follow-up job.
- **`.wh_tiles-container`, `.wh_tiles-item` and `.breadcrumb-sticky` in
  `f13ldman.css` are inert** — they match nothing in the generated output under
  either Oxygen 2024 or 2026. Left in place, commented, rather than deleted.
- **The old `.opt` mapped `topic-page-libraries.xml` to the
  `webhelp.fragment.welcome` placeholder**, which looks like a copy-paste error.
  It was harmless under 25.1 (nothing referenced that placeholder) but 28.1's
  `wt_index.html` *does* reference it, so under 2026 it would have injected a
  `<head>` fragment into the main page's welcome block. Not carried over.
- **The DITA content in this repo is representative sample data, not the real
  publication.** Two things in `f13ldman.css` are coupled to content:
  - the two image height variables above, called out as needing real values;
  - `[data-id="PD_1"] { width: 100% !important }` (the full-width "Regions"
    tile), which is **pre-existing**, carried over unchanged from the 2024
    template. It keys off a DITA filename prefix; `PD_1` is confirmed as the
    real filename, so this works — but note that renaming that file would break
    the rule silently.

  Everything else — page layouts, XSLT, fragments, parameters — is
  content-independent. Anything else that looks content-specific is a bug.
- **The project's `${pd}`-relative scenario paths are stale.** The `.xpr` was
  originally a repo-root project; after the move to `publications/pub-5/dita/`,
  `${pd}/template` points at a folder that no longer exists. The
  `${pd}/template/corp_logo.png` case is fixed — see "The logo" — but the
  scenario is still worth a tidy-up pass independently of this template.

## Upgrading to a future Oxygen version

1. Diff this folder's `page-templates/*` against the plugin's stock
   `oxygen-webhelp/page-templates/*` for the new version.
2. Take the new stock files and re-apply the deltas listed in the table above —
   they are all commented in place.
3. Replace `oxygen.css`, `oxygen-theme.css`, `oxygen-print.css` and `notes.css`
   with the new stock versions. Do not merge — they carry no Fi3ldMan edits.
4. Leave `f13ldman.css`, `xslt/` and `page-templates-fragments/` alone.
