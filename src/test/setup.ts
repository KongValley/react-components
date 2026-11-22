import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

if (typeof window !== 'undefined') {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = ((callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(performance.now()), 16)) as typeof window.requestAnimationFrame;
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = ((handle: number) =>
      window.clearTimeout(handle)) as typeof window.cancelAnimationFrame;
  }
}
