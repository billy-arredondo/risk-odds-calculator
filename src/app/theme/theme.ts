import { DOCUMENT } from '@angular/common';
import { inject, Service, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
const storageKey = 'risk-odds-theme';

@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly current = signal<Theme>(this.restore());
  readonly theme = this.current.asReadonly();

  constructor() {
    this.apply(this.current());
  }

  setTheme(theme: Theme): void {
    this.current.set(theme);
    this.apply(theme);
    try {
      this.document.defaultView?.localStorage.setItem(storageKey, theme);
    } catch {
      // The selected theme still applies for this session when storage is unavailable.
    }
  }

  private restore(): Theme {
    try {
      return this.document.defaultView?.localStorage.getItem(storageKey) === 'dark'
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  }

  private apply(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
