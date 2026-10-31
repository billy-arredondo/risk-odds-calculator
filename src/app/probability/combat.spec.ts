import {
  battle,
  compareDice,
  conditionalRoll,
  MAX_ARMIES,
  percentagePartition,
  rollDistribution,
  strategy,
} from './combat';

describe('exact Risk combat', () => {
  // Counts indexed by attacking losses (0, 1, then 2).
  const references = [
    { a: 1, d: 1, counts: [15, 21], total: 36 },
    { a: 1, d: 2, counts: [55, 161], total: 216 },
    { a: 2, d: 1, counts: [125, 91], total: 216 },
    { a: 2, d: 2, counts: [295, 420, 581], total: 1296 },
    { a: 3, d: 1, counts: [855, 441], total: 1296 },
    { a: 3, d: 2, counts: [2890, 2611, 2275], total: 7776 },
  ];

  for (const { a, d, counts, total } of references) {
    it(`matches the reference distribution for ${a} vs ${d} dice`, () => {
      const roll = rollDistribution(a, d);
      expect(roll.totalOutcomes).toBe(total);
      expect(roll.outcomes.map((o) => o.count)).toEqual(counts);
      expect(roll.outcomes.reduce((sum, o) => sum + o.probability, 0)).toBeCloseTo(1, 14);
      expect(roll.expectedAttackerLoss + roll.expectedDefenderLoss).toBeCloseTo(Math.min(a, d));
    });
  }

  it('sorts without mutating input and awards both ties to the defender', () => {
    const attacker = [3, 6, 1];
    expect(compareDice(attacker, [3, 6])).toEqual({ attackerLoss: 2, defenderLoss: 0 });
    expect(attacker).toEqual([3, 6, 1]);
    expect(compareDice([6, 2, 5], [4, 6])).toEqual({ attackerLoss: 1, defenderLoss: 1 });
  });

  it('enumerates only defender outcomes for known attacker values', () => {
    const roll = conditionalRoll([6, 6, 6], 2);
    expect(roll.totalOutcomes).toBe(36);
    expect(roll.outcomes.map((o) => o.count)).toEqual([25, 10, 1]);
    expect(roll.expectedAttackerLoss).toBeCloseTo(1 / 3);
    expect(conditionalRoll([1], 2).outcomes).toEqual([
      { attackerLoss: 1, defenderLoss: 0, count: 36, probability: 1 },
    ]);
    expect(conditionalRoll([6], 1).expectedDefenderLoss).toBeCloseTo(5 / 6);
  });

  it('handles minimum armies and already conquered territories', () => {
    expect(battle(1, 5)).toEqual({
      conquest: 0,
      resistance: 1,
      expectedAttackerLoss: 0,
      expectedDefenderLoss: 0,
    });
    expect(battle(1, 0).conquest).toBe(1);
    expect(battle(5, 0).expectedAttackerLoss).toBe(0);
    const lastStand = battle(2, 1);
    expect(lastStand.conquest).toBeCloseTo(15 / 36, 14);
    expect(lastStand.expectedAttackerLoss).toBeCloseTo(21 / 36, 14);
    expect(lastStand.expectedDefenderLoss).toBeCloseTo(15 / 36, 14);
  });

  it('matches independently expanded small battles', () => {
    expect(battle(2, 2).conquest).toBeCloseTo((55 / 216) * (15 / 36), 14);
    expect(battle(2, 2).expectedAttackerLoss).toBeCloseTo(1 - (55 / 216) * (15 / 36), 14);
    expect(battle(2, 2).expectedDefenderLoss).toBeCloseTo((55 / 216) * (1 + 15 / 36), 14);
    expect(battle(3, 1).conquest).toBeCloseTo(125 / 216 + (91 / 216) * (15 / 36), 14);
    expect(battle(4, 2).conquest).toBeCloseTo(0.6559539998, 9);
  });

  it('keeps probabilities and casualties within physical bounds', () => {
    for (let a = 1; a <= 12; a++) {
      for (let d = 0; d <= 12; d++) {
        const result = battle(a, d);
        expect(result.conquest + result.resistance).toBe(1);
        expect(result.expectedAttackerLoss).toBeGreaterThanOrEqual(0);
        expect(result.expectedAttackerLoss).toBeLessThanOrEqual(a - 1 + 1e-12);
        expect(result.expectedDefenderLoss).toBeLessThanOrEqual(d + 1e-12);
        if (a > 1 && d > 0) {
          expect(result.conquest).toBeGreaterThanOrEqual(battle(a - 1, d).conquest);
          expect(result.conquest).toBeLessThanOrEqual(battle(a, d - 1).conquest);
        }
      }
    }
    expect(battle(MAX_ARMIES, MAX_ARMIES).conquest).toBeGreaterThan(0.5);
  });

  it('bases opening recommendations on worst-case territorial success', () => {
    for (let a = 2; a <= 10; a++) {
      for (let d = 1; d <= 10; d++) {
        const result = strategy(a, d);
        const attackWorst = (dice: number) =>
          Math.min(
            ...result.choices.filter((c) => c.attackingDice === dice).map((c) => c.conquest),
          );
        const defenseWorst = (dice: number) =>
          Math.min(
            ...result.choices.filter((c) => c.defendingDice === dice).map((c) => c.resistance),
          );
        for (const choice of result.choices) {
          expect(attackWorst(result.attackingDice) + 1e-12).toBeGreaterThanOrEqual(
            attackWorst(choice.attackingDice),
          );
          expect(defenseWorst(result.defendingDice) + 1e-12).toBeGreaterThanOrEqual(
            defenseWorst(choice.defendingDice),
          );
        }
        const max = result.choices.find(
          (c) => c.attackingDice === Math.min(3, a - 1) && c.defendingDice === Math.min(2, d),
        );
        expect(max?.conquest).toBeCloseTo(battle(a, d).conquest, 14);
      }
    }
    expect(strategy(4, 2).attackingDice).toBe(3);
    expect(strategy(4, 2).defendingDice).toBe(2);
    expect(strategy(1, 2).choices).toEqual([]);
    expect(strategy(5, 0).attackingDice).toBe(0);
  });

  it('rejects invalid inputs', () => {
    for (const value of [NaN, Infinity, 1.5, 0, -1, 201]) {
      expect(() => battle(value, 2)).toThrow(RangeError);
    }
    expect(() => battle(2, -1)).toThrow(RangeError);
    expect(() => battle(2, 201)).toThrow(RangeError);
    expect(() => rollDistribution(4, 2)).toThrow(RangeError);
    expect(() => rollDistribution(1, 0)).toThrow(RangeError);
    expect(() => conditionalRoll([], 1)).toThrow(RangeError);
    expect(() => conditionalRoll([7], 1)).toThrow(RangeError);
    expect(() => conditionalRoll([2.5], 1)).toThrow(RangeError);
  });

  it('rounds percentage partitions consistently', () => {
    expect(percentagePartition([1 / 3, 1 / 3, 1 / 3])).toEqual(['33.4%', '33.3%', '33.3%']);
    expect(percentagePartition([0, 1])).toEqual(['0.0%', '100.0%']);
    expect(() => percentagePartition([])).toThrow(RangeError);
    expect(() => percentagePartition([0.7, 0.5])).toThrow(RangeError);
    expect(() => percentagePartition([NaN])).toThrow(RangeError);
  });

  it('distinguishes preserving the territory from minimizing immediate defender casualties', () => {
    const result = strategy(4, 2);
    const one = result.choices.find((c) => c.attackingDice === 3 && c.defendingDice === 1)!;
    const two = result.choices.find((c) => c.attackingDice === 3 && c.defendingDice === 2)!;
    expect(two.resistance).toBeGreaterThan(one.resistance);
    expect(two.roll.expectedDefenderLoss).toBeGreaterThan(one.roll.expectedDefenderLoss);
    expect(result.defendingDice).toBe(2);
  });

  it('recovers all unconditional distributions by averaging conditional distributions', () => {
    for (const { a, d } of references) {
      const totals = [0, 0, 0];
      for (let code = 0; code < 6 ** a; code++) {
        const dice = Array.from({ length: a }, (_, i) => (Math.floor(code / 6 ** i) % 6) + 1);
        const roll = conditionalRoll(dice, d);
        expect(roll.outcomes.reduce((sum, o) => sum + o.probability, 0)).toBeCloseTo(1, 14);
        for (const outcome of roll.outcomes)
          totals[outcome.attackerLoss] += outcome.probability / 6 ** a;
      }
      for (const outcome of rollDistribution(a, d).outcomes) {
        expect(totals[outcome.attackerLoss]).toBeCloseTo(outcome.probability, 13);
      }
    }
  });
});
