import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConfigProvider } from '../../config-provider';
import { Select } from '../Select';

const OPTIONS = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
  { label: 'Gamma', value: 'c' },
];

describe('Select adaptive', () => {
  it('uses a bottom sheet on mobile and selects an option', async () => {
    const onChange = vi.fn();
    render(
      <ConfigProvider device="mobile" adaptive>
        <Select adaptive options={OPTIONS} mobileTitle="Choose one" onChange={onChange} />
      </ConfigProvider>,
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');

    await userEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Choose one' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('option', { name: 'Beta' }));
    expect(onChange).toHaveBeenCalledWith('b');

    await waitFor(
      () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
      { timeout: 1000 },
    );
  });

  it('keeps a multiple selection open until Done is pressed', async () => {
    const onChange = vi.fn();
    render(
      <ConfigProvider device="mobile">
        <Select
          adaptive
          mode="multiple"
          options={OPTIONS}
          defaultValue={['a']}
          mobileTitle="Choose many"
          onChange={onChange}
        />
      </ConfigProvider>,
    );

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Beta' }));
    expect(onChange).toHaveBeenCalledWith(['a', 'b']);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(
      () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
      { timeout: 1000 },
    );
  });

  it('stays a listbox dropdown on desktop', async () => {
    render(
      <ConfigProvider device="desktop" adaptive>
        <Select adaptive options={OPTIONS} />
      </ConfigProvider>,
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');

    await userEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
