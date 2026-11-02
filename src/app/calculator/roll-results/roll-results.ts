import { Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../i18n/language';
import { percentagePartition, RollDistribution } from '../../probability/combat';
import { rollResults } from '../shared/roll-outcome';

@Component({
  selector: 'app-roll-results',
  templateUrl: './roll-results.html',
  styleUrl: './roll-results.css',
})
export class RollResults {
  protected readonly i18n = inject(LanguageService);
  protected readonly messages = computed(() => this.i18n.messages());
  readonly distribution = input.required<RollDistribution>();
  readonly attackerValues = input.required<readonly number[]>();

  protected readonly results = computed(() => rollResults(this.distribution()).results);

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

  protected readonly comparisons = computed(() => rollResults(this.distribution()).comparisons);
}
