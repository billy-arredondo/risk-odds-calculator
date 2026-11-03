import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language';
import { conditionalRoll, rollDistribution } from '../../probability/combat';
import { DiceFaceSelector } from '../dice-face-selector/dice-face-selector';
import { DiceCountSelector } from '../dice-count-selector/dice-count-selector';
import { RollSummary } from '../roll-summary/roll-summary';
import { rollResults } from '../shared/roll-outcome';
import { updateDescendingFaces } from './descending-faces';
import { CalculatorStorage, integerBetween } from '../shared/calculator-storage';

const isFace = integerBetween(1, 6);
const isFreeFaces = (value: unknown): value is number[] =>
  Array.isArray(value) && value.length === 3 && value.every(isFace);
const isDescendingFaces = (value: unknown): value is (number | null)[] =>
  Array.isArray(value) &&
  value.length === 3 &&
  value.every(
    (face, index) =>
      (face === null || isFace(face)) &&
      (index === 0 ||
        (value[index - 1] === null ? face === null : face === null || face <= value[index - 1])),
  );

@Component({
  selector: 'app-individual-roll',
  imports: [DiceFaceSelector, DiceCountSelector, RollSummary],
  templateUrl: './individual-roll.html',
  styleUrl: './individual-roll.css',
})
export class IndividualRoll {
  private readonly storage = inject(CalculatorStorage);
  protected readonly i18n = inject(LanguageService);
  protected readonly messages = computed(() => this.i18n.messages());
  protected readonly attackingDice = signal(
    this.storage.read('individual-attacking-dice', 3, integerBetween(1, 3)),
  );
  protected readonly defendingDice = signal(
    this.storage.read('individual-defending-dice', 2, integerBetween(1, 2)),
  );
  protected readonly entryMode = signal<'descending' | 'free'>(
    this.storage.read(
      'individual-entry-mode',
      'descending',
      (value): value is 'descending' | 'free' => value === 'descending' || value === 'free',
    ),
  );
  protected readonly freeFaces = signal<readonly number[]>(
    this.storage.read('individual-free-faces', [6, 4, 2], isFreeFaces),
  );
  protected readonly descendingFaces = signal<readonly (number | null)[]>(
    this.storage.read('individual-descending-faces', [null, null, null], isDescendingFaces),
  );
  protected readonly editableDice = computed(() =>
    this.entryMode() === 'descending'
      ? Math.min(this.attackingDice(), this.defendingDice())
      : this.attackingDice(),
  );
  protected readonly displayedFaces = computed(() =>
    (this.entryMode() === 'free' ? this.freeFaces() : this.descendingFaces())
      .slice(0, this.attackingDice())
      .map((face, index) => (index < this.editableDice() ? face : null)),
  );
  protected readonly knownDice = computed(() => {
    const faces = this.displayedFaces().slice(0, this.editableDice());
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
  protected readonly preRollResults = computed(() => rollResults(this.preRoll()).results);
  protected readonly conditionalAnnouncement = computed(() => {
    const result = this.conditional();
    if (!result) return this.i18n.messages().incompleteDice;
    return rollResults(result)
      .results.map(
        (outcome) =>
          `${this.i18n.messages().outcomeDescription(outcome.attackerLoss, outcome.defenderLoss)}: ${this.i18n.percentage(outcome.percentage)}`,
      )
      .join('. ');
  });
  protected setFace(index: number, value: number): void {
    if (this.entryMode() === 'free') {
      this.freeFaces.update((faces) => faces.map((face, i) => (i === index ? value : face)));
      this.storage.write('individual-free-faces', this.freeFaces());
      return;
    }
    this.descendingFaces.update((faces) => updateDescendingFaces(faces, index, value));
    this.storage.write('individual-descending-faces', this.descendingFaces());
  }

  protected setCount(side: 'attacking' | 'defending', count: number): void {
    (side === 'attacking' ? this.attackingDice : this.defendingDice).set(count);
    this.storage.write(`individual-${side}-dice`, count);
  }

  protected setEntryMode(mode: 'descending' | 'free'): void {
    this.entryMode.set(mode);
    this.storage.write('individual-entry-mode', mode);
  }
}
