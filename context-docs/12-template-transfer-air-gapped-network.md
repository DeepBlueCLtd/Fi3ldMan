# Fi3ldMan - Moving the Publishing Template to the Air-Gapped Network

## Purpose and scope

The real Fi3ldMan publications live on an air-gapped network. This repository
holds the **publishing template** plus representative sample content. To produce
a new version of the real manual, the template is transferred from the
development machine to the air-gapped network across a one-way gateway, and the
publication is then built there against the real DITA source using the Oxygen
installation on that network.

This document covers that transfer and the target-side setup. For how the
template itself works, see `11-publishing-template-2026.md`.

**What moves:** `dita-parent/pub-5/template-2026/` — 40 files, about 1.4 MB.
**What does not move:** DITA source, build output, `.git`, `node_modules`, the
`.xpr` project file. The real source and its project already exist on the target.

Items marked **«site-specific»** depend on local procedure and are not recorded
in this repository. Fill them in for your site and keep them with this document.

## The governing constraint

The gateway is **one-way**. There is no round trip: nothing comes back, and no
one on the receiving side can ask a question and get an answer in the same
working session. Every defect costs a full transfer cycle.

Three consequences shape the whole procedure:

1. **Verify before sending, not after.** A build that has not been run and
   checked on this side should not cross.
2. **The package must be self-diagnosing.** Integrity must be checkable on the
   receiving side with no external reference, which is what `MANIFEST.sha256`
   and `verify-integrity.ps1` are for.
3. **The documentation travels with the payload.** The person doing the
   target-side work needs the procedure in hand. Include this file.

## Preconditions

| Requirement | Detail |
| --- | --- |
| Oxygen version, both sides | **28.1 (2026).** Confirmed present on the target. Verify via `Help > About` |
| Source-side build | Sample build run and all five verification checks passed |
| Real corporate logo | See "The logo" below — decide before packaging |
| Gateway submission route | «site-specific» |
| Target-side template location | «site-specific» — the folder the Oxygen installation there will read from |

> **The version match is not a formality.** This template is built on the 28.1
> base. On Oxygen 25.1 it produces broken, unstyled output, which is the exact
> failure mode the rebuild was done to fix. If the target Oxygen is ever
> upgraded or rolled back, re-check this before transferring.

---

## Phase A — Pre-flight on the development machine

Do not skip this because the change looks trivial. This is the last point at
which a mistake is cheap.

1. Open `dita-parent/pub-5/dita/index.ditamap` in Oxygen.
2. Run the **`Fieldman Webhelp 2026`** transformation scenario.
3. Work through the full verification checklist in
   `11-publishing-template-2026.md` — all five checks, in a browser, on the
   generated output.
4. Confirm the working tree is clean and the template is committed. The
   transferred template should correspond to a known commit, so that what is on
   the target can be traced back to a specific state of this repository.

Record the commit hash — it goes in the transfer record.

### The logo

`corp_logo.png` in this repository is a **placeholder**, copied from
`dita/Content/Images/image020.png`. Decide which applies:

- **The real logo is already on the target network.** Leave the placeholder in
  the package and replace the file on the target after transfer (Phase F).
- **The real logo is available here.** Replace `corp_logo.png` before packaging,
  re-run Phase A, and commit.

Either way it must not be the placeholder in the published output.

---

## Phase B — Build the transfer package

Run from the repository root, in git bash:

```bash
cd dita-parent/pub-5/template-2026

# Generate the integrity manifest (excludes itself)
# The -b is required: verify-integrity.ps1 parses the binary-mode
# "<hash> *<path>" form. Plain sha256sum emits "<hash>  <path>", which the
# script cannot read - it reports every line as unreadable and fails the
# whole package on arrival.
find . -type f -not -name 'MANIFEST*' | sort | xargs sha256sum -b > MANIFEST.sha256

# Confirm it verifies here before it travels
sha256sum -c MANIFEST.sha256 | grep -v ': OK$' || echo 'All files OK'
```

`MANIFEST.sha256` is a per-transfer artefact, regenerated on each crossing. It
is not committed, and is gitignored so packaging does not dirty the tree.

Then package the folder, using whichever archive format the gateway accepts:

```bash
# From dita-parent/pub-5/ - .zip
zip -r -X fi3ldman-template-2026.zip template-2026/

# ...or .tar.gz
tar -czf fi3ldman-template-2026.tar.gz template-2026/
```

```powershell
# PowerShell equivalent, where git bash is not available
Compress-Archive -Path .\template-2026 -DestinationPath .\fi3ldman-template-2026.zip
```

Record the SHA-256 of the finished archive in a sidecar file next to it
(`sha256sum -b <archive> > <archive>.sha256`), not inside the archive - an
archive cannot contain its own hash.

The package must contain, at minimum:

| Item | Why |
| --- | --- |
| The complete `template-2026/` folder | The payload |
| `MANIFEST.sha256` | Integrity verification on arrival |
| `verify-integrity.ps1` | Ships inside the template folder; runs on stock Windows |
| `README.md` | Ships inside the template folder; change rationale |
| This document + `11-publishing-template-2026.md` | The target-side operator needs both |

Do **not** include `out/`, `.git`, `node_modules`, or any DITA source.

### File types in the payload

Gateways commonly filter on extension or content type. The payload contains:

| Extension | Count | Note |
| --- | --- | --- |
| `.png` / `.jpg` / `.gif` / `.svg` | 11 | Images |
| `.css` | 6 | |
| `.xsl` | 5 | XML |
| `.ttf` | 4 | **Roboto fonts — binary; the most likely to be blocked** |
| `.html` | 4 | Page layouts |
| `.xml` | 3 | Fragments |
| `.js` | 3 | **Scripts — commonly restricted** |
| `.opt` | 1 | **Unusual extension; it is plain XML.** May need renaming to `.xml` in transit and renaming back on arrival |
| `.md`, `.txt`, `.ps1` | 3 | Docs, font licence, verify script |

Largest single file is `resources/images/WorldMap.jpg` at ~280 KB; the whole
payload is ~1.4 MB, so size limits are unlikely to bite.

If any file is stripped, blocked or renamed in transit, `verify-integrity.ps1`
will report it as `MISSING` or `MISMATCH` on arrival — which is the point.

---

## Phase C — Cross the gateway

«site-specific» — follow local submission procedure.

Note anything the gateway does to the payload: re-compression, extension
rewriting, metadata stripping. Some gateways normalise line endings, which will
change hashes for text files and show up as `MISMATCH`. If that happens
routinely at your site, record it here so it is not mistaken for corruption:

> «site-specific» — observed gateway transformations, if any.

---

## Phase D — Verify integrity on arrival

Before anything else, on the target network:

```powershell
cd <template folder>
powershell -NoProfile -ExecutionPolicy Bypass -File verify-integrity.ps1
```

Expected output:

```
Files checked: 40   Problems: 0
Integrity OK
```

The script uses only stock Windows PowerShell — no git bash, no network, no
additional tooling. It reports `MISSING` for absent files, `MISMATCH` for
altered ones, and fails loudly if the manifest itself is absent or empty, so an
unreadable manifest cannot be mistaken for a pass.

**If it reports any problem, stop.** Do not attempt to repair files by hand; a
partial template produces subtly broken output rather than an obvious failure.
Re-transfer.

---

## Phase E — Install and register the template

1. Place the verified `template-2026` folder in its location on the target.
   «site-specific»
2. Register it with Oxygen, either:
   - **Gallery:** `Options > Preferences > DITA > Publishing Templates`, add the
     folder; the template then appears as **f13ldMan 2026** in the Templates
     tab; or
   - **Direct:** skip the gallery and browse straight to `f13ldMan.opt` when
     configuring the scenario in Phase F.

Keep any previous template folder in place rather than overwriting it — see
Rollback.

---

## Phase F — Point the transformation scenario at it

Against the **real** publication's map on the target network:

1. Open the real `index.ditamap`.
2. `Configure Transformation Scenario` → duplicate the existing
   `webhelp-responsive` scenario rather than editing it in place. This preserves
   a working fallback.
3. **Templates tab:** select **f13ldMan 2026**, or browse to `f13ldMan.opt`.
4. **Output tab:** set an output directory *separate from the current live
   build*, so the new output can be inspected before it replaces anything.
5. **Parameters tab: delete any `webhelp.logo.image` override.**

   > This is the most common way to break an otherwise correct setup. The
   > template supplies the logo relative to its own folder. A scenario-level
   > override reintroduces the absolute-path bug that emitted
   > `src="C:\git\Fi3ldMan\...\corp_logo.png"` into every page — a path that
   > resolves on no machine.

6. Leave the other parameters alone unless this export needs a different
   protective marking, in which case set `webhelp.protection.text` and
   `webhelp.protection.background.color` here — per export, not in the shared
   template.
7. If the real logo was not packaged, replace `corp_logo.png` in the template
   folder now.

---

## Phase G — Build and verify

1. Run the scenario.
2. Work through the verification checklist from
   `11-publishing-template-2026.md` in a browser on the target:

| # | Check | Fails when |
| --- | --- | --- |
| 1 | `harmonics.js`, `sorttable.js`, `current-handler.js` all load; no 404s; no `commons.css` / `commons.js` | The `webhelp.fragment.head.topic.page` mechanism did not take |
| 2 | Logo present, `src` relative, real logo not placeholder | A `webhelp.logo.image` override survived, or the logo was not replaced |
| 3 | One search box, in the nav bar, working | A `FI3LDMAN DELTA` deletion did not take |
| 4 | Protection bars top and bottom, correct text and colour | Protection parameters or header/footer XSLT |
| 5 | Top menu positioned correctly | The `.wh_top_menu` retarget in `f13ldman.css` |

Check 1 matters most: it exercises the one genuinely new mechanism in this
template. If it fails, the fallback is to set the scenario's
`webhelp.fragment.head.topic.page` parameter to point at
`page-templates-fragments/topic-page-head.xml`.

---

## Phase H — Tuning that can only be done on the target

Some things cannot be settled on the development side, because the real content
is not here. Expect to do these once, on the target, and record the values.

### Image heights

The two variables in the `:root` block of `f13ldman.css` (lines 388-394) control
the height of linked-image rows and image link tables:

| Variable | Default | Applies to |
| --- | --- | --- |
| `--f13-image-row-height` | `177px` | Rows of linked images in a plain DITA `<div>` |
| `--f13-image-link-height` | `150px` | Linked images inside a table cell |

**These defaults were read off the sample content in this repository, not the
real publication.** They are expected to be close, but if rows look wrong
against the real images, edit the two values in the `:root` block. It is one
edit and it applies everywhere — no content or image changes needed.

Record the values you settle on and feed them back to the development side on
the next update cycle, so the repository default stops being a guess.

### Things to watch for

- **`[data-id="PD_1"]`** in `f13ldman.css` makes the "Regions" tile full width.
  It keys off a DITA filename prefix. If the real publication has renamed that
  file, the rule silently does nothing and the tile renders at half width.
- **`:has()` browser support** — the image row rule needs Chrome/Edge 105+,
  Safari 15.4+ or Firefox 121+. On older browsers on analyst workstations the
  rule is ignored and images fall back to uneven sizing. Cosmetic, not broken.

---

## Rollback

The scenario duplication in Phase F is the rollback mechanism. To revert:

1. Switch the map back to the previous transformation scenario.
2. Rebuild to the live output directory.

Keep the previous template folder in place until the new output has been
accepted. Because the new build went to a separate output directory (Phase F
step 4), nothing live was overwritten and rollback needs no restore.

---

## When a re-transfer is needed

| Change | Re-transfer? |
| --- | --- |
| Any edit to `f13ldman.css`, `notes.css`, XSLT, page layouts, fragments or `f13ldMan.opt` made on the development side | Yes — full package |
| Tuning the two image-height variables | No — edit in place on the target, then mirror the change back into the repository |
| Different protective marking or banner colour for an export | No — scenario parameters |
| Replacing the corporate logo | No — replace `corp_logo.png` in place on the target |
| Oxygen upgraded on either side | Yes, after re-basing the template on the new stock files — see the upgrade procedure in `11-publishing-template-2026.md` |

Changes made directly on the target must be mirrored back into this repository,
or the next transfer will silently overwrite them.

---

## Transfer record

Keep a record of each crossing. «site-specific» as to where this lives, but at
minimum:

| Field | Example |
| --- | --- |
| Date | |
| Source commit hash | |
| Package name and SHA-256 of the archive | |
| Oxygen version, both sides | 28.1 / 28.1 |
| Verification result on arrival | `Files checked: 40   Problems: 0` |
| Five-point checklist result | |
| Image-height values in use | `177px` / `150px` |
| Any target-side edits made | |

The source commit hash is the important one: it is what makes the template on
the target traceable to a known state of this repository.
