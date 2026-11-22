import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Swiper } from '../Swiper';

function renderSwiper(props: Partial<Parameters<typeof Swiper>[0]> = {}) {
  const onChange = vi.fn();
  const result = render(
    <Swiper aria-label="Gallery" onChange={onChange} {...props}>
      <div>First</div>
      <div>Second</div>
      <div>Third</div>
    </Swiper>,
  );
  return { ...result, onChange };
}

describe('Swiper', () => {
  it('switches slides from the indicators', async () => {
    const { onChange } = renderSwiper();
    const dots = screen.getAllByRole('button', { name: /Go to slide/ });

    expect(dots).toHaveLength(3);
    await userEvent.click(dots[2]);

    expect(onChange).toHaveBeenCalledWith(2);
    expect(dots[2]).toHaveAttribute('aria-current', 'true');
    expect(dots[0]).not.toHaveAttribute('aria-current');
  });

  it('supports keyboard navigation', () => {
    const { container, onChange } = renderSwiper();
    const viewport = container.querySelector('.rc-swiper__viewport');
    expect(viewport).not.toBeNull();

    fireEvent.keyDown(viewport as Element, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('clones edge slides when looping', () => {
    const { container } = renderSwiper({ loop: true });
    const slides = container.querySelectorAll('.rc-swiper__slide');
    expect(slides).toHaveLength(5);
    expect(slides[0]).toHaveAttribute('aria-hidden', 'true');
    expect(slides[4]).toHaveAttribute('aria-hidden', 'true');
  });

  it('completes a loop even without a transitionend event', () => {
    vi.useFakeTimers();
    try {
      const { onChange } = renderSwiper({
        loop: true,
        autoplay: true,
        interval: 1000,
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(onChange.mock.calls.map((call) => call[0])).toEqual([1, 2]);

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      act(() => {
        vi.advanceTimersByTime(450);
      });

      expect(onChange).toHaveBeenLastCalledWith(0);
      expect(
        screen.getByRole('button', { name: 'Go to slide 1' }),
      ).toHaveAttribute('aria-current', 'true');
    } finally {
      vi.useRealTimers();
    }
  });
});
