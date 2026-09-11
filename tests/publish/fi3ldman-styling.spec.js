// @ts-check
const { test, expect } = require('@playwright/test')
const { PAGES, visit, computed } = require('./helpers')

/*
 * The Fi3ldMan overrides, checked as computed style on the published page.
 *
 * These are the rules that vanished under 28.1 while the HTML stayed valid.
 * Each assertion names a value declared in f13ldman.css, so a failure points
 * at one of three things: the stylesheet did not load, it loaded but lost the
 * cascade, or the rule was edited without updating the test.
 *
 * Every colour here is written as the rgb()/rgba() form Chrome computes, not
 * the hex in the source. Chrome normalises, and comparing to '#bfebb9' would
 * fail against correct output.
 */

const PROTECTION_GREEN = 'rgb(191, 235, 185)'

test.describe('protection banners', () => {
  test('the header bar keeps its green', async ({ page }) => {
    await visit(page, PAGES.topic)
    expect(
      await computed(page, '.wh_header_protection', 'background-color'),
      'the header protection bar has lost its colour',
    ).toBe(PROTECTION_GREEN)
  })

  test('the footer bar keeps its green and its centring', async ({ page }) => {
    await visit(page, PAGES.topic)
    expect(
      await computed(page, '.wh_footer_protection', 'background-color'),
    ).toBe(PROTECTION_GREEN)
    expect(await computed(page, '.wh_footer_protection', 'text-align')).toBe(
      'center',
    )
    // The rule is `padding: 1em`, so the resolved pixel value tracks the bar's
    // own font-size (14px here, not the 16px document default). Comparing the
    // two keeps this honest if the font-size is ever retuned.
    const [padding, fontSize] = await Promise.all([
      computed(page, '.wh_footer_protection', 'padding-top'),
      computed(page, '.wh_footer_protection', 'font-size'),
    ])
    expect(padding, 'the footer bar has lost its 1em padding').toBe(fontSize)
  })

  test('banner text is set in Arial at 14px', async ({ page }) => {
    await visit(page, PAGES.topic)
    expect(
      await computed(page, '.wh_footer_protection span', 'font-family'),
    ).toBe('Arial')
    expect(
      await computed(page, '.wh_footer_protection span', 'font-size'),
    ).toBe('14px')
  })

  test('both bars are present and carry the marking', async ({ page }) => {
    await visit(page, PAGES.topic)
    // The bars are the protective marking. An empty one is worse than a
    // missing one, because it looks deliberate.
    for (const sel of ['.wh_header_protection', '.wh_footer_protection']) {
      await expect(page.locator(sel)).toHaveCount(1)
      const text = (await page.locator(sel).innerText()).trim()
      expect(text, `${sel} is empty`).not.toBe('')
    }
  })
})

test.describe('layout overrides', () => {
  test('the content container is uncapped', async ({ page }) => {
    await visit(page, PAGES.topic)
    // Defensive against Oxygen capping .container-fluid in some future era.
    // Asserting it also proves f13ldman.css is applied at all.
    expect(
      await computed(page, '#wh_topic_container', 'max-width'),
      'the content container has picked up a width cap',
    ).toBe('100%')
  })

  test('the nav bar is not width-capped', async ({ page }) => {
    await visit(page, PAGES.topic)
    // f13ldman.css says `.c-full-width { max-width: unset }`, which would
    // compute to `none` on its own. It does not: the element is also a
    // .container-fluid, and our own `max-width: 100% !important` outranks the
    // unset. Same outcome, different value — so assert the outcome (no fixed
    // cap) rather than the literal, and don't "fix" the rule to match.
    const maxWidth = await computed(page, '.c-full-width', 'max-width')
    expect(
      ['none', '100%'],
      `nav bar has a fixed width cap of ${maxWidth}`,
    ).toContain(maxWidth)
  })

  test('the menu is right-aligned and horizontal', async ({ page }) => {
    await visit(page, PAGES.topic)
    // Targets `.wh_top_menu`, not the `.c-menu` hook the rules used to use.
    // The 2024 template added `c-menu` via an XSLT fork; template-2026 dropped
    // the fork and retargeted at Oxygen's own class. Both templates emit
    // `wh_top_menu` on the same element, so this selector works against output
    // from either — and it is where the rules themselves now point.
    expect(await computed(page, '.wh_top_menu > ul', 'display')).toBe('flex')
    expect(await computed(page, '.wh_top_menu > ul', 'justify-content')).toBe(
      'flex-end',
    )
  })

  test('the REGIONS tile is full width, the others are not', async ({
    page,
  }) => {
    await visit(page, PAGES.main)

    // [data-id="PD_1"] { width: 100% !important } keys off the DITA filename
    // prefix. It is the one deliberately content-coupled rule in the template,
    // so it breaks silently if that source file is ever renamed.
    const wide = page.locator('.wh_tile[data-id="PD_1"]')
    await expect(
      wide,
      'no tile with data-id="PD_1" — the PD_1 source file may have been ' +
        'renamed, which breaks the full-width REGIONS tile silently',
    ).toHaveCount(1)

    // Measured against its own container rather than against its siblings.
    // Comparing tiles would make this depend on how Oxygen chooses to size the
    // others, which is not ours; width: 100% means "as wide as the container",
    // and that is what the rule promises.
    const { occupied, containerWidth } = await wide.evaluate((el) => {
      const parent = /** @type {HTMLElement} */ (el.parentElement)
      const parentStyle = getComputedStyle(parent)
      const own = getComputedStyle(el)
      return {
        // The tile is a flex item, so its own margins come out of the space it
        // can occupy. Width plus margins is the honest measure of "as wide as
        // the container allows"; the margins themselves are Oxygen's to set.
        occupied:
          el.getBoundingClientRect().width +
          parseFloat(own.marginLeft) +
          parseFloat(own.marginRight),
        // width:100% resolves against the container's content box, so the
        // container's own padding comes off first.
        containerWidth:
          parent.clientWidth -
          parseFloat(parentStyle.paddingLeft) -
          parseFloat(parentStyle.paddingRight),
      }
    })

    expect(
      occupied,
      'the REGIONS tile is not filling its container — the width override is ' +
        'not applying',
    ).toBeCloseTo(containerWidth, 0)
  })

  test('tiles carry the Fi3ldMan background', async ({ page }) => {
    await visit(page, PAGES.main)
    expect(await computed(page, '.wh_tile', 'background-color')).toBe(
      // Chrome rounds the declared 0.419 alpha to 0.42 on the way out.
      'rgba(171, 199, 192, 0.42)',
    )
  })

  test('figures are centred at 90% width', async ({ page }) => {
    await visit(page, PAGES.figures)
    const figure = page.locator('figure').first()
    await expect(figure).toBeAttached()

    const { width, parentWidth, marginLeft } = await figure.evaluate((el) => ({
      width: el.getBoundingClientRect().width,
      parentWidth: /** @type {HTMLElement} */ (
        el.parentElement
      ).getBoundingClientRect().width,
      marginLeft: getComputedStyle(el).marginLeft,
    }))

    expect(width / parentWidth).toBeCloseTo(0.9, 1)
    expect(marginLeft, 'figure is not centred').not.toBe('0px')
  })

  test('short descriptions are hidden on topic pages', async ({ page }) => {
    // Deliberately not PAGES.topic: that page has no shortdesc, so the check
    // would pass by finding nothing.
    await visit(page, PAGES.shortdesc)
    expect(await computed(page, '.shortdesc', 'display')).toBe('none')
  })

  test('the header is hidden on the Welcome page', async ({ page }) => {
    await visit(page, PAGES.welcome)
    // body#Welcome header.wh_header { display: none } — the one rule keyed to
    // a specific page id.
    expect(
      await computed(page, 'header.wh_header', 'display'),
      'the Welcome page is showing the standard header',
    ).toBe('none')

    // ...and only there, or the rule has been over-generalised.
    await visit(page, PAGES.topic)
    expect(await computed(page, 'header.wh_header', 'display')).not.toBe('none')
  })
})

test.describe('related links', () => {
  test('related links are padded', async ({ page }) => {
    await visit(page, PAGES.relatedLinks)
    expect(await computed(page, '.related-links', 'padding-top')).toBe('2px')
  })

  /*
   * Four rules decide a related link's icon, and they are order- and
   * !important-sensitive. Checking only the first link in the list would test
   * whichever rule happens to win there — which is how the first draft of this
   * test ended up asserting the spreadsheet icon.
   *
   * The fourth is `.related_link .current`, which clears the icon along with
   * the rest of the link's styling. It used to look like three: `.current` is
   * added at run time by current-handler.js from a `href === document.URL`
   * comparison, and the dev server's `cleanUrls` redirect meant that
   * comparison never matched under test. With that turned off in
   * `tests/publish/serve.json` the self link is marked, as it is on the
   * deployed site, and it is no longer an ordinary link.
   */
  test('each related-link kind gets its own icon', async ({ page }) => {
    const assets = await visit(page, PAGES.relatedLinks)

    const icons = await page.$$eval('.related-links a', (links) =>
      links.map((a) => ({
        href: a.getAttribute('href') || '',
        image: getComputedStyle(a).backgroundImage,
        current: a.classList.contains('current'),
      })),
    )
    expect(icons.length, 'no related links on this page').toBeGreaterThan(0)

    const spreadsheet = icons.filter((i) => /\.xlsx?$/.test(i.href))
    const internal = icons.filter((i) => i.href.startsWith('#'))
    const current = icons.filter((i) => i.current)
    const ordinary = icons.filter(
      (i) => !/\.xlsx?$/.test(i.href) && !i.href.startsWith('#') && !i.current,
    )

    expect(spreadsheet.length, 'no spreadsheet link to check').toBeGreaterThan(0)
    expect(internal.length, 'no same-page link to check').toBeGreaterThan(0)
    expect(ordinary.length, 'no ordinary link to check').toBeGreaterThan(0)
    expect(
      current.length,
      'no link to the current page was marked — current-handler.js did not ' +
        'run, or the server is rewriting the URL it compares against',
    ).toBeGreaterThan(0)

    for (const link of spreadsheet) {
      expect(link.image, `${link.href} should show the Excel icon`).toContain(
        'icon_excel.gif',
      )
    }
    for (const link of ordinary) {
      expect(
        link.image,
        `${link.href} should show the external-link icon`,
      ).toContain('external_link.svg')
    }
    for (const link of internal) {
      // Same-page links are explicitly stripped of the icon.
      expect(link.image, `${link.href} should have no icon`).toBe('none')
    }
    for (const link of current) {
      // The link to the page you are already on is greyed out and stripped of
      // its background, icon included.
      expect(
        link.image,
        `${link.href} is the current page and should have no icon`,
      ).toBe('none')
    }

    // A background-image that 404s computes exactly the same as one that
    // loads, so the network is the only place a missing icon shows up.
    for (const file of ['external_link.svg', 'icon_excel.gif']) {
      const hits = assets.matching(file)
      expect(hits.length, `${file} was never requested`).toBeGreaterThan(0)
      expect(hits[0].status, `${file} 404d`).toBe(200)
    }
  })
})

/*
 * Linked images, in the two shapes the publication uses.
 *
 * These are measurements, not computed-value assertions, and the difference is
 * the point. cascade.spec.js already proves that our declarations win here —
 * that `.body td > a.xref > img.image` beats Oxygen's `.image { height: auto }`
 * and that `.ImageLinksTable .xref .b` beats whatever would otherwise lay the
 * label out. What it cannot see is the pair f13ldman.css warns about in a
 * comment of its own: the custom property and the `width`/`height` attributes
 * in the content drifting apart. Every declaration wins, nothing is overridden,
 * and the grid is ragged all the same, because the CSS is forcing one size
 * while the markup claims another.
 *
 * So each test below reads the property out of the live stylesheet, reads the
 * attributes off the real elements, and compares the two against what the
 * browser actually laid out.
 *
 * Publishes that predate the rules are skipped, and only those. The guard is
 * the property itself rather than a version list: `template-2024` does not
 * declare `--f13-image-link-height`, so `oxygen-26/` and `oxygen-25/` have no
 * rule for these tests to check and are not evidence of anything when they
 * pass. The cost is the same one OPTIONAL_PAGES carries: if a *current*
 * template ever stopped declaring the property, these tests would go quiet
 * instead of failing. The skip says so on stderr, and the property is one line
 * in f13ldman.css.
 */

/** The value of a `:root` custom property, or '' when the sheet omits it. */
async function customProperty(page, name) {
  return (
    await page.evaluate(
      (prop) =>
        getComputedStyle(document.documentElement).getPropertyValue(prop),
      name,
    )
  ).trim()
}

test.describe('linked images', () => {
  test('image-link tiles are all one size, and the size the markup claims', async ({
    page,
  }) => {
    await visit(page, PAGES.topic)

    const declared = await customProperty(page, '--f13-image-link-height')
    test.skip(
      !declared,
      'this publish predates --f13-image-link-height; its template has no ' +
        'tile-sizing rule to check',
    )
    const declaredWidth = await customProperty(page, '--f13-image-link-width')

    const tiles = page.locator('.body td > a.xref > img.image')
    expect(
      await tiles.count(),
      'no image-link tiles on this page — a grid of one proves nothing about ' +
        'a rule whose job is to make several match',
    ).toBeGreaterThan(1)

    const measured = await tiles.evaluateAll((imgs) =>
      imgs.map((img) => {
        const box = img.getBoundingClientRect()
        return {
          src: img.getAttribute('src') || '',
          width: box.width,
          height: box.height,
          attrWidth: img.getAttribute('width'),
          attrHeight: img.getAttribute('height'),
          // Aspect ratio of the file itself, before any CSS.
          natural: img.naturalWidth / img.naturalHeight,
        }
      }),
    )

    // Same rendered size, every tile. This is the visible promise: a grid.
    const sizes = [...new Set(measured.map((m) => `${m.width}x${m.height}`))]
    expect(
      sizes,
      'the tiles are not all the same size, so the grid is ragged:\n' +
        measured.map((m) => `  ${m.width}x${m.height}  ${m.src}`).join('\n'),
    ).toHaveLength(1)

    // The height is the dimension the rule fully controls, so it is asserted
    // literally. The width deliberately is not: Oxygen sets `max-width: 100%`
    // on images, and a tile in a cell narrower than the declared width is
    // capped to the cell — 412.5px in a 422.5px cell against a declared 438px
    // in the 28.1 publish. The grid still lines up, because every cell is the
    // same width, which is why the sameness check above is the one that
    // carries the visible promise.
    for (const m of measured) {
      expect(
        `${m.height}px`,
        `${m.src} renders ${m.height}px tall, but f13ldman.css declares ` +
          `--f13-image-link-height: ${declared}`,
      ).toBe(declared)
    }

    // The pair f13ldman.css's own comment warns about: the custom properties
    // and the width/height attributes in the content have to stay in step, or
    // the markup claims one size while the CSS forces another. Nothing in the
    // rendering shows this — every declaration still wins the cascade — so it
    // is checked as a source-consistency question, on the attributes DITA
    // emitted rather than on the box.
    for (const m of measured) {
      expect(
        `${m.attrWidth}px`,
        `${m.src} is authored width="${m.attrWidth}" while f13ldman.css ` +
          `forces ${declaredWidth}. The custom properties and the image ` +
          `attributes are a matched pair — change one, change the other`,
      ).toBe(declaredWidth)
      expect(
        `${m.attrHeight}px`,
        `${m.src} is authored height="${m.attrHeight}" while f13ldman.css ` +
          `forces ${declared}`,
      ).toBe(declared)
    }

    // If every picture already had the same shape, the assertions above would
    // pass with no rule applying at all.
    const shapes = new Set(measured.map((m) => m.natural.toFixed(2)))
    expect(
      [...shapes],
      'every tile image has the same aspect ratio, so this test would pass ' +
        'even with the sizing rule removed. The content needs at least two ' +
        'differently-shaped pictures for the check to mean anything',
    ).not.toHaveLength(1)
  })

  test('tile labels sit on their own line, not beside the picture', async ({
    page,
  }) => {
    await visit(page, PAGES.topic)

    const labels = page.locator('.ImageLinksTable .xref .b')
    expect(
      await labels.count(),
      'no image-link labels on this page',
    ).toBeGreaterThan(0)

    expect(await computed(page, '.ImageLinksTable .xref .b', 'display')).toBe(
      'block',
    )
    expect(await computed(page, '.ImageLinksTable .xref .b', 'text-align')).toBe(
      'center',
    )

    // `display: block` is the declaration; a label above or below its picture
    // rather than alongside it is what the declaration is for. The page
    // authors the label first in one row and second in the next, and both
    // should come out the same way.
    const overlapping = await page.$$eval(
      '.ImageLinksTable a.xref',
      (links) =>
        links
          .map((link) => {
            const label = link.querySelector('.b')
            const img = link.querySelector('img.image')
            if (!label || !img) return null
            const l = label.getBoundingClientRect()
            const i = img.getBoundingClientRect()
            const clear = l.bottom <= i.top + 1 || l.top >= i.bottom - 1
            return clear ? null : (label.textContent || '').trim()
          })
          .filter(Boolean),
    )
    expect(
      overlapping,
      'these labels share a line with their picture — .ImageLinksTable .xref ' +
        '.b is not making them block-level',
    ).toEqual([])
  })

  test('images in a row share one height and keep their own widths', async ({
    page,
  }) => {
    await visit(page, PAGES.imageRow)

    const declared = await customProperty(page, '--f13-image-row-height')
    test.skip(
      !declared,
      'this publish predates --f13-image-row-height; its template has no ' +
        'image-row rule to check',
    )

    const images = page.locator(
      '.body div.div:has(> a.xref + a.xref) > a.xref > img.image',
    )
    expect(
      await images.count(),
      'no rows of linked images on this page — the :has() guard needs two ' +
        'adjacent linked images as direct children of the div, so anything ' +
        'authored between them silently empties this test',
    ).toBeGreaterThan(1)

    const measured = await images.evaluateAll((imgs) =>
      imgs.map((img) => {
        const box = img.getBoundingClientRect()
        return {
          src: img.getAttribute('src') || '',
          width: box.width,
          height: box.height,
          attrHeight: img.getAttribute('height'),
        }
      }),
    )

    for (const m of measured) {
      expect(
        `${m.height}px`,
        `${m.src} renders ${m.height}px tall, but f13ldman.css declares ` +
          `--f13-image-row-height: ${declared}`,
      ).toBe(declared)
      expect(
        `${m.attrHeight}px`,
        `${m.src} is authored height="${m.attrHeight}" while the CSS forces ` +
          `${declared} — the markup claims a size the page does not render`,
      ).toBe(declared)
    }

    // The other half of the rule is `width: auto`. Tiles are forced to one
    // width; these are not, and a row of identical widths would mean the tile
    // rule has reached them.
    const widths = new Set(measured.map((m) => m.width.toFixed(1)))
    expect(
      [...widths],
      'every image in the row rendered the same width, so they are being ' +
        'sized as tiles rather than scaled to a shared height. (If the ' +
        'content ever holds only same-shaped pictures, repoint this at a page ' +
        'that does not.)',
    ).not.toHaveLength(1)
  })
})

test.describe('related-link sub-titles', () => {
  /*
   * DITA emits the target topic's <shortdesc> as a <div class="desc"> under
   * every related link, and `li.linklist div.desc` hides it. In a 200px fixed
   * panel a sub-title of any length wraps to several lines and pushes the list
   * out of shape.
   *
   * Checked on the Style Samples page because that is the only page whose
   * related links are chosen for this: three targets carry a sub-title, one
   * deliberately does not, and one is the page itself. Anywhere else the mix
   * is an accident of the content.
   */
  test('a sub-titled target contributes no visible text to the panel', async ({
    page,
  }) => {
    const assets = await visit(page, PAGES.styleSamples, { optional: true })
    test.skip(!assets, `${PAGES.styleSamples} is not in this publish`)

    const descriptions = page.locator('li.linklist div.desc')
    expect(
      await descriptions.count(),
      'no related link on this page targets a topic with a sub-title, so ' +
        'this test would pass by finding nothing. Point a link in ' +
        'StyleSamples.dita at a topic that has a <shortdesc>',
    ).toBeGreaterThan(0)

    const visible = await descriptions.evaluateAll((els) =>
      els
        .filter((el) => getComputedStyle(el).display !== 'none')
        .map((el) => (el.textContent || '').trim()),
    )
    expect(
      visible,
      'these target sub-titles are rendering in the related-links panel',
    ).toEqual([])

    // The links themselves must still be there — hiding the panel would also
    // satisfy the assertion above.
    expect(
      await page.locator('.related_link a').count(),
      'the related-links panel has no links at all',
    ).toBeGreaterThan(1)
  })

  test('the link to the current page is greyed and not clickable', async ({
    page,
  }) => {
    const assets = await visit(page, PAGES.styleSamples, { optional: true })
    test.skip(!assets, `${PAGES.styleSamples} is not in this publish`)

    // .current is added at run time by current-handler.js. scripts.spec.js
    // checks the script installed itself; this checks that what it marks is
    // then styled, which is the part a reader sees.
    const current = page.locator('.related_link .current')
    expect(
      await current.count(),
      'no related link was marked as the current page — current-handler.js ' +
        'did not run, or the panel has no link back to this page',
    ).toBe(1)

    expect(await computed(page, '.related_link .current', 'pointer-events')).toBe(
      'none',
    )
    expect(await computed(page, '.related_link .current', 'color')).toBe(
      'rgb(153, 153, 153)',
    )
  })
})
