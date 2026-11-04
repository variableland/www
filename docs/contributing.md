# Contributing

www takes fixes to the site and its docs. To set up the repo and run its checks, see the [development guide](development.md).

## Issues

- A bug report names the URL and the browser, and says what you expected and what happened.
- A change to the page's words or design starts as an issue before any pull request.

## Pull requests

1. Branch from `main` with a prefix: `feat/`, `fix/`, `docs/`, `refactor/`, `ci/` or `chore/`.
2. Write commits as [Conventional Commits](https://www.conventionalcommits.org), such as `fix: keep the place name on one line at 320 wide`. The pull request title takes the same form, because it becomes the squash commit.
3. Run `rr check` and `astro build` before you push, and look at the page at 1280, 834 and 390 wide, in light and in dark.
4. Workers Builds deploys each pushed branch as a Preview, with its own URL: see [Deploying](development.md#deploying).

CI has to pass, and a maintainer squash-merges. A merge to `main` deploys the site.
