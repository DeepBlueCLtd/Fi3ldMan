# Pub-5 publishes

Everything in this folder is published WebHelp output, served by GitHub Pages
under `/pub-5/`.

| Folder | Oxygen | Template | Published | Suite | Role |
| --- | --- | --- | --- | --- | --- |
| `current/` | 28.1 | `template-2026/` | 2026-08-25 | 37/37 | Browsable current publish |
| `oxygen-28/` | 28.1 | `template-2026/` | 2026-08-25 | 37/37 | Frozen snapshot |
| `oxygen-26/` | 26 | `template-2024/` | 2026-08-25 | 37/37 | Frozen snapshot |
| `oxygen-25/` | 25.x | 25.1-era template | 2023 (committed 2025-01) | — | Frozen snapshot |

`current/` is the only folder a publish overwrites. The `oxygen-NN/` folders are
**frozen**: byte-exact snapshots of a verified publish, kept so that a publish
from a different Oxygen version can be diffed against a known-good reference.
They are not build output — they sit outside every Oxygen output directory, so a
publish with `clean.output=yes` cannot delete them.

`oxygen-26/` is the last known-good output *before* the move to Oxygen 28.1 and
`template-2026/`. `oxygen-28/` is the first known-good output after it — the
build that confirmed the rebuilt template works. Both verify clean: 98 pages,
zero broken references, search index built, the three Fi3ldMan scripts on 94/98
pages.

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
