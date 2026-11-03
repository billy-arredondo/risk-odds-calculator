import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language';
import { IndividualRoll } from '../individual-roll/individual-roll';
import { TerritoryBattle } from '../territory-battle/territory-battle';
import { DiceRoller } from '../dice-roller/dice-roller';

type CalculatorMode = 'battle' | 'roll' | 'simulate';
const storageKey = 'risk-odds-mode';

@Component({
  selector: 'app-calculator',
  imports: [TerritoryBattle, IndividualRoll, DiceRoller],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  private readonly document = inject(DOCUMENT);
  protected readonly i18n = inject(LanguageService);
  protected readonly messages = computed(() => this.i18n.messages());
  protected readonly mode = signal<CalculatorMode>(this.restoreMode());

  protected setMode(mode: CalculatorMode): void {
    this.mode.set(mode);
    try {
      this.document.defaultView?.localStorage.setItem(storageKey, mode);
    } catch {
      // The selected mode still applies for this session when storage is unavailable.
    }
  }

  private restoreMode(): CalculatorMode {
    try {
      const mode = this.document.defaultView?.localStorage.getItem(storageKey);
      return mode === 'roll' || mode === 'simulate' ? mode : 'battle';
    } catch {
      return 'battle';
    }
  }
}
