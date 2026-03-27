# Fi3ldMan - Business Use Cases & Stakeholders

## Overview

Fi3ldMan is a digital replacement for a classified/commercially sensitive field service manual used by acoustic analysts in the naval/maritime domain. The system catalogs naval platforms (ships/submarines) and their acoustic signatures, organized hierarchically by Region > Country > Category > Class. This document captures the business use cases and stakeholder needs derived from the project's GitHub issues and pull requests.

## Domain Context

The manual serves personnel who identify naval platforms by detecting and analyzing their acoustic emissions. Each platform class entry contains:

- **Summary properties** (displacement, speed, dimensions)
- **Acoustic signatures** (tonals/frequencies in structured tables)
- **Propulsion system** details
- **Images** (photographs, diagrams, spectrograms/"grams")
- **Multimedia** (audio WAV files of acoustic signatures, video recordings)

Three publication variants serve different audiences and purposes:

| Publication | Purpose | Audience |
|-------------|---------|----------|
| **Pub-5** | Main reference manual — full platform data by region/country | Acoustic analysts/operators |
| **Pub-9** | Redacted companion to Pub-10 — hides sensitive metadata | Partner organizations |
| **Pub-10** | Operator training — interactive spectrogram ("gram") viewers and the "7 Questions" analysis framework | Training operators |

## Primary Business Use Cases

### 1. Platform Identification by Acoustic Signature

The core use case. An operator detects an unknown frequency and must identify its source platform. This drives requirements for:

- **Harmonics calculation** from shaft rate (SR) and corrected shaft rate (CSR)
- **Frequency matching** with configurable precision (precise/standard/loose)
- **Interactive spectrogram viewing** for pattern recognition training
- **Sortable data tables** for rapid lookup across signature data

*Key issues: #125, #126, #129–136, #139, #142*

### 2. Selective Publishing for Partner Organizations

The most operationally critical requirement. Partner organizations (defense contractors such as "Teledyne", "Axiomatic", "Banchio") hold maintenance contracts for specific nations or platforms and must receive filtered document exports that:

- Include only countries/classes relevant to their contract
- Exclude data where a competitor could bid independently
- Carry custom protective markings and titles per export
- Use an exclusion-based model (mark content to exclude rather than include)

Filtering granularity operates at both country-level and class-level within a country. This drove adoption of DITA `audience` attributes and DITAVAL conditional processing.

*Key issues: #6, #43, #105, #106*

### 3. Advanced Search & Discovery

Basic full-text search (provided by Oxygen WebHelp) is insufficient for analyst workflows. Requirements include:

- **Frequency-range search** with sliders for tonal lookup
- **Faceted filtering** with cascading Region > Country dropdowns
- **Unit search** across all platform entries
- **Search integration** with harmonics calculator (SR/CSR fields in search UI)
- **Page promotion** (e.g., searching "Spain" should surface the Spain country page first)

*Key issues: #10, #11, #13, #14, #18, #63, #114, #150*

### 4. Change Tracking & Version Management

Each release requires clear identification of what has changed:

- Yellow marker images flag new or updated content
- Markers record version provenance (which release introduced the change)
- Bulk removal of previous release markers at each new version
- "What's New" page collating all changes per release
- Provenance tracking back to source reference spreadsheet IDs

*Key issues: #7, #124*

### 5. Information Security & Classification

Every page must display appropriate security classification:

- Configurable warning banners in header and footer
- Customizable banner text and color per publication variant
- Different protective markings for different export audiences
- Corporate logo with link to index page

*Key issues: #88, #89, #90*

### 6. Multimedia Playback

The manual includes embedded multimedia for signature recognition:

- Audio player for acoustic signature WAV files (in signature remarks sections)
- Video player for propulsion system recordings
- Organized content directories: `content/images`, `content/audio`, `content/video`

*Key issue: #17*

## Stakeholders

| Stakeholder | Role | Primary Needs |
|-------------|------|---------------|
| **Acoustic analysts/operators** | Primary end users | Frequency identification, gram viewing, advanced search, sortable tables |
| **DITA authors** | Content maintainers | Intuitive OxygenXML editing, clear authoring procedures, version tracking |
| **Security officers** | Information assurance | Configurable protective markings, controlled filtered exports |
| **Partner organizations** | External recipients | Redacted Pub-9 exports scoped to their contract |
| **Training operators** | Skill development | Pub-9/10 for acoustic feature recognition and the "7 Questions" framework |
| **Project managers** | Oversight | What's New tracking, release provenance, change audit trail |

## Key Domain Terminology

| Term | Definition |
|------|-----------|
| **Class** | A type of naval platform (ship/submarine) — the primary unit of content |
| **Installation** | Older/legacy term for "class" (renamed during the project) |
| **Tonals** | Discrete acoustic frequencies emitted by a platform |
| **SR** | Shaft Rate — base rotational frequency of a platform's propulsion |
| **CSR** | Corrected Shaft Rate — adjusted shaft rate value |
| **TPK** | Tones Per Knot — relates acoustic frequency to platform speed |
| **Harmonics** | Integer multiples of a base frequency |
| **Gram / GramFrame** | Spectrogram/waterfall display of acoustic data over time |
| **7Q / Seven Questions** | Structured analysis framework for acoustic platform identification |
| **Protective Marking** | Security classification label applied to document exports |
| **What's New markers** | Visual indicators (yellow images) flagging changed content per release |
