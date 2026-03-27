# Fi3ldMan - Legacy Migration Strategy

## Overview

Fi3ldMan replaces a legacy HTML-based field service manual (referred to as "LegacyMan"). The migration follows a deliberate two-phase strategy designed to unblock content authors quickly while deferring complex data structuring work. This document captures the migration approach, challenges, and pain points derived from the project's GitHub issues and pull requests.

## Migration Phases

### Phase 1: Coarse Conversion (Completed)

**Goal**: Convert legacy HTML into general DITA and publish as Oxygen WebHelp Responsive, providing full-text search and modern web navigation.

- Bulk-parse legacy HTML into standard DITA topics
- Preserve content fidelity without detailed schema enforcement
- Enable authors to begin editing in OxygenXML immediately
- Publish via DITA-OT with WebHelp Responsive transtype

The prior project "LegacyMan" handled the initial HTML-to-DITA parsing. Fi3ldMan picks up from that output.

*Key issue: #16; Key PR: #107*

### Phase 2: Detailed Specialization (Ongoing)

**Goal**: Parse content into a specialized DITA schema with structured, machine-readable frequency data.

- Create custom DTD specializations for domain elements (class, country, region, propulsion, related-links)
- Parse frequency/tonal data from free text into structured arrays
- Enable programmatic exploitation of signature data (search, harmonics calculation)
- Support selective publishing through profiling attributes

A "simple DITA" variant (without specialization) was later created to reduce the complexity barrier for authors.

*Key PRs: #22, #24, #25, #35, #36, #53, #54, #55, #60, #77, #83, #84, #86, #87*

## Schema Evolution

The DITA information architecture evolved significantly during migration:

| Change | Rationale |
|--------|-----------|
| "Installation" renamed to "Class" | Aligns with domain language used by analysts |
| Custom DTD specializations created | Enable structured data and conditional processing |
| Simple DITA variant introduced | Lower barrier for authors unfamiliar with specialization |
| Categories added as intermediate grouping | Handle nations with many platform classes |
| Related links at country and class levels | Replicate legacy cross-referencing |

**Content hierarchy**: World > Region > Country > [Category] > Class

Each class topic contains sections: summary (properties table), signatures (tonals table), propulsion, remarks, images.

## Legacy Technology Challenges

### Java Applet Conversion

The legacy manual used **Java applets** for interactive spectrogram ("gram") viewers. These applets:

- Display a background spectrogram image with time/frequency axes
- Allow users to measure distances between acoustic features
- Accept ~12 configuration parameters (image URL, axis limits, scale factors)

Migration approach: decompile Java > understand parameter model > rewrite in JavaScript. The applets served Pub-9/10 content for operator training.

*Key issues: #121, #151, #157, #159, #163*

### Data Parsing Fragility

Legacy frequency/harmonic data exists in many inconsistent text formats:

- Ratio expressions: `135.2 x CSR`, `H2-4, **5**, 7`, mixed notations
- Bold/dominant harmonic indicators embedded in text formatting
- Whitespace-dependent layouts from legacy HTML used for visual alignment
- No consistent schema for frequency table cell content

Robust parsing was required to extract structured data from these formats.

*Key issues: #130, #131, #133*

### Layout and Formatting

- Legacy HTML used extensive whitespace for visual layout — causes alignment issues in DITA
- Image sizes inconsistent across class pages
- Screen real estate competition: dense content (grams, tables, related links, search) on analyst workstations
- Left-hand TOC removed since content has its own navigation structure

*Key issues: #62, #110, #113*

## Architecture Decision: DITA-Heavy vs React-Heavy

An early architectural decision (Issue #8) chose **DITA-Heavy**: publish the entire document via DITA-OT and only use React/JavaScript for advanced interactive features (search, harmonics calculator). The alternative — a React-Admin heavy approach — was rejected in favor of keeping the publishing pipeline within the DITA ecosystem.

## Deployment History

| Platform | Purpose | Status |
|----------|---------|--------|
| Heroku | Static content serving trial | Abandoned |
| `serve` (npm) | Local development server | Active |
| GitHub Pages | Demo hosting | Active |
| Oxygen WebHelp | Production publishing | Active |

*Key issues: #30, #164; Key PR: #33*
