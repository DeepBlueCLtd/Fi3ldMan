# Fi3ldMan - Publishing Templates & Build System

> **Note on scope.** This document describes the 2024 template generation, built
> on the Oxygen 25.1 base. For Pub-5 that template has been superseded by
> `publications/pub-5/template-2026/`, which is built on the Oxygen 28.1 (2026)
> base and is the one to use — see `11-publishing-template-2026.md`, and
> `12-template-transfer-air-gapped-network.md` for deploying it to the target
> network. The material below remains current for the Pub-10 and legacy
> templates, and for the shared concepts (`.opt` descriptors, XSLT extension
> points, note styling).

## Template Architecture

Fi3ldMan uses the Oxygen WebHelp Responsive publishing engine with custom templates. The template system has a layered architecture:

```
Pub-5 template (publications/pub-5/template-2024/)
├── XSLT transformations
├── CSS and JavaScript resources
├── HTML page templates and fragments
└── f13ldMan.opt

Pub-10: no template of its own — it publishes from pub-5/template-2026/
```

This used to be described as a layered architecture, with a "root" template at
the repository root and a Pub-5 template beside the Pub-5 source. In practice
the two were independent near-duplicates that had drifted apart, and Pub-5
published from the root one. The reorganisation deleted the duplicate and moved
the survivor to `publications/pub-5/template-2024/`; each publication now has
exactly one template per generation, and shares nothing with the others.

## Template Configuration Files (.opt)

The `.opt` files are Oxygen publishing template descriptors. They define the publishing template name, output format, parameters, and resource references.

### Key Parameters (common to all templates)

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `webhelp.show.main.page.tiles` | `yes` | Tile-based landing page layout |
| `webhelp.show.main.page.toc` | `no` | Hide TOC on main page |
| `webhelp.top.menu.depth` | `3` | Three levels of navigation depth |
| `webhelp.show.print.link` | `no` | Disable print button |
| `webhelp.show.publication.toc` | `no` | Disable publication-level TOC |
| `webhelp.show.indexterms.link` | `yes` | Show index terms link |
| `figure.title.placement` | `top` | Figure titles above figures |
| `args.figurelink.style` | `TITLE` | Link to figures by title |
| `args.tablelink.style` | `TITLE` | Link to tables by title |
| `webhelp.show.protection` | `yes` | Show protection/classification banner |
| `webhelp.protection.text` | `COMMERCIALLY SENSITIVE` | Banner text |
| `webhelp.protection.background.color` | `#bfebb9` | Light green banner background |

### Template Files

| File | Template |
|------|----------|
| `publications/pub-5/template-2024/f13ldMan.opt` | Pub-5, 2024 generation |
| `publications/pub-5/template-2026/f13ldMan.opt` | Pub-5, Pub-9 and Pub-10 — the shared template. See docs 11 and 15 |

### Legacy Templates
| File | Format |
|------|--------|
| `publications/legacy-regions/template/oxygen/oxygen-tiles.opt` | WebHelp tiles layout |
| `publications/legacy-regions/template/oxygen/oxygen-tree.opt` | WebHelp tree navigation |
| `publications/legacy-regions/template/oxygen/oxygen-with-colors.opt` | PDF with color support |

## XSLT Transformations

Custom XSLT files extend the standard Oxygen WebHelp output.

### Location: `template/xslt/`

**Main Transform Files:**
- `customMainPage.xsl` - Main/landing page generation
- `customTopicPage.xsl` - Individual topic page generation
- `customSearchPage.xsl` - Search results page generation

**Include Files (`xslt/inc/`):**
- `customHeader.xsl` - Protection banner in page header
- `customFooter.xsl` - Protection banner in page footer
- `customSearch.xsl` - Custom search integration

### Protection Banner XSLT

The header and footer XSLT templates conditionally render the "COMMERCIALLY SENSITIVE" banner:

```xslt
<!-- Matches elements with class 'wh_header_protection' -->
<xsl:template match="*:header[contains(@class, 'wh_header_protection')]">
  <!-- Checks webhelp.show.protection parameter -->
  <!-- Applies webhelp.protection.background.color as background -->
  <!-- Displays webhelp.protection.text content -->
</xsl:template>
```

## HTML Page Templates

### Page Types
Located in `template/page-templates/` (and Pub-10's `template/page-templates/`):

| File | Purpose |
|------|---------|
| `wt_index.html` | Main landing page with tiles |
| `wt_topic.html` | Individual content topic pages |
| `wt_search.html` | Search results page |
| `wt_terms.html` | Index terms page |

### Page Structure (common pattern)
```html
<html>
<head>
  <!-- Oxygen WebHelp libraries -->
  <!-- Custom CSS (oxygen.css, f13ldman.css, notes.css) -->
  <!-- Custom JavaScript resources -->
</head>
<body>
  <!-- Skip-to-content accessibility link -->
  <!-- Protection header banner -->
  <!-- Navigation bar: logo, title, search, top menu (3 levels) -->
  <!-- Main content area (tiles or topic body) -->
  <!-- Protection footer banner -->
</body>
</html>
```

### Reusable Fragments (`page-templates-fragments/`)
- `header.xml` - Navigation header with protection banner, logo, search, menu
- `footer.xml` - Footer with protection banner

The header fragment contains:
- Protection banner element (`wh_header_protection` class)
- Logo and publication title container
- Mobile hamburger toggle button
- Search input field
- Top menu component (3-level depth via `<whc:webhelp_top_menu/>`)
- Index terms link
- Conditional customization fragments

## CSS Styling

### `f13ldman.css` - Custom Branding

Key style rules:
- **Container**: Full width (max-width: 100%)
- **Sections**: Top border (8px solid #448), large bottom padding (200px)
- **Tiles**: Flexbox layout, 2 columns on desktop, stacked on mobile (breakpoint ~985px)
- **PlatformData tile**: Full width (100%) via `[data-id]` selector
- **Short descriptions**: Hidden (`display: none`) in published output
- **Figures**: Centered at 90% width
- **Title formatting**: Flexbox for country flag display
- **Related links**: Custom icons for Excel files and external links
- **Flag sections**: No border or padding (special handling)

### `notes.css` - Note Box Styling

**Stock Oxygen, not a Fi3ldMan file**, despite sitting alongside ones that are.
Oxygen generates it from the note-styling options chosen when a publishing
template is created. The copy in `template-2024/` is byte-identical to the
one in every stock template shipped with Oxygen 26. Replace it from stock on
upgrade; do not edit it, and put any note overrides in `f13ldman.css`.

DITA note types with color-coded boxes:
| Note Type | Border Color | Background |
|-----------|-------------|------------|
| Default note | #0078A0 (blue) | Light blue |
| Danger / Caution | #606060 (gray) | Beige |
| Warning / Important / Attention | #FFCA2D (yellow) | Yellow |
| Restriction | #FF342D (red) | Red |

All notes have rounded borders (11px radius).

### `oxygen.css` - Oxygen WebHelp Base Styles
Standard Oxygen framework styles (not customized).

## Build Process

### Prerequisites
- Oxygen XML Editor (with WebHelp Responsive plugin)
- Node.js 18.x (for serving output)

### Building a Publication

1. Open the Oxygen project file (`.xpr`) for the target publication
2. Select the WebHelp Responsive build scenario
3. The scenario references:
   - The master `.ditamap` file
   - The `.opt` template file
   - The `project.ditaval` filter file
4. Run the transformation
5. Output is generated to the configured output directory

### Output Structure
```
publications/{publication}/dita/out/{scenario}/
├── {topic-directories}/     # HTML topic files organized by source structure
├── Content/                 # Images and media
├── oxygen-webhelp/          # WebHelp framework resources
├── index.html               # Main landing page
├── search.html              # Search page
├── indexTerms.html          # Index terms page
├── context-help-map.xml     # Context-sensitive help mapping
└── sitemap.xml              # SEO sitemap
```

### Publishing It

Oxygen's output directory is scratch (and gitignored). A publish becomes part
of the site only once it has been verified and copied in:

```bash
python publications/pub-5/check-publish.py <output-dir>   # pages, refs, scripts
npm test                                                  # styling suite
cp -a <output-dir>/. site/pub-5/current/                  # then commit
npm start                                                 # serves site/ locally
```

## Template Summary

Each publication owns its template outright; they share concepts, not files.
- **Pub-5**: `template-2026/` (current) and `template-2024/` (what the
  `site/pub-5/oxygen-26/` publish was built with)
- **Pub-10**: adds `gramframe.bundle.js` for gram visualization; has its own
  page-templates with structure matching Pub-5's
- **Pub-9**: will get a template of its own when promoted from mockup to DITA
  source
