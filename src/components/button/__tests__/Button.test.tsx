import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children and handles clicks', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button')).toHaveClass('rcui-btn--default');
  });

  it('supports primary variant and native submit type', () => {
    render(
      <Button variant="primary" htmlType="submit">
        Submit
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveClass('rcui-btn--primary');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('is disabled and busy while loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
