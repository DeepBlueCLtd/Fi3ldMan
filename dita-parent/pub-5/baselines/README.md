# Pub-5 publish baselines

Reference WebHelp output, kept so that a publish from a *different* Oxygen
version can be diffed against a known state. These are snapshots — never
publish into this folder, and never edit the files by hand.

## `oxygen-26/`

| | |
| --- | --- |
| Published | 2026-08-24 23:05 |
| Oxygen | 26 (`C:\Program Files\Oxygen XML Editor 26`), asset build `2025053100` |
| Template | repo-root `template/` at commit `7f5489f` |
| Source | `dita-parent/pub-5/dita/out/oxygen-2025/`, copied byte-identical |
| Contents | 308 files, 98 HTML pages, 16 MB |

This is the **last good pre-28 publish** — the state to compare against once
Oxygen 28.1 and `template-2026/` are in play.

### Known defect captured in this snapshot

The corporate logo is broken on 97 of the 98 pages:

```
src="../C:\git\Fi3ldMan\dita-parent\pub-5\dita/template/corp_logo.png"
```

The cause is a *transformation scenario* parameter, not the template:
`DITA_project_pub5.xpr` sets `webhelp.logo.image` to `${pd}/template/corp_logo.png`,
where `${pd}` resolves to `…/pub-5/dita` — a folder with no `template/` in it.
So the path is both machine-absolute and pointing at nothing.

`template/f13ldMan.opt` now declares `webhelp.logo.image="corp_logo.png"`
relative to the template folder, which is the correct home for it. **That only
takes effect once the scenario parameter is removed**, because scenario
parameters override publishing-template parameters. In Oxygen: *Configure
Transformation Scenario → Parameters → select `webhelp.logo.image` → Delete*,
then re-publish. Everything else in this snapshot resolves.

## Verifying a publish

```
python dita-parent/pub-5/check-publish.py <output-dir>
```

Reports page count, Oxygen asset build id, which Oxygen era the assets belong
to (`commons.*` = pre-28, `bootstrap.css`/`jquery.js` = 28.1), Fi3ldMan script
injection coverage, whether the search index was built, and every local
`href`/`src` that does not resolve on disk.

Against `oxygen-26/` the expected result is 98 pages, scripts on 94 of them
(the 4 without are the main, search, index-terms and context-help pages), search
index built, and exactly the 97 logo references broken.
