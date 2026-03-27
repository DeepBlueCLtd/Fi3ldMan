# Fi3ldMan - Repository Architecture & Structure

## Overview

Fi3ldMan is a Field Service Manual system with advanced data exploitation capabilities. It produces web-based technical publications using DITA XML as the source format and Oxygen WebHelp Responsive as the publishing engine. The project is supported by Oxygen XML.

The repository hosts three publications:
- **Pub-5**: The original and largest publication - regional field service documentation
- **Pub-9**: A companion publication to Pub-10 (currently at mockup stage)
- **Pub-10**: A specialized publication focused on spectral analysis ("Grams")

## Repository Root Structure

```
Fi3ldMan/
├── context-docs/          # Claude Project enrichment documents (this folder)
├── dita-parent/           # Active DITA source for Pub-5 and Pub-10
│   ├── pub-5/             # Publication 5 source, template, and config
│   └── pub-10/            # Publication 10 source, template, and config
├── dita-legacy/           # Archived legacy DITA specialization and content
│   ├── dtd/               # Custom DITA specialization DTDs
│   ├── regions/           # Specialized DITA content (uses custom DTD)
│   ├── regions_simple/    # Plain DITA content (no specialization)
│   └── template/oxygen/   # Legacy Oxygen publishing templates
├── mockup/                # HTML mockups and prototypes
│   ├── britain-legacy/    # Dynamic table mockups
│   ├── p9_10_mock/        # Pub-9 and Pub-10 HTML mockups
│   └── oxygen-webhelp/    # Oxygen template mockups
├── out/                   # Published output
│   ├── oxygen/            # Pub-5 published HTML output
│   └── pub-10/            # Pub-10 published HTML output
├── template/              # Shared publishing template (root/default)
│   ├── page-templates/    # HTML page layouts (topic, index, search, terms)
│   ├── page-templates-fragments/ # Reusable HTML fragments (header, footer)
│   ├── resources/         # CSS and JavaScript assets
│   └── xslt/              # Custom XSLT transformations
├── index.html             # Navigation hub linking to published outputs
├── package.json           # Node.js config (serve static files)
├── project.ditaval        # DITA conditional filtering (audience/country)
├── tsconfig.json          # TypeScript configuration
├── author_layout.layout   # Oxygen XML author layout
└── README.md              # Brief project description
```

## Key Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Content authoring | DITA XML (v1.2) | Structured technical documentation source format |
| Authoring tool | Oxygen XML Editor | DITA editing, profiling, and transformation |
| Publishing engine | Oxygen WebHelp Responsive (v25.1) | DITA-to-HTML5 transformation |
| Templating | XSLT + HTML page templates | Custom layout and branding |
| Styling | CSS (f13ldman.css, notes.css, oxygen.css) | Visual presentation |
| Interactivity | Vanilla JavaScript | Harmonic calculator, gram viewer, sortable tables |
| Static hosting | Node.js 18.x + serve v14.0.1 | Serves published output |
| Version control | Git | Source management |

## Publication-Specific Directory Layout

### Pub-5 (`dita-parent/pub-5/`)
```
pub-5/
├── dita/                        # DITA source content
│   ├── index.ditamap            # Master map: "Field Manual v5 Mar 2025"
│   ├── countryFilters.ditamap   # Subject scheme for country filtering
│   ├── DITA_project_pub5.xpr    # Oxygen project file
│   ├── Britain.Legacy/          # Britain legacy equipment
│   ├── Britain1/                # Britain modern equipment
│   ├── Britain_Cmplx/           # Britain complex configurations
│   ├── Fr_Legacy/               # France legacy equipment
│   ├── France1/                 # France modern equipment
│   ├── Spain/                   # Spain standard
│   ├── Spain.Legacy/            # Spain legacy
│   ├── Spain_Cmplx/            # Spain complex
│   ├── Wales/                   # Wales standard
│   ├── Wales.Legacy/            # Wales legacy
│   ├── Wales_Cmplx/            # Wales complex
│   ├── Wales_Composite/         # Wales composite/hybrid
│   ├── WightandMan/             # Wight and Man region
│   ├── Transducers/             # Transducer component documentation
│   ├── Brush_Noise/             # Brush noise predictive maintenance
│   ├── PlatformData/            # Regional platform maps and data
│   ├── QuickLinksData/          # Abbreviations, contents, reference data
│   ├── Introduction/            # Cover page, admin, what's new
│   └── Content/                 # Shared images and resources
└── template/
    └── f13ldMan.opt             # Pub-5 publishing template config
```

### Pub-10 (`dita-parent/pub-10/`)
```
pub-10/
├── dita/                        # DITA source content
│   ├── index.ditamap            # Master map: "Field Manual Pub-10 Mar 2025"
│   ├── DITA_project_pub10.xpr   # Oxygen project file
│   ├── gram-index.dita          # Gram navigation landing page
│   ├── Welcome.dita             # Cover/entry page
│   ├── Grams/                   # Gram analysis content
│   │   ├── gram1.dita           # Gram 1 data
│   │   ├── gram2.dita           # Gram 2 data
│   │   ├── gram1-2.dita         # Gram 1 variant 2
│   │   ├── gram2-2.dita         # Gram 2 variant 2
│   │   ├── gram1 analysis.dita  # Gram 1 analysis questions
│   │   └── gram2 analysis.dita  # Gram 2 analysis questions
│   ├── Introduction/
│   │   └── Security.dita        # Security classification page
│   └── Content/                 # Shared images
└── template/
    ├── f13ldMan-p10.opt         # Pub-10 publishing template config
    ├── page-templates/          # Pub-10 specific page layouts
    ├── page-templates-fragments/
    └── resources/
        └── gramframe.bundle.js  # Gram visualization JavaScript
```

### Pub-9 (mockup stage only)
```
mockup/p9_10_mock/
├── index.html           # Navigation hub for P9 and P10 mockups
├── p9/                  # Pub-9 mockup HTML
│   ├── Grams/
│   ├── Introduction/
│   ├── gram-index.html
│   └── index.html
├── p10/                 # Pub-10 mockup HTML
│   ├── Grams/
│   ├── Introduction/
│   ├── gram-index.html
│   └── index.html
└── to_convert.html      # Sample HTML for DITA conversion testing
```

## Build and Deployment

The publishing workflow is:
1. Author DITA XML content in Oxygen XML Editor
2. Run Oxygen WebHelp Responsive transformation using `.opt` template
3. XSLT transformations apply custom header/footer, protection banner, and search
4. Output generated to `out/` directories as static HTML5
5. Serve via `npm start` (runs `serve dita/out` on Node.js 18.x)

The project can also be deployed as a static site (e.g., GitHub Pages).