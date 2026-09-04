# Pub-5 publishes

Everything in this folder is published WebHelp output, served by GitHub Pages
under `/pub-5/`.

| Folder | Oxygen | Template | Published | Suite | Role |
| --- | --- | --- | --- | --- | --- |
| `current/` | 28.1 | `template-2026/` | 2026-09-04 | 40/40 | Browsable current publish |
| `oxygen-28/` | 28.1 | `template-2026/` | 2026-09-04 | 40/40 | Frozen snapshot |
| `oxygen-26/` | 26 | `template-2024/` | 2026-08-25 | 39/40, 1 skipped | Frozen snapshot |
| `oxygen-25/` | 25.x | 25.1-era template | 2023 (committed 2025-01) | — | Frozen snapshot |

The table-cell `!important` fix is in all three. The suite grew from 39 tests
to 40 when `StyleSamples.html` joined the page list in `helpers.js`;
`oxygen-26/` predates that page, so the suite skips it there — one test fewer,
not a discrepancy.

That skip had to be built. A missing page does not quietly drop one test: it
failed six, in four spec files, none of them about styling. See "A snapshot
cannot gain a page" below.

`current/` is the only folder a publish overwrites. The `oxygen-NN/` folders are
**frozen**: byte-exact snapshots of a verified publish, kept so that a publish
from a different Oxygen version can be diffed against a known-good reference.
They are not build output — they sit outside every Oxygen output directory, so a
publish with `clean.output=yes` cannot delete them.

`oxygen-26/` is the last known-good output *before* the move to Oxygen 28.1 and
`template-2026/`. `oxygen-28/` is the 28.1 build with the styling regressions
fixed — coloured table cells, row-level colours, image-link tile sizing and
related-link descriptions — and the first to include `StyleSamples.dita`. It
carries 99 pages against `oxygen-26/`'s 98 for that reason.

The snapshot this replaced surveyed clean under `check-publish.py` and was
broken all the same. That tool counts pages and references; it cannot see a
stylesheet that loads, returns 200, and then loses the cascade. Only the browser
suite catches that, and it was never run against the folder before it was
frozen.

**Freezing a snapshot does not verify it.** Run the suite against a folder
before trusting it as a reference, and re-run it when the template changes — a
snapshot taken before a fix stays broken for as long as it sits there:

```
PUBLISH_DIR=site/pub-5/oxygen-28 npm test
```

Each pre-fix snapshot remains in git history if the old rendering is ever
needed.

### A snapshot cannot gain a page that did not exist when it was frozen

Adding `StyleSamples.dita` to the source, and its page to `helpers.js`, took
`oxygen-26/` from a full pass to six failures — none of them about styling, all
of them "this page 404s". A frozen snapshot can never acquire the page, so the
suite would have stayed red on that folder for good.

`OPTIONAL_PAGES` in `tests/publish/helpers.js` names the pages a publish may
legitimately lack, one line of reason each. Such a page is skipped when absent
and only when absent; every other 404 still fails the run, because a styling
test with nothing to look at reports success. The skip prints to stderr and is
repeated in the failure message of any sweep that did not cover it, so a run
never quietly claims more coverage than it had.

The cost is real and worth stating: if a *current* publish stops emitting one
of those pages, the sweeps go quiet instead of failing. Keep the list short.

Keep both. The pair is what makes an upgrade reviewable: the 26 snapshot says
what the publication used to look like, the 28 snapshot is what a future 28.1
build is diffed against.

## Refreshing `current/`

Publish from Oxygen to the gitignored `publications/pub-5/dita/out/`, verify it
(below), then copy it over `current/`.

## Diffing a new publish against a snapshot

```
python publications/pub-5/check-publish.py <path-to-new-output>
diff -rq site/pub-5/oxygen-26 <path-to-new-output>
```

Every page will differ on first inspection: Oxygen stamps a fresh
`buildId=<timestamp>` cache-buster into every asset reference on every run.
Normalise it before reading the diff, or the real changes are invisible:

```
sed -E 's/buildId=[0-9]+/buildId=X/g'
```

`.gitattributes` marks `site/pub-5/oxygen-*/**` as `-text` so `core.autocrlf`
cannot rewrite line endings on checkout and make every file differ from a fresh
publish.

## When Oxygen is next upgraded

The first verified publish on the new version is committed **twice**: as a new
frozen `oxygen-NN/` folder, and over `current/`. The previous version's frozen
folder stays, giving the same before/after pair this table describes.
