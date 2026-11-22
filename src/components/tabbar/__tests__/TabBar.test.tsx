import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TabBar, type TabBarItem } from '../TabBar';

const ITEMS: TabBarItem[] = [
  { key: 'home', title: 'Home' },
  { key: 'search', title: 'Search', badge: 3 },
  { key: 'profile', title: 'Profile' },
];

describe('TabBar', () => {
  it('switches the active tab and exposes badges', async () => {
    const onChange = vi.fn();
    render(<TabBar items={ITEMS} onChange={onChange} />);

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('3')).toBeInTheDocument();

    await userEvent.click(tabs[1]);
    expect(onChange).toHaveBeenCalledWith('search');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
  });

  it('supports arrow-key navigation', async () => {
    const onChange = vi.fn();
    render(<TabBar items={ITEMS} onChange={onChange} />);

    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenCalledWith('search');
    expect(tabs[1]).toHaveFocus();
  });
});
