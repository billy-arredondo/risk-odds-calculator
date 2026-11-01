import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme';

describe('ThemeService', () => {
  afterEach(() => localStorage.removeItem('risk-odds-theme'));

  it('defaults to light for missing or invalid stored values', () => {
    localStorage.setItem('risk-odds-theme', 'invalid');
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('restores a saved theme and persists changes', () => {
    localStorage.setItem('risk-odds-theme', 'dark');
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    service.setTheme('light');
    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('risk-odds-theme')).toBe('light');
  });

  it('applies a theme even when browser storage is unavailable', () => {
    const document = window.document.implementation.createHTMLDocument();
    Object.defineProperty(document, 'defaultView', {
      value: {
        get localStorage() {
          throw new Error('blocked');
        },
      },
    });
    TestBed.configureTestingModule({ providers: [{ provide: DOCUMENT, useValue: document }] });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
    service.setTheme('dark');
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
