# Repository guide

## Commands

- Use npm (`packageManager`: npm 12.0.2); install locked dependencies with `npm ci`.
- `npm start` serves the app at `http://localhost:4200/`; `npm run build` makes a production build in `dist/`.
- `npx ng test --watch=false` runs the Vitest suite once in Node/jsdom. For one file: `npx ng test --watch=false --include=src/app/app.spec.ts`; use `--filter="test name"` to select tests by name. In the current PowerShell environment, `npm test -- ...` passes flags to npm instead of Angular.
- There is no configured lint or e2e target.

## Application layout

- This is a single Angular application: `src/main.ts` bootstraps `App` with providers from `src/app/app.config.ts`; routes are in `src/app/app.routes.ts`.
- `public/` is copied into build assets. Global CSS imports Tailwind v4 in `src/styles.css`, with PostCSS configured in `.postcssrc.json`.
- Production builds enforce initial bundle budgets of 500 kB warning / 1 MB error and component-style budgets of 4 kB warning / 8 kB error.

## Project conventions

- Write all documentation in English, including documentation filenames.
- Use standalone components without explicitly setting `standalone: true` or `changeDetection: OnPush`; lazy-load feature routes. Use `host` metadata instead of `@HostBinding`/`@HostListener`.
- Use signals for state, `computed()` for derived values, `input()`/`output()`, and `inject()`. Prefer `@Service()` for new auto-provided singleton services.
- Prefer Signal Forms for new forms, otherwise reactive forms. Use native template control flow and class/style bindings instead of `*ngIf`/`*ngFor`, `ngClass`, or `ngStyle`.
- Use `NgOptimizedImage` for static images (except inline base64), and meet WCAG AA and AXE accessibility requirements.
- Write strict TypeScript; prefer `unknown` to `any`. Prettier uses 100-character lines, single quotes, and the Angular parser for HTML.
