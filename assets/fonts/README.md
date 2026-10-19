# Bundled fonts

Inter and Teko are bundled from the official Google Fonts repository, not fetched
by Next.js during builds. Each font directory includes its upstream OFL license.
The existing Persian font assets are unchanged.

| Asset | Upstream source | Variable axes | SHA-256 |
| --- | --- | --- | --- |
| `inter/Inter-Variable.ttf` | `https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz,wght%5D.ttf` | weight 100–900; optical size 14–32 | `29160a80ff49ddcab2c97711247e08b1fab27a484a329ce8b813d820dc559031` |
| `teko/Teko-Variable.ttf` | `https://raw.githubusercontent.com/google/fonts/main/ofl/teko/Teko%5Bwght%5D.ttf` | weight 300–700 | `d1321889f262bbbff632e7976349853399cd097b6f382d4b19790c915c13c1ae` |

Retrieved October 19, 2026. These are the original font families, normal style,
with their full weight ranges and character sets (not replacement fonts).
`--font-inter` and `--font-teko` are preserved by `next/font/local`.