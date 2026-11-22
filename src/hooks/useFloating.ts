import { useCallback, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';
export type Placement = Side | `${Side}-${Align}`;
export type ResolvedPlacement = `${Side}-${Align}`;

export interface UseFloatingOptions {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  placement?: Placement;
  offset?: number;
  flip?: boolean;
  matchAnchorWidth?: boolean;
  viewportPadding?: number;
}

export interface FloatingState {
  x: number;
  y: number;
  width?: number;
  side: Side;
  align: Align;
  placement: ResolvedPlacement;
  ready: boolean;
  style: CSSProperties;
}

const OPPOSITE: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function parsePlacement(placement: Placement): { side: Side; align: Align } {
  const [side, align] = placement.split('-') as [Side, Align | undefined];
  return { side, align: align ?? 'center' };
}

/**
 * Measurement-driven positioning for fixed-position floating elements.
 * Supports flip, viewport clamping, anchor-width matching and live updates on
 * scroll/resize/content-size changes. No external dependency.
 */
export function useFloating({
  open,
  anchorRef,
  floatingRef,
  placement = 'bottom-start',
  offset = 8,
  flip = true,
  matchAnchorWidth = false,
  viewportPadding = 8,
}: UseFloatingOptions): FloatingState {
  const [state, setState] = useState<FloatingState>(() => ({
    x: 0,
    y: 0,
    side: 'bottom',
    align: 'start',
    placement: 'bottom-start',
    ready: false,
    style: { position: 'fixed', left: 0, top: 0, visibility: 'hidden' },
  }));
  const stateRef = useRef(state);
  const initial = parsePlacement(placement);

  const compute = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating || typeof window === 'undefined') return;

    const anchorRect = anchor.getBoundingClientRect();
    const floatingRect = floating.getBoundingClientRect();
    const floatingWidth = floatingRect.width || floating.offsetWidth;
    const floatingHeight = floatingRect.height || floating.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = viewportPadding;

    let side = initial.side;
    const align = initial.align;

    const fits = (candidate: Side): boolean => {
      switch (candidate) {
        case 'top':
          return anchorRect.top - offset - floatingHeight >= padding;
        case 'bottom':
          return anchorRect.bottom + offset + floatingHeight <= viewportHeight - padding;
        case 'left':
          return anchorRect.left - offset - floatingWidth >= padding;
        case 'right':
          return anchorRect.right + offset + floatingWidth <= viewportWidth - padding;
      }
    };

    if (flip && !fits(side)) {
      const opposite = OPPOSITE[side];
      if (fits(opposite)) {
        side = opposite;
      } else {
        const space: Record<Side, number> = {
          top: anchorRect.top,
          bottom: viewportHeight - anchorRect.bottom,
          left: anchorRect.left,
          right: viewportWidth - anchorRect.right,
        };
        if (space[opposite] > space[side]) side = opposite;
      }
    }

    let x = 0;
    let y = 0;

    if (side === 'top' || side === 'bottom') {
      y = side === 'top' ? anchorRect.top - floatingHeight - offset : anchorRect.bottom + offset;
      if (align === 'start') x = anchorRect.left;
      else if (align === 'end') x = anchorRect.right - floatingWidth;
      else x = anchorRect.left + (anchorRect.width - floatingWidth) / 2;
    } else {
      x = side === 'left' ? anchorRect.left - floatingWidth - offset : anchorRect.right + offset;
      if (align === 'start') y = anchorRect.top;
      else if (align === 'end') y = anchorRect.bottom - floatingHeight;
      else y = anchorRect.top + (anchorRect.height - floatingHeight) / 2;
    }

    const maxX = Math.max(padding, viewportWidth - floatingWidth - padding);
    const maxY = Math.max(padding, viewportHeight - floatingHeight - padding);
    x = Math.min(Math.max(x, padding), maxX);
    y = Math.min(Math.max(y, padding), maxY);

    const resolvedPlacement = `${side}-${align}` as ResolvedPlacement;
    const width = matchAnchorWidth ? Math.round(anchorRect.width) : undefined;
    const previous = stateRef.current;

    if (
      previous.ready &&
      Math.abs(previous.x - x) < 0.5 &&
      Math.abs(previous.y - y) < 0.5 &&
      previous.width === width &&
      previous.placement === resolvedPlacement
    ) {
      return;
    }

    const next: FloatingState = {
      x: Math.round(x),
      y: Math.round(y),
      width,
      side,
      align,
      placement: resolvedPlacement,
      ready: true,
      style: {
        position: 'fixed',
        left: Math.round(x),
        top: Math.round(y),
        width,
        visibility: 'visible',
      },
    };
    stateRef.current = next;
    setState(next);
  }, [
    anchorRef,
    floatingRef,
    initial.side,
    initial.align,
    offset,
    flip,
    matchAnchorWidth,
    viewportPadding,
  ]);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;

    compute();
    const frame = window.requestAnimationFrame(compute);

    const update = () => compute();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(update);
      if (anchorRef.current) observer.observe(anchorRef.current);
      if (floatingRef.current) observer.observe(floatingRef.current);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, [open, compute, anchorRef, floatingRef]);

  return state;
}
