# Publish styling tests

Automated checks that **our** contribution to a published WebHelp build
survived — that `f13ldman.css`, `notes.css` and the three Fi3ldMan scripts are
loaded, applied, and winning the cascade. Run them in Phase A, before anything
crosses the gateway.

```
npm test                                  # the live publish, or the baseline
PUBLISH_DIR=path/to/output npm test       # a specific build
npm run test:report                       # last run's HTML report
```

## Why these are browser tests and not HTML assertions

The 25.1 → 28.1 breakage changed **no HTML**. Oxygen renamed its own CSS and JS
bundles, the template carried on asking for the old names, and every page 404'd
on its base styling. The markup was correct throughout: right elements, right
classes, right structure. A snapshot or DOM test would have passed while the
publication rendered as unstyled text.

So the suite loads the output in a real browser and asserts two things a source
diff cannot see:

- **computed style** — what the cascade actually resolved to, after every
  stylesheet that loaded and every one that didn't
- **network status** — whether each asset was really served

Both matter, and neither is sufficient alone. A stylesheet can return 200 and
still lose the cascade; a rule can compute correctly and reference a background
image that 404s.

## Scope: we test what we own

**No assertion here pins a value that a stock Oxygen stylesheet produces.**
Oxygen is free to restyle its own output — change its fonts, its spacing, its
navigation layout — and this suite must stay green. It is not our design, and a
failure here should always mean *we* broke something.

That draws the line in three places:

| | |
| --- | --- |
| **Asserted** | Computed values declared in `f13ldman.css`; the behaviour of our three scripts; that every asset a page references resolves |
| **Not asserted** | Any value coming from `oxygen.css`, `app/*.css`, or Bootstrap — fonts, resets, menu layout, tile sizing |
| **Why 404s still count** | A missing asset is a build defect whoever owns the file. Requesting something that is not there is never correct |

Two consequences worth understanding, because they look like gaps:

- **Nothing names an Oxygen bundle.** The suite never checks for
  `commons.css`. It checks that a page links *some* stylesheet that is not
  ours — which catches a page layout that has stopped emitting the base CSS
  (a real 25.1 fault, and one that produces no 404 because nothing is
  requested) without caring what Oxygen calls its files.
- **Measurements are taken against containers, not siblings.** The full-width
  REGIONS tile is checked against the width of its own container, not against
  the other tiles, so that how Oxygen chooses to size the others stays their
  business.

## Layout

| File | Covers |
| --- | --- |
| `assets.spec.js` | Every referenced asset resolves; the logo is not a broken image; no machine-absolute paths; the base CSS is still being requested |
| `fi3ldman-styling.spec.js` | The `f13ldman.css` rules win the cascade |
| `scripts.spec.js` | The three Fi3ldMan scripts ran, and sorting actually sorts |
| `helpers.js` | Page list and the response recorder |

## Which output is tested

In order: `PUBLISH_DIR` if set, else `dita-parent/pub-5/dita/out/oxygen-2025`,
else `dita-parent/pub-5/baselines/oxygen-26`. The baseline fallback keeps the
suite runnable on a fresh clone, where the output directory is gitignored.

The run prints the directory it chose. Check it — passing against last week's
build is the one failure mode this suite cannot detect for you.

## The rule for adding tests

**Never let an assertion pass by finding nothing.** `.shortdesc` is checked on
`Britain_Legacy.html` rather than `Britain1.html` because the latter has no
short description, and the first draft of that test passed for that reason
alone. `helpers.computed()` asserts the element exists before reading its
style; keep using it, and if a selector stops matching, repoint it or delete
the test rather than letting it idle.

## Verified against deliberate breakage

A suite that only ever passes proves nothing. Each of these was confirmed by
copying the output to a scratch directory, breaking one thing, and pointing
`PUBLISH_DIR` at it:

| Change injected | Expected | Result |
| --- | --- | --- |
| Oxygen's `app/commons.css` renamed — the literal 25.1 → 28.1 breakage | fail | 11 failures, every page, via the 404 sweep |
| `template/f13ldman.css` removed | fail | 25 failures — every override test |
| Logo deleted, `src` left as a tidy relative path | fail | Caught by `naturalWidth`, the only signal that separates it from working output |
| Page layouts stop linking any Oxygen stylesheet (no 404 produced) | fail | Caught by the foreign-stylesheet count |
| **Oxygen restyles its own sheets** — different body font, colours, navbar layout | **pass** | **35 passed.** Their design, not our regression |

That last row is the one to re-check after any change to this suite. It is what
keeps a green run meaningful.

## Known coverage gaps

- **`notes.css` is untested.** The sample content contains no DITA notes at
  all, so there is nothing on any page for the note-box rules to style. This is
  also the one place where the 2026 CSS load-order change (`f13ldman.css` now
  loads last, previously `notes.css` did) is observable — so the reordering is
  currently unverifiable. Adding a topic with a note to the sample content
  would close both gaps in one step.
- **Dead rules are not flagged.** `.wh_tiles-container`, `.breadcrumb-sticky`,
  `.fullWidthTable`, `.table-separator` and `.permalink` match nothing in the
  current output. They are harmless, but they are also not what they look like.
- **The suite runs on the development side only.** The air-gapped target has
  neither Node nor npm, so the manual checklist in
  `context-docs/11-publishing-template-2026.md` remains the feedback loop
  there. These tests reduce what can reach it broken; they do not replace it.
- **Oxygen 28.1 output has never been through this suite.** Everything here was
  written against an Oxygen 26 publish. Narrowing the scope to our own CSS
  makes a clean first run on 28.1 much more likely, but that is a prediction,
  not a measurement. Read each failure before changing a test — some will be
  real.
