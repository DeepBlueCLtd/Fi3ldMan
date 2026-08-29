# Legacy regions publication

The archived Fi3ldMan publication built on a custom DITA specialization
(`dtd/`). It is kept for reference and is not developed; the active
publications are `../pub-5/` and `../pub-10/`, which use plain DITA.

- `regions/` — content using the specialization
- `regions_simple/` — the same content in plain DITA, no specialization
- `template/oxygen/` — its Oxygen publishing templates
- `FieldMan.ditamap` / `FieldMan_Simple.ditamap` — the two maps
- `FieldMan.xpr` — the Oxygen project

Its published output is at `site/legacy-regions/`, linked from the site hub.

Eventually this document will include steps to include the specialization in
OxygenXML. See `context-docs/08-legacy-migration-strategy.md` for the migration
story.
