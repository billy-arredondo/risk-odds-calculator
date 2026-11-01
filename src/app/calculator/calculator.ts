import { Component, inject, signal } from '@angular/core';
import { LanguageService } from '../i18n/language';
import { MAX_ARMIES } from '../probability/combat';
import { IndividualRoll } from './individual-roll';
import { TerritoryBattle } from './territory-battle';

@Component({
  selector: 'app-calculator',
  imports: [TerritoryBattle, IndividualRoll],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  protected readonly i18n = inject(LanguageService);
  protected readonly mode = signal<'battle' | 'roll'>('battle');
  protected readonly maxArmies = MAX_ARMIES;
}
