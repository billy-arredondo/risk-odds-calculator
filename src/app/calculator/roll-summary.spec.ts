import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../i18n/language';
import { conditionalRoll } from '../probability/combat';
import { RollSummary } from './roll-summary';

describe('RollSummary', () => {
  afterEach(() => localStorage.removeItem('risk-odds-language'));

  it('summarizes every outcome with its probability and a proportional bar', async () => {
    const fixture = TestBed.createComponent(RollSummary);
    fixture.componentRef.setInput('distribution', conditionalRoll([5, 4, 3], 1));
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const items = [...root.querySelectorAll('.summary-list li')];
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('66.7%');
    expect(items[0].textContent).toContain('The attacker wins the roll');
    expect(items[1].textContent).toContain('33.3%');
    expect(items[1].textContent).toContain('The defender wins the roll');
    expect(root.querySelectorAll('.segments span')).toHaveLength(2);
    TestBed.inject(LanguageService).setLanguage('es');
    await fixture.whenStable();
    expect(items[0].textContent).toContain('66,7%');
    expect(items[0].textContent).toContain('El atacante gana la tirada');
    expect(root.querySelector('h3')?.textContent).toContain('Probabilidades de ganar la tirada');
  });

  it('provides localized short labels for each possible outcome', async () => {
    const fixture = TestBed.createComponent(RollSummary);
    fixture.componentRef.setInput('distribution', conditionalRoll([6, 4, 3], 2));
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const labels = () =>
      [...root.querySelectorAll('.short-label')].map((el) => el.textContent?.trim());
    expect(labels()).toEqual(['Attacker wins', 'Shared losses', 'Defender wins']);
    expect([...root.querySelectorAll('.summary-list li')].map((el) => el.className)).toEqual([
      'attacker',
      'both',
      'defender',
    ]);
    expect([...root.querySelectorAll('.segments span')].map((el) => el.className)).toEqual([
      'attacker',
      'both',
      'defender',
    ]);
    TestBed.inject(LanguageService).setLanguage('es');
    await fixture.whenStable();
    expect(labels()).toEqual(['Gana atacante', 'Bajas repartidas', 'Gana defensor']);
  });
});
