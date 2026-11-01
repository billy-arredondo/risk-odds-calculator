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
        b.textContent?.includes(text),
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
    expect(element.querySelector('.notice')?.textContent).toContain('before seeing');
    button('1 die').click();
    await fixture.whenStable();
    expect(element.querySelectorAll('select').length).toBe(1);
    const select = element.querySelector('select');
    if (!select) throw new Error('Missing die selector');
    select.value = '1';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(element.querySelector('.casualties')?.textContent).toContain('100.0%');
    const rows = element.querySelectorAll('.casualties tbody tr');
    expect(rows[1].querySelectorAll('td')[0].textContent).toContain('100.0%');
    expect(element.querySelector('caption')?.textContent).toContain('36 equally likely');
  });

  it('defaults to progressive descending dice, enforcing limits and preserving valid later values', async () => {
    const { fixture, element, button } = await setup();
    button('Individual roll').click();
    await fixture.whenStable();
    expect(button('Descending').getAttribute('aria-pressed')).toBe('true');
    const dice = () => [...element.querySelectorAll<HTMLSelectElement>('.face-selectors select')];
    const select = async (index: number, value: string) => {
      const die = dice()[index];
      die.value = value;
      die.dispatchEvent(new Event('change'));
      await fixture.whenStable();
    };
    expect(dice().map((die) => die.disabled)).toEqual([false, true, true]);
    expect(element.querySelector('.casualties')).toBeNull();
    expect(element.textContent).toContain('Choose a value for each attacking die');
    await select(0, '5');
    expect(dice().map((die) => die.disabled)).toEqual([false, false, true]);
    expect([...dice()[1].options].map((option) => option.value)).toEqual([
      '',
      '1',
      '2',
      '3',
      '4',
      '5',
    ]);
    await select(1, '5');
    expect(dice()[2].disabled).toBe(false);
    await select(2, '4');
    expect(element.querySelector('.casualties caption')?.textContent).toContain('5, 5, 4');
    await select(0, '6');
    expect(dice().map((die) => die.value)).toEqual(['6', '5', '4']);
    await select(1, '3');
    expect(dice().map((die) => die.value)).toEqual(['6', '3', '']);
    expect(element.querySelector('.casualties')).toBeNull();
    await select(2, '3');
    await select(0, '2');
    expect(dice().map((die) => die.value)).toEqual(['2', '', '']);
    expect(dice()[2].disabled).toBe(true);
    await select(0, '');
    expect(dice().map((die) => die.disabled)).toEqual([false, true, true]);
  });

  it('keeps free and descending entries independent across mode and dice-count changes', async () => {
    const { fixture, element, button } = await setup();
    button('Individual roll').click();
    await fixture.whenStable();
    const dice = () => [...element.querySelectorAll<HTMLSelectElement>('.face-selectors select')];
    const select = async (index: number, value: string) => {
      dice()[index].value = value;
      dice()[index].dispatchEvent(new Event('change'));
      await fixture.whenStable();
    };
    await select(0, '4');
    await select(1, '3');
    await select(2, '2');
    button('1 die').click();
    await fixture.whenStable();
    expect(dice().map((die) => die.value)).toEqual(['4']);
    expect(element.querySelector('.casualties')).toBeTruthy();
    button('3 dice').click();
    await fixture.whenStable();
    expect(dice().map((die) => die.value)).toEqual(['4', '3', '2']);
    button('Any order').click();
    await fixture.whenStable();
    expect(dice().map((die) => die.value)).toEqual(['6', '4', '2']);
    await select(0, '1');
    await select(1, '6');
    expect(element.querySelector('.casualties caption')?.textContent).toContain('1, 6, 2');
    button('Descending').click();
    await fixture.whenStable();
    expect(dice().map((die) => die.value)).toEqual(['4', '3', '2']);
    button('Any order').click();
    await fixture.whenStable();
    expect(dice().map((die) => die.value)).toEqual(['1', '6', '2']);
  });
});
