import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActionSheet } from '../ActionSheet';

describe('ActionSheet', () => {
  it('selects an action and closes', async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(
      <ActionSheet
        open
        title="Upload"
        actions={[
          { key: 'camera', text: 'Camera' },
          { key: 'album', text: 'Album' },
        ]}
        onSelect={onSelect}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Upload' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Camera' }));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'camera', text: 'Camera' }),
      0,
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignores disabled actions', async () => {
    const onSelect = vi.fn();
    render(
      <ActionSheet
        open
        title="Actions"
        actions={[{ text: 'Delete', danger: true, disabled: true }]}
        onSelect={onSelect}
        onClose={() => {}}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('reports cancellation and closes from the cancel button', async () => {
    const onCancel = vi.fn();
    const onClose = vi.fn();
    render(
      <ActionSheet
        open
        actions={[{ text: 'Option' }]}
        cancelText="Dismiss"
        onCancel={onCancel}
        onClose={onClose}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
