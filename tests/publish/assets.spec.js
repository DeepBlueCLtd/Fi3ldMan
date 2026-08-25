// @ts-check
const { test, expect } = require('@playwright/test')
const { PAGES, ALL_PAGES, visit } = require('./helpers')

/*
 * The headline suite. Everything here would have caught the 25.1 -> 28.1
 * breakage on the first run.
 *
 * When the template asked for app/commons.css and Oxygen had split it into
 * app/bootstrap.css + app/main.css, the build succeeded, the HTML was correct,
 * and the pages 404'd on their base styling. Nothing short of watching the
 * network sees that.
 */

test.describe('assets', () => {
  for (const [name, path] of Object.entries(PAGES)) {
    test(`${name}: every referenced asset resolves`, async ({ page }) => {
      const assets = await visit(page, path)
      expect(
        assets.problems(),
        'assets failed to load — the page will render unstyled or partly ' +
          'scripted while looking correct in the HTML source',
      ).toEqual([])
    })
  }

  test('stylesheets in <head> all return 200', async ({ page }) => {
    const assets = await visit(page, PAGES.topic)

    const linked = await page.$$eval('link[rel="stylesheet"]', (links) =>
      links.map((l) => /** @type {HTMLLinkElement} */ (l).href),
    )
    expect(
      linked.length,
      'no stylesheets linked at all — the page cannot be styled',
    ).toBeGreaterThan(0)

    for (const href of linked) {
      const [hit] = assets.responses.filter((r) => r.url === href)
      expect(hit, `stylesheet was never requested: ${href}`).toBeDefined()
      expect(hit.status, `stylesheet did not load: ${href}`).toBe(200)
    }
  })

  test('the Fi3ldMan stylesheets are present and load', async ({ page }) => {
    const assets = await visit(page, PAGES.topic)

    // f13ldman.css carries the branding and the overrides; notes.css the DITA
    // note boxes. Both are ours, and both are named in <resources>, so their
    // absence is a template fault rather than an Oxygen one.
    for (const sheet of ['f13ldman.css', 'notes.css']) {
      const hits = assets.matching(sheet)
      expect(hits.length, `${sheet} was never requested`).toBeGreaterThan(0)
      expect(hits[0].status, `${sheet} did not load`).toBe(200)
    }
  })

  test('an Oxygen base stylesheet loads, whichever era this is', async ({
    page,
  }) => {
    const assets = await visit(page, PAGES.topic)

    // Deliberately not naming a bundle. 25.1 shipped app/commons.css; 28.1
    // ships app/bootstrap.css + app/main.css. Pinning either name here would
    // re-create the exact coupling that broke the 2024 template.
    const appCss = assets.responses.filter(
      (r) => r.url.includes('/oxygen-webhelp/app/') && r.url.includes('.css'),
    )
    expect(
      appCss.length,
      'no Oxygen app stylesheet was requested — the page has no base styling',
    ).toBeGreaterThan(0)
    expect(appCss.every((r) => r.status === 200)).toBe(true)
  })

  test('the corporate logo loads and is not a broken image', async ({
    page,
  }) => {
    await visit(page, PAGES.topic)

    const logo = page.locator('.wh_logo img').first()
    await expect(logo, 'no logo image in the header').toBeAttached()

    const src = await logo.getAttribute('src')
    expect(
      src,
      'logo src is an absolute filesystem path — a webhelp.logo.image ' +
        'override is set in the transformation scenario; delete it',
    ).not.toMatch(/^[a-zA-Z]:[\\/]/)

    // The distinguishing check. A template-relative webhelp.logo.image yields
    // a perfectly sane-looking relative src with no file behind it: the source
    // looks right and the image is broken. Only naturalWidth tells them apart.
    const naturalWidth = await logo.evaluate(
      (img) => /** @type {HTMLImageElement} */ (img).naturalWidth,
    )
    expect(
      naturalWidth,
      `logo src "${src}" resolved to nothing. The path is relative, which ` +
        'looks correct, but no file is there — see "The logo" in ' +
        'context-docs/11-publishing-template-2026.md',
    ).toBeGreaterThan(0)
  })

  test('the search index was built', async ({ page }) => {
    const assets = await visit(page, PAGES.main)
    // Search silently degrades to "no results" if the index is missing, which
    // reads as a content problem rather than a build one.
    expect(
      assets.matching('search/index/').length,
      'no search index requested — search will return nothing',
    ).toBeGreaterThan(0)
  })

  test('no page links to a stale absolute build path', async ({ page }) => {
    for (const path of ALL_PAGES) {
      await visit(page, path)
      const absolute = await page.$$eval('[src], [href]', (els) =>
        els
          .map((el) => el.getAttribute('src') || el.getAttribute('href') || '')
          .filter((v) => /^[a-zA-Z]:[\\/]/.test(v) || v.startsWith('file://')),
      )
      expect(absolute, `${path} contains machine-absolute references`).toEqual(
        [],
      )
    }
  })
})
