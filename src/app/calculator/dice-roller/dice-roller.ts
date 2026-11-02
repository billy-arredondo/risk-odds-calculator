import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language';
import { compareDice, rollDistribution } from '../../probability/combat';
import { DiceCountSelector } from '../dice-count-selector/dice-count-selector';
import { RollSummary } from '../roll-summary/roll-summary';
import { DICE_PIPS } from '../shared/dice-pips';

interface GeneratedRoll {
  readonly attacker: readonly number[];
  readonly defender: readonly number[];
  readonly attackerLoss: number;
  readonly defenderLoss: number;
}

@Component({
  selector: 'app-dice-roller',
  imports: [DiceCountSelector, RollSummary],
  templateUrl: './dice-roller.html',
  styleUrl: './dice-roller.css',
})
export class DiceRoller {
  private readonly i18n = inject(LanguageService);
  private timer: ReturnType<typeof setTimeout> | undefined;
  protected readonly messages = computed(() => this.i18n.messages());
  protected readonly attackingDice = signal(3);
  protected readonly defendingDice = signal(2);
  protected readonly rolling = signal(false);
  protected readonly result = signal<GeneratedRoll | null>(null);
  protected readonly pips = DICE_PIPS;
  protected readonly diceSlots = [0, 1, 2];
  protected readonly odds = computed(() =>
    rollDistribution(this.attackingDice(), this.defendingDice()),
  );
  protected readonly comparisons = computed(() => {
    const result = this.result();
    if (!result) return [];
    return result.attacker.slice(0, result.defender.length).map((attack, index) => {
      const defend = result.defender[index];
      return { attack, defend, tie: attack === defend, attackerLost: attack <= defend };
    });
  });
  protected readonly announcement = computed(() => {
    const t = this.messages();
    if (this.rolling()) return t.simulateRolling;
    const result = this.result();
    if (!result) return '';
    return [
      t.simulateValues(t.attacker, result.attacker.join(', ')),
      t.simulateValues(t.defender, result.defender.join(', ')),
      t.outcomeDescription(result.attackerLoss, result.defenderLoss),
      t.outcomeLosses(result.attackerLoss, result.defenderLoss),
    ].join('. ');
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cancelTimer());
  }

  protected changeCount(side: 'attacker' | 'defender', count: number): void {
    this.cancelTimer();
    this.rolling.set(false);
    this.result.set(null);
    (side === 'attacker' ? this.attackingDice : this.defendingDice).set(count);
  }

  protected roll(): void {
    this.cancelTimer();
    const dice = (count: number) =>
      Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
    const attacker = dice(this.attackingDice());
    const defender = dice(this.defendingDice());
    const result: GeneratedRoll = { attacker, defender, ...compareDice(attacker, defender) };
    this.result.set(null);
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      this.rolling.set(false);
      this.result.set(result);
      return;
    }
    this.rolling.set(true);
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.rolling.set(false);
      this.result.set(result);
    }, 1500);
  }

  private cancelTimer(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
  }
}
