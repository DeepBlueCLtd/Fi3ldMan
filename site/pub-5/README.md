# Pub-5 publishes

Everything in this folder is published WebHelp output, served by GitHub Pages
under `/pub-5/`.

| Folder | Oxygen | Template | Published | Suite | Role |
| --- | --- | --- | --- | --- | --- |
| `current/` | 28.1 | `template-2026/` | 2026-08-25 | **1 failing** | Browsable current publish |
| `oxygen-28/` | 28.1 | `template-2026/` | 2026-08-25 | **1 failing** | Frozen snapshot |
| `oxygen-26/` | 26 | `template-2024/` | 2026-08-25 | 39/39 | Frozen snapshot |
| `oxygen-25/` | 25.x | 25.1-era template | 2023 (committed 2025-01) | — | Frozen snapshot |

> **`current/` and `oxygen-28/` are known bad and awaiting replacement.** Both
> fail `cascade.spec.js` on 22 declarations: they were published *before* the
> table-cell `!important` fix, so every coloured table cell renders white while
> the HTML, the classes and the stylesheet are all correct. A verified publish
> has been confirmed to fix it; both folders are refreshed at the next publish,
> which also picks up `StyleSamples.dita`. Until then the deployed site shows
> white cells on pages such as `Britain.Legacy/Phase_G.html`.

`current/` is the only folder a publish overwrites. The `oxygen-NN/` folders are
**frozen**: byte-exact snapshots of a verified publish, kept so that a publish
from a different Oxygen version can be diffed against a known-good reference.
They are not build output — they sit outside every Oxygen output directory, so a
publish with `clean.output=yes` cannot delete them.

`oxygen-26/` is the last known-good output *before* the move to Oxygen 28.1 and
`template-2026/`. `oxygen-28/` is the build that confirmed the rebuilt template
works. Both survey clean under `check-publish.py`: 98 pages, zero broken
references, search index built, the three Fi3ldMan scripts on 94/98 pages.

That survey is what made `oxygen-28/` look trustworthy while it was not.
`check-publish.py` counts pages and references; it cannot see a stylesheet that
loads, returns 200, and then loses the cascade. Only the browser suite catches
that, and it was never run against the folder before it was frozen.

**Freezing a snapshot does not verify it.** Run the suite against a folder
before trusting it as a reference, and re-run it when the template changes — a
snapshot taken before a fix stays broken for as long as it sits there:

```
PUBLISH_DIR=site/pub-5/oxygen-28 npm test
```

When `oxygen-28/` is replaced, the pre-fix snapshot remains in git history if
the old rendering is ever needed.

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
