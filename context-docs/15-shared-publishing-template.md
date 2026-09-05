# Fi3ldMan - One Publishing Template for Pub-5 and Pub-10

## The question

The Oxygen 25.1 → 28.1 upgrade forced a rebuild of pub-5's publishing template
(`template-2026`, see `11-publishing-template-2026.md`). Pub-10 shipped its own
template, forked from pub-5's, which would have needed the same Oxygen 28
repairs. Rather than repair it twice, can `template-2026` serve both?

That turns on one thing: **does `template-2026` have a rule for every custom
style pub-10 asks for?** This document answers that from the source, not from
recollection, and reaches a firm conclusion. Section 6 records the change that
followed — both publications now publish from one `template-2026` scenario,
pending a verifying publish of each.

A second, related belief motivated the same investigation — that some of the
"styled, unused" rules in pub-5's stylesheets were really written for pubs
9/10, and would turn out to be load-bearing there. That belief is **wrong**,
and section 4 shows why it matters that it is.

## 1. How the evidence was gathered

Two standard-library scripts, both runnable on a client machine with nothing
installed:

| Script | Question it answers |
| --- | --- |
| `publications/pub-5/audit-classes.py` | For **one** publication and **one** template: which outputclasses have a rule, which have none, and which rules nothing asks for (with js / tmpl / html evidence columns). |
| `publications/compare-classes.py` | Across **several** publications against **one candidate** template: who uses what, what the candidate fails to style, and what it styles for nobody. |

`compare-classes.py` is new for this exercise and imports the audit script
rather than re-deriving the CSS parsing — that parser already carries fixes for
two real bugs (comments swallowing selectors, `@media` eating the rest of a
file), and a second copy would only re-acquire them.

Reproduce the whole finding with:

```bash
python publications/compare-classes.py pub-5 pub-10
```

`outputclass` is the DITA attribute that becomes an HTML `class`, so it is what
both scripts read. Neither applies the ditaval, so a class reachable only
through filtered-out content still counts as used — the safe direction when
deciding what to keep.

## 2. What pub-10 actually uses

Eleven source files, and **seven distinct outputclasses in total**:

| outputclass | uses | `template-2026` has a rule? | Also in pub-5? |
| --- | --- | --- | --- |
| `enterBtn` | 22 | yes | yes (13) |
| `h1` | 4 | yes | yes (92) |
| `gram-config` | 4 | no — and correctly so, see below | **no** |
| `current` | 2 | yes | applied by `current-handler.js` |
| `item-list` | 1 | yes | yes (1) |
| `audio` | 1 | no — Oxygen's own `<object>` handling | yes (1) |
| `video` | 1 | no — Oxygen's own `<object>` handling | yes (1) |

Three of the seven need comment:

- **`gram-config`** marks the `<table>` that `gramframe.bundle.js` reads to
  configure a spectrogram. It is a JavaScript hook, not a style. It should have
  no CSS rule, and the absence of one is not a gap.
- **`audio` / `video`** sit on `<object>` and are consumed by DITA-OT's HTML5
  output, which emits `<audio>` / `<video>` for them. They need no rule either —
  and they are not pub-10's anyway: pub-5's `Introduction/Warning.dita` carries
  the identical pair, from the same boilerplate.
- **`current`** is added at run time by `current-handler.js` in both
  publications, which is why it appears in pub-10's source but not pub-5's.
  Both templates already style it.

**So exactly one outputclass is genuinely pub-10's own — `gram-config` — and it
wants JavaScript, not CSS.** `template-2026` styles every pub-10 outputclass
that should be styled, today, with no rules ported.

## 3. Pub-9

Pub-9 has no DITA source; it exists only as published mockups under
`site/mockups/p9-10/p9/`. Those mockups and pub-10's use an **identical set of
165 HTML classes** — pub-9 introduces nothing. The dozen classes present there
but not in pub-10's published output (`col-lg-*`, `wh_topic_toc`,
`close-toc-button`, `section-title`, …) are all Oxygen's own WebHelp chrome,
and `template-2026` already carries rules for the ones we restyle.

This is weaker evidence than source would be — when pub-9 gains a DITA source,
re-run `compare-classes.py` with it before relying on the conclusion. But
nothing in the mockups argues against a shared template.

## 4. The "unused pub-5 rules were for pubs 9/10" belief, tested

It does not survive contact with the data, and the direction of travel is the
opposite of what was assumed.

`template-2026` defines 150 classes. 121 of them are asked for by no
outputclass in **either** publication. Pub-10 explains none of them: it uses
seven classes, five of which pub-5 also uses.

Run the audit the other way and the picture is unambiguous. Pub-10's *own*
stylesheet defines `bkLightGray`, `bkDarkGray`, `bkYellow`, `bkBlue`, `bkRed`,
`bkGreen`, `colorBlue`, `colorRed`, `colorPink`, `colorOrange`, `title-country`,
`ImageLinksTable`, `fullWidthTable`, `rh_notes`, `contents-index` and the rest —
and **uses not one of them**. Those are pub-5's regional-table styles, carried
into pub-10 by the fork and inert there ever since.

The unused rules did not come from pubs 9/10. They went *to* pub-10, unused,
when the template was copied. Merging the templates therefore removes a
duplicate copy of the dead weight; it does not resurrect any of it.

The archived `legacy-regions` publication tells the same story a third time.
Run `compare-classes.py` with no arguments and it is included: 128 source files,
20 outputclasses, and **not one of them unique to it** — the same `bkLightGray`,
`bkDarkGray`, `title-country` set pub-5 uses, in near-identical proportions.
Three publications, one vocabulary.

The 121 orphans remain a live question for pub-5 — but it is the question
`audit-classes.py`'s evidence columns already frame, and most of them are rules
that restyle Oxygen's markup rather than serve an outputclass. Nothing in this
analysis licenses deleting them.

## 5. Pub-10's template is a stale copy of `template-2024`

File by file against `publications/pub-5/template-2024/`:

| | |
| --- | --- |
| **Byte-identical** | `notes.css`, `oxygen.css`, `oxygen-tiles.png`, all four `page-templates/*`, all six `xslt/*`, every font, every image, `current-handler.js`, `sorttable.js`, `harmonics.js` |
| **Differs** | `f13ldman.css` (15 lines), `f13ldman_author_mode.css` (25 lines), `topic-page-libraries.xml` (1 line) |
| **Added** | `resources/gramframe.bundle.js`, its own `f13ldMan-p10.opt`, `corp_logo.png` at the template root |
| **Missing** | `README.md`, `resources/corp_logo.png` |

The differences are cosmetic or regressive:

- `f13ldman.css`: padding tweaks (`.body` 70px → 80px), a fixed width on
  `.wh_related_links`, and `.rh_notes` stripped of its `position: fixed` block.
- `f13ldman_author_mode.css`: the `enterBtn` and `current` author-mode previews
  were **deleted** — from the publication that uses `enterBtn` 22 times, more
  than any other class it has. Pub-10 authors have had no Oxygen Author preview
  of their commonest style.
- `topic-page-libraries.xml`: one added `<script>` for `gramframe.bundle.js`.
  This is the only load-bearing difference in the whole template.
- its `f13ldMan-p10.opt`: identical to pub-5's 2024 scenario but for the name
  and a **dropped** `webhelp.logo.image` parameter, so pub-10 publishes with no
  corporate logo. `template-2026`'s `.opt` documents why that parameter is
  subtle and how to set it correctly, and pub-10 inherits it by publishing from
  that template — which is why pub-10's next publish gains a logo it has not had.

Pub-10 also still carries `xslt/inc/customSearch.xsl`, the fork of an Oxygen
template that existed solely to add a `c-menu` class to the top menu.
`template-2026` deleted that fork and retargeted the rules at Oxygen's own
`wh_top_menu`. `c-menu` is the **only** class pub-10's stylesheets define that
`template-2026` does not — and it is deliberately gone, replaced, not lost.

Pub-10 has therefore inherited every 2024-era bug that `template-2026` fixed,
and will 404 on its base CSS and JavaScript under Oxygen 28 in exactly the way
pub-5 did.

### Its current publish is already broken

Running `check-publish.py` over `site/pub-10/current/` — which this change
extends to know about `gramframe.bundle.js` — shows the dropped
`webhelp.logo.image` parameter has done exactly the damage the 2026 `.opt`
warns about:

```
era markers   : commons.css=yes commons.js=yes | bootstrap.css=NO jquery.js=NO
logo src forms: /Users/ian/git/Fi3ldMan/dita-parent/pub-10/dita/template/corp_logo.png
broken refs   : 2 distinct, 11 occurrences
       7  ..//Users/ian/git/Fi3ldMan/dita-parent/pub-10/dita/template/corp_logo.png
       4  /Users/ian/git/Fi3ldMan/dita-parent/pub-10/dita/template/corp_logo.png
```

Eleven references on the live pub-10 site point at an author's home directory.
That is the machine-absolute path the `template-2026` `.opt` comment exists to
prevent, and pub-10 inherits the fix simply by publishing from that template.
The era markers on the same output confirm it is a 25.1-era build.

## 6. Conclusion, and the change made

**A single template is not merely convenient here; pub-10's template has no
content of its own worth preserving.** It is `template-2024` plus one script
tag, minus a logo and two author-mode rules.

`template-2026` has been changed to serve both, through **one** `.opt` and one
head fragment:

1. `gramframe.bundle.js` copied into `template-2026/resources/`, byte-identical
   to pub-10's.
2. `page-templates-fragments/topic-page-head.xml` gains one `<script>` line for
   it, so every publication loads it.
3. The `enterBtn` author-mode rule restored to `f13ldman_author_mode.css`, with
   `display: block` to match what actually publishes. Both the 2026 template and
   pub-10's fork had dropped it, so Author mode showed neither publication its
   commonest style.
4. `check-publish.py` reports the bundle's coverage alongside the other three
   scripts. Expect (N-4)/N on every publication - the head fragment fills
   `webhelp.fragment.head.topic.page`, so `index.html`, `search.html`,
   `indexTerms.html` and `cshelp.html` never carry them and do not need them.

Pub-5 therefore loads a script it has no use for. That is deliberate, and it is
the second answer to this question rather than the first.

### Why not a second `.opt` for pub-10

The first attempt gave pub-10 its own `f13ldMan-p10.opt` and its own
`topic-page-head-grams.xml`, so the bundle stayed out of pub-5's pages and out
of its output. It worked, and it was wrong: two `.opt` files share **63
non-comment lines** — every parameter, every layout reference, every XSLT
extension — that nothing keeps in sync. Change `webhelp.top.menu.depth` in one
and pub-10 quietly publishes with the old value. That is the exact class of
silent divergence this whole exercise exists to end.

What the split bought turned out to be very little. GramFrame's entry point is:

```js
const configTables = container.querySelectorAll("table.gram-config");
configTables.forEach(...)
```

On a pub-5 page that matches nothing and the bundle does nothing — no error, no
DOM change, no console noise. So the cost of dropping the split is one `<script>`
tag per pub-5 page and one file in pub-5's output, for a publication served from
local disk or an air-gapped network. The cost of keeping it was a maintenance
hazard with a silent failure mode.

**Expect that as a real delta** when diffing a pub-5 publish against the frozen
`site/pub-5/oxygen-28/`: one added `<script>` line per page, and
`oxygen-webhelp/template/resources/gramframe.bundle.js` present where it was
not. Everything else should be byte-identical once the `buildId` is normalised.
Nothing else pub-5 publishes with — stylesheets, layouts, XSLT, parameters — is
touched, and the author-mode rule changes Oxygen Author only.

### Verified in Oxygen 28.1 — pub-10, both editions

Published 2026-09-05 from this template to `publications/pub-10/out/student`
and `.../instructor`. `check-publish.py` on both:

| | before (`site/pub-10/current/`) | after |
| --- | --- | --- |
| broken refs | **2 distinct, 11 occurrences** | **0** |
| logo `src` | `/Users/ian/git/Fi3ldMan/...` absolute | relative, correct |
| era markers | `commons.css`/`commons.js` = yes (25.1) | `bootstrap.css`/`main.css`/`jquery.js` = yes (28.1) |
| gramframe | present | present, `gram-config` tables intact |
| search index | built | built |

So the fork's two headline defects — the machine-absolute logo path and the
25.1-era asset bundles that would 404 under Oxygen 28 — are both fixed by
publishing from this template, with no pub-10-specific configuration.

The `audience = -trainee` filter behaves exactly as intended. The student build
is the instructor build minus `Grams/gram1 analysis.html` and
`Grams/gram2 analysis.html`, with zero occurrences of the ship identities
("Pride of Le Havre", "Spirit of Whale Island") and zero ANALYSIS links. The
instructor build carries all of them.

### What still needs Oxygen to confirm

- **Pub-5 unchanged but for the bundle.** Publish, run `check-publish.py` and
  the Playwright suite, and diff against the frozen `site/pub-5/oxygen-28/` with
  the `buildId` normalised, as `site/pub-5/README.md` prescribes. The only
  expected differences are the added `<script>` line and the added file.
- **GramFrame is harmless on pub-5.** Read from its source, not observed: a
  pub-5 page should show no console error and no visual change.
- **Pub-10's spectrograms render.** The output carries the `gram-config` tables
  and the bundle, but that a Grams page actually draws an interactive gramframe
  is still an on-screen check.

`publications/pub-10/template/` is retained until both publishes are verified,
then should be deleted. The template folder itself stays under `pub-5/` for now;
renaming it would break the release tag prefix, the `template-release.yml` path
filter and `DITA_project_pub5.xpr`, and is not worth doing in the same change
that has to be publish-verified.

## 7. Caveats worth carrying forward

- Both scripts read `outputclass` only. A class can also reach a page from a
  script, the page templates, or Oxygen itself — `audit-classes.py`'s evidence
  columns exist for exactly that reason, and this analysis leaned on them.
- **Neither script can see GramFrame's styles at all.** The bundle carries about
  25 KB of CSS as a string and injects it into a `<style>` element at run time —
  roughly a hundred `gram-frame-*` classes that are in no stylesheet and on no
  `outputclass`. So "the template styles everything pub-10 uses" is true of the
  template's own CSS, and silent about pub-10's most important visual component,
  whose styling travels inside the bundle. That is fine for sharing a template —
  those styles move with the file — but it means the class counts in section 2
  describe less of pub-10's rendered page than they do of pub-5's.
- Neither script applies the ditaval. `pub-5/project.ditaval` currently excludes
  nothing (its one `prop` is commented out), so no pub-5 content is filtered
  today; pub-10 has no ditaval at all. If either gains real filtering, usage
  counts become upper bounds.
- Pub-9's conclusion rests on published mockups, not source. Re-run
  `compare-classes.py` against its DITA when that exists.
- `pub-5/dita/QuickLinksData/VanesandCranes.dita` carries
  `outputclass="bkDarkGray sorttable_fman"`. Nothing in the repository defines
  or reads `sorttable_fman` — it appears to be a typo for a `sorttable_*` class,
  and it is pub-5's own, unrelated to sharing the template.
