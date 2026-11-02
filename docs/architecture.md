# Architecture

The repository contains a single client-side Angular 22 application. There is no backend, external
data source, or state-management dependency.

## Execution flow

1. `src/main.ts` bootstraps `App` using providers in `src/app/app.config.ts`.
2. `App` renders the page shell and a router outlet. `src/app/app.routes.ts` lazy-loads `Calculator`
   at the home route and redirects unknown paths there.
3. `src/app/calculator/calculator/calculator.ts` switches between `TerritoryBattle`, `IndividualRoll`,
   and `DiceRoller`. Each view owns its state in signals; computed signals derive validated inputs,
   battle forecasts, opening comparisons, and roll distributions. All three views stay mounted
   while switching so their selections and simulator result are retained.
4. `src/app/probability/combat.ts` exposes framework-independent functions. It caches the six legal
   roll distributions and memoizes maximum-dice battle states by army counts.
5. `src/app/i18n/` contains typed English and Spanish messages and a shared signal-based language
   service. It remembers the selection in browser storage when available, updates document language
   and metadata, and formats displayed numbers without changing probability calculations.
6. `src/app/theme/` stores the light or dark theme in a shared signal, applies it to the document
   root, and persists the choice in browser storage when available. Light is the default.

The calculator uses native number and radio controls and button events without an Angular form model.
Invalid army inputs hide forecasts and display validation feedback rather than running the engine.
`DiceCountSelector` is shared by the individual-roll analysis and the simulator; `RollSummary` and
the helpers in `calculator/shared/` reuse outcome presentation and dice graphics across views.

The simulator generates one random roll for each side, sorts the dice, and delegates casualty
comparison to `compareDice` in the probability engine. Its pre-roll odds still come from exact
enumeration. Changing a dice count clears the result and cancels any pending reveal. The result is
announced to assistive technology; reduced motion skips the delayed roll animation. Responsive mode
navigation retains complete accessible labels even when inactive labels are hidden on small screens.

## Boundaries

| Location               | Responsibility                                                        |
| ---------------------- | --------------------------------------------------------------------- |
| `src/app/app.*`        | Page shell and routing integration tests.                             |
| `src/app/calculator/`  | Responsive UI, input validation, presentation, and interaction tests. |
| `src/app/probability/` | Pure combat calculations, bounded caches, and mathematical tests.     |
| `src/app/i18n/`        | Runtime language selection, message catalogs, and locale formatting.  |
| `src/app/theme/`       | Persistent light and dark theme selection.                            |
| `src/styles.css`       | Global theme, Tailwind v4 import, keyboard focus, and base styles.    |
| `public/`              | Static files copied to build assets.                                  |
| `angular.json`         | Build, server, test, and size budget configuration.                   |
| `.postcssrc.json`      | Tailwind PostCSS plugin configuration.                                |
| `docs/`                | Project documentation.                                                |

The engine validates its public combat inputs independently of the UI. Keep Angular imports and
formatting out of the combat calculations; fractional expectations must not be rounded before
they are combined. See [the probability model](probability-model.md) for the recurrence and strategy
assumptions, and [`AGENTS.md`](../AGENTS.md) for implementation conventions.
