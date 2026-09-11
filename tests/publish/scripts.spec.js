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

    /*
     * The frozen oxygen-NN snapshots predate this behaviour and can never
     * acquire it, so they have to be skipped. *What* is asked, though, decides
     * whether this test is worth anything.
     *
     * The first version of this guard read current-handler.js and skipped when
     * it lacked the fix — which is the same question as the test itself, so a
     * publish that lost the behaviour went quiet instead of failing. That is a
     * hole exactly where a regression would appear.
     *
     * template-version.txt is a different question: is this publish new enough
     * that the behaviour is *expected* of it. Oxygen started stamping the file
     * into the output well after the snapshots were frozen, so they lack it
     * and are skipped, while every current and future publish carries it and
     * is therefore always checked — including one that has lost the fix, which
     * now fails as it should. Confirmed by putting main's pre-#192 handler in
     * front of the suite: failure, not a skip.
     */
    const stamped = await page.request.get(
      '/oxygen-webhelp/template/resources/template-version.txt',
    )
    if (!stamped.ok()) {
      console.warn(
        `SKIPPED ${path} in-page marking — this publish carries no ` +
          'template-version.txt, so it was built before the template was ' +
          'versioned and long before this behaviour existed',
      )
      test.skip()
    }

    const current = () =>
      page.$$eval('.related_link a.current', (links) =>
        links.map((a) => a.getAttribute('href')),
      )

    // Three states, and the panel needs all three kept apart. `current` is
    // the link pointing at exactly where the reader is: greyed out and inert,
    // because there is nowhere for it to take them. `same-page` is the wider
    // set that would not leave this page — it decides the badge, not the
    // greying. Everything else leaves the page and is badged.
    //
    // Conflating the first two is a mistake with a failure mode at each end,
    // and both were shipped on the way here: marking the panel's link to this
    // topic `current` at an anchor greys out the reader's way back to the top
    // of the page, and not marking it at all badges a link to this page as
    // though it led away from it.
    const SELF = 'unit_banjo.html'
    const marked = (name) =>
      page.$$eval(`.related_link a.${name}`, (links) =>
        links.map((a) => a.getAttribute('href')),
      )
    const selfLink = page.locator(`.related_link a[href="${SELF}"]`)

    // Arrive at an anchor, exactly as the panel's own links leave the reader.
    await visit(page, `${path}#unit_banjo__number3`)
    expect(
      await current(),
      'the link to the anchor in the URL was not greyed out on arrival — this ' +
        'is the load-time marking, and it worked before the fix too',
    ).toEqual(['#unit_banjo__number3'])

    // ...then follow a second in-page link out of the panel.
    await page.locator('.related_link a[href="#unit_banjo__number4"]').click()
    await expect(page).toHaveURL(/#unit_banjo__number4$/)
    expect(
      await current(),
      'the greyed-out link did not move with the reader. The address bar ' +
        'updated, so the click worked: what failed is that the marking is ' +
        'not being redone. Note that pushState raises no event — see ' +
        'current-handler.js',
    ).toEqual(['#unit_banjo__number4'])

    // Back is a real navigation here — pushState made a history entry — and
    // it is the one route that goes through popstate rather than the wrapper.
    await page.goBack()
    await expect(page).toHaveURL(/#unit_banjo__number3$/)
    expect(
      await current(),
      'Back left the marking on the anchor the reader has just left',
    ).toEqual(['#unit_banjo__number3'])

    // And throughout all of that, the reader is somewhere on this topic, so
    // the panel's link to it is same-page — no badge — while staying live.
    expect(
      await marked('same-page'),
      'the in-page anchors and the link to this topic should all be marked ' +
        'as not leaving the page',
    ).toEqual(['#unit_banjo__number4', '#unit_banjo__number3', SELF])
    await expect(
      selfLink,
      'the link back to the top of this page was greyed out while the reader ' +
        'is partway down it',
    ).not.toHaveClass(/\bcurrent\b/)
    await expect(
      selfLink,
      'the link to this page is unclickable while the reader is elsewhere on it',
    ).toHaveCSS('pointer-events', 'auto')
    await expect(
      selfLink,
      'the link to this page is badged as though following it left the page',
    ).toHaveCSS('background-image', 'none')

    // ...and the converse, on the same page and at the same anchor: a link
    // that does leave the page still says so. Asserted here and not only in
    // the icon test, which visits a page top: "the badge went missing" is a
    // thing that happened, and it happened to a reader looking at an anchor.
    await expect(
      page.locator('.related_link a[href="BR_transducers.html"]'),
      'a link to another topic lost the badge that says following it leaves ' +
        'this page',
    ).toHaveCSS('background-image', /external_link\.svg/)

    // At the top of the page the reader *is* where that link points, so now
    // it is current: greyed and inert, like any other current link.
    await visit(page, path)
    expect(
      await current(),
      'at the top of the page, the only current link should be the one ' +
        'pointing at the page itself',
    ).toEqual([SELF])
    await expect(selfLink).toHaveCSS('pointer-events', 'none')
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
