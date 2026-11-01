import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language';
import { en, es } from './messages';

describe('LanguageService', () => {
  afterEach(() => localStorage.removeItem('risk-odds-language'));

  it('keeps both translation catalogs in sync', () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
    expect(es.dice(1)).toBe('1 dado');
    expect(es.dice(2)).toBe('2 dados');
    expect(es.requiresDefense(1)).toContain('ejército defensor');
    expect(es.requiresDefense(2)).toContain('ejércitos defensores');
  });

  it('falls back to English and still switches if browser storage is unavailable', () => {
    const document = window.document.implementation.createHTMLDocument();
    Object.defineProperty(document, 'defaultView', {
      value: {
        get localStorage() {
          throw new Error('blocked');
        },
      },
    });
    const meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
    TestBed.configureTestingModule({ providers: [{ provide: DOCUMENT, useValue: document }] });
    const service = TestBed.inject(LanguageService);
    expect(service.language()).toBe('en');
    service.setLanguage('es');
    expect(service.language()).toBe('es');
    expect(document.documentElement.lang).toBe('es');
    expect(document.title).toBe(es.pageTitle);
    expect(meta.content).toBe(es.description);
    expect(service.number(1.25)).toBe('1,25');
    expect(service.percentage('41.7%')).toBe('41,7%');
  });
});
