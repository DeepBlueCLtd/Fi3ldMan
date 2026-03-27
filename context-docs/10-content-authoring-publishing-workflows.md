# Fi3ldMan - Content Authoring & Publishing Workflows

## Overview

This document captures the authoring workflows, selective publishing processes, and content management practices derived from the project's GitHub issues and pull requests. For technical template/build details, see `04-publishing-templates-build-system.md`.

## Selective Publishing Workflow

### Purpose

Partner organizations hold maintenance contracts for specific nations or platforms. Each partner receives a filtered export of the manual containing only the content relevant to their contract, with appropriate security markings.

### Known Partners (from Issues)

Partners referenced in issues include "Teledyne", "Axiomatic", and "Banchio" — each with contracts scoped to specific countries or platform classes.

### Filtering Model

The system uses an **exclusion-based model**: content is marked for exclusion rather than inclusion.

| Aspect | Detail |
|--------|--------|
| Mechanism | DITA `audience` attribute + DITAVAL conditional processing |
| Granularity | Country-level and class-level within a country |
| Custom per export | Protective marking text, banner color, document title |
| Constraint | Must exclude data where a competitor could bid independently |

### Process

1. Author applies `audience` profiling attributes to content at country and class levels
2. A DITAVAL filter file specifies which audience values to exclude for a given partner
3. Oxygen DITA-OT build applies the filter, producing a subset publication
4. Custom protective marking and title are set via build parameters

*Key issues: #6, #43, #105, #106*

## DITA Authoring in OxygenXML

### Author Mode Customizations

Several OxygenXML Author mode enhancements support content maintainers:

| Feature | Detail | Issue |
|---------|--------|-------|
| Line-break insertion | `<?linebreak?>` processing instruction for controlled breaks | #109 |
| Whitespace visibility | Toggle to see whitespace in Author mode (legacy content used whitespace for layout) | #110 |
| Surround with PH | Inline text shading/coloring via `<ph>` element wrapping | #111 |
| xref wrapper removal | Guidance for removing unnecessary xref elements around images | #112 |
| Author-mode CSS | Custom styling for interactive elements (e.g., enterBtn) in Author view | #155, #156 |
| DTD management | Managed via OxygenXML project file to avoid relative DTD path references | — |

### Authoring Guidance

A training document need was identified (Issue #4) to provide:

- Background context on the project and its business purpose
- Description of the business process and publishing pipeline
- Typical author tasks: adding new pages, updating existing content, managing images
- DITA conventions specific to Fi3ldMan

## What's New / Change Tracking

### Purpose

Each release of the manual must clearly communicate what content has changed since the previous version.

### Mechanism

| Component | Detail |
|-----------|--------|
| Visual markers | Yellow marker images placed next to new or updated content |
| Version provenance | Each marker records which release version introduced the change |
| What's New page | Collation page listing all changed entries with links |
| Bulk removal | Previous release markers must be stripped at each new version |
| Reference tracking | Changes traced back to source reference spreadsheet IDs |

*Key issues: #7, #124*

## Protective Markings & Security Banners

### Purpose

Every page of every publication must display appropriate security classification, configurable per publication variant and export.

### Implementation

| Element | Detail |
|---------|--------|
| Header banner | Security warning text displayed at top of every page |
| Footer banner | Matching security warning at bottom of every page |
| Banner color | Configurable per publication/export (e.g., red for classified, blue for commercially sensitive) |
| Banner text | Configurable (e.g., "COMMERCIALLY SENSITIVE", "RESTRICTED") |
| Corporate logo | Displayed in header, links to index page |
| Version info | Branch name and build date shown on welcome page |

*Key issues: #88, #89, #90, #91*

## Content Organization

### Multimedia Management

Content assets are organized into dedicated directories:

| Type | Location | Usage |
|------|----------|-------|
| Images | `content/images` | Platform photographs, diagrams, spectrograms |
| Audio | `content/audio` | Acoustic signature WAV recordings |
| Video | `content/video` | Propulsion system video recordings |

Embedded audio and video players in published output allow inline playback within class topic pages.

*Key issue: #17*

### Content Hierarchy

The publication content follows a strict geographic/taxonomic hierarchy:

```
World
└── Region (e.g., "North Atlantic")
    └── Country (e.g., "United Kingdom")
        └── [Category] (optional grouping for nations with many classes)
            └── Class (e.g., a specific ship/submarine type)
                ├── Summary (properties table)
                ├── Signatures (tonals/frequency table)
                ├── Propulsion
                ├── Remarks
                └── Images
```

Related links exist at both country and class levels, rendered as floating sidebar navigation in published output.

## Publishing Pipeline Summary

| Step | Tool | Output |
|------|------|--------|
| Authoring | OxygenXML Editor (Author mode) | DITA XML source |
| Filtering | DITAVAL + profiling attributes | Filtered DITA for target audience |
| Transformation | DITA-OT via Oxygen build scenario | WebHelp Responsive HTML |
| Template | Custom .opt publishing template | Branded output with security banners |
| Hosting | GitHub Pages / local `serve` | Accessible web publication |
