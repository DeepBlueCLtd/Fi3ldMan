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
    expect(await computed(page, '.c-menu > ul', 'display')).toBe('flex')
    expect(await computed(page, '.c-menu > ul', 'justify-content')).toBe(
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

    const wideWidth = await wide.evaluate((el) => el.getBoundingClientRect().width)
    const others = await page
      .locator('.wh_tile:not([data-id="PD_1"])')
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width))

    expect(others.length, 'no other tiles to compare against').toBeGreaterThan(0)
    expect(
      wideWidth,
      'the REGIONS tile is not wider than its siblings — the width override ' +
        'is not applying',
    ).toBeGreaterThan(Math.max(...others))
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
   * Three rules decide a related link's icon, and they are order- and
   * !important-sensitive. Checking only the first link in the list would test
   * whichever rule happens to win there — which is how the first draft of this
   * test ended up asserting the spreadsheet icon.
   */
  test('each related-link kind gets its own icon', async ({ page }) => {
    const assets = await visit(page, PAGES.relatedLinks)

    const icons = await page.$$eval('.related-links a', (links) =>
      links.map((a) => ({
        href: a.getAttribute('href') || '',
        image: getComputedStyle(a).backgroundImage,
      })),
    )
    expect(icons.length, 'no related links on this page').toBeGreaterThan(0)

    const spreadsheet = icons.filter((i) => /\.xlsx?$/.test(i.href))
    const internal = icons.filter((i) => i.href.startsWith('#'))
    const ordinary = icons.filter(
      (i) => !/\.xlsx?$/.test(i.href) && !i.href.startsWith('#'),
    )

    expect(spreadsheet.length, 'no spreadsheet link to check').toBeGreaterThan(0)
    expect(internal.length, 'no same-page link to check').toBeGreaterThan(0)
    expect(ordinary.length, 'no ordinary link to check').toBeGreaterThan(0)

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

    // A background-image that 404s computes exactly the same as one that
    // loads, so the network is the only place a missing icon shows up.
    for (const file of ['external_link.svg', 'icon_excel.gif']) {
      const hits = assets.matching(file)
      expect(hits.length, `${file} was never requested`).toBeGreaterThan(0)
      expect(hits[0].status, `${file} 404d`).toBe(200)
    }
  })
})
