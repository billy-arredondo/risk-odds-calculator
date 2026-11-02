import { Component, computed, inject, input, output } from '@angular/core';
import { LanguageService } from '../../i18n/language';

@Component({
  selector: 'app-dice-count-selector',
  templateUrl: './dice-count-selector.html',
  styleUrl: './dice-count-selector.css',
})
export class DiceCountSelector {
  readonly side = input.required<'attacker' | 'defender'>();
  readonly count = input.required<number>();
  readonly countChange = output<number>();
  private readonly injectLanguage = inject(LanguageService);
  protected readonly messages = computed(() => this.injectLanguage.messages());
  protected readonly options = computed(() => (this.side() === 'attacker' ? [1, 2, 3] : [1, 2]));
}
