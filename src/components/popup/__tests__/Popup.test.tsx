import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Popup } from '../Popup';

describe('Popup', () => {
  it('renders a labelled dialog and closes on Escape', async () => {
    const onClose = vi.fn();
    render(
      <Popup open title="Sheet" onClose={onClose}>
        <button type="button">Action</button>
      </Popup>,
    );

    expect(screen.getByRole('dialog', { name: 'Sheet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when the mask is clicked', () => {
    const onClose = vi.fn();
    render(
      <Popup open onClose={onClose}>
        Content
      </Popup>,
    );

    const mask = document.querySelector('.rc-popup-mask');
    expect(mask).not.toBeNull();
    fireEvent.click(mask as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps the panel mounted for the exit transition', async () => {
    const { rerender } = render(<Popup open>Body</Popup>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(<Popup open={false}>Body</Popup>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await waitFor(
      () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
      { timeout: 1000 },
    );
  });
});
