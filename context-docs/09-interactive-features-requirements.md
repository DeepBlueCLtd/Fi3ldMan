# Fi3ldMan - Interactive Features: Requirements & User Needs

## Overview

This document captures the **requirements and user needs** behind Fi3ldMan's interactive JavaScript features, as expressed in GitHub issues and pull requests. For technical implementation details of existing features, see `05-interactive-features-javascript.md`.

## Harmonics Calculator

### User Story

An acoustic analyst detects an unknown frequency and needs to determine which platform is producing it. The harmonics calculator enables rapid cross-referencing of observed frequencies against known signature data.

### Requirements (from Issues #125, #126, #129–136, #139, #142)

| Requirement | Detail |
|-------------|--------|
| SR/CSR entry | User enters Shaft Rate and/or Corrected Shaft Rate values |
| Harmonic computation | Calculate all harmonics for each row in signature tables |
| Observed frequency matching | Highlight table rows where computed harmonics match an entered frequency |
| Dominant harmonic emphasis | Bold formatting for dominant harmonics (as marked in source data) |
| Absolute frequency toggle | Switch between ratio-based and absolute frequency display |
| Precision levels | Precise (±0.1 Hz), Standard (±1 Hz), Loose (±4 Hz) |
| Speed calculator | `speed = SR / TPK` with auto-calculation of missing values |
| Cross-page persistence | Calculator values stored in localStorage, available across page navigations |
| Complex ratio parsing | Handle formats like `135.2 x CSR`, `H2-4, **5**, 7`, mixed notations |
| Error reporting | Surface unparseable data to authors for correction |

### Pain Points

- Ratio/harmonic formats vary wildly across legacy content — no consistent notation
- Some ratios reference SR, others CSR, others are absolute frequencies
- Bold/dominant indicators embedded in HTML formatting rather than structured data

## Interactive Gram Viewer

### User Story

Training operators study spectrogram ("gram") images to learn acoustic feature recognition. They need to interactively measure distances between features on the waterfall display, guided by the "7 Questions" analytical framework.

### Requirements (from Issues #121, #151, #157, #158, #159, #163)

| Requirement | Detail |
|-------------|--------|
| Spectrogram display | Render background gram image with calibrated time/frequency axes |
| Measurement tool | Allow users to measure distances between features on the image |
| Configuration parameters | ~12 params per gram: image URL, time/freq axis limits, scale factors |
| 7Q integration | "Seven Questions" framework embedded alongside gram viewer on the same page |
| Responsive layout | Scale wide gram images appropriately for laptop screens |
| Legacy parity | Replicate functionality of original Java applets |

### Migration Path

Java applets → decompile → understand parameter model → rewrite in JavaScript. The GramFrame viewer is central to Pub-9/10 operator training content.

## Faceted / Advanced Search

### User Story

Analysts need to find platform information by various criteria — not just free text. They may know a frequency range, a country, or a unit name, and need to narrow results efficiently.

### Requirements (from Issues #10, #11, #13, #14, #18, #63, #114, #150)

| Requirement | Detail |
|-------------|--------|
| Frequency search | Sliders for tonal frequency range lookup |
| Cascading filters | Region > Country dropdowns that narrow as constraints are applied |
| Unit search | Search across platform unit names |
| Faceted narrowing | Available filter options reduce based on active constraints |
| SR/CSR integration | Harmonics calculator fields available within search UI |
| Page promotion | Searching "Spain" surfaces the Spain country page first |
| JSON data index | Frequency/platform data extracted from published HTML into JSON for search indexing |

### Libraries Considered

`itemsjs`, `minisearch`, `react-admin` — evaluated during search design discussions.

## Table Sorting

### User Story

Long signature data tables are difficult to scan. Analysts need to sort by platform name or by numerical frequency value.

### Requirements (from Issue #122; PR #123)

- Client-side sort capability on data tables
- Sort by name (alphabetical) or by frequency (numerical)
- JS-inserted sort buttons on table column headers
- Used the `sorttable` open-source library

## Abbreviation Tooltips

### User Story

Source data contains many acronyms that analysts may not immediately recognize. Hovering over an acronym should reveal its expansion.

### Requirements (from Issue #14)

- Abbreviations document provides canonical expansions
- Tooltips appear on hover for acronym instances in published output
- Supports the many source/equipment acronyms found in installation data

## Dark Theme

### User Story

Analysts working in darkened environments (e.g., operations rooms) need a low-light display option.

### Requirements (from Issue #12 — still open)

- Light/dark toggle for published output
- DITA-Bootstrap plugin already supports dark theme capability
- Not yet implemented

## Navigation & UX Enhancements

### Requirements (from Issues #34, #37, #42, #62, #69, #92, #95, #96, #100, #101, #103)

| Feature | Detail |
|---------|--------|
| World image-map | Clickable map for region navigation (replicating legacy) |
| Region listing pages | Country tables with flag images per region |
| In-page floating nav | Panel for jumping between class sections (summary, signatures, propulsion, remarks) |
| Related links sidebar | Floating right-hand panel with external link indicators |
| Search in header | Full-text search moved to header bar to save screen space |
| Welcome page | Prominent "Regions" tile as primary entry point |
| Gallery component | Image gallery at top of class pages |
| Current page suppression | Don't show link to current page in navigation |
