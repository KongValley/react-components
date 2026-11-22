import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NavBar } from '../NavBar';

describe('NavBar', () => {
  it('renders the title and back action', async () => {
    const onBack = vi.fn();
    render(<NavBar title="Orders" onBack={onBack} right={<span>More</span>} />);

    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Go back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('reserves space when fixed', () => {
    const { container } = render(<NavBar title="Fixed" fixed />);
    expect(container.querySelector('.rcui-navbar--fixed')).not.toBeNull();
    expect(container.querySelector('.rcui-navbar-placeholder')).not.toBeNull();
  });
});
