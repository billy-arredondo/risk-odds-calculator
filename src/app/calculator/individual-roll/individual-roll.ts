import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language';
import { conditionalRoll, rollDistribution } from '../../probability/combat';
import { DiceFaceSelector } from '../dice-face-selector/dice-face-selector';
import { RollSummary } from '../roll-summary/roll-summary';
import { rollResults } from '../shared/roll-outcome';
import { updateDescendingFaces } from './descending-faces';

@Component({
  selector: 'app-individual-roll',
  imports: [DiceFaceSelector, RollSummary],
  templateUrl: './individual-roll.html',
  styleUrl: './individual-roll.css',
})
export class IndividualRoll {
  protected readonly i18n = inject(LanguageService);
  protected readonly attackingDice = signal(3);
  protected readonly defendingDice = signal(2);
  protected readonly entryMode = signal<'descending' | 'free'>('descending');
  protected readonly freeFaces = signal<readonly number[]>([6, 4, 2]);
  protected readonly descendingFaces = signal<readonly (number | null)[]>([null, null, null]);
  protected readonly dieOptions = [1, 2, 3];
  protected readonly defenderOptions = [1, 2];
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
    return rollResults(result).results
      .map((outcome) => `${this.i18n.messages().outcomeDescription(outcome.attackerLoss, outcome.defenderLoss)}: ${this.i18n.percentage(outcome.percentage)}`)
      .join('. ');
  });
  protected setFace(index: number, value: number): void {
    if (this.entryMode() === 'free') {
      this.freeFaces.update((faces) => faces.map((face, i) => (i === index ? value : face)));
      return;
    }
    this.descendingFaces.update((faces) => updateDescendingFaces(faces, index, value));
  }
}
