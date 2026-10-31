# Risk Odds Calculator

An Angular 22 calculator for classic Risk combat, using exhaustive dice enumeration and memoized
territorial battle probabilities rather than Monte Carlo simulation.

## Features

- Forecast conquest, resistance, and expected casualties from total territory army counts.
- Compare all legal opening dice choices and their immediate and full-battle tradeoffs.
- Analyze known attacker dice against every possible defender roll, with explicit pre-roll rules.
- Use responsive counters and dice selectors on mobile or desktop, without a backend.

Battle forecasts assume maximum legal dice on every roll and attacks continuing until conquest or
only one attacking army remains. Inputs support up to 200 armies per side. Known-attacker analysis
is hypothetical: the defender must choose dice before seeing the attacker’s results.

## Quick start

With Node.js and npm installed, run the following from the repository root:

```bash
npm ci
npm start
```

Open [http://localhost:4200/](http://localhost:4200/).

## Documentation

- [Development and testing](docs/development.md): requirements, commands, and available checks.
- [Architecture](docs/architecture.md): current application structure and execution flow.
- [Probability model](docs/probability-model.md): rules, recurrence, reference values, and strategy scope.
- [AGENTS.md](AGENTS.md): instructions for coding agents.
