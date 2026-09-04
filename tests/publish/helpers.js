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
  /*
   * A unit page, for the row-of-linked-images shape: a plain DITA <div> whose
   * direct children are two or more <xref>s each wrapping an <image>.
   *
   * It is not here as a second topic page. Until it was added, the selector
   * `.body div.div:has(> a.xref + a.xref) > a.xref > img.image` matched nothing
   * on any page in this list — not the country pages, whose linked images are
   * table cells, and not charlie_pics.html, whose divs hold one linked image
   * each. cascade.spec.js skips a rule with no element to test, so the row
   * height went unaudited while looking covered.
   *
   * StyleSamples.dita now carries the same shape, but a sample only reaches
   * the output at the next publish from Oxygen; this page carries it today and
   * in every frozen snapshot.
   */
  imageRow: '/Britain.Legacy/_100_unit_charlie.html',
  // The Style Samples page, which carries one example of every Fi3ldMan class.
  // It is here so cascade.spec.js can audit the rules that the publication's
  // real content happens not to use — item-list, fullWidthTable and
  // table-separator matched no element at all until this page existed, and a
  // rule that matches nothing cannot be checked. Adding a class to
  // StyleSamples.dita only puts it in front of the suite because this entry
  // exists; without it the page is published but never visited.
  styleSamples: '/QuickLinksData/StyleSamples.html',
}

/** Every page above, for the sweeps that should cover all page types. */
const ALL_PAGES = Object.values(PAGES)

/*
 * Pages a publish may legitimately not contain, and why.
 *
 * The default above is deliberate and stays: a page that 404s fails the run,
 * because a styling test with nothing to look at reports success. But the
 * `oxygen-NN/` folders are *frozen* snapshots, and the suite is meant to be
 * re-run against them whenever the template changes. A snapshot taken before
 * a page existed can never gain it, so a page added to the source today turns
 * every older snapshot red — which is what adding StyleSamples.dita did:
 * `PUBLISH_DIR=site/pub-5/oxygen-26` went from a full pass to six failures,
 * none of them about styling.
 *
 * So an entry here is skipped when absent, and only when absent. The trade is
 * explicit: if a *current* publish silently stops emitting one of these, the
 * sweeps go quiet about it instead of failing. That is why the skip is
 * announced on stderr and repeated in the sweep's own reporting, and why this
 * map should stay short — one entry per page that predates a frozen snapshot,
 * with the reason written down.
 */
const OPTIONAL_PAGES = new Map([
  [
    PAGES.styleSamples,
    'added to the source in 2026-09 — the oxygen-25 and oxygen-26 snapshots ' +
      'were frozen before StyleSamples.dita existed',
  ],
])

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
async function visit(page, path, { optional = false } = {}) {
  const assets = recordResponses(page)
  const response = await page.goto(path, { waitUntil: 'load' })

  // An OPTIONAL_PAGES entry this publish does not have: report and stand down.
  if (optional && response?.status() === 404) {
    console.warn(
      `SKIPPED ${path} — not in this publish. ${OPTIONAL_PAGES.get(path)}`,
    )
    return null
  }

  expect(
    response?.status(),
    `${path} should itself be served; a 404 here means the page list in ` +
      `helpers.js does not match this publication`,
  ).toBe(200)
  return assets
}

/**
 * Runs `fn(assets, path)` for every page in ALL_PAGES.
 *
 * Pages listed in OPTIONAL_PAGES are skipped when this publish does not have
 * them; every other 404 still fails. Returns the paths that were skipped, so
 * the caller can say which pages its result does *not* cover — a sweep that
 * quietly covered fewer pages than it claims is the failure mode this whole
 * suite exists to avoid.
 */
async function sweep(page, fn) {
  const skipped = []
  for (const path of ALL_PAGES) {
    const assets = await visit(page, path, { optional: OPTIONAL_PAGES.has(path) })
    if (!assets) {
      skipped.push(path)
      continue
    }
    await fn(assets, path)
  }
  return skipped
}

/** A sentence naming the pages a sweep did not cover, for a failure message. */
function coverageNote(skipped) {
  return skipped.length
    ? `\n(not covered by this run: ${skipped.join(', ')})`
    : ''
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

module.exports = {
  PAGES,
  ALL_PAGES,
  OPTIONAL_PAGES,
  recordResponses,
  visit,
  sweep,
  coverageNote,
  computed,
}
