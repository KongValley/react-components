import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../Tooltip';

describe('Tooltip', () => {
  it('shows on hover and hides on leave', async () => {
    render(
      <Tooltip title="Helpful hint" delay={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Hover me' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Helpful hint');

    fireEvent.mouseLeave(screen.getByRole('button', { name: 'Hover me' }));
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('opens on focus for keyboard users', async () => {
    render(
      <Tooltip title="Focus hint" delay={0}>
        <button type="button">Focus me</button>
      </Tooltip>,
    );

    fireEvent.focus(screen.getByRole('button', { name: 'Focus me' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Focus hint');
    expect(screen.getByRole('button', { name: 'Focus me' })).toHaveAttribute(
      'aria-describedby',
    );
  });
});
