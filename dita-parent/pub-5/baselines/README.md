# Publish baselines

Byte-exact snapshots of published pub-5 WebHelp output, kept so that a publish
from a different Oxygen version can be diffed against a known-good reference.

These are **not** the browsable preview copy — that lives in repo-root `out/`
and is linked from `index.html`. Nor are they build output: they sit outside
every Oxygen output directory, so a publish with `clean.output=yes` cannot
delete them.

| Snapshot | Oxygen | Template | Published | Suite |
| --- | --- | --- | --- | --- |
| `oxygen-26/` | 26 | repo-root `template/` | 2026-08-25 | 37/37 |
| `oxygen-28/` | 28.1 | `template-2026/` | 2026-08-25 | 37/37 |

`oxygen-26/` is the last known-good output *before* the move to Oxygen 28.1 and
`template-2026/`. `oxygen-28/` is the first known-good output after it — the
build that confirmed the rebuilt template works. Both verify clean: 98 pages,
zero broken references, search index built, the three Fi3ldMan scripts on 94/98
pages.

Keep both. The pair is what makes an upgrade reviewable: the 26 snapshot says
what the publication used to look like, the 28 snapshot is what a future 28.1
build is diffed against.

## Diffing a new publish against a baseline

```
python dita-parent/pub-5/check-publish.py <path-to-new-output>
diff -rq dita-parent/pub-5/baselines/oxygen-26 <path-to-new-output>
```

Every page will differ on first inspection: Oxygen stamps a fresh
`buildId=<timestamp>` cache-buster into every asset reference on every run.
Normalise it before reading the diff, or the real changes are invisible:

```
sed -E 's/buildId=[0-9]+/buildId=X/g'
```

`.gitattributes` marks this tree `-text` so `core.autocrlf` cannot rewrite line
endings on checkout and make every file differ from a fresh publish.
