# Architecture

The repository contains a single client-side Angular 22 application. There is no backend, external
data source, or state-management dependency.

## Execution flow

1. `src/main.ts` bootstraps `App` using providers in `src/app/app.config.ts`.
2. `App` renders the page shell and a router outlet. `src/app/app.routes.ts` lazy-loads `Calculator`
   at the home route and redirects unknown paths there.
3. `src/app/calculator/calculator.ts` holds UI state in signals. Computed signals derive validated
   inputs, battle forecasts, opening comparisons, and conditional casualty distributions.
4. `src/app/probability/combat.ts` exposes framework-independent functions. It caches the six legal
   roll distributions and memoizes maximum-dice battle states by army counts.

The calculator uses native number/select controls and button events without an Angular form model.
Invalid army inputs hide forecasts and display validation feedback rather than running the engine.
Switching modes preserves the selections in each mode.

## Boundaries

| Location               | Responsibility                                                        |
| ---------------------- | --------------------------------------------------------------------- |
| `src/app/app.*`        | Page shell and routing integration tests.                             |
| `src/app/calculator/`  | Responsive UI, input validation, presentation, and interaction tests. |
| `src/app/probability/` | Pure combat calculations, bounded caches, and mathematical tests.     |
| `src/styles.css`       | Global theme, Tailwind v4 import, keyboard focus, and base styles.    |
| `public/`              | Static files copied to build assets.                                  |
| `angular.json`         | Build, server, test, and size budget configuration.                   |
| `.postcssrc.json`      | Tailwind PostCSS plugin configuration.                                |
| `docs/`                | Project documentation.                                                |

The engine validates its public combat inputs independently of the UI. Keep Angular imports and
formatting out of the combat calculations; fractional expectations must not be rounded before
they are combined. See [the probability model](probability-model.md) for the recurrence and strategy
assumptions, and [`AGENTS.md`](../AGENTS.md) for implementation conventions.
