// @ts-check
const { test, expect } = require('@playwright/test')
const { PAGES, visit } = require('./helpers')

/*
 * The four Fi3ldMan scripts, checked by effect rather than by <script> tag.
 *
 * Under 28.1 the old injection mechanism (a whc:page_libraries override naming
 * app/commons.js) stopped working, and the 2026 template replaced it with a
 * page-templates-fragments head fragment. That mechanism is the newest and
 * least proven thing in the template, so these tests deliberately check that
 * the scripts *ran*, not that the tags are present — a tag pointing at a 404
 * is exactly the failure that was shipped last time.
 */

test.describe('fi3ldman scripts', () => {
  test('all four are requested and load', async ({ page }) => {
    const assets = await visit(page, PAGES.topic)

    for (const script of [
      'current-handler.js',
      'sorttable.js',
      'harmonics.js',
      // Pub-10's spectrogram viewer. Nothing on a pub-5 page uses it - it
      // looks for table.gram-config and finds none - but it ships in the
      // shared template and so must load rather than 404 here too.
      'gramframe.bundle.js',
    ]) {
      const hits = assets.matching(script)
      expect(
        hits.length,
        `${script} was never requested — the head-fragment injection did not ` +
          'take; see webhelp.fragment.head.topic.page',
      ).toBeGreaterThan(0)
      expect(hits[0].status, `${script} 404d`).toBe(200)
    }
  })

  // No jQuery check here: none of the four Fi3ldMan scripts reference it, so
  // whether Oxygen ships jQuery is Oxygen's business, not a dependency of ours.

  test('sorttable installed itself', async ({ page }) => {
    await visit(page, PAGES.table)
    const present = await page.evaluate(
      () => typeof (/** @type {any} */ (window).sorttable) === 'object',
    )
    expect(present, 'sorttable.js loaded but did not define its global').toBe(
      true,
    )
  })

  test('a sortable table is claimed and actually sorts', async ({ page }) => {
    await visit(page, PAGES.table)
    const table = page.locator('table.sortable').first()
    await expect(
      table,
      'no table.sortable on this page — repoint PAGES.table',
    ).toBeAttached()

    // The published markup has no <thead>; sorttable.makeSortable creates one
    // and moves the first row into it. Its presence is proof that init reached
    // this table, and it is invisible in the source HTML.
    await expect(
      table.locator('thead'),
      'sorttable did not claim the table — it renders correctly and silently ' +
        'does nothing when clicked',
    ).toHaveCount(1)

    const header = table.locator('thead tr > *').first()
    expect(
      await header.evaluate((el) => /** @type {any} */ (el).sorttable_columnindex),
      'the first column has no sort handler',
    ).toBe(0)

    // Prove it sorts, rather than merely that it was wired up.
    //
    // Two clicks, not one: this column's rows happen to be in ascending order
    // already, so the first click is a legitimate no-op and comparing against
    // the initial order would fail on working code. The second click reverses,
    // which is observable whatever the starting order.
    const column = table.locator('tbody tr td:first-child')
    expect((await column.allInnerTexts()).length, 'no body rows').toBeGreaterThan(1)

    await header.click()
    await expect(header).toHaveClass(/sorttable_sorted/)
    const ascending = await column.allInnerTexts()

    await header.click()
    await expect(header).toHaveClass(/sorttable_sorted_reverse/)
    const descending = await column.allInnerTexts()

    expect(
      descending,
      'the second click did not reverse the rows — sorttable is wired up but ' +
        'not sorting',
    ).toEqual([...ascending].reverse())
  })

  test('the harmonics calculator initialises', async ({ page }) => {
    await visit(page, PAGES.topic)
    // harmonics.js declares hCalc at top level of a classic script and hangs
    // its init off window.onload.
    const state = await page.evaluate(() => ({
      // eslint-disable-next-line no-undef
      hasCalc: typeof hCalc !== 'undefined',
      hasOnload: typeof window.onload === 'function',
    }))
    expect(state.hasCalc, 'harmonics.js did not evaluate').toBe(true)
    expect(state.hasOnload, 'harmonics.js did not register its init').toBe(true)
  })

  test('current-handler marks the link to the current page', async ({ page }) => {
    await visit(page, PAGES.topic)
    // The script runs on readystatechange and adds .current to any link whose
    // href matches the current URL.
    const installed = await page.evaluate(
      () => typeof document.onreadystatechange === 'function',
    )
    expect(installed, 'current-handler.js did not evaluate').toBe(true)

    // ...and the marking is asserted, not just the registration. The two are
    // not the same check: the comparison is `link.href === document.URL`, so
    // anything that rewrites the URL — the dev server's `cleanUrls` default
    // did exactly this until `tests/publish/serve.json` turned it off — leaves
    // the handler installed, running, and marking nothing.
    const marked = await page.$$eval('a.current', (links) =>
      links.map((a) => /** @type {HTMLAnchorElement} */ (a).href),
    )
    expect(
      marked,
      'no link was marked as the current page. The handler ran, so either ' +
        'this page has no link back to itself, or the URL it was served at ' +
        'is not the URL its own links resolve to',
    ).not.toEqual([])
    for (const href of marked) {
      expect(href, 'a link was marked .current without matching the URL').toBe(
        page.url(),
      )
    }
  })

  /*
   * The same marking, after the reader has moved within the page.
   *
   * A related-links panel can hold links to anchors in the topic itself, and
   * the greyed-out "you are here" marking has to follow the reader between
   * them. It did not: the handler ran once and the link the reader arrived at
   * stayed greyed for the rest of the visit (issue #192).
   *
   * Nothing about that is visible to a test of the handler in isolation,
   * because the event it needs does not exist. Oxygen's own app/topic.js
   * intercepts the click on an in-page link, calls preventDefault(), scrolls
   * the page itself and rewrites the address with history.pushState — which
   * fires neither hashchange nor popstate. So this is a test of the two
   * scripts together, in a browser, and it is the only place that interaction
   * shows up at all.
   */
  test('the marking follows in-page related links', async ({ page }) => {
    const path = PAGES.anchoredRelatedLinks

    // A publish built from a template older than the fix cannot have the
    // behaviour, and the frozen oxygen-NN snapshots never will. Skip on those
    // and say so, rather than reporting a template-2026 defect against a 2024
    // build. Guarded on the handler itself, so any publish carrying the fix is
    // always checked and no snapshot has to be remembered.
    const handler = await (
      await page.request.get('/oxygen-webhelp/template/resources/current-handler.js')
    ).text()
    if (!handler.includes('pushState')) {
      console.warn(
        `SKIPPED ${path} in-page marking — this publish carries a ` +
          'current-handler.js from before the issue-192 fix, which marks the ' +
          'current link once at load and never again',
      )
      test.skip()
    }

    const current = () =>
      page.$$eval('.related_link a.current', (links) =>
        links.map((a) => a.getAttribute('href')),
      )

    // Two links are expected current throughout, not one. The panel's own
    // link back to this topic ("Signature", the bare page URL) is a link to
    // where the reader is whatever anchor they are at, so it stays marked
    // while the anchor marking moves beneath it. Asserting the whole list
    // rather than just the anchor is deliberate: it is what catches that one
    // going missing, which is how it read as an ordinary link to somewhere
    // else the moment a reader followed any in-page link.
    const SELF = 'unit_banjo.html'

    // Arrive at an anchor, exactly as the panel's own links leave the reader.
    await visit(page, `${path}#unit_banjo__number3`)
    expect(
      await current(),
      'the link to the anchor in the URL was not greyed out on arrival — this ' +
        'is the load-time marking, and it worked before the fix too',
    ).toEqual(['#unit_banjo__number3', SELF])

    // ...then follow a second in-page link out of the panel.
    await page.locator('.related_link a[href="#unit_banjo__number4"]').click()
    await expect(page).toHaveURL(/#unit_banjo__number4$/)
    expect(
      await current(),
      'the greyed-out link did not move with the reader. The address bar ' +
        'updated, so the click worked: what failed is that the marking is ' +
        'not being redone. Note that pushState raises no event — see ' +
        'current-handler.js',
    ).toEqual(['#unit_banjo__number4', SELF])

    // Back is a real navigation here — pushState made a history entry — and
    // it is the one route that goes through popstate rather than the wrapper.
    await page.goBack()
    await expect(page).toHaveURL(/#unit_banjo__number3$/)
    expect(
      await current(),
      'Back left the marking on the anchor the reader has just left',
    ).toEqual(['#unit_banjo__number3', SELF])

    // And at the top of the page the anchor links are no longer where the
    // reader is, while the page's own link still is. Loaded afresh rather than
    // reached with a third goBack: the visit above is this page's first
    // history entry, so one more step back leaves the document entirely.
    await visit(page, path)
    expect(
      await current(),
      'at the top of the page, the only current link should be the one ' +
        'pointing at the page itself',
    ).toEqual([SELF])
  })

  test('no console errors on load', async ({ page }) => {
    const errors = []
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text())
    })
    page.on('pageerror', (e) => errors.push(e.message))

    await visit(page, PAGES.topic)
    await page.waitForLoadState('networkidle')

    expect(errors, 'scripts threw on load').toEqual([])
  })
})
