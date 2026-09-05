# Fi3ldMan - One Publishing Template for Pub-5 and Pub-10

## The question

The Oxygen 25.1 → 28.1 upgrade forced a rebuild of pub-5's publishing template
(`template-2026`, see `11-publishing-template-2026.md`). Pub-10 still ships its
own template, which was forked from pub-5's, and which will need the same
Oxygen 28 repairs. Rather than repair it twice, can `template-2026` serve both?

That turns on one thing: **does `template-2026` have a rule for every custom
style pub-10 asks for?** This document answers that from the source, not from
recollection, and reaches a firm conclusion.

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
| **Added** | `resources/gramframe.bundle.js`, `f13ldMan-p10.opt`, `corp_logo.png` at the template root |
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
- `f13ldMan-p10.opt`: identical to pub-5's 2024 scenario but for the name and a
  **dropped** `webhelp.logo.image` parameter, so pub-10 publishes with no
  corporate logo. `template-2026`'s `.opt` documents why that parameter is
  subtle and how to set it correctly.

Pub-10 also still carries `xslt/inc/customSearch.xsl`, the fork of an Oxygen
template that existed solely to add a `c-menu` class to the top menu.
`template-2026` deleted that fork and retargeted the rules at Oxygen's own
`wh_top_menu`. `c-menu` is the **only** class pub-10's stylesheets define that
`template-2026` does not — and it is deliberately gone, replaced, not lost.

Pub-10 has therefore inherited every 2024-era bug that `template-2026` fixed,
and will 404 on its base CSS and JavaScript under Oxygen 28 in exactly the way
pub-5 did.

## 6. Conclusion and the change required

**A single template is not merely convenient here; pub-10's template has no
content of its own worth preserving.** It is `template-2024` plus one script
tag, minus a logo and two author-mode rules.

To make `template-2026` serve both, three additive changes — none of which
alters pub-5's output:

1. Copy `gramframe.bundle.js` into `template-2026/resources/`.
2. Add a second head fragment beside `topic-page-head.xml` that loads the three
   shared scripts **and** `gramframe.bundle.js`. Do not add gramframe to the
   shared fragment: it is 217 KB and pub-5 has no use for it.
3. Add a pub-10 `.opt` to the template that names that fragment in its
   `<html-fragments>` section. Oxygen selects a publishing template by `.opt`,
   so two scenarios can live in one template folder and differ only here.

Then restore the `enterBtn` author-mode rule, which `template-2026` dropped as
well — pub-5 uses it 13 times and pub-10 22, so it is worth having back in both.

Verify the result the way `README.md` prescribes: publish, run
`check-publish.py` and the Playwright suite, and diff against the frozen
`site/pub-5/oxygen-28/` to prove pub-5's output is unchanged before looking at
pub-10's at all.

## 7. Caveats worth carrying forward

- Both scripts read `outputclass` only. A class can also reach a page from a
  script, the page templates, or Oxygen itself — `audit-classes.py`'s evidence
  columns exist for exactly that reason, and this analysis leaned on them.
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
