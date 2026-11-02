import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../../i18n/language';
import { DiceRoller } from './dice-roller';

describe('DiceRoller', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    localStorage.removeItem('risk-odds-language');
  });

  it('reveals sorted dice, tie rules, and shared losses after the animation', async () => {
    const fixture = TestBed.createComponent(DiceRoller);
    TestBed.inject(LanguageService).setLanguage('en');
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const random = vi.spyOn(Math, 'random');
    // Attacker: 1, 6, 4; defender: 6, 3.
    [0, 0.99, 0.5, 0.99, 0.34].forEach((value) => random.mockReturnValueOnce(value));
    vi.useFakeTimers();
    root.querySelector<HTMLButtonElement>('.roll-button')!.click();
    fixture.detectChanges();
    expect(root.querySelector('.rolling')).toBeTruthy();
    expect(root.querySelector('[role="status"]')?.textContent).toContain('Rolling dice');
    expect(root.querySelector('.result-card')).toBeNull();
    expect(root.querySelector('.reroll-icon.spinning')).toBeTruthy();
    vi.advanceTimersByTime(1499);
    fixture.detectChanges();
    expect(root.querySelector('.result-card')).toBeNull();
    vi.advanceTimersByTime(1);
    fixture.detectChanges();
    expect(root.querySelector('.result-card')?.textContent).toContain('Shared losses');
    expect(root.querySelector('.result-card.shared')).toBeTruthy();
    expect(root.querySelector('.reroll-icon:not(.spinning)')).toBeTruthy();
    expect(root.querySelector('.result-card')?.textContent).toContain('Attacker: 1 lost');
    expect(root.querySelector('.comparison')?.textContent).toContain('6 vs 6: Attacker loses');
    expect(root.querySelector('.comparison')?.textContent).toContain('Tie — defender wins');
    expect(root.querySelector('.comparison')?.textContent).toContain('4 vs 3: Defender loses');
    expect(root.querySelector('.dice-side.attacker')?.getAttribute('aria-label')).toContain(
      '6, 4, 1',
    );
    expect(root.querySelectorAll('.die-wrap.unused')).toHaveLength(1);
    expect(root.querySelector('[role="status"]')?.textContent).toContain('Shared losses');
    expect(root.querySelector('.odds')?.textContent).toContain('possible rolls of both sides');
    fixture.destroy();
  });

  it('reveals immediately for reduced motion and resets when a dice count changes', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    const fixture = TestBed.createComponent(DiceRoller);
    TestBed.inject(LanguageService).setLanguage('es');
    vi.spyOn(Math, 'random').mockReturnValue(0);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    root.querySelector<HTMLButtonElement>('.roll-button')!.click();
    fixture.detectChanges();
    expect(root.querySelector('.rolling')).toBeNull();
    expect(root.querySelector('.result-card')?.textContent).toContain('El defensor gana la tirada');
    expect(root.querySelector('.result-card.defender-win')).toBeTruthy();
    expect(root.querySelector('.comparison')?.textContent).toContain('Empate: gana el defensor');
    root.querySelector<HTMLButtonElement>('.attacker button[aria-label="2 dados"]')!.click();
    fixture.detectChanges();
    expect(root.querySelector('.result-card')).toBeNull();
    expect(root.querySelector('.empty')?.textContent).toContain('Elige los dados');
    fixture.destroy();
  });

  it('marks an attacker win when the defender takes all losses', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    const fixture = TestBed.createComponent(DiceRoller);
    const random = vi.spyOn(Math, 'random');
    [0.99, 0.99, 0.99, 0, 0].forEach((value) => random.mockReturnValueOnce(value));
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    root.querySelector<HTMLButtonElement>('.roll-button')!.click();
    fixture.detectChanges();
    expect(root.querySelector('.result-card.attacker-win')).toBeTruthy();
    expect(root.querySelector('.result-card.defender-win, .result-card.shared')).toBeNull();
    fixture.destroy();
  });

  it('cancels a pending roll if dice are changed during animation', async () => {
    const fixture = TestBed.createComponent(DiceRoller);
    TestBed.inject(LanguageService).setLanguage('en');
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    vi.useFakeTimers();
    root.querySelector<HTMLButtonElement>('.roll-button')!.click();
    fixture.detectChanges();
    root.querySelector<HTMLButtonElement>('.defender button[aria-label="1 die"]')!.click();
    fixture.detectChanges();
    vi.advanceTimersByTime(1500);
    fixture.detectChanges();
    expect(root.querySelector('.result-card')).toBeNull();
    expect(root.querySelector('.rolling')).toBeNull();
    expect(root.querySelector('.roll-button')?.textContent).toContain('Roll dice');
    fixture.destroy();
  });
});
