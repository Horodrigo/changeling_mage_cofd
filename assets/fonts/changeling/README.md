# Changeling sheet fonts

The browser assets in `public/fonts/changeling/` are modified builds of EB Garamond 12 by Georg Duffner. The source fonts and the SIL Open Font License 1.1 are kept here so the webfonts can be reproduced and redistributed with their required notice.

Run from the repository root:

```text
python scripts/build-changeling-fonts.py
```

The script requires `fonttools` and `brotli`. It produces the Regular, Italic, and Small Caps WOFF2 files consumed by the Changeling-only stylesheet. Mage does not load or use this family.
