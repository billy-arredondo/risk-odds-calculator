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
});
