import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SafeArea } from '../SafeArea';

describe('SafeArea', () => {
  it('applies the requested edge classes', () => {
    render(<SafeArea data-testid="safe" position="both" />);
    expect(screen.getByTestId('safe')).toHaveClass('rc-safe-area--both');
  });
});
