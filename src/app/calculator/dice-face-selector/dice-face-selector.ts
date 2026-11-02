import { Component, computed, inject, input, output } from '@angular/core';
import { LanguageService } from '../../i18n/language';

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
  protected readonly pips = [
    [[12, 12]],
    [[6, 6], [18, 18]],
    [[6, 6], [12, 12], [18, 18]],
    [[6, 6], [18, 6], [6, 18], [18, 18]],
    [[6, 6], [18, 6], [12, 12], [6, 18], [18, 18]],
    [[6, 6], [18, 6], [6, 12], [18, 12], [6, 18], [18, 18]],
  ];
}
