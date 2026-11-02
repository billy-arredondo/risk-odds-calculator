import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language';
import { IndividualRoll } from '../individual-roll/individual-roll';
import { TerritoryBattle } from '../territory-battle/territory-battle';

@Component({
  selector: 'app-calculator',
  imports: [TerritoryBattle, IndividualRoll],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  protected readonly i18n = inject(LanguageService);
  protected readonly messages = computed(() => this.i18n.messages());
  protected readonly mode = signal<'battle' | 'roll'>('battle');
}
