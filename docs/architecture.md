# Current architecture

The repository contains a single Angular application. It is at an early stage: it displays the
Angular starter page, has no routes defined, and does not yet implement probability calculations.

## Bootstrap and navigation

1. `src/main.ts` bootstraps the root `App` component using `bootstrapApplication`.
2. `src/app/app.config.ts` configures the application providers and router.
3. `src/app/app.routes.ts` contains the currently empty route list.
4. `src/app/app.ts` defines the root component, which uses `app.html`, `app.css`, and `RouterOutlet`.

## Files and tools

| Location          | Responsibility                                            |
| ----------------- | --------------------------------------------------------- |
| `src/app/`        | Application components, configuration, routes, and tests. |
| `src/styles.css`  | Global styles and Tailwind CSS v4 import.                 |
| `public/`         | Static files copied to the build assets.                  |
| `angular.json`    | Build, server, test, and size budget configuration.       |
| `.postcssrc.json` | Tailwind PostCSS plugin configuration.                    |
| `docs/`           | Project documentation.                                    |

Implementation conventions for agents are maintained in [`AGENTS.md`](../AGENTS.md).
