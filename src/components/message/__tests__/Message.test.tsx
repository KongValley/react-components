import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { message } from '../Message';

afterEach(() => {
  act(() => {
    message.destroy();
  });
});

describe('message', () => {
  it('renders and dismisses notifications', async () => {
    await act(async () => {
      message.success('Saved successfully', 0);
    });

    expect(await screen.findByText('Saved successfully')).toBeInTheDocument();

    await act(async () => {
      message.destroy();
    });

    await waitFor(
      () => expect(screen.queryByText('Saved successfully')).not.toBeInTheDocument(),
      { timeout: 1500 },
    );
  });

  it('closes a closable message from its button', async () => {
    await act(async () => {
      message.open({
        content: 'Heads up',
        type: 'warning',
        duration: 0,
        closable: true,
      });
    });

    expect(await screen.findByText('Heads up')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));

    await waitFor(
      () => expect(screen.queryByText('Heads up')).not.toBeInTheDocument(),
      { timeout: 1500 },
    );
  });

  it('calls onClose after removal', async () => {
    const onClose = vi.fn();
    await act(async () => {
      message.open({ content: 'Bye', duration: 0, onClose });
    });

    expect(await screen.findByText('Bye')).toBeInTheDocument();
    act(() => {
      message.destroy();
    });

    await waitFor(() => expect(onClose).toHaveBeenCalled(), { timeout: 1500 });
  });
});
