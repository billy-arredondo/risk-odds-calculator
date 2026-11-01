import { DOCUMENT } from '@angular/common';
import { computed, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { percentagePartition } from '../probability/combat';

/** Animates a complete distribution without changing the calculated probabilities. */
export class AnimatedPartition {
  private readonly view = inject(DOCUMENT).defaultView;
  private readonly current = signal<readonly number[]>([]);
  private frame: number | null = null;
  private target: readonly number[] = [];
  private readonly motion = this.view?.matchMedia?.('(prefers-reduced-motion: reduce)');

  readonly values = computed(() => {
    const target = this.source();
    const current = this.current();
    return current.length === target.length ? current : target;
  });
  readonly percentages = computed(() => {
    const values = this.values();
    return values.length ? percentagePartition(values) : [];
  });

  constructor(private readonly source: () => readonly number[]) {
    const onMotionChange = () => {
      if (this.motion?.matches) {
        this.cancel();
        this.current.set(this.target);
      }
    };
    this.motion?.addEventListener?.('change', onMotionChange);
    effect(() => {
      const target = [...this.source()];
      untracked(() => this.update(target));
    });
    inject(DestroyRef).onDestroy(() => {
      this.cancel();
      this.motion?.removeEventListener?.('change', onMotionChange);
    });
  }

  private update(target: readonly number[]): void {
    this.cancel();
    this.target = target;
    const start = this.current();
    if (
      !target.length ||
      start.length !== target.length ||
      !this.view?.requestAnimationFrame ||
      !this.motion ||
      this.motion.matches ||
      target.every((value, i) => value === start[i])
    ) {
      this.current.set(target);
      return;
    }
    let started: number | null = null;
    const tick = (time: number) => {
      started ??= time;
      const progress = Math.min((time - started) / 400, 1);
      this.current.set(target.map((value, i) => start[i] + (value - start[i]) * progress));
      this.frame = progress < 1 ? this.view!.requestAnimationFrame(tick) : null;
    };
    this.frame = this.view.requestAnimationFrame(tick);
  }

  private cancel(): void {
    if (this.frame !== null) this.view?.cancelAnimationFrame(this.frame);
    this.frame = null;
  }
}
