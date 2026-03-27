# Fi3ldMan - Publications Guide (Pub-5, Pub-9, Pub-10)

## Publication Overview

The Fi3ldMan project produces three publications from a shared template infrastructure. All publications use the DITA XML authoring format and the Oxygen WebHelp Responsive publishing engine.

| Publication | Title | Status | Scope | Source Location |
|-------------|-------|--------|-------|-----------------|
| Pub-5 | Field Manual v5 Mar 2025 | Active (published) | Regional field service documentation | `dita-parent/pub-5/dita/` |
| Pub-9 | (Companion to Pub-10) | Mockup stage | Spectral analysis (Grams) | `mockup/p9_10_mock/p9/` |
| Pub-10 | Field Manual Pub-10 Mar 2025 | Active (published) | Spectral analysis (Grams) | `dita-parent/pub-10/dita/` |

## Publication 5 (Pub-5) - Regional Field Service Manual

### Purpose
Pub-5 is the main and most extensive publication. It documents field service procedures, equipment specifications, diagnostic techniques, and maintenance guidance organized by geographic region. It was the original publication that the Fi3ldMan repository was created to support.

### Master Map
- **File**: `dita-parent/pub-5/dita/index.ditamap`
- **Title**: "Field Manual v5 Mar 2025"
- **Top-level references**:
  - `PlatformData/PD_1.dita` (full-width tile on main page)
  - `QuickLinksData/Abbreviations.dita`
  - `Introduction/Warning.dita`
  - `QuickLinksData/Contents_Index.dita`
  - `countryFilters.ditamap` (subject scheme for country-based filtering)

### Regional Coverage

Each region typically has multiple variants reflecting different equipment generations and complexities:

| Region | Variants | Description |
|--------|----------|-------------|
| **Britain** | Britain.Legacy, Britain1, Britain_Cmplx | Legacy, modern, and complex configurations |
| **France** | Fr_Legacy, France1 | Legacy and modern equipment |
| **Spain** | Spain.Legacy, Spain, Spain_Cmplx | Legacy, standard, and complex configurations |
| **Wales** | Wales.Legacy, Wales, Wales_Cmplx, Wales_Composite | Legacy, standard, complex, and composite/hybrid systems |
| **Wight and Man** | WightandMan | Single variant for this region |

### Shared Technical Content
- **Transducers**: Standalone component library (Charlie_Transducer, Delta_Transducer, Bravo, Echo)
- **Brush Noise**: Predictive maintenance guide for brush wear detection
- **PlatformData**: Regional maps and installation overview data
- **QuickLinksData**: Abbreviations glossary, contents/index, vanes and cranes reference
- **Introduction**: Cover page, administrative/distribution warnings, What's New

### Equipment Documented in Pub-5

The manual documents diesel-powered marine/industrial propulsion systems:

**Unit Classes:**
- **Unit Charlie**: 4 Diesel engines, PTR mode, propulsion signature analysis
- **Unit Delta**: Hydraulic drive systems with multiple shaft configurations
- **Unit Anchors**: Anchor systems with complex propulsion
- **Unit Banjo**: Referenced in complex system configurations

**Technical Specifications per Unit:**
- Propulsion type (V8/V6 Diesel configurations)
- Shaft x Blade ratios (e.g., 2x4 FPP, 3x3, 12x4)
- Maximum speeds (16-40 knots)
- Reduction ratios and gearing
- Temperature operating ranges
- Power consumption
- Friction measurements

**Transducer Specifications:**
- Bravo Transducer: 12 Hz frequency, AAW pairing, multiple temperature modes
- Charlie Transducer: Country-specific variants
- Echo Transducer: Referenced across regions
- Phase G / Phase F systems: Advanced signature analysis

### Content Filtering
Pub-5 uses DITA profiling (conditional processing) to include/exclude content by country:
- **Subject scheme**: `countryFilters.ditamap` defines audience attributes
- **Filter values**: `deny-france`, `deny-england`, `deny-spain`, `deny-wales`
- **Filter file**: `project.ditaval` controls which countries are included at build time
- Currently all content is included (no exclusions active)

### Landing Page
Tile-based layout with regional tiles at 50% width each, and the PlatformData tile at 100% width.

---

## Publication 10 (Pub-10) - Grams Analysis

### Purpose
Pub-10 is a specialized publication focused on "Grams" - spectral/acoustic analysis data used for signal identification and diagnostic analysis. It was developed after Pub-5 using the same template infrastructure.

### Master Map
- **File**: `dita-parent/pub-10/dita/index.ditamap`
- **Title**: "Field Manual Pub-10 Mar 2025"
- **Top-level references**:
  - `gram-index.dita` (main gram navigation landing page)
  - `Introduction/Security.dita` (security classification)

### Content Structure

**Gram Topics:**
- `gram1.dita` / `gram1-2.dita` - Gram 1 data and variant
- `gram2.dita` / `gram2-2.dita` - Gram 2 data and variant
- `gram1 analysis.dita` - Gram 1 analysis questions and theory
- `gram2 analysis.dita` - Gram 2 analysis questions and theory

**Gram Data Structure:**
Each gram topic contains:
- Gram image (spanning 2 columns in the configuration table)
- Time parameters: `time-start`, `time-end` (typical window 0-40 seconds)
- Frequency parameters: `freq-start`, `freq-end` (typical range 100-300 Hz)
- Analysis question/theory table for training and diagnostic notes
- LOFAR references for acoustic analysis

**Gram Analysis Topics:**
- Training questions about depth, height, weather considerations
- Harmonic patterns: H1-4 analysis
- Signal ratios: S12, S5 frequencies, CSR multipliers

### Specialized JavaScript
Pub-10 includes `gramframe.bundle.js` (217KB bundled JavaScript) for gram visualization, in addition to the shared JavaScript components.

### Landing Page
The `gram-index.dita` page provides button-style navigation to individual grams. The `Welcome.dita` page serves as a cover/entry point with a "Next Page" link.

---

## Publication 9 (Pub-9) - Companion to Pub-10

### Purpose
Pub-9 is a companion publication to Pub-10, both covering spectral analysis content. Pub-9 is currently at the mockup/prototype stage - HTML mockups exist but no DITA source directory has been created yet.

### Current State
- **Mockup location**: `mockup/p9_10_mock/p9/`
- **No DITA source**: There is no `dita-parent/pub-9/` directory yet
- **Structure**: Mirrors Pub-10's structure (Grams, Introduction, gram-index)
- **Content differences**: Subtle content variations from Pub-10 (~50 byte differences in key files)

### Pub-9/10 Mockup Navigation
The mockup hub at `mockup/p9_10_mock/index.html` links to both P9 and P10 previews. Both mockups include the full Oxygen WebHelp framework with search, sorting, and harmonic analysis JavaScript.

---

## Relationship Between Publications

```
Pub-5 (Regional Field Service Manual)
  └── The original publication; template infrastructure built for this
  └── Covers: equipment, regions, transducers, maintenance, diagnostics

Pub-9 + Pub-10 (Grams / Spectral Analysis pair)
  └── Built on the same template infrastructure as Pub-5
  └── Pub-10: Active with DITA source and published output
  └── Pub-9: Mockup stage, companion to Pub-10
  └── Cover: spectral analysis, acoustic signatures, training exercises
```

All three publications share:
- The same Oxygen WebHelp Responsive template system
- Common CSS (f13ldman.css, notes.css, oxygen.css)
- Common JavaScript (harmonics.js, sorttable.js, current-handler.js)
- The "COMMERCIALLY SENSITIVE" protection banner
- The same tile-based landing page design pattern