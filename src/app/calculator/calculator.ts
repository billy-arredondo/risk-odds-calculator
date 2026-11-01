import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../i18n/language';
import { RollResults } from './roll-results';
import {
  battle,
  conditionalRoll,
  MAX_ARMIES,
  percentagePartition,
  rollDistribution,
  strategy,
} from '../probability/combat';

@Component({
  selector: 'app-calculator',
  imports: [RollResults],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  protected readonly i18n = inject(LanguageService);
  protected readonly mode = signal<'battle' | 'roll'>('battle');
  protected readonly attacker = signal('10');
  protected readonly defender = signal('7');
  protected readonly attackingDice = signal(3);
  protected readonly defendingDice = signal(2);
  protected readonly entryMode = signal<'descending' | 'free'>('descending');
  protected readonly freeFaces = signal<readonly number[]>([6, 4, 2]);
  protected readonly descendingFaces = signal<readonly (number | null)[]>([null, null, null]);
  protected readonly dieOptions = [1, 2, 3];
  protected readonly defenderOptions = [1, 2];
  protected readonly faceOptions = [6, 5, 4, 3, 2, 1];
  protected readonly pips = [
    [[12, 12]],
    [
      [6, 6],
      [18, 18],
    ],
    [
      [6, 6],
      [12, 12],
      [18, 18],
    ],
    [
      [6, 6],
      [18, 6],
      [6, 18],
      [18, 18],
    ],
    [
      [6, 6],
      [18, 6],
      [12, 12],
      [6, 18],
      [18, 18],
    ],
    [
      [6, 6],
      [18, 6],
      [6, 12],
      [18, 12],
      [6, 18],
      [18, 18],
    ],
  ];
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
  protected readonly displayedFaces = computed(() =>
    (this.entryMode() === 'free' ? this.freeFaces() : this.descendingFaces()).slice(
      0,
      this.attackingDice(),
    ),
  );
  protected readonly knownDice = computed(() => {
    const faces = this.displayedFaces();
    return faces.every((face) => face !== null)
      ? faces.filter((face): face is number => face !== null)
      : null;
  });
  protected readonly conditional = computed(() => {
    const dice = this.knownDice();
    return dice ? conditionalRoll(dice, this.defendingDice()) : null;
  });
  protected readonly preRoll = computed(() =>
    rollDistribution(this.attackingDice(), this.defendingDice()),
  );

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

  protected setFace(index: number, value: number): void {
    if (this.entryMode() === 'free') {
      this.freeFaces.update((faces) => faces.map((face, i) => (i === index ? value : face)));
      return;
    }
    this.descendingFaces.update((faces) => {
      const next = [...faces];
      next[index] = value;
      for (let i = index + 1; i < next.length; i++) {
        if (next[i] === null || next[i]! > next[i - 1]!) next[i] = next[i - 1];
      }
      return next;
    });
  }
}
