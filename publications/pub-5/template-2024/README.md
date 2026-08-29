# template-2024

The pub-5 publishing template built in 2024 on the Oxygen 25.1 WebHelp
Responsive base. Superseded by `../template-2026/`, which is rebuilt on the
28.1 base; this one is kept because it is what `site/pub-5/oxygen-26/` — the
last known-good publish before the 28.1 move — was actually built with, and so
it is half of the before/after pair that makes that upgrade reviewable.

It lived at the repository root until the reorganisation, with a drifted
near-duplicate at `dita-parent/pub-5/template/`. The duplicate has been
deleted. This is the copy that survived, because:

- its `f13ldMan.opt` carries the `webhelp.logo.image` fix (an output-relative
  path, with `corp_logo.png` under `resources/` where the fileset copies it);
  the duplicate had the logo loose at the template root and no parameter,
- its `f13ldman.css` and `f13ldman_author_mode.css` carry rules the duplicate
  never got — the uncapped `.container-fluid`, the related-links padding and
  the suppressed current-page link,
- and it is the copy the `oxygen-26` publish was made from.

The two `corp_logo.png` files were byte-identical, so nothing was lost with the
duplicate.

Do not develop this template further. New work belongs in `template-2026/`;
this folder is a reference point.
