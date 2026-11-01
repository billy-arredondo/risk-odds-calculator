import { Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../i18n/language';
import { percentagePartition, RollDistribution } from '../probability/combat';

@Component({
  selector: 'app-roll-results',
  templateUrl: './roll-results.html',
  styleUrl: './roll-results.css',
})
export class RollResults {
  protected readonly i18n = inject(LanguageService);
  readonly distribution = input.required<RollDistribution>();
  readonly attackerValues = input.required<readonly number[]>();

  protected readonly results = computed(() => {
    const distribution = this.distribution();
    const comparisons = this.comparisons();
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
    return outcomes.map((outcome, index) => ({
      ...outcome,
      percentage: percentages[index],
      mostLikely: outcome.count === highest,
      kind:
        outcome.attackerLoss === 0 ? 'defender' : outcome.defenderLoss === 0 ? 'attacker' : 'both',
    }));
  });

  protected readonly casualtyRows = computed(() => {
    const outcomes = this.distribution().outcomes;
    const attacker = percentagePartition(
      [0, 1, 2].map((loss) =>
        outcomes.filter((o) => o.attackerLoss === loss).reduce((sum, o) => sum + o.probability, 0),
      ),
    );
    const defender = percentagePartition(
      [0, 1, 2].map((loss) =>
        outcomes.filter((o) => o.defenderLoss === loss).reduce((sum, o) => sum + o.probability, 0),
      ),
    );
    return [0, 1, 2].map((loss) => ({ loss, attacker: attacker[loss], defender: defender[loss] }));
  });

  protected readonly comparisons = computed(() => {
    const first = this.distribution().outcomes[0];
    return first.attackerLoss + first.defenderLoss;
  });
}
