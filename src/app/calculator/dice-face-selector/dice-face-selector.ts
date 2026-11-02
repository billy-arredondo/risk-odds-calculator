import { Component, computed, inject, input, output } from '@angular/core';
import { LanguageService } from '../../i18n/language';
import { DICE_PIPS } from '../shared/dice-pips';

@Component({
  selector: 'app-dice-face-selector',
  templateUrl: './dice-face-selector.html',
  styleUrl: './dice-face-selector.css',
})
export class DiceFaceSelector {
  readonly faces = input.required<readonly (number | null)[]>();
  readonly descending = input.required<boolean>();
  readonly editableDice = input.required<number>();
  readonly faceChange = output<{ index: number; value: number }>();

  protected readonly i18n = inject(LanguageService);
  protected readonly messages = computed(() => this.i18n.messages());
  protected readonly faceOptions = [6, 5, 4, 3, 2, 1];
  protected readonly pips = DICE_PIPS;
}
