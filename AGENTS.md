# www

Variable Land's homepage, at `variable.land`. [README.md](./README.md) is for people, [docs/development.md](./docs/development.md) holds the commands, and this file is for agents working in this repo.

The site is one static page. `astro build` renders `src/pages/index.astro` and the icon at `src/pages/favicon.svg.ts` into `dist/`. The Worker has no script: [wrangler.jsonc](./wrangler.jsonc) serves `dist/` as assets, and an unknown path gets Cloudflare's 404.

## Code

- The words are in `src/content.ts`, never in the page.
- The map is drawn at build time. `src/land/land.ts` defines the land: its hills, its seed and its contour levels. `src/land/contours.ts` traces it with marching squares, then simplifies and smooths each line. The same seed draws the same land on every build.
- The page sets the land under the Logo: `.sheet`'s `--place-x` and `--place-y` say where the summit sits on the sheet at each width, and the map's `--summit-x` and `--summit-y` say where it is on the land.
- The Logo is `src/logo.ts`: its shapes, its proportions, and the hull that clears the contour lines around it. Its green is the only hue on the page.
- Colors and font families come from `src/styles/tokens.css`, a copy of the brand guideline's `tokens/tokens.css`. Replace the whole file when the guideline changes; never edit it here. `src/styles/site.css` uses only its `--vland-*` properties. The page's two `theme-color` metas repeat `--vland-paper` for each theme.
- The fonts, Newsreader and Geist Mono, both under the SIL Open Font License, are self-hosted from Fontsource's packages: the latin subset, with Newsreader's optical-size axis, declared in `site.css` and preloaded by the page. The page loads nothing from another origin.
- Light and dark follow the system's `prefers-color-scheme`.
- The tools run by name through mise's PATH; the commands are in [docs/development.md](./docs/development.md#tasks). In a non-interactive shell mise's hook may not run: use `mise exec -- <command>`.

## Rules

- The repo is public. Nothing private goes into code, comments, commits or pull requests: no names, paths or data that are not the site's own.
- Docs and copy are in English, written for any harness: say "agents", not one tool's name.
- The page's words and design change only with the maintainer's approval, starting from an issue.
- A change to the page is done after checking the build in a browser at 1280, 834 and 390 wide, in light and in dark.
