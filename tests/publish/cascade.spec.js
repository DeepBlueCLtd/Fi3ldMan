// @ts-check
const { test, expect } = require('@playwright/test')
const { sweep, coverageNote } = require('./helpers')

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
 * Declarations known to be overridden by a stylesheet we do not own, and
 * accepted.
 *
 * Empty, and that is the finding rather than an omission.
 *
 * The list held ten entries. Seven said, in prose, that a declaration had been
 * displaced by a more specific rule of our own — .c-full-width, the four
 * .related-links icon properties, .bkDarkGray, the sortable header colour, and
 * `.enterBtn { font-size }`, added by hand when the Style Samples page put the
 * button beside its own .contents-index variant. That last one is why the
 * prose approach had to go: the page demonstrates base rules next to their
 * variants on purpose, so every sample added would have earned an entry. The
 * audit now works this out for itself (see `lostToOurOwnSheet` below), and all
 * seven went with the mechanism that needed them.
 *
 * The remaining three were recorded as genuine losses to Oxygen, "pre-existing
 * on 26 and 28.1 — unresolved", and left for whoever next looked at the
 * harmonics calculator. They were nothing of the kind. `.wh_harmonics td` sets
 * `text-align: right` and `padding: 0`; `.wh_harmonics td.obs`, eleven lines
 * below it, sets `text-align: left` and `padding-left: 10px`. `.wh_harmonics
 * input` sets `width: 50px` and `input.working`, `input.absolute` and
 * `input.clear` each set their own. Every one of them is our own variant rule
 * winning on the cell it was written for, on the first element the audit
 * happened to sample. There was never anything to fix.
 *
 * So nothing in f13ldman.css currently loses to a stylesheet we do not own.
 * The map stays because the next Oxygen upgrade will put something in it, and
 * every entry needs a reason — an entry without one is a bug someone silenced.
 */
const ACCEPTED = new Map([])

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

    const others = [...document.styleSheets].filter((s) => s !== sheet)

    /*
     * Force `declared` onto the element and report whether the rendering moves.
     *
     * Empirical rather than a specificity calculation, which is the whole
     * approach of this file: it accounts for units, inheritance, custom
     * properties and anything else the browser resolves.
     */
    const movesWhenForced = (el, prop, declared, read) => {
      const before = read()
      const savedValue = el.style.getPropertyValue(prop)
      const savedPriority = el.style.getPropertyPriority(prop)
      el.style.setProperty(prop, declared, 'important')
      const forced = read()
      el.style.setProperty(prop, savedValue, savedPriority)
      if (!savedValue) el.style.removeProperty(prop)
      return before !== forced
    }

    /*
     * Did this declaration lose to another rule in f13ldman.css?
     *
     * A declaration displaced by a more specific rule of our own is not a
     * fault — it is the cascade working. `.enterBtn` sets 28px and
     * `.contents-index .enterBtn` sets 20px; on a page carrying a contents
     * index the first loses and nothing is wrong. `.related-links a` sets the
     * generic link icon and our own `a[href^="#"]` variant clears it. The
     * Style Samples page demonstrates base rules beside their own variants on
     * purpose, so this shape is now normal rather than exceptional, and
     * hand-listing each instance in ACCEPTED does not survive the next sample
     * someone adds.
     *
     * Asked by elimination: switch every other stylesheet off, so f13ldman.css
     * is the only author sheet in play, and force the declaration again. If it
     * still moves the rendering, one of our own rules was beating it and the
     * loss is internal. If it now holds, we win among ourselves — so whatever
     * beat it with the other sheets enabled belongs to somebody else, and that
     * is the fault this spec exists to catch.
     *
     * Comparing against the value with our sheet merely disabled would not do:
     * `a[href^="#"]` sets `background-image: none`, which is also the value
     * with no stylesheet at all, and the loss would read as foreign.
     */
    const lostToOurOwnSheet = (el, prop, declared, read) => {
      others.forEach((s) => (s.disabled = true))
      const internal = movesWhenForced(el, prop, declared, read)
      others.forEach((s) => (s.disabled = false))
      return internal
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
          let lost
          if (declared.includes('url(')) {
            const file = (declared.match(/url\(['"]?([^'")]+)/) || [])[1]
            const name = file ? file.split('/').pop() : null
            lost = !!name && !read().includes(name)
          } else {
            lost = movesWhenForced(el, prop, declared, read)
          }

          if (!lost) continue
          // Beaten by a sibling rule of our own on this element — the cascade
          // working. Say nothing, and keep looking at the other elements.
          if (lostToOurOwnSheet(el, prop, declared, read)) continue

          losing.push({
            key: `${rule.selectorText} { ${prop} }`,
            was: read(),
            declared,
          })
          break // one failing element is enough to report the declaration
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

    const skipped = await sweep(page, async (_assets, path) => {
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
    })

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
        'override is deliberate, add it to ACCEPTED with a reason.' +
        coverageNote(skipped),
    ).toEqual([])
  })

  test('the accepted-override list has not gone stale', async ({ page }) => {
    test.setTimeout(180_000)

    const seen = new Set()
    const skipped = await sweep(page, async () => {
      const report = await auditPage(page)
      report.losing?.forEach((l) => seen.add(l.key))
    })

    // An entry that no longer reproduces has been fixed, or the selector it
    // names has gone. Either way the list should shrink, or the next real
    // override hides behind a stale exemption.
    const stale = [...ACCEPTED.keys()].filter((k) => !seen.has(k))
    expect(
      stale,
      'these declarations are no longer overridden — remove them from ' +
        'ACCEPTED' + coverageNote(skipped),
    ).toEqual([])
  })
})
