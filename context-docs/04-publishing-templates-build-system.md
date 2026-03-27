# Fi3ldMan - Publishing Templates & Build System

## Template Architecture

Fi3ldMan uses the Oxygen WebHelp Responsive publishing engine with custom templates. The template system has a layered architecture:

```
Root template (template/)
├── Shared XSLT transformations
├── Shared CSS and JavaScript resources
├── Shared HTML page templates and fragments
│
├── Pub-5 template (dita-parent/pub-5/template/)
│   └── f13ldMan.opt (references root resources)
│
└── Pub-10 template (dita-parent/pub-10/template/)
    ├── f13ldMan-p10.opt (references own resources)
    ├── page-templates/ (Pub-10 specific layouts)
    ├── page-templates-fragments/ (Pub-10 specific fragments)
    └── resources/gramframe.bundle.js (Pub-10 only)
```

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
| `template/f13ldMan.opt` | Root/default template |
| `dita-parent/pub-5/template/f13ldMan.opt` | Pub-5 (identical to root) |
| `dita-parent/pub-10/template/f13ldMan-p10.opt` | Pub-10 variant |

### Legacy Templates
| File | Format |
|------|--------|
| `dita-legacy/template/oxygen/oxygen-tiles.opt` | WebHelp tiles layout |
| `dita-legacy/template/oxygen/oxygen-tree.opt` | WebHelp tree navigation |
| `dita-legacy/template/oxygen/oxygen-with-colors.opt` | PDF with color support |

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
out/{publication}/
├── {topic-directories}/     # HTML topic files organized by source structure
├── Content/                 # Images and media
├── oxygen-webhelp/          # WebHelp framework resources
├── index.html               # Main landing page
├── search.html              # Search page
├── indexTerms.html          # Index terms page
├── context-help-map.xml     # Context-sensitive help mapping
└── sitemap.xml              # SEO sitemap
```

### Serving Locally
```bash
npm start    # Runs: serve dita/out
```

## Template Inheritance Summary

All publications inherit from the same base template infrastructure. Differences are:
- **Pub-5**: Uses root template as-is
- **Pub-10**: Adds `gramframe.bundle.js` for gram visualization; has its own page-templates with identical structure
- **Pub-9**: Will use similar template when promoted from mockup to DITA source
