# www

Variable Land's homepage, at variable.land.

[variable.land](https://variable.land) is one static page: a map sheet with the contour lines of an invented land, the Logo on its summit and the name beside it as a place label. [Astro](https://astro.build) builds it into `dist/`, tracing the map as it builds, and a Worker with no script serves `dist/` as [static assets](https://developers.cloudflare.com/workers/static-assets/).

## Repository

- `src/pages/`: the homepage, its icons and its Open Graph image.
- `src/land/`: the land on the map and the tracer that draws its contour lines.
- `src/og/`: the Open Graph image, drawn at build time.
- `src/components/`: the map.
- `src/brand/`: the brand guideline's tokens.
- `src/styles/`: the fonts and the page's styles.
- `public/`: `robots.txt` and `_headers`, copied as is.
- `docs/`: the [contributing](docs/contributing.md) and [development](docs/development.md) guides.

## Contributing

The [contributing guide](docs/contributing.md) covers issues and pull requests, and the [development guide](docs/development.md) covers setting up the repo and running its checks.

## License

[MIT](LICENSE).

<p align="center">
  <a href="https://variable.land"><img src="https://cdn.jsdelivr.net/npm/@variableland/brand@0.1.0/assets/logo.svg" width="20" alt="" align="top">&nbsp;&nbsp;Variable Land</a>
</p>
