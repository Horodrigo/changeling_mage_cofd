# Changeling style raster sources

These PNG and WebP files are the high-resolution source artwork for the botanical frame,
masthead, selected-tab texture, hand-inked rules, and dividers used by the
Changeling sheet. They combine user-provided artwork with an Attributes ornament
generated from the approved visual reference. They are retained here so the
optimized public assets can be rebuilt.

The maintained implementation history, asset inventory, and reuse guidance for
other game lines are documented in `docs/sheet-stylization-guide.md`.

Run:

```text
python scripts/build-changeling-style-assets.py
```

The script crops transparent margins, removes accidental checkerboards or paper
from extracted green ink, and writes optimized WebP files under
`public/changeling/style/`. Transparent ornaments are lossless; the opaque tab
texture uses high-quality lossy WebP.
