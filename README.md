# www

Variable Land's homepage, at [variable.land](https://variable.land).

It is one static page: a map sheet with the contour lines of an invented land, the Logo on its summit and the name beside it as a place label. [Astro](https://astro.build) builds it into `dist/`, tracing the map as it builds, and a Worker with no script serves `dist/` as [static assets](https://developers.cloudflare.com/workers/static-assets/).

## Repository

- `src/pages/`: the homepage and its icon.
- `src/land/`: the land on the map and the tracer that draws its contour lines.
- `src/components/`: the map.
- `src/styles/`: the brand's tokens, the fonts and the page's styles.
- `docs/`: the [contributing](docs/contributing.md) and [development](docs/development.md) guides.

## Contributing

The [contributing guide](docs/contributing.md) covers issues and pull requests, and the [development guide](docs/development.md) covers setting up the repo and running its checks.

## License

[MIT](LICENSE).
