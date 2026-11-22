import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from '../Tabs';

const items = [
  { key: 'overview', label: 'Overview', children: 'Overview panel' },
  { key: 'settings', label: 'Settings', children: 'Settings panel' },
  { key: 'disabled', label: 'Disabled', children: 'Hidden panel', disabled: true },
];

describe('Tabs', () => {
  it('renders the first tab by default and switches on click', async () => {
    const onChange = vi.fn();
    render(<Tabs items={items} onChange={onChange} />);

    expect(screen.getByText('Overview panel')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(onChange).toHaveBeenCalledWith('settings');
    expect(screen.getByText('Settings panel')).toBeInTheDocument();
    expect(screen.queryByText('Overview panel')).not.toBeInTheDocument();
  });

  it('moves selection with arrow keys and skips disabled tabs', async () => {
    render(<Tabs items={items} />);
    const overview = screen.getByRole('tab', { name: 'Overview' });
    overview.focus();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('renders card type', () => {
    const { container } = render(<Tabs items={items} type="card" />);
    expect(container.querySelector('.rc-tabs--card')).toBeTruthy();
  });
});
