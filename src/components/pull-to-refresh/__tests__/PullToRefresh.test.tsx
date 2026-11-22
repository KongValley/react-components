import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PullToRefresh } from '../PullToRefresh';

const touchPoint = (clientY: number) => [{ identifier: 1, clientY }];

function touchStart(element: Element, clientY: number) {
  fireEvent.touchStart(element, { touches: touchPoint(clientY) });
}

function touchMove(element: Element, clientY: number) {
  fireEvent.touchMove(element, { touches: touchPoint(clientY) });
}

function touchEnd(element: Element, clientY: number) {
  fireEvent.touchEnd(element, {
    touches: [],
    changedTouches: touchPoint(clientY),
  });
}

describe('PullToRefresh', () => {
  it('triggers a refresh after pulling past the threshold', async () => {
    let resolve: (() => void) | undefined;
    const onRefresh = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );

    const { container } = render(
      <PullToRefresh onRefresh={onRefresh} minimumSpinTime={0}>
        <div>List content</div>
      </PullToRefresh>,
    );
    const root = container.querySelector('.rcui-pull-refresh');
    expect(root).not.toBeNull();

    touchStart(root as Element, 100);
    touchMove(root as Element, 240);
    touchEnd(root as Element, 240);

    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Refreshing…');

    resolve?.();
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Pull to refresh'),
    );
  });

  it('does not refresh below the threshold', () => {
    const onRefresh = vi.fn();
    const { container } = render(
      <PullToRefresh onRefresh={onRefresh}>
        <div>List content</div>
      </PullToRefresh>,
    );
    const root = container.querySelector('.rcui-pull-refresh') as Element;

    touchStart(root, 100);
    touchMove(root, 130);
    touchEnd(root, 130);

    expect(onRefresh).not.toHaveBeenCalled();
  });

  it('ignores gestures while disabled', () => {
    const onRefresh = vi.fn();
    const { container } = render(
      <PullToRefresh onRefresh={onRefresh} disabled>
        <div>List content</div>
      </PullToRefresh>,
    );
    const root = container.querySelector('.rcui-pull-refresh') as Element;

    touchStart(root, 100);
    touchMove(root, 240);
    touchEnd(root, 240);

    expect(onRefresh).not.toHaveBeenCalled();
  });
});
