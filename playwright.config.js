// @ts-check
const { defineConfig, devices } = require('@playwright/test')
const { existsSync } = require('node:fs')
const { resolve } = require('node:path')

/*
 * These tests check *styling*, not markup.
 *
 * The 25.1 -> 28.1 breakage did not change the generated HTML in any way a
 * source diff would flag. Oxygen renamed its own CSS/JS bundles, the template
 * went on asking for the old names, and the pages 404'd on their base styling.
 * Every page still had the right elements and the right classes; none of them
 * were styled. So the suite loads the published output in a real browser and
 * asserts computed styles and asset status codes.
 *
 * Which output is tested:
 *   PUBLISH_DIR=<path>   explicit, wins over everything
 *   otherwise            the live publish, publications/pub-5/dita/out/...
 *   otherwise            site/pub-5/oxygen-28
 *
 * The frozen-snapshot fallback keeps the suite runnable on a fresh clone,
 * where the output directory is gitignored and therefore absent.
 */

const CANDIDATES = [
  process.env.PUBLISH_DIR,
  // Where the `Fieldman Webhelp 2026` scenario writes.
  'publications/pub-5/dita/out/webhelp-responsive',
  // Fresh clone: the output directory is gitignored, so fall back to the
  // newest committed frozen publish under site/.
  'site/pub-5/oxygen-28',
].filter(Boolean)

const publishDir = CANDIDATES.map((c) => resolve(__dirname, c)).find((c) =>
  existsSync(resolve(c, 'index.html')),
)

if (!publishDir) {
  throw new Error(
    'No published output found. Looked for index.html in:\n  ' +
      CANDIDATES.join('\n  ') +
      '\nPublish from Oxygen first, or set PUBLISH_DIR.',
  )
}

const PORT = Number(process.env.PUBLISH_PORT || 5099)

/*
 * Served over HTTP rather than opened as file:// on purpose. We need real
 * status codes to catch a 404, and file:// gives every response a status of 0
 * — which is exactly how the 28.1 breakage stayed invisible for so long.
 *
 * `serve -s` must never be added here: it rewrites not-found requests to
 * index.html, turning every 404 into a 200 and disarming the headline test.
 */
module.exports = defineConfig({
  testDir: './tests/publish',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // Wide enough that max-width overrides are observable: several of the
    // Fi3ldMan rules only bite once the viewport passes Oxygen's own caps.
    viewport: { width: 1600, height: 1000 },
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      // Playwright's pinned Chromium, not system Edge/Chrome. Computed styles
      // are the assertion here, so the browser version is part of the fixture:
      // a Windows Update to Edge must not be able to move a value under us.
      use: { ...devices['Desktop Chrome'], channel: undefined },
    },
  ],

  webServer: {
    command: `npx serve "${publishDir}" -l ${PORT} --no-clipboard --no-port-switching`,
    url: `http://127.0.0.1:${PORT}/index.html`,
    // Never reuse. A `serve` left running from `npm start`, or from a previous
    // run against a different PUBLISH_DIR, would be silently reused and the
    // whole suite would report on the wrong output — the exact class of
    // confidently-wrong answer these tests exist to prevent.
    reuseExistingServer: false,
    stdout: 'ignore',
    timeout: 60_000,
  },
})

module.exports.publishDir = publishDir
