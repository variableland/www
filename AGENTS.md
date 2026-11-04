# www

Variable Land's homepage, at `variable.land`. [README.md](./README.md) is for people, [docs/development.md](./docs/development.md) holds the commands, and this file is for agents working in this repo.

The site is one static page. `astro build` renders `src/pages/index.astro`, its icons (`favicon.svg`, `apple-touch-icon.png`) and its Open Graph image (`og.png`) from `src/pages/` into `dist/`, with `public/robots.txt` and `public/_headers` copied as is. The Worker has no script: [wrangler.jsonc](./wrangler.jsonc) serves `dist/` as assets with the headers `_headers` sets, and an unknown path gets Cloudflare's 404.

## Code

- The words are in `src/content.ts`, never in the page.
- The brand comes from the `@variableland/brand` package, never copied here: its `tokens.css` and `tokens.json`, the Logo (`assets/logo.svg`) and the Map (`assets/land/`). A change to any of them is a new version of the package, bumped here. `src/variableland-brand.d.ts` types the two exports of `assets/land/land.mjs` the site uses.
- The page inlines the Map, `assets/land/map.svg`, with its Clearing and its own styles, and sets it under the Logo: `.sheet`'s `--place-x` and `--place-y` say where the summit sits on the sheet at each width, and `--summit-x` and `--summit-y`, from the package's `top`, say where it is on the land.
- `src/logo.ts` reads the Logo's proportions from `assets/logo.svg` and places it with the attributes each use needs. Its green is the only hue on the page.
- The name's cap height centers on the Logo: `.place-name` moves down 0.143em beside it, and not on a phone, where the name sits under the Logo.
- `src/styles/site.css` uses only the `--vland-*` properties of the package's `tokens.css`: each text sets the `--vland-type-<step>-*` values of its step (`place`, `statement`, `link`, `label`, `body`), and the tokens resize the steps at 1023px and 640px. Code that needs a value outside CSS, such as the `theme-color` metas and the images, reads `tokens.json`.
- The fonts, Newsreader and Geist Mono, both under the SIL Open Font License, are self-hosted from Fontsource's packages: the latin subset, with Newsreader's optical-size axis, declared in `site.css` and preloaded by the page. The page loads nothing from another origin.
- Light and dark follow the system's `prefers-color-scheme`.
- The head carries the description, the canonical URL, Open Graph and `twitter:card` tags with absolute URLs from `site` in `astro.config.mjs`, and the icons. There is no sitemap: the site is one URL.
- `og.png` is drawn at build time by `src/og/`, in the dark theme: the Map (the package's `mapPaths()`) full bleed, with the Logo on its Clearing and the name as the Place at the center, on `paper`. The Place is the page's desktop Place at 1.15×; the name sits 0.158em lower than its box, as the approved design measured it, on a whole-pixel baseline, as a browser sets it. The name is shaped with HarfBuzz (harfbuzzjs) at the page's own instance, weight 500 at the optical size of its pixel size, so its kerning varies with the instance as the browser's does, and drawn as the glyphs' outlines; an image renderer that sets type from a variable font uses its default instance, the 16pt text cut. sharp rasterizes the SVG.
- The tools run by name through mise's PATH; the commands are in [docs/development.md](./docs/development.md#tasks). In a non-interactive shell mise's hook may not run: use `mise exec -- <command>`.

## Rules

- The repo is public. Nothing private goes into code, comments, commits or pull requests: no names, paths or data that are not the site's own.
- Docs and copy are in English, written for any harness: say "agents", not one tool's name.
- The page's words and design change only with the maintainer's approval, starting from an issue.
- A change to the page is done after checking the build in a browser at 1280, 834 and 390 wide, in light and in dark.
