#!/usr/bin/env python3
"""Which Fi3ldMan styles are actually used, and which classes have no style.

Run this against a set of DITA source materials to decide what to keep.

    python publications/pub-5/audit-classes.py publications/pub-5/dita

It answers three questions, and the third is the one that lets you delete
things:

  USED, STYLED        an outputclass in the source with a rule behind it.
                      Working as intended; nothing to do.

  USED, NO RULE       an outputclass in the source that no stylesheet defines,
                      so it renders as if it were not there. This is how
                      "This title is in blue" rendered black for years:
                      colorDarkBlue was on the element and in no CSS file.
                      Add a rule, or strip the attribute.

  STYLED, UNUSED      a class f13ldman.css styles that nothing asks for.
                      Candidates for deletion — but only after the evidence
                      columns below are read, because most of f13ldman.css
                      exists to restyle Oxygen's own markup rather than to
                      serve an outputclass.

Nothing here is deleted automatically and nothing should be deleted on the
strength of the first column alone. A class can reach the page four ways:

  dita   an outputclass= value in the DITA source
  js     named in a template script, which puts it on an element at run time
         (the harmonics calculator builds its whole table this way)
  tmpl   written into the page templates or the XSLT by hand
  html   present in a published build — which is the catch-all: it covers
         everything Oxygen emits on its own, and it is the only evidence
         available for a class Oxygen invents

A class with no evidence in any of those four is genuinely inert. A class with
html-only evidence is Oxygen's, not ours, and deleting our rule for it changes
how Oxygen's markup looks — which may be exactly what you want, or exactly what
you must not do. Read the row before acting on it.

Pass --output <dir> to include the html column. Without a published build the
report says so and the html column reads "?" rather than "no", because absence
of evidence you did not look for is not evidence of absence.

Only the standard library is used, so this runs on a client machine with
nothing installed.
"""

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent

# Selector text minus the parts a class name must never be read out of:
# strings, url() bodies and attribute selectors. Without this, `a[href$=".xls"]`
# contributes a class called `xls` and `.svg` turns up in the defined list.
NOISE = re.compile(r'"[^"]*"|\'[^\']*\'|url\([^)]*\)|\[[^\]]*\]')
CLASS_IN_SELECTOR = re.compile(r'\.(-?[_a-zA-Z][\w-]*)')
# A declaration block, so class names are only read from selectors. Applied
# repeatedly, because @media wraps rules and one pass leaves the outer braces.
COMMENT = re.compile(r'/\*.*?\*/', re.S)
BLOCKS = re.compile(r'\{[^{}]*\}')
AT_RULE_PRELUDE = re.compile(r'@[\w-]+[^{;]*')

OUTPUTCLASS = re.compile(r'outputclass\s*=\s*"([^"]*)"')
CLASS_ATTR = re.compile(r'\bclass\s*=\s*"([^"]*)"')
# A bare identifier in a script or template. Deliberately loose: this is
# evidence that something *may* apply the class, not proof that it does, and a
# false positive here only means a class is not offered for deletion.
def word(name):
    return re.compile(r'(?<![\w-])' + re.escape(name) + r'(?![\w-])')


def read(path):
    return path.read_text(encoding='utf-8', errors='replace')


def files(root, suffixes):
    if not root or not root.exists():
        return []
    if root.is_file():
        return [root] if root.suffix.lower() in suffixes else []
    return sorted(p for p in root.rglob('*') if p.suffix.lower() in suffixes)


def defined_classes(css_paths):
    """Class names f13ldman.css (and friends) actually write rules for."""
    found = defaultdict(set)
    for path in css_paths:
        text = read(path)
        # Comments first: f13ldman.css quotes Oxygen's rules inside them, and
        # an unbalanced brace in a comment silently swallows the file's real
        # selectors — which is how a first cut of this script reported every
        # .bk* and .color* class as undefined while they were all right there.
        text = COMMENT.sub(' ', text)
        # At-rules before blocks, while the opening brace that bounds each
        # prelude is still there. After the braces go, `@media ... ` has no
        # terminator and swallows the rest of the file.
        text = AT_RULE_PRELUDE.sub(' ', text)
        # One pass, which removes the innermost blocks — the declarations.
        # Repeating it would then eat the @media wrapper along with the
        # selectors now sitting inside it, and .rh_notes and everything else
        # defined under a media query would read as undefined.
        text = BLOCKS.sub(' ', text)
        text = text.replace('{', ' ').replace('}', ' ')
        text = NOISE.sub(' ', text)
        for name in CLASS_IN_SELECTOR.findall(text):
            found[name].add(path.name)
    return found


def used_in_source(dita_paths):
    """outputclass values in the DITA source, with a count and example file."""
    counts = defaultdict(int)
    where = defaultdict(set)
    for path in dita_paths:
        for value in OUTPUTCLASS.findall(read(path)):
            for name in value.split():
                counts[name] += 1
                where[name].add(path.name)
    return counts, where


def mentioned_in(paths, names):
    """Names that appear as a bare word in any of these files."""
    if not paths:
        return set()
    blob = '\n'.join(read(p) for p in paths)
    return {n for n in names if word(n).search(blob)}


def classes_in_html(paths):
    found = set()
    for path in paths:
        for value in CLASS_ATTR.findall(read(path)):
            found.update(value.split())
    return found


def main():
    ap = argparse.ArgumentParser(
        description=__doc__.splitlines()[0],
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    ap.add_argument('source', nargs='+', type=Path,
                    help='DITA source file or directory (repeatable)')
    ap.add_argument('--template', type=Path,
                    default=HERE / 'template-2026',
                    help='publishing template holding the CSS, JS and page '
                         'templates (default: pub-5 template-2026)')
    ap.add_argument('--output', type=Path,
                    help='a published build, for the html evidence column')
    args = ap.parse_args()

    if not args.template.exists():
        sys.exit(f'no such template: {args.template}')

    css = files(args.template, {'.css'})
    js = files(args.template, {'.js'})
    tmpl = files(args.template, {'.xml', '.xsl', '.html'})
    dita = [p for root in args.source for p in files(root, {'.dita', '.ditamap'})]
    html = files(args.output, {'.html'}) if args.output else []

    if not dita:
        sys.exit('no .dita or .ditamap files found under: '
                 + ', '.join(str(s) for s in args.source))
    if not css:
        sys.exit(f'no stylesheets found under: {args.template}')

    defined = defined_classes(css)
    counts, where = used_in_source(dita)

    used_styled = sorted(n for n in counts if n in defined)
    used_bare = sorted(n for n in counts if n not in defined)
    unused = sorted(n for n in defined if n not in counts)

    in_js = mentioned_in(js, unused)
    in_tmpl = mentioned_in(tmpl, unused)
    in_html = classes_in_html(html) if html else None
    candidates = []

    print(f'{len(dita)} source files, {len(css)} stylesheets'
          + (f', {len(html)} published pages' if html else ''))
    print()

    print(f'USED, STYLED — {len(used_styled)}')
    print('  An outputclass with a rule behind it. Nothing to do.')
    for name in sorted(used_styled, key=lambda n: -counts[n]):
        print(f'    {counts[name]:>5}  {name}')
    print()

    print(f'USED, NO RULE — {len(used_bare)}')
    print('  On elements in the source, defined in no stylesheet, so it')
    print('  renders as if it were not there. Add a rule, or strip it.')
    for name in sorted(used_bare, key=lambda n: -counts[n]):
        example = sorted(where[name])[0]
        print(f'    {counts[name]:>5}  {name:<24} e.g. {example}')
    print()

    print(f'STYLED, UNUSED — {len(unused)}')
    print('  No outputclass asks for these. Read the evidence columns before')
    print('  deleting: a class can still reach the page from a script, from')
    print('  the templates, or because Oxygen emits it.')
    if not html:
        print('  No --output given, so the html column reads "?" throughout.')
    print()
    print(f'    {"class":<28} {"js":<4} {"tmpl":<5} {"html":<5} verdict')
    for name in unused:
        j = 'yes' if name in in_js else 'no'
        t = 'yes' if name in in_tmpl else 'no'
        h = '?' if in_html is None else ('yes' if name in in_html else 'no')
        if j == 'no' and t == 'no' and h == 'no':
            verdict = 'DELETION CANDIDATE — no evidence anywhere'
            candidates.append(name)
        elif h == '?' and j == 'no' and t == 'no':
            verdict = 'no evidence in source — re-run with --output'
        elif h == 'yes' and j == 'no' and t == 'no':
            verdict = "Oxygen's markup — our rule restyles it"
        else:
            verdict = 'applied at run time or by the template'
        print(f'    {name:<28} {j:<4} {t:<5} {h:<5} {verdict}')

    print()
    print(f'{len(candidates)} deletion candidates, {len(used_bare)} classes '
          'with no rule.')
    print()
    print('Both lists are relative to the material you pointed at. A rule with')
    print('no evidence here may still be earning its keep in a publication')
    print('this run never saw, and a WebHelp feature switched off in this')
    print('build emits nothing for its class either. Point the script at every')
    print('source tree that matters before deleting anything.')


if __name__ == '__main__':
    main()
