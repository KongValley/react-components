import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Stepper } from '../Stepper';

describe('Stepper', () => {
  it('increments, decrements, and respects bounds', async () => {
    render(<Stepper defaultValue={2} min={1} max={3} />);

    const input = screen.getByRole('textbox', { name: 'Value' });
    const increase = screen.getByRole('button', { name: 'Increase value' });
    const decrease = screen.getByRole('button', { name: 'Decrease value' });

    await userEvent.click(increase);
    expect(input).toHaveValue('3');
    expect(increase).toBeDisabled();

    await userEvent.click(decrease);
    await userEvent.click(decrease);
    expect(input).toHaveValue('1');
    expect(decrease).toBeDisabled();
  });

  it('commits typed values with clamping on blur', async () => {
    render(<Stepper defaultValue={2} min={0} max={10} />);

    const input = screen.getByRole('textbox', { name: 'Value' });
    await userEvent.clear(input);
    await userEvent.type(input, '99');
    await userEvent.tab();

    expect(input).toHaveValue('10');
    expect(screen.getByRole('button', { name: 'Increase value' })).toBeDisabled();
  });

  it('applies the configured precision', async () => {
    render(<Stepper defaultValue={1} step={0.1} precision={1} max={2} />);

    const input = screen.getByRole('textbox', { name: 'Value' });
    await userEvent.click(screen.getByRole('button', { name: 'Increase value' }));
    expect(input).toHaveValue('1.1');
  });
});
