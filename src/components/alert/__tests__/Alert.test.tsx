import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Alert } from '../Alert';

describe('Alert', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('plays a closing transition before unmounting', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(<Alert type="error" message="Failed to load" closable onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close alert' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alert')).toHaveClass('rcui-alert--closing');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
