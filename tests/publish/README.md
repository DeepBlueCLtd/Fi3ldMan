# Publish styling tests

Automated checks that a published WebHelp build is **styled**, not merely
generated. Run them in Phase A, before anything crosses the gateway.

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

## Layout

| File | Covers |
| --- | --- |
| `assets.spec.js` | Every referenced asset resolves; the logo is not a broken image; no machine-absolute paths |
| `oxygen-base.spec.js` | Oxygen's own base styling and the template skin are in effect |
| `fi3ldman-styling.spec.js` | The Fi3ldMan overrides win the cascade |
| `scripts.spec.js` | The three Fi3ldMan scripts ran, and sorting actually sorts |
| `helpers.js` | Page list and the response recorder |

## Which output is tested

In order: `PUBLISH_DIR` if set, else `dita-parent/pub-5/dita/out/oxygen-2025`,
else `dita-parent/pub-5/baselines/oxygen-26`. The baseline fallback keeps the
suite runnable on a fresh clone, where the output directory is gitignored.

The run prints the directory it chose. Check it — passing against last week's
build is the one failure mode this suite cannot detect for you.

## Two rules for changing these tests

**Never let an assertion pass by finding nothing.** `.shortdesc` is checked on
`Britain_Legacy.html` rather than `Britain1.html` because the latter has no
short description, and the first draft of that test passed for that reason
alone. `helpers.computed()` asserts the element exists before reading its
style; keep using it, and if a selector stops matching, repoint it or delete
the test rather than letting it idle.

**Never name an Oxygen asset.** The suite asserts that *some* stylesheet under
`oxygen-webhelp/app/` loaded, not that `commons.css` did. Pinning a bundle name
would rebuild, in the tests, the exact coupling that broke the 2024 template —
and it would surface the same way: as a baffling failure after an upgrade.

## Verified against deliberate breakage

A test suite that only ever passes proves nothing, so each of these was
confirmed to fail when the corresponding defect is introduced:

| Defect injected | Result |
| --- | --- |
| Oxygen's `app/commons.css` renamed — the literal 25.1 → 28.1 breakage | 14 failures, every page, starting with `body` still on the 8px user-agent margin |
| `template/f13ldman.css` removed | Every override test fails, plus the asset checks |
| Logo file deleted, `src` left as a tidy relative path | Caught by `naturalWidth`, which is the only signal that distinguishes it from working output |

Re-run that exercise after any substantial change to the suite. Copy the output
to a scratch directory, break one thing, point `PUBLISH_DIR` at it.

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
  written against an Oxygen 26 publish. Several assertions encode values that
  28.1 is expected to preserve, but that is an expectation, not a measurement.
  Expect a first run against 28.1 to need adjustment, and read each failure
  before changing the test — some of them will be real.
