# Fi3ldMan - Interactive Features & JavaScript Components

## Overview

The published Fi3ldMan output includes several JavaScript components that add interactive functionality beyond static HTML documentation. These are delivered as part of the Oxygen WebHelp template resources.

## Shared Components (All Publications)

### 1. Harmonics Calculator (`harmonics.js`)

**Location**: `template/resources/harmonics.js` (~4,891 lines)

**Purpose**: An interactive harmonic frequency calculator embedded in signal analysis pages. It allows field service personnel to enter observed frequencies and match them against known harmonic signatures in the documentation.

**How It Works**:
1. Detects HTML tables with the `data-cols="6"` attribute (signature tables)
2. Injects a calculator form into the `.wh_content_area` container
3. User enters:
   - **SR** (Sample Rate)
   - **CSR** (Custom Sample Rate)
   - **Observed frequencies** (in a textarea, one per line)
4. Calculates harmonic matches with a tolerance of **+/- 1 Hz** (`FREQ_ERROR`)
5. Displays matching results in expandable rows within the signature tables
6. Highlights matches with `match_row` and `match_harmonic` CSS classes

**Data Types for Frequency Ratios**:
| Type | Prefix | Meaning |
|------|--------|---------|
| S-ratio | `S` | Sample rate dependent (value * SR) |
| CSR-ratio | `C` | Custom sample rate dependent (value * CSR) |
| Absolute | `A` | Direct frequency value |

**Persistence**: Form values are stored in `localStorage` with the key `'harmonics-for-key'`, so they persist across page navigations within the same browser session.

**Input Handling**:
- Supports range expansion (e.g., "1-20" expands to show first 5 + "..." + last entries)
- Regex-based parsing of complex ratio formats
- Numeric validation on all frequency inputs
- Tick/checkmark indicator when matches are found

### 2. Sortable Tables (`sorttable.js`)

**Location**: `template/resources/sorttable.js`

**Purpose**: Enables client-side column sorting on HTML tables marked with `class="sortable"`.

**Origin**: Based on Stuart Langridge's sorttable v2 (2007), modified by Ian Mayo (January 2025) to support integer-in-brackets sort priority.

**Features**:
- Click any column header to sort ascending; click again for descending
- Automatic data type detection: date, numeric, alphanumeric
- Rows with `class="sortbottom"` are moved to `<tfoot>` and excluded from sorting
- IE compatibility support
- Non-intrusive: only activates on tables with the `sortable` class

### 3. Current Page Handler (`current-handler.js`)

**Location**: `template/resources/current-handler.js` (~13 lines)

**Purpose**: Highlights the currently active navigation link by comparing `window.location.href` against all anchor `href` attributes and adding a `"current"` CSS class to matching links.

**Behavior**: Runs on `DOMContentLoaded` event. Enables CSS-based styling of the active navigation item.

## Pub-10 Specific Components

### 4. Gram Frame Viewer (`gramframe.bundle.js`)

**Location**: `dita-parent/pub-10/template/resources/gramframe.bundle.js` (~217KB bundled)

**Purpose**: Specialized visualization component for spectral analysis "Grams" in Pub-10. This is a bundled JavaScript module (likely Webpack output) that provides interactive gram/spectrogram display capabilities.

**Used by**: Pub-10 gram topics only. Not included in Pub-5.

**Features**: Renders gram images with configurable time and frequency parameters as defined in the gram DITA topic structure.

## Mockup-Only Features

### Dynamic Tables (Mockup Prototypes)

Located in `mockup/britain-legacy/dynamic_tables/`:

| Mockup | Description |
|--------|-------------|
| `alternate_calc_models.html` | Alternative calculation model demonstrations |
| `synced_persistent_tables.html` | Synchronized and persistent table data |
| `heatmap_demo.html` | Heatmap visualization prototype |

These are proof-of-concept prototypes that may or may not be incorporated into future publications.

## Integration with DITA Content

The JavaScript components interact with the published HTML through specific conventions:

### Table Integration
- **Signature tables**: Must have `data-cols="6"` attribute for harmonics.js to detect them
- **Sortable tables**: Must have `class="sortable"` for sorttable.js to activate
- These attributes are set in the DITA source and preserved through the XSLT transformation

### Page Structure Integration
- **harmonics.js**: Targets `.wh_content_area` container (standard Oxygen WebHelp class)
- **current-handler.js**: Scans all `<a>` elements in the page
- **gramframe.bundle.js**: Targets gram-specific containers in Pub-10 topics

### CSS Dependencies
The JavaScript components rely on CSS classes defined in `f13ldman.css`:
- `match_row` / `match_harmonic`: Highlighting for harmonic matches
- `current`: Active navigation link styling
- `sortable`: Table header cursor and sort indicator styling

## Resource Loading

Resources are loaded via the Oxygen WebHelp template system. The `.opt` template configuration specifies which CSS and JavaScript files to include. All shared resources are referenced from the `template/resources/` directory, while Pub-10's `gramframe.bundle.js` is in its own `template/resources/` directory.
