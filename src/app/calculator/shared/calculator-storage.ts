import { DOCUMENT } from '@angular/common';
import { inject, Service } from '@angular/core';

@Service()
export class CalculatorStorage {
  private readonly document = inject(DOCUMENT);

  read<T>(key: string, fallback: T, valid: (value: unknown) => value is T): T {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(`risk-odds-${key}`);
      if (stored == null) return fallback;
      const value: unknown = JSON.parse(stored);
      return valid(value) ? value : fallback;
    } catch {
      return fallback;
    }
  }

  write(key: string, value: unknown): void {
    try {
      this.document.defaultView?.localStorage.setItem(`risk-odds-${key}`, JSON.stringify(value));
    } catch {
      // The current selection remains available for this session.
    }
  }
}

export function integerBetween(min: number, max: number): (value: unknown) => value is number {
  return (value): value is number =>
    typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}
