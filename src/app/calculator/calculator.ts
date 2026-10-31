import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
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
  imports: [DecimalPipe],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  protected readonly mode = signal<'battle' | 'roll'>('battle');
  protected readonly attacker = signal('10');
  protected readonly defender = signal('7');
  protected readonly attackingDice = signal(3);
  protected readonly defendingDice = signal(2);
  protected readonly faces = signal<readonly number[]>([6, 4, 2]);
  protected readonly dieOptions = [1, 2, 3];
  protected readonly defenderOptions = [1, 2];
  protected readonly faceOptions = [1, 2, 3, 4, 5, 6];
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
  protected readonly knownDice = computed(() => this.faces().slice(0, this.attackingDice()));
  protected readonly conditional = computed(() =>
    conditionalRoll(this.knownDice(), this.defendingDice()),
  );
  protected readonly preRoll = computed(() =>
    rollDistribution(this.attackingDice(), this.defendingDice()),
  );
  protected readonly casualtyRows = computed(() => {
    const outcomes = this.conditional().outcomes;
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

  protected setFace(index: number, event: Event): void {
    const select = event.target;
    if (select instanceof HTMLSelectElement) {
      this.faces.update((faces) =>
        faces.map((face, i) => (i === index ? Number(select.value) : face)),
      );
    }
  }
}
