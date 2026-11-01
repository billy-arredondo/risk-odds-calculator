import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../i18n/language';
import { conditionalRoll } from '../probability/combat';
import { RollResults } from './roll-results';

describe('RollResults', () => {
  afterEach(() => localStorage.removeItem('risk-odds-language'));

  it('describes joint outcomes for known attacker dice and preserves mathematical details', async () => {
    const fixture = TestBed.createComponent(RollResults);
    fixture.componentRef.setInput('distribution', conditionalRoll([5, 4, 3], 1));
    fixture.componentRef.setInput('attackerValues', [5, 4, 3]);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const results = [...root.querySelectorAll('.results li')];
    expect(results).toHaveLength(2);
    expect(results[0].textContent).toContain('66.7%');
    expect(results[0].textContent).toContain('The attacker wins the roll');
    expect(results[0].textContent).toContain('Attacker: 0 lost · Defender: 1 lost');
    expect(results[0].textContent).toContain('4 of 6 possible defender rolls');
    expect(results[1].textContent).toContain('33.3%');
    expect(results[1].textContent).toContain('The defender wins the roll');
    expect(results[1].textContent).toContain('2 of 6 possible defender rolls');
    expect(root.querySelector('details')?.open).toBe(false);
    expect(root.querySelectorAll('table')).toHaveLength(2);
    expect(root.textContent).toContain('4 / 6');
    TestBed.inject(LanguageService).setLanguage('es');
    await fixture.whenStable();
    expect(results[0].textContent).toContain('66,7%');
    expect(root.querySelector('h3')?.textContent).toContain('Desglose de resultados');
    expect(results[0].textContent).toContain('El atacante gana la tirada');
    expect(results[0].textContent).toContain('4 de 6 tiradas defensoras posibles');
  });

  it('shows shared losses separately and zero probability for an impossible victory', async () => {
    const fixture = TestBed.createComponent(RollResults);
    fixture.componentRef.setInput('distribution', conditionalRoll([6, 6], 2));
    fixture.componentRef.setInput('attackerValues', [6, 6]);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll('.results li')).toHaveLength(3);
    expect([...root.querySelectorAll('.results li')].map((el) => el.className)).toEqual([
      'attacker',
      'both',
      'defender',
    ]);
    expect(root.querySelector('.results li')?.textContent).toContain(
      '25 of 36 possible defender rolls',
    );
    expect(root.querySelector('.results .both')?.textContent).toContain(
      'Attacker: 1 lost · Defender: 1 lost',
    );
    expect(root.querySelector('.results .both')?.textContent).toContain('Shared losses');
    fixture.componentRef.setInput('distribution', conditionalRoll([1], 1));
    fixture.componentRef.setInput('attackerValues', [1]);
    await fixture.whenStable();
    const results = root.querySelectorAll('.results li');
    expect(results).toHaveLength(2);
    expect(results[0].textContent).toContain('0.0%');
    expect(results[0].textContent).toContain('The attacker wins the roll');
    expect(results[1].textContent).toContain('100.0%');
    expect(results[1].textContent).toContain('The defender wins the roll');
  });
});
