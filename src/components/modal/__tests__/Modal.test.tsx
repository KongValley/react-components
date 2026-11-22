import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConfigProvider } from '../../config-provider';
import { Modal } from '../index';

describe('Modal', () => {
  it('renders a dialog and closes on Escape', async () => {
    const onCancel = vi.fn();
    render(
      <Modal open title="Settings" onCancel={onCancel}>
        Body content
      </Modal>,
    );

    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onOk and shows loading while the promise is pending', async () => {
    let resolve: (() => void) | undefined;
    const onOk = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );

    render(
      <Modal open title="Delete" onOk={onOk} onCancel={() => {}}>
        Are you sure?
      </Modal>,
    );

    const ok = screen.getByRole('button', { name: 'OK' });
    await userEvent.click(ok);
    expect(onOk).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(ok).toBeDisabled());

    resolve?.();
    await waitFor(() => expect(ok).not.toBeDisabled());
  });

  it('becomes a bottom sheet on mobile when adaptive', async () => {
    const onCancel = vi.fn();
    render(
      <ConfigProvider device="mobile" adaptive>
        <Modal open title="Mobile settings" onCancel={onCancel}>
          Sheet body
        </Modal>
      </ConfigProvider>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Mobile settings' });
    expect(dialog).toHaveClass('rcui-modal-sheet');
    expect(dialog).toHaveClass('rcui-popup-panel--bottom');
    expect(document.querySelector('.rcui-modal-root')).toBeNull();

    await userEvent.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('stays a dialog on desktop when adaptive', () => {
    render(
      <ConfigProvider device="desktop" adaptive>
        <Modal open title="Desktop settings">
          Dialog body
        </Modal>
      </ConfigProvider>,
    );

    expect(document.querySelector('.rcui-modal')).not.toBeNull();
    expect(document.querySelector('.rcui-modal-sheet')).toBeNull();
  });

  it('supports imperative Modal.confirm', async () => {
    const onOk = vi.fn();
    const instance = Modal.confirm({
      title: 'Remove item',
      content: 'This cannot be undone.',
      onOk,
    });

    const dialog = await screen.findByRole('dialog', { name: 'Remove item' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(onOk).toHaveBeenCalled();
    instance.destroy();
  });
});
