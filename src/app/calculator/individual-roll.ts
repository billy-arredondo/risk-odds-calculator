import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../i18n/language';
import { conditionalRoll, rollDistribution } from '../probability/combat';
import { RollResults } from './roll-results';
import { RollSummary } from './roll-summary';

@Component({
  selector: 'app-individual-roll',
  imports: [RollResults, RollSummary],
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
