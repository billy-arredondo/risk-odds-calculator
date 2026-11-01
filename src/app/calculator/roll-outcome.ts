import { percentagePartition, RollDistribution } from '../probability/combat';

export type RollResultKind = 'attacker' | 'defender' | 'both';

export interface RollResult {
  readonly attackerLoss: number;
  readonly defenderLoss: number;
  readonly count: number;
  readonly probability: number;
  readonly percentage: string;
  readonly mostLikely: boolean;
  readonly kind: RollResultKind;
}

export interface RollResultsData {
  readonly results: readonly RollResult[];
  readonly comparisons: number;
}

export function rollResults(distribution: RollDistribution): RollResultsData {
  const first = distribution.outcomes[0];
  const comparisons = first.attackerLoss + first.defenderLoss;
  const outcomes = Array.from(
    { length: comparisons + 1 },
    (_, attackerLoss) =>
      distribution.outcomes.find((outcome) => outcome.attackerLoss === attackerLoss) ?? {
        attackerLoss,
        defenderLoss: comparisons - attackerLoss,
        count: 0,
        probability: 0,
      },
  );
  const percentages = percentagePartition(outcomes.map((outcome) => outcome.probability));
  const highest = Math.max(...outcomes.map((outcome) => outcome.count));
  const results = outcomes.map((outcome, index) => ({
    ...outcome,
    percentage: percentages[index],
    mostLikely: outcome.count === highest,
    kind: (outcome.attackerLoss === 0
      ? 'attacker'
      : outcome.defenderLoss === 0
        ? 'defender'
        : 'both') as RollResultKind,
  }));
  return { results, comparisons };
}
