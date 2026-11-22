import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('tracks input, clears, and submits the current value', async () => {
    const onChange = vi.fn();
    const onSearch = vi.fn();
    render(<SearchBar onChange={onChange} onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search');
    await userEvent.type(input, 'react');
    expect(onChange).toHaveBeenLastCalledWith('react');
    expect(input).toHaveValue('react');

    const form = input.closest('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);
    expect(onSearch).toHaveBeenCalledWith('react');

    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(input).toHaveValue('');
  });

  it('clears the value and notifies on cancel', async () => {
    const onCancel = vi.fn();
    render(
      <SearchBar defaultValue="draft" cancelText="Cancel" onCancel={onCancel} />,
    );

    const input = screen.getByPlaceholderText('Search');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('');
    expect(input).not.toHaveFocus();
  });
});
