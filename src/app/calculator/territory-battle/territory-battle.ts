import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language';
import { battle, MAX_ARMIES, percentagePartition, strategy } from '../../probability/combat';
import { AnimatedPartition } from '../shared/animated-partition';
import { CalculatorStorage, integerBetween } from '../shared/calculator-storage';

@Component({
  selector: 'app-territory-battle',
  templateUrl: './territory-battle.html',
  styleUrl: './territory-battle.css',
})
export class TerritoryBattle {
  private readonly storage = inject(CalculatorStorage);
  protected readonly i18n = inject(LanguageService);
  protected readonly messages = computed(() => this.i18n.messages());
  protected readonly attacker = signal(
    String(this.storage.read('battle-attacker', 5, integerBetween(1, MAX_ARMIES))),
  );
  protected readonly defender = signal(
    String(this.storage.read('battle-defender', 3, integerBetween(0, MAX_ARMIES))),
  );
  protected readonly maxArmies = MAX_ARMIES;
  protected readonly attackerValid = computed(() => this.validArmy(this.attacker(), 1));
  protected readonly defenderValid = computed(() => this.validArmy(this.defender(), 0));
  private validArmy(value: string, min: number): boolean {
    const count = Number(value);
    return !!value.trim() && Number.isInteger(count) && count >= min && count <= MAX_ARMIES;
  }
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
    if (input instanceof HTMLInputElement) {
      this[side].set(input.value);
      if (this.validArmy(input.value, side === 'attacker' ? 1 : 0)) {
        this.storage.write(`battle-${side}`, Number(input.value));
      }
    }
  }
  protected step(side: 'attacker' | 'defender', delta: number): void {
    const min = side === 'attacker' ? 1 : 0;
    const current = Number(this[side]());
    this[side].set(
      String(
        Math.max(min, Math.min(MAX_ARMIES, (Number.isFinite(current) ? current : min) + delta)),
      ),
    );
    if (this.validArmy(this[side](), min))
      this.storage.write(`battle-${side}`, Number(this[side]()));
  }
}
