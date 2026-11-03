import { TestBed } from '@angular/core/testing';
import { Calculator } from './calculator';

describe('Calculator', () => {
  afterEach(() => localStorage.clear());

  async function setup() {
    await TestBed.configureTestingModule({ imports: [Calculator] }).compileComponents();
    const fixture = TestBed.createComponent(Calculator);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const button = (text: string) => {
      const match = [...element.querySelectorAll('button')].find(
        (b) => b.textContent?.includes(text) || b.getAttribute('aria-label') === text,
      );
      if (!match) throw new Error(`Button not found: ${text}`);
      return match;
    };
    const input = async (id: string, value: string) => {
      const field = element.querySelector<HTMLInputElement>(`#${id}`);
      if (!field) throw new Error(`Input not found: ${id}`);
      field.value = value;
      field.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    return { fixture, element, button, input };
  }

  it('saves the selected mode and restores it in a new calculator', async () => {
    const first = await setup();
    for (const [label, mode] of [
      ['Individual roll', 'roll'],
      ['03 / Roll dice', 'simulate'],
      ['Territory battle', 'battle'],
      ['03 / Roll dice', 'simulate'],
    ]) {
      first.button(label).click();
      await first.fixture.whenStable();
      expect(localStorage.getItem('risk-odds-mode')).toBe(mode);
    }
    first.fixture.destroy();
    const restored = TestBed.createComponent(Calculator);
    await restored.whenStable();
    const element: HTMLElement = restored.nativeElement;
    expect(
      element.querySelector('[aria-label="03 / Roll dice"]')?.getAttribute('aria-pressed'),
    ).toBe('true');
    expect(element.querySelector<HTMLElement>('app-dice-roller')?.style.display).toBe('block');
  });

  it('defaults to battle for an invalid saved mode', async () => {
    localStorage.setItem('risk-odds-mode', 'invalid');
    const { button } = await setup();
    expect(button('Territory battle').getAttribute('aria-pressed')).toBe('true');
  });

  it('restores army counts, individual roll choices and simulator counts independently', async () => {
    const { fixture, element, input } = await setup();
    await input('attacker-armies', '12');
    await input('defender-armies', '4');
    const individual = element.querySelector<HTMLElement>('app-individual-roll')!;
    const simulator = element.querySelector<HTMLElement>('app-dice-roller')!;
    individual.querySelector<HTMLButtonElement>('.attacker button[aria-label="2 dice"]')!.click();
    individual.querySelector<HTMLButtonElement>('.defender button[aria-label="1 die"]')!.click();
    await fixture.whenStable();
    individual.querySelector<HTMLInputElement>('input[name="die-0"][value="5"]')!.click();
    await fixture.whenStable();
    [...individual.querySelectorAll('button')]
      .find((button) => button.textContent?.includes('Any order'))!
      .click();
    await fixture.whenStable();
    individual.querySelector<HTMLInputElement>('input[name="die-0"][value="3"]')!.click();
    simulator.querySelector<HTMLButtonElement>('.attacker button[aria-label="1 die"]')!.click();
    simulator.querySelector<HTMLButtonElement>('.defender button[aria-label="1 die"]')!.click();
    await fixture.whenStable();
    fixture.destroy();

    const restored = TestBed.createComponent(Calculator);
    await restored.whenStable();
    const root: HTMLElement = restored.nativeElement;
    expect(root.querySelector<HTMLInputElement>('#attacker-armies')?.value).toBe('12');
    expect(root.querySelector<HTMLInputElement>('#defender-armies')?.value).toBe('4');
    const roll = root.querySelector<HTMLElement>('app-individual-roll')!;
    const roller = root.querySelector<HTMLElement>('app-dice-roller')!;
    expect(
      roll.querySelector('.attacker button[aria-label="2 dice"]')?.getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      roll.querySelector('.defender button[aria-label="1 die"]')?.getAttribute('aria-pressed'),
    ).toBe('true');
    expect(roll.querySelector<HTMLInputElement>('input[name="die-0"][value="3"]')?.checked).toBe(
      true,
    );
    expect(
      roller.querySelector('.attacker button[aria-label="1 die"]')?.getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      roller.querySelector('.defender button[aria-label="1 die"]')?.getAttribute('aria-pressed'),
    ).toBe('true');
    [...roll.querySelectorAll('button')]
      .find((button) => button.textContent?.includes('Descending'))!
      .click();
    await restored.whenStable();
    expect(roll.querySelector<HTMLInputElement>('input[name="die-0"][value="5"]')?.checked).toBe(
      true,
    );
  });

  it('ignores invalid saved values and keeps the last valid army input', async () => {
    localStorage.setItem('risk-odds-individual-attacking-dice', '99');
    localStorage.setItem('risk-odds-simulator-defender-dice', 'bad json');
    const { fixture, element, input } = await setup();
    await input('attacker-armies', '8');
    await input('attacker-armies', '');
    expect(localStorage.getItem('risk-odds-battle-attacker')).toBe('8');
    fixture.destroy();
    const restored = TestBed.createComponent(Calculator);
    await restored.whenStable();
    const root: HTMLElement = restored.nativeElement;
    expect(root.querySelector<HTMLInputElement>('#attacker-armies')?.value).toBe('8');
    expect(
      root
        .querySelector('app-individual-roll .attacker button[aria-label="3 dice"]')
        ?.getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      root
        .querySelector('app-dice-roller .defender button[aria-label="2 dice"]')
        ?.getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('updates battle odds and blocks invalid army inputs', async () => {
    const { element, input } = await setup();
    await input('attacker-armies', '2');
    await input('defender-armies', '1');
    expect(element.querySelector('.forecast')?.textContent).toContain('41.7%');
    await input('attacker-armies', '');
    expect(element.querySelector('.forecast')).toBeNull();
    expect(element.querySelector('#attacker-armies')?.getAttribute('aria-invalid')).toBe('true');
    expect(element.querySelector('#defender-armies')?.getAttribute('aria-invalid')).toBe('false');
    expect(element.querySelector('#army-error')?.textContent).toContain('Enter whole numbers');
    await input('attacker-armies', '1.5');
    expect(element.querySelector('.forecast')).toBeNull();
    await input('attacker-armies', '201');
    expect(element.querySelector('.forecast')).toBeNull();
  });

  it('handles terminal states and army counter controls', async () => {
    const { fixture, element, input } = await setup();
    await input('attacker-armies', '1');
    expect(element.textContent).toContain('No attack is possible');
    expect(
      element.querySelector<HTMLButtonElement>('[aria-label="Remove attacking army"]')?.disabled,
    ).toBe(true);
    await input('defender-armies', '0');
    expect(element.textContent).toContain('already conquered');
    element.querySelector<HTMLButtonElement>('[aria-label="Add attacking army"]')?.click();
    await fixture.whenStable();
    expect(element.querySelector<HTMLInputElement>('#attacker-armies')?.value).toBe('2');
  });

  it('switches modes and recomputes conditional probabilities from dice controls', async () => {
    const { fixture, element, button } = await setup();
    button('Individual roll').click();
    await fixture.whenStable();
    expect(element.querySelectorAll('.pre-roll li')).toHaveLength(3);
    expect(element.querySelector('.pre-roll')?.textContent).toContain('Possible outcomes');
    button('1 die').click();
    await fixture.whenStable();
    expect(element.querySelectorAll('.face-column').length).toBe(1);
    element.querySelector<HTMLInputElement>('input[name="die-0"][value="1"]')!.click();
    await fixture.whenStable();
    expect(element.querySelector('.summary-list .defender')?.textContent).toContain('100.0%');
    expect(element.querySelector('.summary-list .defender')?.textContent).toContain('36 of 36');
  });

  it('defaults to descending dice and fills or preserves later values within their limits', async () => {
    const { fixture, element, button } = await setup();
    button('Individual roll').click();
    await fixture.whenStable();
    expect(button('Descending').getAttribute('aria-pressed')).toBe('true');
    const options = (index: number) => [
      ...element.querySelectorAll<HTMLInputElement>(`input[name="die-${index}"]`),
    ];
    const selected = () =>
      [...element.querySelectorAll<HTMLInputElement>('.face-option input:checked')].map(
        (die) => die.value,
      );
    const select = async (index: number, value: string) => {
      options(index)
        .find((die) => die.value === value)!
        .click();
      await fixture.whenStable();
    };
    expect(options(0).every((die) => !die.disabled)).toBe(true);
    expect(options(1).every((die) => die.disabled)).toBe(true);
    expect(options(2).every((die) => die.disabled)).toBe(true);
    expect(element.querySelectorAll('.face-option svg').length).toBe(18);
    expect(element.querySelector('app-individual-roll .summary-list')).toBeNull();
    expect(element.textContent).toContain('Choose the required attacking dice values');
    await select(0, '5');
    expect(selected()).toEqual(['5', '5']);
    expect(
      options(1)
        .filter((die) => die.disabled)
        .map((die) => die.value),
    ).toEqual(['6']);
    await select(1, '4');
    expect(selected()).toEqual(['5', '4']);
    await select(0, '6');
    expect(selected()).toEqual(['6', '4']);
    await select(1, '3');
    expect(selected()).toEqual(['6', '3']);
    await select(0, '2');
    expect(selected()).toEqual(['2', '2']);
    expect(
      options(1)
        .filter((die) => !die.disabled)
        .map((die) => die.value),
    ).toEqual(['2', '1']);
  });

  it('keeps free and descending entries independent across mode and dice-count changes', async () => {
    const { fixture, element, button } = await setup();
    button('Individual roll').click();
    await fixture.whenStable();
    const dice = () => [
      ...element.querySelectorAll<HTMLInputElement>('.face-option input:checked'),
    ];
    const select = async (index: number, value: string) => {
      element
        .querySelector<HTMLInputElement>(`input[name="die-${index}"][value="${value}"]`)!
        .click();
      await fixture.whenStable();
    };
    await select(0, '4');
    await select(1, '3');
    button('1 die').click();
    await fixture.whenStable();
    expect(dice().map((die) => die.value)).toEqual(['4']);
    expect(element.querySelector('.summary-list')).toBeTruthy();
    button('3 dice').click();
    await fixture.whenStable();
    expect(dice().map((die) => die.value)).toEqual(['4', '3']);
    button('Any order').click();
    await fixture.whenStable();
    expect(dice().map((die) => die.value)).toEqual(['6', '4', '2']);
    await select(0, '1');
    await select(1, '6');
    expect(dice().map((die) => die.value)).toEqual(['1', '6', '2']);
    button('Descending').click();
    await fixture.whenStable();
    expect(dice().map((die) => die.value)).toEqual(['4', '3']);
    button('Any order').click();
    await fixture.whenStable();
    expect(dice().map((die) => die.value)).toEqual(['1', '6', '2']);
    button('Territory battle').click();
    await fixture.whenStable();
    button('Individual roll').click();
    await fixture.whenStable();
    expect(dice().map((die) => die.value)).toEqual(['1', '6', '2']);
    expect(button('Any order').getAttribute('aria-pressed')).toBe('true');
  });

  it('preserves the simulator selection and result when switching calculator modes', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    const { fixture, element, button } = await setup();
    try {
      button('03 / Roll dice').click();
      await fixture.whenStable();
      const simulator = element.querySelector<HTMLElement>('app-dice-roller')!;
      simulator.querySelector<HTMLButtonElement>('.attacker button[aria-label="2 dice"]')!.click();
      await fixture.whenStable();
      simulator.querySelector<HTMLButtonElement>('.roll-button')!.click();
      await fixture.whenStable();
      const result = simulator.querySelector('.result-card')?.textContent;
      expect(result).toBeTruthy();
      button('Territory battle').click();
      await fixture.whenStable();
      button('03 / Roll dice').click();
      await fixture.whenStable();
      expect(simulator.querySelector('.result-card')?.textContent).toBe(result);
      expect(
        simulator
          .querySelector('.attacker button[aria-label="2 dice"]')
          ?.getAttribute('aria-pressed'),
      ).toBe('true');
    } finally {
      fixture.destroy();
      vi.unstubAllGlobals();
    }
  });
});
