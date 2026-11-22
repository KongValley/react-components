import {
  forwardRef,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';
import { cx } from '../utils/cx';
import { useFloating, type Placement, type ResolvedPlacement } from '../hooks/useFloating';
import { useMergedRef } from '../hooks/useMergedRef';
import { usePresence } from '../hooks/usePresence';
import { Portal } from './Portal';

export interface PopupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  placement?: Placement;
  offset?: number;
  flip?: boolean;
  matchAnchorWidth?: boolean;
  viewportPadding?: number;
  container?: HTMLElement | null;
  className?: string;
  style?: CSSProperties;
  zIndex?: number;
  children: ReactNode | ((placement: ResolvedPlacement) => ReactNode);
}

/**
 * Internal floating-panel primitive: portal + fixed positioning + flip.
 * Visible state and dismissal are owned by the consuming component.
 */
export const Popup = forwardRef<HTMLDivElement, PopupProps>(function Popup(
  {
    open,
    anchorRef,
    placement = 'bottom-start',
    offset = 8,
    flip = true,
    matchAnchorWidth = false,
    viewportPadding = 8,
    container,
    className,
    style,
    zIndex,
    children,
    ...rest
  },
  forwardedRef,
) {
  const { mounted, active } = usePresence(open, 180);
  const floatingRef = useRef<HTMLDivElement>(null);
  const [floatingNode, setFloatingNode] = useState<HTMLDivElement | null>(null);
  const mergedRef = useMergedRef(
    floatingRef,
    forwardedRef,
    (node: HTMLDivElement | null) => setFloatingNode(node),
  );
  // The portal mounts one tick after `open` becomes true, so the panel must be
  // measured only once its DOM node actually exists.
  const floating = useFloating({
    open: open && floatingNode !== null,
    anchorRef,
    floatingRef,
    placement,
    offset,
    flip,
    matchAnchorWidth,
    viewportPadding,
  });

  if (!mounted) return null;

  return (
    <Portal container={container}>
      <div
        ref={mergedRef}
        className={cx('rc-popup', className)}
        data-placement={floating.placement}
        data-state={active ? 'open' : 'closed'}
        aria-hidden={!open || undefined}
        style={{ zIndex, ...floating.style, ...style }}
        {...rest}
      >
        {typeof children === 'function' ? children(floating.placement) : children}
      </div>
    </Portal>
  );
});
