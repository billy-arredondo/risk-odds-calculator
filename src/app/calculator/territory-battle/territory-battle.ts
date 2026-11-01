import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language';
import { battle, MAX_ARMIES, percentagePartition, strategy } from '../../probability/combat';
import { AnimatedPartition } from '../shared/animated-partition';

@Component({
  selector: 'app-territory-battle',
  templateUrl: './territory-battle.html',
  styleUrl: './territory-battle.css',
})
export class TerritoryBattle {
  protected readonly i18n = inject(LanguageService);
  protected readonly attacker = signal('10');
  protected readonly defender = signal('7');
  protected readonly maxArmies = MAX_ARMIES;
  protected readonly armies = computed(() => {
    const a = Number(this.attacker());
    const d = Number(this.defender());
    if (
      !this.attacker().trim() ||
      !this.defender().trim() ||
      !Number.isInteger(a) ||
      !Number.isInteger(d) ||
      a < 1 ||
      d < 0 ||
      a > MAX_ARMIES ||
      d > MAX_ARMIES
    )
      return null;
    return { a, d };
  });
  protected readonly forecast = computed(() => {
    const armies = this.armies();
    return armies ? battle(armies.a, armies.d) : null;
  });
  protected readonly recommendation = computed(() => {
    const armies = this.armies();
    if (!armies) return null;
    const result = strategy(armies.a, armies.d);
    return {
      ...result,
      choices: result.choices.map((choice) => ({
        ...choice,
        percentages: percentagePartition([choice.conquest, choice.resistance]),
      })),
    };
  });
  protected readonly battlePercentages = computed(() => {
    const result = this.forecast();
    return result ? percentagePartition([result.conquest, result.resistance]) : [];
  });
  protected readonly animatedBattle = new AnimatedPartition(() => {
    const result = this.forecast();
    return result ? [result.conquest, result.resistance] : [];
  });
  protected updateArmy(side: 'attacker' | 'defender', event: Event): void {
    const input = event.target;
    if (input instanceof HTMLInputElement) this[side].set(input.value);
  }
  protected step(side: 'attacker' | 'defender', delta: number): void {
    const min = side === 'attacker' ? 1 : 0;
    const current = Number(this[side]());
    this[side].set(
      String(
        Math.max(min, Math.min(MAX_ARMIES, (Number.isFinite(current) ? current : min) + delta)),
      ),
    );
  }
}
