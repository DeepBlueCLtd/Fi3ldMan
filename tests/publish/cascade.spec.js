// @ts-check
const { test, expect } = require('@playwright/test')
const { ALL_PAGES, visit } = require('./helpers')

/*
 * Does every rule we wrote actually reach the page?
 *
 * The rest of the suite checks a chosen handful of declarations. That is not
 * enough, and Oxygen 28.1 proved it: main.css introduced
 *
 *     .simpletable>:not(caption)>*>*, .table>:not(caption)>*>* {
 *         background-color: var(--wh-primary-bg,#fff);
 *         color: var(--wh-primary-color,#000);
 *     }
 *
 * which scores (0,1,1) against our .bkDarkGray and friends at (0,1,0). Six
 * table-cell colour classes silently rendered white. The HTML was unchanged,
 * the classes were still on the elements, our stylesheet loaded and returned
 * 200, and every hand-written test in this suite stayed green.
 *
 * So this spec does not pick declarations. It reads every rule out of
 * f13ldman.css at run time and asks, for each declaration on each page: if
 * this definitely won the cascade, would the rendering change? If yes, it is
 * being overridden and the styling is not reaching the reader.
 *
 * The check is empirical rather than a specificity calculation — force the
 * value inline with !important on the real element, in its real context, and
 * see whether the computed value moves. That accounts for units, inheritance,
 * custom properties and anything else the browser resolves.
 */

/*
 * Declarations known to be overridden, and accepted.
 *
 * Every entry needs a reason. An entry without one is a bug someone silenced.
 * Anything not listed here fails the test.
 */
const ACCEPTED = new Map([
  // Overridden by our own `.container-fluid { max-width: 100% !important }`,
  // which lands on the same element. Same visual result, so `unset` never
  // takes effect.
  ['.c-full-width { max-width }', 'superseded by our own .container-fluid rule'],

  // The generic related-link icon is deliberately displaced by our own more
  // specific rules: the .xls/.xlsx variant (which is !important) and the
  // same-page `a[href^="#"]` variant that clears the icon.
  ['.related-links a { background-image }', 'superseded by our own href-specific rules'],
  ['.related-links a { background-position-x }', 'superseded by our own href-specific rules'],
  ['.related-links a { background-position-y }', 'superseded by our own href-specific rules'],
  ['.related-links a { background-repeat }', 'superseded by our own href-specific rules'],

  // Sortable table headers. Three of our own rules stack on the same cells —
  // the content's .bkDarkGray, the generic header colour, and the nosort
  // variant — and the most specific wins each time. This is the same outcome
  // as Oxygen 26 produced, checked against that baseline.
  ['.bkDarkGray { background-color }', 'superseded by our own table.sortable thead td rule'],
  ['table.sortable thead td { background-color }', 'superseded by our own .sorttable_nosort rule'],

  // Pre-existing on Oxygen 26 as well as 28.1, so not an upgrade regression.
  // Genuine losses, worth fixing on their own merits; until someone decides
  // what the harmonics calculator should look like they are recorded rather
  // than hidden.
  ['.wh_harmonics td { text-align }', 'pre-existing on 26 and 28.1 — unresolved'],
  ['.wh_harmonics td { padding-left }', 'pre-existing on 26 and 28.1 — unresolved'],
  ['.wh_harmonics input { width }', 'pre-existing on 26 and 28.1 — unresolved'],
])

/** Reads f13ldman.css out of the live page and tests every declaration. */
async function auditPage(page) {
  return page.evaluate(() => {
    const sheet = [...document.styleSheets].find(
      (s) => s.href && s.href.includes('f13ldman.css'),
    )
    if (!sheet) return { error: 'f13ldman.css is not among the loaded stylesheets' }

    const flat = []
    const walk = (rules) => {
      for (const r of rules) {
        if (r.constructor.name === 'CSSMediaRule') {
          // Only rules whose media query applies at this viewport.
          if (window.matchMedia(r.conditionText).matches) walk(r.cssRules)
        } else if (r.style && r.selectorText) {
          flat.push(r)
        }
      }
    }
    try {
      walk(sheet.cssRules)
    } catch (e) {
      return { error: 'cannot read cssRules: ' + e.message }
    }

    const losing = []
    let checked = 0

    for (const rule of flat) {
      const parts = rule.selectorText.split(/::(?=[a-z])/)
      const pseudo = parts[1] ? '::' + parts[1] : null

      let els = []
      try {
        els = [...document.querySelectorAll(parts[0])].slice(0, 3)
      } catch {
        continue // :has(), :visited etc. that querySelectorAll rejects
      }
      if (!els.length) continue

      for (let i = 0; i < rule.style.length; i++) {
        const prop = rule.style[i]
        const declared = rule.style.getPropertyValue(prop)
        checked++

        for (const el of els) {
          const read = () => getComputedStyle(el, pseudo).getPropertyValue(prop)

          // A url() resolves against the stylesheet from a sheet and against
          // the document when set inline, so comparing them directly is
          // meaningless. Compare the filename instead.
          if (declared.includes('url(')) {
            const file = (declared.match(/url\(['"]?([^'")]+)/) || [])[1]
            const name = file ? file.split('/').pop() : null
            if (name && !read().includes(name)) {
              losing.push({
                key: `${rule.selectorText} { ${prop} }`,
                was: read(),
                declared,
              })
            }
            continue
          }

          const before = read()
          const savedValue = el.style.getPropertyValue(prop)
          const savedPriority = el.style.getPropertyPriority(prop)
          el.style.setProperty(prop, declared, 'important')
          const forced = read()
          el.style.setProperty(prop, savedValue, savedPriority)
          if (!savedValue) el.style.removeProperty(prop)

          if (before !== forced) {
            losing.push({
              key: `${rule.selectorText} { ${prop} }`,
              was: before,
              declared,
            })
            break // one failing element is enough to report the declaration
          }
        }
      }
    }
    return { losing, checked }
  })
}

test.describe('cascade', () => {
  test('every f13ldman.css declaration reaches the page', async ({ page }) => {
    test.setTimeout(180_000)

    /** @type {Map<string, {pages: Set<string>, was: string, declared: string}>} */
    const overridden = new Map()
    let checked = 0

    for (const path of ALL_PAGES) {
      await visit(page, path)
      const report = await auditPage(page)
      expect(report.error, report.error || '').toBeUndefined()
      checked = Math.max(checked, report.checked)

      for (const l of report.losing) {
        const hit = overridden.get(l.key) || {
          pages: new Set(),
          was: l.was,
          declared: l.declared,
        }
        hit.pages.add(path)
        overridden.set(l.key, hit)
      }
    }

    expect(checked, 'no declarations were checked — is f13ldman.css loading?')
      .toBeGreaterThan(100)

    const unexpected = [...overridden.entries()].filter(
      ([key]) => !ACCEPTED.has(key),
    )

    expect(
      unexpected.map(([key, v]) => `${key}\n     renders: ${v.was}\n     we set: ${v.declared}\n     on: ${[...v.pages].join(', ')}`),
      'f13ldman.css declarations are being overridden by other stylesheets. ' +
        'The rule is in the file, the stylesheet loaded, the class is on the ' +
        'element — and the styling still does not reach the reader. Raise ' +
        'specificity or add !important, then say why in the CSS. If the ' +
        'override is deliberate, add it to ACCEPTED with a reason.',
    ).toEqual([])
  })

  test('the accepted-override list has not gone stale', async ({ page }) => {
    test.setTimeout(180_000)

    const seen = new Set()
    for (const path of ALL_PAGES) {
      await visit(page, path)
      const report = await auditPage(page)
      report.losing?.forEach((l) => seen.add(l.key))
    }

    // An entry that no longer reproduces has been fixed, or the selector it
    // names has gone. Either way the list should shrink, or the next real
    // override hides behind a stale exemption.
    const stale = [...ACCEPTED.keys()].filter((k) => !seen.has(k))
    expect(
      stale,
      'these declarations are no longer overridden — remove them from ACCEPTED',
    ).toEqual([])
  })
})
