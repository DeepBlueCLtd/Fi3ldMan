// @ts-check
const { test, expect } = require('@playwright/test')
const { PAGES, visit, computed } = require('./helpers')

/*
 * A 200 on a stylesheet is not proof it is doing anything. These assert that
 * Oxygen's own base styling and the template skin are actually in effect, by
 * checking values that differ from what an unstyled page would compute.
 *
 * Nothing here names an Oxygen bundle. The whole point of the 2026 rebuild was
 * that the template stopped naming Oxygen assets, and a test that pins
 * commons.css would put that coupling straight back — in the test suite, where
 * it would be found the same way: by a mystifying failure after an upgrade.
 */

test.describe('oxygen base styling', () => {
  test('the CSS reset is applied', async ({ page }) => {
    await visit(page, PAGES.topic)
    // The browser default is 8px. Bootstrap, which Oxygen ships in every era
    // so far, zeroes it. If this is 8px the page has no base stylesheet at all
    // and everything below is meaningless.
    expect(
      await computed(page, 'body', 'margin-top'),
      'body still has the user-agent default margin — no base CSS is applied',
    ).toBe('0px')
  })

  test('the template skin wins over the base stylesheet', async ({ page }) => {
    await visit(page, PAGES.topic)
    // Bootstrap sets a long native font stack on body; the template's
    // oxygen.css overrides it with Roboto. Seeing Roboto proves both that
    // oxygen.css loaded and that it is ordered after the base bundle.
    expect(
      await computed(page, 'body', 'font-family'),
      'body is not using the skin font — oxygen.css did not load, or the ' +
        'base bundle is overriding it',
    ).toBe('Roboto, sans-serif')
  })

  test('the Roboto webfont files actually load', async ({ page }) => {
    await visit(page, PAGES.topic)
    // font-family: Roboto computes the same whether or not the .ttf is there;
    // it just silently falls back to sans-serif. document.fonts is the only
    // way to tell, and a missing resources/fonts/ is a plausible packaging
    // slip on the air-gapped side.
    const loaded = await page.evaluate(async () => {
      await document.fonts.ready
      return document.fonts.check('400 16px Roboto')
    })
    expect(
      loaded,
      'Roboto is specified but not available — resources/fonts/ did not make ' +
        'it into the output, and the pages are silently falling back',
    ).toBe(true)
  })

  test('the top menu is laid out, not stacked', async ({ page }) => {
    await visit(page, PAGES.topic)
    const nav = page.locator('.wh_top_menu').first()
    await expect(nav, 'no top menu in the output').toBeAttached()
    // An unstyled <nav>/<ul> stacks vertically. This is the single most
    // visible symptom of the base bundle failing to load, and the one the
    // 28.1 breakage produced.
    expect(
      await computed(page, '.wh_top_menu ul', 'display'),
      'the top menu is not laid out horizontally — base or template CSS is ' +
        'missing and the navigation will render as a bare vertical list',
    ).toBe('flex')
  })

  test('the header is a flex container', async ({ page }) => {
    await visit(page, PAGES.topic)
    expect(
      await computed(page, '.wh_header_flex_container', 'display'),
      'the header is not flexed — base CSS is missing',
    ).toBe('flex')
  })

  test('main page tiles are laid out', async ({ page }) => {
    await visit(page, PAGES.main)
    const tiles = page.locator('.wh_tile')
    await expect(
      tiles.first(),
      'no tiles on the main page — webhelp.show.main.page.tiles is off, or ' +
        'the main page layout did not apply',
    ).toBeAttached()
    expect(await tiles.count()).toBeGreaterThan(1)

    // Tiles that fail to pick up their styling collapse to full-width blocks
    // in source order, which still *looks* like a page rather than an error.
    const boxes = await tiles.evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().width),
    )
    expect(
      Math.max(...boxes),
      'tiles have zero width — the tile layout did not apply',
    ).toBeGreaterThan(0)
  })
})
