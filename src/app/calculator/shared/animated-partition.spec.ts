import { DOCUMENT } from '@angular/common';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AnimatedPartition } from './animated-partition';

describe('AnimatedPartition', () => {
  function setup(reduced = false) {
    let nextId = 0;
    const frames = new Map<number, FrameRequestCallback>();
    let motionChange: (() => void) | undefined;
    const motion = {
      matches: reduced,
      addEventListener: (_type: string, listener: () => void) => (motionChange = listener),
      removeEventListener: () => (motionChange = undefined),
    };
    const view = {
      matchMedia: () => motion,
      requestAnimationFrame: (callback: FrameRequestCallback) => {
        const id = ++nextId;
        frames.set(id, callback);
        return id;
      },
      cancelAnimationFrame: (id: number) => frames.delete(id),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: { defaultView: view } }],
    });
    const target = signal<readonly number[]>([0.2, 0.8]);
    const animation = TestBed.runInInjectionContext(() => new AnimatedPartition(target));
    TestBed.tick();
    const advance = (time: number) => {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback(time));
    };
    return { animation, target, advance, frames, motion, changeMotion: () => motionChange?.() };
  }

  it('interpolates together, handles interruption, and keeps rounded totals at 100%', () => {
    const { animation, target, advance, frames } = setup();
    expect(animation.percentages()).toEqual(['20.0%', '80.0%']);
    target.set([0.8, 0.2]);
    TestBed.tick();
    advance(0);
    advance(200);
    expect(animation.percentages()).toEqual(['50.0%', '50.0%']);
    target.set([0.1, 0.9]);
    TestBed.tick();
    expect(frames.size).toBe(1);
    advance(225);
    advance(425);
    expect(animation.percentages()).toEqual(['30.0%', '70.0%']);
    advance(625);
    expect(animation.percentages()).toEqual(['10.0%', '90.0%']);
    expect(frames.size).toBe(0);
    target.set([1 / 3, 1 / 3, 1 / 3]);
    TestBed.tick();
    expect(animation.percentages()).toEqual(['33.4%', '33.3%', '33.3%']);
    expect(frames.size).toBe(0);
  });

  it('displays final values immediately for reduced motion and stops an active animation', () => {
    const { animation, target, advance, frames, motion, changeMotion } = setup();
    target.set([0.8, 0.2]);
    TestBed.tick();
    advance(0);
    advance(200);
    motion.matches = true;
    changeMotion();
    expect(animation.percentages()).toEqual(['80.0%', '20.0%']);
    expect(frames.size).toBe(0);
    target.set([0.4, 0.6]);
    TestBed.tick();
    expect(animation.percentages()).toEqual(['40.0%', '60.0%']);
    expect(frames.size).toBe(0);
  });
});
