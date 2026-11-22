import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('renders page buttons and emits page changes', async () => {
    const onChange = vi.fn();
    render(<Pagination total={100} defaultPageSize={10} onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onChange).toHaveBeenCalledWith(2, 10);
  });

  it('disables previous on the first page and next on the last page', async () => {
    render(<Pagination total={20} defaultPageSize={10} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('renders simple mode and total summary', () => {
    render(
      <Pagination
        total={42}
        defaultPageSize={10}
        simple
        showTotal={(total) => `Total ${total}`}
      />,
    );
    expect(screen.getByText('Total 42')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
