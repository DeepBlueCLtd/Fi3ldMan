// @ts-check
const { test, expect } = require('@playwright/test')
const { ALL_PAGES, visit } = require('./helpers')

/*
 * What our page layouts put into the deliverable, as opposed to how it looks.
 *
 * Oxygen copies HTML comments from page-templates/*.xml and wt_*.html verbatim
 * into every published page. That makes a comment in those files not a note to
 * the next maintainer but content in the document — and the document carries a
 * COMMERCIALLY SENSITIVE banner and goes to an air-gapped network.
 *
 * It happened: header.xml and footer.xml grew explanatory blocks naming the
 * XSLT that drives the protection bars, the parameters it reads, and worked
 * example markup for restoring the stock footer. Every one of the 98 pages
 * shipped ~2 KB of it — 193 KB across the build. The prose now lives in
 * template-2026/README.md and the layouts keep a one-line pointer.
 *
 * Nothing about this is visible from inside the template, which is why it is a
 * test rather than a note.
 */

// Roughly double what a correct build emits (~341 B on the widest page), so an
// extra marker is fine and a re-added prose block is not.
const MAX_COMMENT_BYTES_PER_PAGE = 700

// Oxygen's own build stamp is ~71 B and the FI3LDMAN DELTA markers ~74 B.
// Anything several times that is prose, which belongs in the README.
const MAX_SINGLE_COMMENT_BYTES = 200

/** Byte length of every HTML comment in the document, including outside <html>. */
async function commentSizes(page) {
  return page.evaluate(() => {
    const walker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT)
    const sizes = []
    const encoder = new TextEncoder()
    while (walker.nextNode()) {
      const value = walker.currentNode.nodeValue || ''
      sizes.push({
        bytes: encoder.encode(value).length,
        head: value.replace(/\s+/g, ' ').trim().slice(0, 80),
      })
    }
    return sizes
  })
}

test.describe('page hygiene', () => {
  test('pages do not ship template authoring notes', async ({ page }) => {
    for (const path of ALL_PAGES) {
      await visit(page, path)
      const comments = await commentSizes(page)
      const total = comments.reduce((n, c) => n + c.bytes, 0)

      expect(
        total,
        `${path} carries ${total} B of HTML comments. Comments in ` +
          'page-templates/ are copied into every published page — put the ' +
          'prose in template-2026/README.md and leave a one-line pointer.\n' +
          comments.map((c) => `  ${c.bytes} B  ${c.head}`).join('\n'),
      ).toBeLessThanOrEqual(MAX_COMMENT_BYTES_PER_PAGE)
    }
  })

  test('no single comment is long enough to be prose', async ({ page }) => {
    // Caught separately from the page total: one 600 B block would slip under
    // the budget above while being exactly the thing that budget exists for.
    for (const path of ALL_PAGES) {
      await visit(page, path)
      const oversized = (await commentSizes(page)).filter(
        (c) => c.bytes > MAX_SINGLE_COMMENT_BYTES,
      )
      expect(
        oversized,
        `${path} has a comment long enough to be documentation. It will be ` +
          'read by whoever opens the published page, not by the next person ' +
          'to edit the template.',
      ).toEqual([])
    }
  })
})
