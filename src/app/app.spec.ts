import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(() => {
    localStorage.removeItem('risk-odds-language');
    localStorage.removeItem('risk-odds-theme');
  });
  afterEach(() => {
    localStorage.removeItem('risk-odds-language');
    localStorage.removeItem('risk-odds-theme');
    document.documentElement.removeAttribute('data-theme');
  });
  it('creates the application shell', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
    expect(TestBed.createComponent(App).componentInstance).toBeTruthy();
  });

  it('lazy-loads the calculator at the home route', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create('/');
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toContain(
      'The balance of forces',
    );
  });

  it('switches both modes without resetting inputs and updates accessible labels', async () => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const findButton = (text: string) => {
      const button = [...root.querySelectorAll('button')].find(
        (b) => b.textContent?.trim() === text,
      );
      if (!button) throw new Error(`Missing button: ${text}`);
      return button;
    };
    const attacker = root.querySelector<HTMLInputElement>('#attacker-armies')!;
    const defender = root.querySelector<HTMLInputElement>('#defender-armies')!;
    attacker.value = '2';
    attacker.dispatchEvent(new Event('input'));
    defender.value = '1';
    defender.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    findButton('ES').click();
    await fixture.whenStable();
    expect(document.documentElement.lang).toBe('es');
    expect(document.title).toContain('Calculadora de probabilidades');
    expect(findButton('ES').getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelector('#attacker-armies')?.getAttribute('aria-invalid')).toBe('false');
    expect(root.querySelector<HTMLInputElement>('#attacker-armies')?.value).toBe('2');
    expect(root.querySelector('.forecast')?.textContent).toContain('41,7%');
    expect(root.querySelector('[aria-label="Añadir un ejército atacante"]')).toBeTruthy();
    expect(localStorage.getItem('risk-odds-language')).toBe('es');
    attacker.value = '';
    attacker.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(root.querySelector('#army-error')?.textContent).toContain('Introduce números enteros');
    attacker.value = '2';
    attacker.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    findButton('02 / Tirada individual').click();
    await fixture.whenStable();
    findButton('1 dado').click();
    await fixture.whenStable();
    root.querySelector<HTMLInputElement>('input[name="die-0"][value="1"]')!.click();
    await fixture.whenStable();
    expect(root.querySelector('.summary-list .defender')?.textContent).toContain('Gana defensor');
    findButton('EN').click();
    await fixture.whenStable();
    expect(document.documentElement.lang).toBe('en');
    expect(root.querySelector('.summary-list .defender')?.textContent).toContain('Defender wins');
    expect(root.querySelector<HTMLInputElement>('input[name="die-0"]:checked')?.value).toBe('1');
    expect(root.querySelector('.summary-list .defender')?.textContent).toContain('100.0%');
    findButton('01 / Territory battle').click();
    await fixture.whenStable();
    expect(root.querySelector<HTMLInputElement>('#attacker-armies')?.value).toBe('2');
    expect(root.querySelector('.forecast')?.textContent).toContain('41.7%');
  });

  it('restores a saved language at startup', async () => {
    localStorage.setItem('risk-odds-language', 'es');
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create('/');
    expect(document.documentElement.lang).toBe('es');
    expect(harness.routeNativeElement?.textContent).toContain('El balance de fuerzas');
  });

  it('switches theme without resetting the calculator and translates the controls', async () => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const attacker = root.querySelector<HTMLInputElement>('#attacker-armies')!;
    attacker.value = '2';
    attacker.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    const themeGroup = root.querySelector<HTMLElement>('[aria-label="Color theme"]')!;
    const [light, dark] = themeGroup.querySelectorAll('button');
    expect(light.getAttribute('aria-label')).toBe('Light');
    expect(dark.getAttribute('aria-label')).toBe('Dark');
    expect(light.getAttribute('aria-pressed')).toBe('true');
    dark.click();
    await fixture.whenStable();
    expect(dark.getAttribute('aria-pressed')).toBe('true');
    expect(light.getAttribute('aria-pressed')).toBe('false');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('risk-odds-theme')).toBe('dark');
    expect(attacker.value).toBe('2');
    expect(root.querySelector('.forecast')?.textContent).toContain('Attacker conquers');
    const spanish = [...root.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'ES',
    )!;
    spanish.click();
    await fixture.whenStable();
    expect(themeGroup.getAttribute('aria-label')).toBe('Tema de color');
    expect(dark.getAttribute('aria-label')).toBe('Oscuro');
    expect(dark.getAttribute('aria-pressed')).toBe('true');
    light.click();
    await fixture.whenStable();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('risk-odds-theme')).toBe('light');
    expect(attacker.value).toBe('2');
  });
});
