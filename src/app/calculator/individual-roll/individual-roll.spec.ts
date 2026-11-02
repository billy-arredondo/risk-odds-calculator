import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../../i18n/language';
import { IndividualRoll } from './individual-roll';

describe('IndividualRoll', () => {
  afterEach(() => localStorage.removeItem('risk-odds-language'));

  it('disables only unmatched descending dice without changing pre-roll odds', async () => {
    const fixture = TestBed.createComponent(IndividualRoll);
    TestBed.inject(LanguageService).setLanguage('en');
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const columns = () => [...root.querySelectorAll<HTMLFieldSetElement>('.face-column')];
    const button = (selector: string, text: string) => {
      const match = [...root.querySelectorAll<HTMLButtonElement>(selector)].find(
        (element) => element.textContent?.trim() === text || element.getAttribute('aria-label') === text,
      );
      if (!match) throw new Error(`Missing button: ${text}`);
      return match;
    };

    expect(columns().map((column) => column.disabled)).toEqual([false, false, true]);
    root.querySelector<HTMLInputElement>('input[name="die-0"][value="6"]')!.click();
    await fixture.whenStable();
    root.querySelector<HTMLInputElement>('input[name="die-1"][value="4"]')!.click();
    await fixture.whenStable();
    expect(root.querySelector('.pre-roll')?.textContent).toContain('For 3 vs 2 dice');
    const summary = root.querySelector('.summary-list')!.textContent;
    expect(root.querySelector('.summary-list')).toBeTruthy();

    button('.attacker button', '2 dice').click();
    await fixture.whenStable();
    expect(columns().map((column) => column.disabled)).toEqual([false, false]);
    expect(root.querySelector('.summary-list')?.textContent).toBe(summary);
    expect(root.querySelector('.pre-roll')?.textContent).toContain('For 2 vs 2 dice');

    button('.defender button', '1 die').click();
    await fixture.whenStable();
    expect(columns().map((column) => column.disabled)).toEqual([false, true]);
    expect(root.querySelector('.summary-list')?.textContent).toContain('5 of 6');

    button('.attacker button', '3 dice').click();
    await fixture.whenStable();
    expect(columns().map((column) => column.disabled)).toEqual([false, true, true]);
    button('.mode-switch button', 'Any order').click();
    await fixture.whenStable();
    expect(columns().map((column) => column.disabled)).toEqual([false, false, false]);
    expect(root.querySelector('.summary-list')).toBeTruthy();

    button('.mode-switch button', 'Descending').click();
    button('.defender button', '2 dice').click();
    await fixture.whenStable();
    expect(columns().map((column) => column.disabled)).toEqual([false, false, true]);
    expect(root.querySelector<HTMLInputElement>('input[name="die-1"]:checked')?.value).toBe('4');
  });
});
