# www

Variable Land's homepage, at `variable.land`. [README.md](./README.md) is for people, [docs/development.md](./docs/development.md) holds the commands, and this file is for agents working in this repo.

The site is one static page. `astro build` renders `src/pages/index.astro`, its icons (`favicon.svg`, `apple-touch-icon.png`) and its Open Graph image (`og.png`) from `src/pages/` into `dist/`, with `public/robots.txt` and `public/_headers` copied as is. The Worker has no script: [wrangler.jsonc](./wrangler.jsonc) serves `dist/` as assets with the headers `_headers` sets, and an unknown path gets Cloudflare's 404.

## Code

- The words are in `src/content.ts`, never in the page.
- The map is drawn at build time. `src/land/land.ts` defines the land: its hills, its seed and its contour levels. `src/land/contours.ts` traces it with marching squares, then simplifies and smooths each line. The same seed draws the same land on every build. It is the land of Variable Land's brand guideline v1, `assets/land/land.mjs`: its numbers change there first, and the paths traced here stay the same as the guideline's `assets/land/map.svg`.
- The page sets the land under the Logo: `.sheet`'s `--place-x` and `--place-y` say where the summit sits on the sheet at each width, and the map's `--summit-x` and `--summit-y` say where it is on the land.
- The Logo is `src/logo.ts`: its shapes, its proportions, and the hull that clears the contour lines around it. Its green is the only hue on the page. The Clearing, that hull grown by 40% on the summit, is `clearingTransform` in `src/land/land.ts`, the same on the page and in the Open Graph image.
- The name's cap height centers on the Logo: `.place-name` moves down 0.143em beside it, and not on a phone, where the name sits under the Logo.
- Colors, font families and the type steps come from `src/brand/`: `tokens.css` and `tokens.json`, verbatim copies of `tokens/` from Variable Land's brand guideline, v1. Replace both files when the guideline changes; never edit them here. `src/styles/site.css` uses only the `--vland-*` properties of `tokens.css`: each text sets the `--vland-type-<step>-*` values of its step (`place`, `statement`, `link`, `label`, `body`), and the tokens resize the steps at 1023px and 640px. Code that needs a value outside CSS, such as the `theme-color` metas, the favicon and the images, reads `tokens.json`.
- The fonts, Newsreader and Geist Mono, both under the SIL Open Font License, are self-hosted from Fontsource's packages: the latin subset, with Newsreader's optical-size axis, declared in `site.css` and preloaded by the page. The page loads nothing from another origin.
- Light and dark follow the system's `prefers-color-scheme`.
- The head carries the description, the canonical URL, Open Graph and `twitter:card` tags with absolute URLs from `site` in `astro.config.mjs`, and the icons. There is no sitemap: the site is one URL.
- `og.png` is drawn at build time by `src/og/`: the Map with the Logo on its Clearing and the name as the Place, on `paper`. The Place is the page's desktop Place at 1.3×, centered, so it fits the centered square some apps crop the image to. The name's cap middle sits on the Logo's center, measured on the drawn instance's own "H": the font's static cap height is the 16pt cut's, about 6% short at the display sizes. The name is drawn as outlines from Newsreader's variable font at the page's own instance (weight 500 and the optical size of its pixel size), with fontkit, since an image renderer that sets type from a variable font uses its default instance, the 16pt text cut. sharp rasterizes the SVG.
- The tools run by name through mise's PATH; the commands are in [docs/development.md](./docs/development.md#tasks). In a non-interactive shell mise's hook may not run: use `mise exec -- <command>`.

## Rules

- The repo is public. Nothing private goes into code, comments, commits or pull requests: no names, paths or data that are not the site's own.
- Docs and copy are in English, written for any harness: say "agents", not one tool's name.
- The page's words and design change only with the maintainer's approval, starting from an issue.
- A change to the page is done after checking the build in a browser at 1280, 834 and 390 wide, in light and in dark.
