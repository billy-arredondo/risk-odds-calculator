# Development and testing

Run commands from the repository root.

## Requirements and installation

- The project specifies npm 12.0.2 as its package manager.
- The Angular CLI version locked in `package-lock.json` requires Node.js `^22.22.3`,
  `^24.15.0`, or `>=26.0.0`.

Install the locked dependencies:

```bash
npm ci
```

## Development server

```bash
npm start
```

The application is available at [http://localhost:4200/](http://localhost:4200/) and reloads when
source files change.

## Build

```bash
npm run build
```

The build uses the production configuration and writes files to `dist/`. The budgets configured in
`angular.json` warn at 500 kB for the initial bundle and 4 kB per component stylesheet, and fail
at 1 MB and 8 kB, respectively.

To rebuild continuously using the development configuration:

```bash
npm run watch
```

## Tests

Tests use Vitest and run in Node.js with jsdom by default:

```bash
# Run the suite once
npx ng test --watch=false

# Run one file
npx ng test --watch=false --include=src/app/app.spec.ts

# Filter by suite or test name
npx ng test --watch=false --filter="should create the app"
```

In the current PowerShell environment, `npm test -- ...` interprets options as npm arguments;
use the `npx ng test` commands above to pass options to Angular.

The project has no configured lint or end-to-end (e2e) targets.
