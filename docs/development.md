# Development

How to work on www in a clone. The [contributing guide](contributing.md) covers how a change gets in.

## Layout

- `src/pages/`: the homepage, its icons and its Open Graph image.
- `src/og/`: the Open Graph image, drawn at build time.
- `src/styles/`: the fonts and the page's styles.
- `src/content.ts` and `src/logo.ts`: the page's words and the Logo.
- `src/variableland-brand.d.ts`: types for what the site imports from `@variableland/brand`, which holds the tokens, the Logo and the Map.
- `public/`: files copied as is: `robots.txt` and `_headers`.
- `docs/`: these two guides.
- `wrangler.jsonc`: how the Worker serves `dist/`.
- `lefthook.yml` and `lefthook/`: the git hooks.

## Setup

[mise](https://mise.jdx.dev) 2026.10.19 or later pins Node 24, pnpm 12 and [gitleaks](https://github.com/gitleaks/gitleaks) (`mise.toml`, `mise.lock`) and puts `node_modules/.bin` on the PATH, so the tools run by name:

```sh
mise install   # Node, pnpm and gitleaks, at the versions mise.toml pins
pnpm install   # the dependencies, and the git hooks
```

In a shell where mise isn't activated, run them as `mise exec -- <command>`.

`pnpm install` also installs the git hooks: lefthook's postinstall writes them. With `CI` set, that postinstall skips them, so after a `CI=1 pnpm install` run `lefthook install` to add them.

## Tasks

```sh
astro dev                   # the site, rebuilt as you edit
rr check                    # format and lint with Biome, then types with astro check
rr jsc --fix                # apply Biome's fixes
astro build                 # the site, into dist/
wrangler dev                # dist/, served as the Worker serves it
wrangler deploy --dry-run   # the deploy, without deploying
```

`rr check` runs Biome, then `astro check` through `@rrlab/astro-plugin`, which type-checks `.astro` and `.ts` files. `rr tsc` runs only the type check.

## CI

- **On each commit:** the git hooks ([lefthook](https://lefthook.dev)) run `rr jsc --fix-staged` on the staged files, `rr tsc` when a TypeScript or `.astro` file or a tsconfig changes, and gitleaks on the staged changes, in parallel. `lefthook.yml` extends `base.yml`, the config `@rrlab/cli` ships, and then `lefthook/tsc.yml`, which adds `.astro` files to its `tsc` job. Its own `shared-hooks` job fails the commit, saying to run `pnpm install`, when `base.yml` is missing from `node_modules`. There is no pre-push hook: www has no tests.
- **On each pull request to `main`:** CI runs `pnpm rr check` and `pnpm astro build` with the tools mise pins, and beside them gitleaks scans the pull request's commits for secrets. CI's `Test` passes when both do. Workflow audit runs zizmor on the workflows as `Audit workflows`. `Test` and `Audit workflows` are the checks a pull request must pass.
- **On each push:** Workers Builds builds the branch. `main` deploys the site, and every other branch deploys its own Preview, as [Deploying](#deploying) says.
- **Every Monday:** a workflow runs `pnpm audit` on `pnpm-lock.yaml`, and keeps an issue labeled `dependency-audit` open while it finds known vulnerabilities (Dependency audit). Dependabot opens pull requests for security updates only, never for version updates.

## Deploying

The Worker is `variableland-www`, deployed with [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) (Git integration). It owns `variable.land` as a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), which `routes` in `wrangler.jsonc` claims on each production deploy, together with its DNS record.

Its build settings, under the Worker's Settings → Build, have two sets: Production, for `main`, and Previews Base, for every other branch.

| Setting        | Production                  | Previews Base                |
| -------------- | --------------------------- | ---------------------------- |
| Root directory | `/`                         | `/`                          |
| Build command  | `pnpm exec astro build`     | `pnpm exec astro build`      |
| Build variable | `NODE_VERSION` = `24`       | `NODE_VERSION` = `24`        |
| Deploy command | `pnpm exec wrangler deploy` | `pnpm exec wrangler preview` |

- Commands run through `pnpm exec`, never `npx`: `devEngines` in `package.json` makes npm refuse to run. Workers Builds installs the exact pnpm that `devEngines` names.
- The Build command is set in Workers Builds, not as `build.command` in `wrangler.jsonc`. Both `wrangler deploy` and `wrangler preview` would run `build.command` after Workers Builds' own Build command, so every build would run Astro twice.
- `NODE_VERSION` is there because Workers Builds doesn't read `mise.toml` or `mise.lock`. Without it, a build gets the build image's default Node.
- Each branch copies the Previews Base into its own trigger the first time it's pushed, so a change to the base applies only to branches pushed after it.
- `previews: {}` in `wrangler.jsonc` is required for the preview command. `preview_urls: true`, together with Preview turned on under the Worker's Domains → Worker URL, gives each branch its own Preview URL: `https://<branch>-variableland-www.<subdomain>.workers.dev`, with each `/` in the branch name turned into `-`.
