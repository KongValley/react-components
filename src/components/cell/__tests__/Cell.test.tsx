import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Cell, CellGroup } from '../index';

describe('Cell', () => {
  it('is clickable and keyboard operable when onClick is provided', async () => {
    const onClick = vi.fn();
    render(<Cell title="Profile" description="Personal details" onClick={onClick} arrow />);

    const cell = screen.getByRole('button', { name: /Profile/ });
    await userEvent.click(cell);
    expect(onClick).toHaveBeenCalledTimes(1);

    cell.focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('does not expose a button role when disabled', async () => {
    const onClick = vi.fn();
    render(<Cell title="Locked" disabled onClick={onClick} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Locked'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders a group heading around cells', () => {
    render(
      <CellGroup title="Account" inset>
        <Cell title="Name" value="Zoe" />
      </CellGroup>,
    );

    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Zoe')).toBeInTheDocument();
  });
});
