# Publish styling tests

Automated checks that **our** contribution to a published WebHelp build
survived — that `f13ldman.css` and the three Fi3ldMan scripts are loaded,
applied, and winning the cascade. Run them in Phase A, before anything crosses
the gateway.

`f13ldman.css` is the only stylesheet in the template that is ours.
`oxygen.css`, `oxygen-theme.css`, `oxygen-print.css` and — despite the name —
`notes.css` are all stock Oxygen files.

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
| **Not asserted** | Any value coming from `oxygen.css`, `notes.css`, `app/*.css`, or Bootstrap — fonts, resets, note boxes, menu layout, tile sizing |
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
| Stock `notes.css` **deleted** | fail | 11 failures, via the 404 sweep alone |
| **Oxygen restyles its own sheets** — body font, navbar layout, and the `notes.css` note-box radius | **pass** | **35 passed.** Their design, not our regression |

The last two rows are the pair that defines the scope, and they are the ones to
re-check after any change to this suite. A stock sheet that has been *restyled*
is Oxygen exercising its own judgement and must stay green; a stock sheet that
is *missing* is a broken build and must not. Keeping both true is what makes a
green run mean something.

## Confirmed against Oxygen 28.1

Both baselines now pass all 35 — `oxygen-26/` (Oxygen 26, repo-root `template/`)
and `oxygen-28/` (Oxygen 28.1, `template-2026/`).

The suite also met the **genuine** 25.1 → 28.1 breakage along the way, not a
simulated one: a build was accidentally produced with the 2025 template on
Oxygen 28.1, and 8 tests failed naming the two 404s exactly. That is what it
was written for.

Two things it settled that had only been reasoned about before:

- **The logo mechanism works on 28.1.** The Ant behaviour the fix depends on is
  unchanged there.
- **The `webhelp.fragment.head.topic.page` injection works.** The three
  Fi3ldMan scripts load on 94/98 pages, the same as under 26. This was the
  newest and least proven thing in the template.

## Known coverage gaps

- **The CSS load order is only verified indirectly.** The 2026 change put
  `f13ldman.css` last so its overrides reliably win. Nothing in `f13ldman.css`
  currently contests a rule in a stock sheet on a page the sample content
  produces, so the ordering is confirmed only by the override assertions
  passing at all — not by a head-to-head conflict. If a future override starts
  fighting a stock rule, test that specific pair.

  (`notes.css` used to be listed here as an untested Fi3ldMan file. It is
  stock Oxygen, so its absence from the suite is correct rather than a gap.)
- **Dead rules are not flagged.** `.wh_tiles-container`, `.breadcrumb-sticky`,
  `.fullWidthTable`, `.table-separator` and `.permalink` match nothing in the
  current output. They are harmless, but they are also not what they look like.
- **The suite runs on the development side only.** The air-gapped target has
  neither Node nor npm, so the manual checklist in
  `context-docs/11-publishing-template-2026.md` remains the feedback loop
  there. These tests reduce what can reach it broken; they do not replace it.
- **`check-publish.py` is a survey tool, not an oracle.** It regexes `href` and
  `src` over raw text, so example markup inside an HTML comment counts as a
  reference. The 28.1 build reports 97 occurrences of
  `${webhelp.fragment.footer}` for exactly that reason — a documentation
  comment in `page-templates/footer.xml`. This suite uses real network
  responses and is unaffected.
