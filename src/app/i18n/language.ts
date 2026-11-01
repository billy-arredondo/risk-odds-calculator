import { DOCUMENT } from '@angular/common';
import { inject, Service, signal } from '@angular/core';
import { en, es } from './messages';

export type Language = 'en' | 'es';
const storageKey = 'risk-odds-language';

@Service()
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly current = signal<Language>(this.restore());
  readonly language = this.current.asReadonly();

  constructor() {
    this.updateDocument(this.current());
  }

  messages() {
    return this.current() === 'es' ? es : en;
  }

  setLanguage(language: Language): void {
    this.current.set(language);
    this.updateDocument(language);
    try {
      this.document.defaultView?.localStorage.setItem(storageKey, language);
    } catch {
      /* Storage can be unavailable. */
    }
  }

  number(value: number): string {
    return new Intl.NumberFormat(this.current() === 'es' ? 'es-ES' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  percentage(value: string): string {
    return this.current() === 'es' ? value.replace('.', ',') : value;
  }

  private restore(): Language {
    try {
      return this.document.defaultView?.localStorage.getItem(storageKey) === 'es' ? 'es' : 'en';
    } catch {
      return 'en';
    }
  }

  private updateDocument(language: Language): void {
    const messages = language === 'es' ? es : en;
    this.document.documentElement.lang = language;
    this.document.title = messages.pageTitle;
    this.document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', messages.description);
  }
}
