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

## Installing

The project lockfile is `yarn.lock` (yarn classic), so `npm ci` cannot be used —
it needs a `package-lock.json`. Either runner works:

```
yarn install --frozen-lockfile     # matches the lockfile exactly
npm install                        # also fine; package-lock.json is gitignored
npx playwright install chromium    # the browser the suite pins
```

**Behind TLS interception**, every registry request fails with
`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`. Node ships its own CA bundle and ignores
the Windows certificate store, so a corporate root trusted by Windows is
invisible to it. Point Node at the system store:

```
NODE_OPTIONS=--use-system-ca npm install
```

The same applies to `npx playwright install` and to `npm test` itself. Set it as
a user environment variable to stop it recurring.

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
| `page-hygiene.spec.js` | What our page layouts put *into* the deliverable — see below |
| `helpers.js` | Page list and the response recorder |
| `serve.json` | Config for the dev server the suite starts — see below |

### `cascade.spec.js` — the one that generalises

The other specs check a **chosen handful** of declarations, and Oxygen 28.1
proved that is not enough. Its `main.css` introduced

```css
.simpletable>:not(caption)>*>*, .table>:not(caption)>*>* {
  background-color: var(--wh-primary-bg,#fff);
  color: var(--wh-primary-color,#000);
}
```

which scores **(0,1,1)** against our `.bkDarkGray` and friends at **(0,1,0)**.
Six table-cell colour classes rendered white. The HTML was unchanged, the
classes were still on the elements, `f13ldman.css` loaded and returned 200 —
and every hand-written test in this suite stayed green.

So `cascade.spec.js` picks nothing. It reads every rule out of `f13ldman.css`
at run time and asks, per declaration per page: *if this definitely won the
cascade, would the rendering change?* If yes, it is being overridden and the
styling is not reaching the reader. The check is empirical rather than a
specificity calculation — force the value inline with `!important` on the real
element, in its real context, and see whether the computed value moves. That
handles units, inheritance and custom properties for free.

Overrides that are legitimate — nearly always one of our own rules beating
another — live in the `ACCEPTED` map, **each with a reason**. An entry without
one is a bug someone silenced. A second test fails when an `ACCEPTED` entry
stops reproducing, so the list shrinks as things are fixed instead of hiding
the next real regression.

`page-hygiene.spec.js` is the one group not about appearance. Oxygen copies
HTML comments from `page-templates/` verbatim into every published page, so a
comment there is not a note to the next maintainer — it is content in a
document that carries a COMMERCIALLY SENSITIVE banner and goes to an air-gapped
network. It reached 193 KB across one build before anyone noticed, because
nothing about it is visible from inside the template.

### `serve.json` — the dev server must not rewrite URLs

`serve` turns `cleanUrls` on by default, which 301s `/a/b.html` to `/a/b`.
GitHub Pages does not: it serves the `.html` path as authored. Left on, every
page in this suite is visited at a URL the deployment never produces.

That is not cosmetic. `current-handler.js` marks the link to the page you are
already on by comparing each `link.href` against `document.URL`, and under the
rewritten URL the comparison never matches. The handler loads, runs, and marks
nothing — so `.related_link .current` (the greyed-out, unclickable self link)
and the icon rule it overrides were both untestable, and the icon test read the
self link as an ordinary one and asserted the wrong thing about it.

`serve.json` turns it off, and `playwright.config.js` passes the file with
`-c`. Two things follow from that and are worth not undoing: the icon test now
classifies related links four ways rather than three, and the current-handler
test asserts what it marks rather than only that it registered.

## Which output is tested

In order: `PUBLISH_DIR` if set, else `publications/pub-5/dita/out/webhelp-responsive`
(where the `Fieldman Webhelp 2026` scenario writes), else
`site/pub-5/oxygen-28`. That last is the frozen 28.1 publish; the fallback keeps
the suite runnable on a fresh clone, where the output directory is gitignored.

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
| **Oxygen restyles its own sheets** — body font, navbar layout, and the `notes.css` note-box radius | **pass** | **All passed.** Their design, not our regression |
| A build shipping 2 KB/page of template authoring notes | fail | Caught by the comment budget, which names the byte count and lists the offending comments |
| The two image-sizing rules and `.ImageLinksTable .xref .b` deleted | fail | 3 failures: ragged tiles, labels sharing a line with their picture, a row of images at three heights |
| `li.linklist div.desc` deleted | fail | Caught on the Style Samples page — the target sub-titles render in the panel |
| `--f13-image-link-width` and `--f13-image-row-height` retuned without touching the content | fail | Caught as drift: the CSS and the `width`/`height` attributes DITA emits are a matched pair, and nothing about the rendering shows them disagreeing |
| `.related_link .current` deleted | fail | 2 failures: the self link is neither greyed nor stripped of its icon |

The **restyled** and **deleted** `notes.css` rows are the pair that defines the
scope, and they are the ones to re-check after any change to this suite. A
stock sheet that has been *restyled* is Oxygen exercising its own judgement and
must stay green; a stock sheet that is *missing* is a broken build and must
not. Keeping both true is what makes a green run mean something.

## Confirmed against Oxygen 28.1

The suite is 46 tests, and `current/` and `oxygen-28/` both pass all of them.
`oxygen-26/` passes 41 and skips 5. The two numbers are not a discrepancy: that
snapshot predates `StyleSamples.html` joining the page list, and its
`template-2024` stylesheet declares neither `--f13-image-link-height` nor
`--f13-image-row-height`, so there is no image-sizing rule there for those
tests to check. Each skip names its reason on stderr.

The image-sizing tests guard on the custom property rather than on a list of
Oxygen versions, so a template that declares it is always checked and one that
does not is always skipped — no snapshot has to be remembered. The cost is the
same one `OPTIONAL_PAGES` carries and is worth stating: if a *current* template
stopped declaring the property, those tests would go quiet instead of failing.

That is true because `OPTIONAL_PAGES` in `helpers.js` makes it true, and it was
not true when the page was added. A page missing from a publish does not
quietly cost one test: `oxygen-26/` failed six, across four spec files, every
one of them "this page 404s" rather than anything about styling. A frozen
snapshot can never acquire a page added later, so it would have stayed red for
good. `OPTIONAL_PAGES` names the pages a publish may legitimately lack, one
line of reason each; such a page is skipped when absent and only when absent,
announced on stderr, and named in the failure message of any sweep that did not
cover it. Every other 404 still fails the run.

The cost is worth stating plainly: if a *current* publish stops emitting one of
those pages, the sweeps go quiet about it instead of failing. Keep the list
short.

It took a while to get there. `oxygen-28/` and the deployed `current/` spent a
period failing `cascade.spec.js` on 22 declarations: both were published
*before* the table-cell `!important` fix, so every coloured cell rendered white
while the HTML, the classes and the stylesheet were all correct.

That is worth reading against the deliberate-breakage table above. The suite was
written to catch exactly this failure and does catch it — but nobody had pointed
it at the frozen folders, so a snapshot taken before the fix sat in the repo as
the reference a new publish would be diffed against. A frozen folder is only as
good as the build it was frozen from, and only as trusted as the last time
someone ran the suite over it.

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

Tracked in **issue #184**, along with the styling follow-ups they turned up.

- **A class whose *descendants* lose is invisible to `cascade.spec.js`.** The
  audit force-applies each declaration on the element carrying the class and
  watches the computed value. That catches a specificity fight on the same
  element, and misses inheritance. `outputclass="colorRed"` on a `<row>` puts
  the class on the `<tr>`, whose own computed colour is correct — while Oxygen
  28.1's `main.css` sets `color` on each `<td>` directly and the cells render
  black. The test passed throughout; the bug was found by eye. `.bold` on a row
  fails the same way today and nothing reports it.

- **A class used in content that no stylesheet defines is not detected _by this
  suite_.** The audit reads rules *out of* `f13ldman.css` and checks they land,
  so the inverse never comes up here. `colorDarkBlue` and `colorDarkBrown` were
  used in `VanesandCranes.dita` and defined nowhere, rendering black, for as
  long as anyone had been looking.

  `publications/pub-5/audit-classes.py` answers it instead, from the source
  rather than the browser: point it at one or more DITA trees and it reports
  every `outputclass` no stylesheet defines — thirteen in pub-5 — alongside
  every rule nothing asks for. It is not part of a test run, because the
  decision it feeds is per class and per publication: add a rule, or strip the
  attribute. Issue #184 tracks that decision.

- **The CSS load order is only verified indirectly.** The 2026 change put
  `f13ldman.css` last so its overrides reliably win. Nothing in `f13ldman.css`
  currently contests a rule in a stock sheet on a page the sample content
  produces, so the ordering is confirmed only by the override assertions
  passing at all — not by a head-to-head conflict. If a future override starts
  fighting a stock rule, test that specific pair.

  (`notes.css` was twice listed here as a gap — first as an untested Fi3ldMan
  file, then as sample content missing DITA notes. It is neither. The file is
  stock Oxygen, and **Fi3ldMan does not use DITA notes**: there is no `<note>`
  element in any DITA source in this repository, or in the real publications.
  Nothing to test, and nothing to add to the sample content.)
- **Dead rules are not flagged.** `.wh_tiles-container`, `.breadcrumb-sticky`
  and `.permalink` match nothing in the current output. They are harmless, but
  they are also not what they look like. (`.fullWidthTable` and
  `.table-separator` were on this list until `StyleSamples.dita` demonstrated
  them, which is what the page is for: a rule with nothing to match cannot be
  audited, so adding the sample is how a dead rule stops being dead.)
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
