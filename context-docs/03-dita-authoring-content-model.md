# Fi3ldMan - DITA Authoring & Content Model

## What is DITA?

DITA (Darwin Information Typing Architecture) is an OASIS XML standard for structured technical documentation. Content is authored as modular "topics" and assembled into publications via "maps." DITA supports conditional processing (profiling), content reuse, and multi-channel publishing.

Fi3ldMan uses DITA 1.2 with the Oxygen XML Editor as the authoring tool.

## DITA Maps (Publication Assembly)

### Pub-5 Master Map (`dita-parent/pub-5/dita/index.ditamap`)

```xml
<map title="Field Manual v5 Mar 2025">
  <topicref href="PlatformData/PD_1.dita">
    <!-- outputclass="wh_tile_width_100" makes this tile full width -->
  </topicref>
  <topicref href="QuickLinksData/Abbreviations.dita"/>
  <topicref href="Introduction/Warning.dita"/>
  <topicref href="QuickLinksData/Contents_Index.dita"/>
  <subjectScheme href="countryFilters.ditamap"/>
</map>
```

The map references top-level topics that serve as tile entry points on the landing page. Each top-level topic typically contains nested `topicref` elements pointing to regional and equipment subtopics.

### Pub-10 Master Map (`dita-parent/pub-10/dita/index.ditamap`)

```xml
<map title="Field Manual Pub-10 Mar 2025">
  <topicref href="gram-index.dita"/>
  <topicref href="Introduction/Security.dita"/>
</map>
```

A much simpler map with just two top-level references.

## Subject Scheme (Country Filtering)

The `countryFilters.ditamap` defines a subject scheme for conditional content:

```xml
<subjectScheme>
  <enumerationDef>
    <attributeDef name="audience"/>
    <subjectDef>
      <subjectDef keys="-france"/>
      <subjectDef keys="-england"/>
      <subjectDef keys="-spain"/>
      <subjectDef keys="-wales"/>
    </subjectDef>
  </enumerationDef>
</subjectScheme>
```

This allows topics or elements to be tagged with `audience="deny-wales"` (for example), and then filtered in/out at build time via `project.ditaval`.

## DITAVAL (Conditional Processing)

The `project.ditaval` file controls what content is included/excluded:

```xml
<val>
  <!-- Example: exclude Wales content -->
  <!-- <prop action="exclude" att="audience" val="deny-wales"/> -->
</val>
```

Currently all exclusions are commented out (all content included). Additional profiling attributes available: `platform`, `product`, `props`, `otherprops`, `rev`.

In the Oxygen project file, profiling conditions are visually color-coded:
- deny-england: displayed with a specific color in the editor
- deny-france: different color
- deny-spain: different color
- deny-wales: different color

## DITA Topic Types

### Standard Topics (Pub-5)
Regional equipment topics follow a consistent pattern with:
- **Short description** (`shortdesc`): Brief equipment summary (hidden in published output via CSS)
- **Body content**: Equipment specifications, signature tables, maintenance notes
- **Tables**: Equipment data with `data-cols` attribute for JavaScript integration
- **Related links**: Cross-references to other topics, external resources (Excel files)
- **Audience attributes**: Country profiling for conditional inclusion

### Gram Topics (Pub-10)
Gram topics use a specialized table structure:

```
gram-config table:
├── Row 1: Gram image (colspan=2)
├── Row 2: time-start | time-end
├── Row 3: freq-start | freq-end
└── Analysis table:
    ├── Question column
    └── Theory column
```

Gram analysis topics include training questions and harmonic analysis data with audience profiling (e.g., `audience="-trainee"` for trainee-specific content).

## Content Organization Patterns

### Regional Topics (Pub-5)
Each region follows a naming convention:
- `{Region}/` - Directory containing all topics for that region
- Legacy variants: `{Region}.Legacy/` - Older equipment generations
- Complex variants: `{Region}_Cmplx/` - Advanced configurations
- Composite variants: `{Region}_Composite/` - Hybrid systems

### Equipment Documentation Pattern
Each equipment topic typically covers:
1. Unit identification and classification
2. Propulsion specifications (engine type, shaft/blade ratios)
3. Performance characteristics (max speed, power, temperature)
4. Signature data (harmonic frequencies in 6-column tables)
5. Diagnostic indicators and failure modes
6. Regional notes and variations

### Shared Content
- `Content/` directories contain shared images used across topics
- `Introduction/` contains cover pages and administrative content
- `QuickLinksData/` provides abbreviations and cross-reference indices

## Legacy DITA Content

The `dita-legacy/` directory preserves earlier approaches:

### Custom DITA Specialization (`dita-legacy/dtd/`)
A custom DITA specialization was created specifically for Pub-5 content. This extended standard DITA elements with domain-specific structures.

### Two Content Versions
1. **Specialized version** (`dita-legacy/regions/`): Uses the custom DTD specialization
2. **Plain DITA version** (`dita-legacy/regions_simple/`): Same content using standard DITA elements only

The active publications in `dita-parent/` have moved to plain DITA (no specialization), making the content more portable and easier to maintain.

## Oxygen XML Editor Integration

### Project Files (.xpr)
Each publication has an Oxygen project file:
- `dita-parent/pub-5/dita/DITA_project_pub5.xpr`
- `dita-parent/pub-10/dita/DITA_project_pub10.xpr`
- `dita-legacy/FieldMan.xpr` (legacy)

These configure:
- Master files (which ditamap to use)
- Profiling conditions and color coding
- Build scenarios (transformation type, output directory, template)
- DITAVAL file references

### Build Scenario Configuration
A typical Oxygen build scenario specifies:
- **Transtype**: `webhelp-responsive`
- **Output directory**: `${pd}/out/`
- **Temp directory**: `${pd}/temp/webhelp-responsive`
- **Template**: Path to `.opt` file
- **DITAVAL**: Path to `project.ditaval`
- **Parameters**: figure/table link style, force-unique IDs, print link, TOC settings

## Author Layout

The `author_layout.layout` file at the repository root provides a custom editing layout for the Oxygen XML Author mode, optimizing the editing experience for Fi3ldMan content.
