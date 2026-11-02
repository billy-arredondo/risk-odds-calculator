import { TestBed } from '@angular/core/testing';
import { Calculator } from './calculator';

describe('Calculator', () => {
  async function setup() {
    await TestBed.configureTestingModule({ imports: [Calculator] }).compileComponents();
    const fixture = TestBed.createComponent(Calculator);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const button = (text: string) => {
      const match = [...element.querySelectorAll('button')].find((b) =>
        b.textContent?.includes(text) || b.getAttribute('aria-label') === text,
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
    expect(element.querySelector('.summary-list')).toBeNull();
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
});
