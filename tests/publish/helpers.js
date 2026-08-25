// @ts-check
const { expect } = require('@playwright/test')

/*
 * Representative pages. Each is here because it is the only place some rule or
 * mechanism can be observed — not to sample the publication evenly.
 *
 * These paths exist in the pub-5 sample content. Against a different
 * publication most of them will 404, and the suite will say so loudly rather
 * than skipping: a styling test that quietly finds nothing to check is worse
 * than no test, because it reports success.
 */
const PAGES = {
  main: '/index.html',
  welcome: '/Welcome.html',
  search: '/search.html',
  indexTerms: '/indexTerms.html',
  topic: '/Britain1/Britain1.html',
  figures: '/Britain.Legacy/charlie_pics.html',
  relatedLinks: '/Britain.Legacy/Phase_G.html',
  table: '/QuickLinksData/VanesandCranes.html',
  // Not every topic has a short description, and `.shortdesc { display: none }`
  // cannot be tested on one that does not.
  shortdesc: '/Britain.Legacy/Britain_Legacy.html',
}

/** Every page above, for the sweeps that should cover all page types. */
const ALL_PAGES = Object.values(PAGES)

/**
 * Records every response the page makes, plus outright request failures.
 *
 * Call before navigating. A 404 on a stylesheet does not fail navigation and
 * leaves no trace in the DOM, so this recorder is the only thing standing
 * between us and a silently unstyled publication.
 */
function recordResponses(page) {
  const responses = []
  const failures = []

  page.on('response', (r) => {
    responses.push({ url: r.url(), status: r.status() })
  })
  page.on('requestfailed', (r) => {
    failures.push({
      url: r.url(),
      error: r.failure()?.errorText ?? 'unknown',
    })
  })

  return {
    responses,
    failures,
    /** Non-2xx/3xx responses and hard failures, as readable lines. */
    problems() {
      return [
        ...responses
          .filter((r) => r.status >= 400)
          .map((r) => `${r.status}  ${r.url}`),
        ...failures.map((f) => `FAILED (${f.error})  ${f.url}`),
      ]
    },
    /** Responses whose URL contains `fragment`. */
    matching(fragment) {
      return responses.filter((r) => r.url.includes(fragment))
    },
  }
}

/**
 * Loads a page with response recording already armed, and waits for the point
 * at which stylesheets and deferred scripts have been applied.
 */
async function visit(page, path) {
  const assets = recordResponses(page)
  const response = await page.goto(path, { waitUntil: 'load' })
  expect(
    response?.status(),
    `${path} should itself be served; a 404 here means the page list in ` +
      `helpers.js does not match this publication`,
  ).toBe(200)
  return assets
}

/**
 * Computed style of the first match, asserting the element exists first.
 *
 * expect(locator).toHaveCSS() already fails on a missing element, but this is
 * used where we need the raw value to compare or report.
 */
async function computed(page, selector, property) {
  const locator = page.locator(selector).first()
  await expect(
    locator,
    `expected at least one "${selector}" — if the content genuinely has none, ` +
      `the assertion is vacuous and should be removed or repointed`,
  ).toBeAttached()
  return locator.evaluate(
    (el, prop) => getComputedStyle(el).getPropertyValue(prop),
    property,
  )
}

module.exports = { PAGES, ALL_PAGES, recordResponses, visit, computed }
