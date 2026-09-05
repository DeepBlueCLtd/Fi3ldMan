#!/usr/bin/env python3
"""Which outputclasses does each publication use, and can one template serve them all?

`pub-5/audit-classes.py` answers "what does this publication need from this
template". This answers the question that comes before adopting a shared
template: **what does each publication ask for, and does the candidate template
have a rule for every one of them?**

    python publications/compare-classes.py

With no arguments it compares every publication under `publications/` against
pub-5's `template-2026` — the template the Oxygen 28 upgrade produced, and the
proposed common one. Name publications explicitly to narrow it:

    python publications/compare-classes.py pub-5 pub-10
    python publications/compare-classes.py --template publications/pub-5/template-2024

Three sections come out:

  BY PUBLICATION      every outputclass each publication uses, with its count,
                      and whether the candidate template has a rule for it.
                      SHARED / <pub>-ONLY says who would notice if a rule went.

  NOT STYLED          an outputclass some publication uses that the candidate
                      template defines no rule for. Each one is either a
                      migration blocker or a hook something other than CSS
                      reads — the report cannot tell which, so it says where
                      to look. `gram-config` is the standing example: it marks
                      the table gramframe.bundle.js reads, and wants no CSS.

  STYLED BY NOBODY    a rule in the candidate template that no publication in
                      this run asks for by outputclass. Same caveat as
                      audit-classes.py: most of f13ldman.css restyles Oxygen's
                      own markup rather than serving an outputclass, so run
                      audit-classes.py for the js/tmpl/html evidence columns
                      before reading any of these as dead.

Two things this deliberately does not do. It does not apply the ditaval, so a
class only reachable through filtered-out content still counts as used — which
is the safe direction for a keep/delete decision. And it reads `outputclass`
only: that is the one DITA attribute that becomes an HTML class, but a class
can still reach the page from a script, the page templates, or Oxygen itself.

Standard library only, and it reuses audit-classes.py rather than re-deriving
the CSS parsing — that parser has bugs already found and fixed in it (comments
swallowing selectors, @media eating the rest of the file) and there is no
reason to grow a second copy of them.
"""

import argparse
import importlib.util
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
AUDIT = HERE / 'pub-5' / 'audit-classes.py'
DEFAULT_TEMPLATE = HERE / 'pub-5' / 'template-2026'


def load_audit():
    """Import audit-classes.py, whose hyphen keeps it off the import path."""
    if not AUDIT.exists():
        sys.exit(f'cannot find the audit script: {AUDIT}')
    spec = importlib.util.spec_from_file_location('audit_classes', AUDIT)
    module = importlib.util.module_from_spec(spec)
    sys.dont_write_bytecode = True
    spec.loader.exec_module(module)
    return module


def publication_dirs(names):
    """`pub-10` or a path, resolved to (label, dita directory) pairs."""
    found = []
    for name in names:
        path = Path(name)
        if not path.exists():
            path = HERE / name
        if not path.exists():
            sys.exit(f'no such publication: {name}')
        dita = path / 'dita' if (path / 'dita').is_dir() else path
        found.append((path.name, dita))
    return found


def discover():
    return sorted(p.name for p in HERE.iterdir()
                  if (p / 'dita').is_dir() or
                  (p.is_dir() and any(p.glob('**/*.ditamap'))))


def main():
    ap = argparse.ArgumentParser(
        description=__doc__.splitlines()[0],
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    ap.add_argument('publication', nargs='*',
                    help='publication folder name or path (default: all of them)')
    ap.add_argument('--template', type=Path, default=DEFAULT_TEMPLATE,
                    help='the candidate shared template holding the CSS '
                         '(default: pub-5/template-2026)')
    args = ap.parse_args()

    audit = load_audit()

    if not args.template.exists():
        sys.exit(f'no such template: {args.template}')
    css = audit.files(args.template, {'.css'})
    if not css:
        sys.exit(f'no stylesheets found under: {args.template}')
    defined = audit.defined_classes(css)

    pubs = publication_dirs(args.publication or discover())

    usage = {}
    for label, dita_dir in pubs:
        paths = audit.files(dita_dir, {'.dita', '.ditamap'})
        counts, where = audit.used_in_source(paths)
        usage[label] = {'counts': counts, 'where': where, 'files': len(paths)}

    live = [(label, dita) for label, dita in pubs if usage[label]['counts']]
    if not live:
        sys.exit('no outputclass attributes found in any publication given')

    labels = [label for label, _ in live]
    rel = args.template.relative_to(HERE.parent) \
        if args.template.is_relative_to(HERE.parent) else args.template

    # Column widths follow the longest publication name, so `legacy-regions`
    # does not push the counts out of line.
    pub_w = max(len(l) for l in labels) + 2

    print(f'candidate template: {rel} — {len(css)} stylesheets, '
          f'{len(defined)} classes with rules')
    for label in labels:
        info = usage[label]
        print(f'  {label:<{pub_w}} {info["files"]:>3} source files, '
              f'{len(info["counts"]):>3} distinct outputclasses')
    print()

    every = sorted({n for label in labels for n in usage[label]['counts']})
    width = max(len(n) for n in every) + 2

    # The reach column only says anything with more than one publication to
    # compare; against a single one every class is trivially "shared".
    many = len(labels) > 1

    print('BY PUBLICATION')
    print('  Every outputclass in the source. "styled" is whether the candidate')
    print('  template has a rule for it.'
          + ('  "reach" is who would notice its loss.' if many else ''))
    print()
    header = f'    {"class":<{width}}' + ''.join(f'{l:>{pub_w}}' for l in labels)
    print(header + f'  {"styled":<6}' + ('  reach' if many else ''))
    users_of = {}
    for name in every:
        users = [l for l in labels if name in usage[l]['counts']]
        users_of[name] = users
        cells = ''.join(
            f'{usage[l]["counts"].get(name, 0) or "-":>{pub_w}}' for l in labels)
        styled = 'yes' if name in defined else 'NO'
        reach = ''
        if many:
            if len(users) == len(labels):
                reach = '  SHARED'
            elif len(users) == 1:
                reach = f'  {users[0].upper()}-ONLY'
            else:
                reach = '  ' + ' + '.join(u.upper() for u in users)
        print(f'    {name:<{width}}{cells}  {styled:<6}{reach}')
    print()

    if many:
        shared = [n for n in every if len(users_of[n]) == len(labels)]
        print(f'  {len(shared)} shared, ' + ', '.join(
            f'{len([n for n in every if users_of[n] == [l]])} only in {l}'
            for l in labels) + '.')
        print()

    unstyled = [n for n in every if n not in defined]
    print(f'NOT STYLED BY THE CANDIDATE TEMPLATE — {len(unstyled)}')
    print('  Used in the source, no rule in the candidate. Either a rule to')
    print('  port before adopting it, or a hook read by something other than')
    print('  CSS — check the template scripts and XSLT before adding one.')
    if not unstyled:
        print('    none — the candidate styles every outputclass in every '
              'publication above.')
    for name in sorted(unstyled, key=lambda n: -sum(
            usage[l]['counts'].get(n, 0) for l in labels)):
        for label in users_of[name]:
            example = sorted(usage[label]['where'][name])[0]
            print(f'    {name:<{width}} {label:<{pub_w}} '
                  f'{usage[label]["counts"][name]:>4}x  e.g. {example}')
    print()

    orphans = sorted(n for n in defined if n not in every)
    print(f'STYLED BY NOBODY — {len(orphans)}')
    print('  A rule in the candidate that no publication here asks for by')
    print('  outputclass. Not a deletion list: run audit-classes.py for the')
    print('  js / tmpl / html evidence before treating any of these as dead.')
    print('   ', ', '.join(orphans) if orphans else 'none')
    print()

    print('Counts ignore the ditaval, so a class only reachable through')
    print('filtered-out content still reads as used — the safe direction when')
    print('deciding what to keep. Only `outputclass` is read; a class can also')
    print('reach the page from a script, the templates, or Oxygen itself.')


if __name__ == '__main__':
    try:
        main()
    except BrokenPipeError:
        # Piping into `head` closes the pipe early. Without this the
        # interpreter also complains again while flushing at exit.
        try:
            sys.stdout.close()
        finally:
            sys.exit(0)
