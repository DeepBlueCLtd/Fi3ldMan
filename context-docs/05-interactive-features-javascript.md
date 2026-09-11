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

**Location**: `template/resources/current-handler.js`

**Purpose**: Highlights the currently active navigation link by comparing `document.URL` against every anchor's resolved `href` and toggling a `"current"` CSS class on the ones that match. `f13ldman.css` uses it to grey out and disable the related-links entry pointing at wherever the reader is.

**Behavior**: Two kinds of link count as current, and both mean "this is where the reader already is":

- an **exact** match on the full URL, fragment included — this is what marks an in-page link to the anchor the reader has scrolled to;
- a link to **this page carrying no fragment of its own**, whatever anchor the reader is at within it. A related-links panel usually holds one of these ("Overview"), and an exact-match-only rule left it looking like an ordinary link to somewhere else as soon as the reader followed any in-page link — the opposite of what `.related_link .current` exists to do.

`link.hash` is empty only when the link carries no fragment at all, so the second rule never claims another topic's anchor link.

The marking is redone on every navigation, not computed once at load. That is not as simple as it sounds, because a related-links panel can hold in-page links (`href="#topic__number3"`) and no single event covers following one:

| Route | Hook |
| --- | --- |
| Page load | `document.onreadystatechange`, at `complete` |
| A hash typed into the address bar, or a link Oxygen did not intercept | `hashchange` |
| Back / Forward | `popstate` |
| Clicking an in-page link | a wrapper around `history.pushState` / `replaceState` |

The last one is the awkward one. Oxygen's own `app/topic.js` intercepts a click on an in-page link, calls `preventDefault()`, scrolls the page itself and rewrites the address with `history.pushState` — and `pushState` fires neither `hashchange` nor `popstate`. So the address can change with no event raised anywhere, which is why the panel appeared frozen on a page whose URL was in fact keeping up (issue #192). The wrapper calls the original method first and preserves its return value; it is invisible to Oxygen and only supplies the notification the History API declines to send.

`tests/publish/scripts.spec.js` covers both the load-time marking and the in-page case, the latter on `Britain_Cmplx/unit_banjo.html` — a topic with two in-page related links, which is the smallest content that can show the marking failing to move.

## Pub-10 Specific Components

### 4. Gram Frame Viewer (`gramframe.bundle.js`)

**Location**: `publications/pub-5/template-2026/resources/gramframe.bundle.js` — the shared template, loaded by every publication and a no-op where there is no `gram-config` table.

**Purpose**: Specialized visualization component for spectral analysis "Grams" in Pub-10. This is a bundled JavaScript module (likely Webpack output) that provides interactive gram/spectrogram display capabilities.

**Used by**: Pub-10 gram topics only. Not included in Pub-5.

**Features**: Renders gram images with configurable time and frequency parameters as defined in the gram DITA topic structure.

## Mockup-Only Features

### Dynamic Tables (Mockup Prototypes)

Located in `site/mockups/dynamic-tables/dynamic_tables/`:

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

### Related-link icons

Not a script, but the other half of what a reader sees in that panel. `f13ldman.css` badges a related link in two cases only: `rel="external"`, which DITA emits for a link the author marked `scope="external"`, and a `.xls`/`.xlsx` target, which downloads rather than opens. Everything else — an in-page anchor, an ordinary topic in the same publication, the link back to this page — carries no icon.

It used to be "every link that is not an in-page anchor gets the external-link icon", which badged every ordinary topic as though it were outside the publication and left the one genuinely external link with no way to stand out.

### CSS Dependencies
The JavaScript components rely on CSS classes defined in `f13ldman.css`:
- `match_row` / `match_harmonic`: Highlighting for harmonic matches
- `current`: Active navigation link styling
- `sortable`: Table header cursor and sort indicator styling

## Resource Loading

Resources are loaded via the Oxygen WebHelp template system. The `.opt` template configuration specifies which CSS and JavaScript files to include. All shared resources are referenced from the `template/resources/` directory, while Pub-10's `gramframe.bundle.js` is in its own `template/resources/` directory.
