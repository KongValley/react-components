import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Picker, type PickerColumn } from '../Picker';

const COLUMNS: PickerColumn[] = [
  {
    key: 'City',
    values: [
      { label: 'Beijing', value: 'bj' },
      { label: 'Shanghai', value: 'sh' },
    ],
  },
  {
    key: 'Team',
    values: [
      { label: 'Frontend', value: 'fe' },
      { label: 'Backend', value: 'be' },
    ],
  },
];

describe('Picker', () => {
  it('renders one listbox per column and confirms values', async () => {
    const onChange = vi.fn();
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <Picker
        open
        title="Configure"
        columns={COLUMNS}
        defaultValue={['sh', 'fe']}
        onChange={onChange}
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Configure' })).toBeInTheDocument();
    expect(screen.getAllByRole('listbox')).toHaveLength(2);

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onChange).toHaveBeenCalledWith(
      ['sh', 'fe'],
      [COLUMNS[0].values[1], COLUMNS[1].values[0]],
    );
    expect(onConfirm).toHaveBeenCalledWith(
      ['sh', 'fe'],
      [COLUMNS[0].values[1], COLUMNS[1].values[0]],
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('reports cancellation without confirming', async () => {
    const onChange = vi.fn();
    const onCancel = vi.fn();
    const onClose = vi.fn();
    render(
      <Picker
        open
        columns={COLUMNS}
        onCancel={onCancel}
        onChange={onChange}
        onClose={onClose}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });
});
