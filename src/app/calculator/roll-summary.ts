import { Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../i18n/language';
import { RollDistribution } from '../probability/combat';
import { AnimatedPartition } from './animated-partition';
import { rollResults } from './roll-outcome';

@Component({
  selector: 'app-roll-summary',
  templateUrl: './roll-summary.html',
  styleUrl: './roll-summary.css',
})
export class RollSummary {
  protected readonly i18n = inject(LanguageService);
  readonly distribution = input.required<RollDistribution>();

  protected readonly results = computed(() => rollResults(this.distribution()).results);
  protected readonly animatedResults = new AnimatedPartition(() =>
    this.results().map((result) => result.probability),
  );
}
