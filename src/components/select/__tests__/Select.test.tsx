import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from '../Select';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('Select', () => {
  it('opens, selects an option and closes', async () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} placeholder="Pick a fruit" />);

    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('option', { name: 'Banana' }));
    expect(onChange).toHaveBeenCalledWith('banana');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    await waitFor(() =>
      expect(document.querySelector('.rc-select-dropdown')).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
  });

  it('filters options with the search input', async () => {
    render(<Select options={options} showSearch placeholder="Pick a fruit" />);

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByLabelText('Search options'), 'err');

    expect(screen.getByRole('option', { name: 'Cherry' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
  });

  it('supports keyboard selection', async () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);

    const combo = screen.getByRole('combobox');
    combo.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledWith('banana');
  });

  it('supports multiple selection with tags', async () => {
    const onChange = vi.fn();
    render(<Select mode="multiple" options={options} onChange={onChange} />);

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
    await userEvent.click(screen.getByRole('option', { name: 'Cherry' }));

    expect(onChange).toHaveBeenLastCalledWith(['apple', 'cherry']);
    expect(screen.getByLabelText('Remove Apple')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Remove Apple'));
    expect(onChange).toHaveBeenLastCalledWith(['cherry']);
  });
});
