/** Exact outcome enumeration; probabilities are evaluated with double precision. */
export interface RollOutcome {
  readonly attackerLoss: number;
  readonly defenderLoss: number;
  readonly count: number;
  readonly probability: number;
}

export interface RollDistribution {
  readonly outcomes: readonly RollOutcome[];
  readonly totalOutcomes: number;
  readonly expectedAttackerLoss: number;
  readonly expectedDefenderLoss: number;
}

export interface BattleResult {
  readonly conquest: number;
  readonly resistance: number;
  readonly expectedAttackerLoss: number;
  readonly expectedDefenderLoss: number;
}

export interface OpeningChoice extends BattleResult {
  readonly attackingDice: number;
  readonly defendingDice: number;
  readonly roll: RollDistribution;
}

export interface Strategy {
  readonly attackingDice: number;
  readonly defendingDice: number;
  readonly choices: readonly OpeningChoice[];
}

// Bound synchronous work and memoization to a predictable size on mobile devices.
export const MAX_ARMIES = 200;

function integer(value: number, min: number, max: number, name: string): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}.`);
  }
}

function enumerate(count: number, visit: (dice: readonly number[]) => void): void {
  const dice: number[] = [];
  function next(): void {
    if (dice.length === count) {
      visit(dice);
      return;
    }
    for (let face = 1; face <= 6; face++) {
      dice.push(face);
      next();
      dice.pop();
    }
  }
  next();
}

export function compareDice(
  attacker: readonly number[],
  defender: readonly number[],
): { attackerLoss: number; defenderLoss: number } {
  integer(attacker.length, 1, 3, 'Attacking dice');
  integer(defender.length, 1, 2, 'Defending dice');
  [...attacker, ...defender].forEach((die) => integer(die, 1, 6, 'Die value'));
  const a = [...attacker].sort((x, y) => y - x);
  const d = [...defender].sort((x, y) => y - x);
  let attackerLoss = 0;
  let defenderLoss = 0;
  for (let i = 0; i < Math.min(a.length, d.length); i++) {
    if (a[i] > d[i]) defenderLoss++;
    else attackerLoss++;
  }
  return { attackerLoss, defenderLoss };
}

function distribution(
  attackers: readonly (readonly number[])[],
  defendingDice: number,
): RollDistribution {
  const counts = new Map<number, number>();
  for (const attacker of attackers) {
    enumerate(defendingDice, (defender) => {
      const { attackerLoss } = compareDice(attacker, defender);
      counts.set(attackerLoss, (counts.get(attackerLoss) ?? 0) + 1);
    });
  }
  const totalOutcomes = attackers.length * 6 ** defendingDice;
  const comparisons = Math.min(attackers[0].length, defendingDice);
  const outcomes = [...counts.entries()]
    .sort(([a], [b]) => a - b)
    .map(([attackerLoss, count]) => ({
      attackerLoss,
      defenderLoss: comparisons - attackerLoss,
      count,
      probability: count / totalOutcomes,
    }));
  return {
    outcomes,
    totalOutcomes,
    expectedAttackerLoss: outcomes.reduce((sum, o) => sum + o.attackerLoss * o.probability, 0),
    expectedDefenderLoss: outcomes.reduce((sum, o) => sum + o.defenderLoss * o.probability, 0),
  };
}

const rolls = new Map<string, RollDistribution>();

export function rollDistribution(attackingDice: number, defendingDice: number): RollDistribution {
  integer(attackingDice, 1, 3, 'Attacking dice');
  integer(defendingDice, 1, 2, 'Defending dice');
  const key = `${attackingDice}:${defendingDice}`;
  const cached = rolls.get(key);
  if (cached) return cached;
  const attackers: number[][] = [];
  enumerate(attackingDice, (dice) => attackers.push([...dice]));
  const result = distribution(attackers, defendingDice);
  rolls.set(key, result);
  return result;
}

/** Hypothetical analysis only: the defender must choose dice before seeing these values. */
export function conditionalRoll(
  attacker: readonly number[],
  defendingDice: number,
): RollDistribution {
  integer(attacker.length, 1, 3, 'Attacking dice');
  attacker.forEach((die) => integer(die, 1, 6, 'Die value'));
  integer(defendingDice, 1, 2, 'Defending dice');
  return distribution([attacker], defendingDice);
}

const battles = new Map<string, BattleResult>();

function continuation(a: number, d: number, roll: RollDistribution): BattleResult {
  let conquest = 0;
  let expectedAttackerLoss = 0;
  let expectedDefenderLoss = 0;
  for (const outcome of roll.outcomes) {
    const next = solve(a - outcome.attackerLoss, d - outcome.defenderLoss);
    conquest += outcome.probability * next.conquest;
    expectedAttackerLoss +=
      outcome.probability * (outcome.attackerLoss + next.expectedAttackerLoss);
    expectedDefenderLoss +=
      outcome.probability * (outcome.defenderLoss + next.expectedDefenderLoss);
  }
  conquest = Math.max(0, Math.min(1, conquest));
  return { conquest, resistance: 1 - conquest, expectedAttackerLoss, expectedDefenderLoss };
}

function solve(a: number, d: number): BattleResult {
  if (d === 0 || a === 1) {
    return {
      conquest: d === 0 ? 1 : 0,
      resistance: d === 0 ? 0 : 1,
      expectedAttackerLoss: 0,
      expectedDefenderLoss: 0,
    };
  }
  const key = `${a}:${d}`;
  const cached = battles.get(key);
  if (cached) return cached;
  const result = continuation(a, d, rollDistribution(Math.min(3, a - 1), Math.min(2, d)));
  battles.set(key, result);
  return result;
}

export function battle(attackingArmies: number, defendingArmies: number): BattleResult {
  integer(attackingArmies, 1, MAX_ARMIES, 'Attacking armies');
  integer(defendingArmies, 0, MAX_ARMIES, 'Defending armies');
  return solve(attackingArmies, defendingArmies);
}

/** Opening-roll maximin choice, followed by maximum-dice play on every later roll. */
export function strategy(attackingArmies: number, defendingArmies: number): Strategy {
  battle(attackingArmies, defendingArmies); // Validate both inputs, including terminal states.
  const choices: OpeningChoice[] = [];
  if (attackingArmies === 1 || defendingArmies === 0) {
    return { attackingDice: 0, defendingDice: 0, choices };
  }
  for (let a = 1; a <= Math.min(3, attackingArmies - 1); a++) {
    for (let d = 1; d <= Math.min(2, defendingArmies); d++) {
      const roll = rollDistribution(a, d);
      choices.push({
        attackingDice: a,
        defendingDice: d,
        roll,
        ...continuation(attackingArmies, defendingArmies, roll),
      });
    }
  }
  // The attacker cannot condition their choice on the defender's simultaneous choice.
  // Pick the best worst-case conquest chance; prefer more dice for numerical ties.
  let attackingDice = 1;
  let best = -1;
  for (let a = 1; a <= Math.min(3, attackingArmies - 1); a++) {
    const worst = Math.min(...choices.filter((c) => c.attackingDice === a).map((c) => c.conquest));
    if (worst >= best - 1e-12) {
      best = worst;
      attackingDice = a;
    }
  }
  // Independently choose the defense with the best worst-case resistance chance.
  let defendingDice = 1;
  best = -1;
  for (let d = 1; d <= Math.min(2, defendingArmies); d++) {
    const worst = Math.min(
      ...choices.filter((c) => c.defendingDice === d).map((c) => c.resistance),
    );
    if (worst >= best - 1e-12) {
      best = worst;
      defendingDice = d;
    }
  }
  return { attackingDice, defendingDice, choices };
}

/** Round a complete probability partition together so displayed percentages sum to 100%. */
export function percentagePartition(probabilities: readonly number[]): readonly string[] {
  if (
    probabilities.length === 0 ||
    probabilities.some((p) => !Number.isFinite(p) || p < 0 || p > 1) ||
    Math.abs(probabilities.reduce((sum, p) => sum + p, 0) - 1) > 1e-9
  ) {
    throw new RangeError('A probability partition must contain values from 0 to 1 summing to 1.');
  }
  const scaled = probabilities.map((p) => Math.max(0, Math.min(1, p)) * 1000);
  const units = scaled.map(Math.floor);
  const order = scaled
    .map((p, i) => i)
    .sort((a, b) => scaled[b] - units[b] - (scaled[a] - units[a]));
  const remainder = 1000 - units.reduce((sum, value) => sum + value, 0);
  for (let i = 0; i < remainder; i++) units[order[i % order.length]]++;
  return units.map((value) => `${(value / 10).toFixed(1)}%`);
}
