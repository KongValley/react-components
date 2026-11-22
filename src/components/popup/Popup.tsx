import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons';
import { Portal } from '../../internal/Portal';
import { usePresence } from '../../hooks/usePresence';
import { useLockScroll } from '../../hooks/useLockScroll';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { cx } from '../../utils/cx';

export type PopupPosition = 'bottom' | 'top' | 'left' | 'right' | 'center';

export interface PopupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open?: boolean;
  /** Edge the panel slides in from. `center` renders a centered dialog. */
  position?: PopupPosition;
  title?: ReactNode;
  closable?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  /** Rounds the panel on the side facing the screen. */
  round?: boolean;
  /** Adds the device safe-area inset for vertical placements. */
  safeArea?: boolean;
  /** Shows a drag handle on bottom sheets. Defaults to true for `bottom`. */
  showHandle?: boolean;
  /** Allows dragging the handle downwards to dismiss the sheet. */
  swipeToClose?: boolean;
  bodyStyle?: CSSProperties;
  getContainer?: () => HTMLElement | null;
  zIndex?: number;
  onClose?: () => void;
  afterClose?: () => void;
  children?: ReactNode;
}

const DRAG_CLOSE_THRESHOLD = 72;

export const Popup = forwardRef<HTMLDivElement, PopupProps>(function Popup(
  {
    open = false,
    position = 'bottom',
    title,
    closable = false,
    mask = true,
    maskClosable = true,
    keyboard = true,
    round = true,
    safeArea = true,
    showHandle,
    swipeToClose = true,
    bodyStyle,
    getContainer,
    zIndex,
    onClose,
    afterClose,
    className,
    style,
    children,
    ...rest
  },
  forwardedRef,
) {
  const { mounted, active } = usePresence(open, 280);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const openedRef = useRef(false);
  const dragStartRef = useRef<{ pointerId: number; y: number } | null>(null);
  const dragOffsetRef = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  useLockScroll(mounted);
  useFocusTrap(panelRef, open && mounted);
  useEscapeKey(() => {
    if (open) onClose?.();
  }, open && keyboard);

  useEffect(() => {
    if (open) {
      openedRef.current = true;
      return;
    }
    if (openedRef.current && !mounted) {
      openedRef.current = false;
      afterClose?.();
    }
  }, [open, mounted, afterClose]);

  useEffect(() => {
    if (open) return;
    dragStartRef.current = null;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    setDragging(false);
  }, [open]);

  if (!mounted) return null;

  const hasHandle = showHandle ?? position === 'bottom';
  const hasHeader = title !== undefined || closable;
  const canDrag = hasHandle && position === 'bottom' && swipeToClose;

  const endDrag = (close: boolean) => {
    if (!dragStartRef.current) return;
    dragStartRef.current = null;
    setDragging(false);
    if (close && dragOffsetRef.current >= DRAG_CLOSE_THRESHOLD) {
      onClose?.();
    }
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canDrag || event.button !== 0) return;
    dragStartRef.current = { pointerId: event.pointerId, y: event.clientY };
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const offset = Math.max(0, event.clientY - start.y);
    dragOffsetRef.current = offset;
    setDragOffset(offset);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    endDrag(true);
  };

  const panelStyle = {
    ...style,
    '--rc-popup-drag': `${dragOffset}px`,
  } as CSSProperties;

  return (
    <Portal container={getContainer?.()}>
      <div
        className="rc-popup-layer"
        style={zIndex !== undefined ? { zIndex } : undefined}
      >
        {mask ? (
          <div
            className={cx('rc-popup-mask', active && 'rc-popup-mask--active')}
            aria-hidden="true"
            onClick={maskClosable ? onClose : undefined}
          />
        ) : null}
        <div
          {...rest}
          ref={(node) => {
            panelRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          className={cx(
            'rc-popup-panel',
            `rc-popup-panel--${position}`,
            round && 'rc-popup-panel--round',
            safeArea && 'rc-popup-panel--safe-area',
            active && 'rc-popup-panel--active',
            dragging && 'rc-popup-panel--dragging',
            className,
          )}
          style={panelStyle}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title !== undefined ? titleId : undefined}
          tabIndex={-1}
        >
          {hasHandle ? (
            <div
              className="rc-popup-panel__handle"
              aria-hidden="true"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => endDrag(false)}
            />
          ) : null}
          {hasHeader ? (
            <div className="rc-popup-panel__header">
              <div
                className="rc-popup-panel__title"
                id={title !== undefined ? titleId : undefined}
              >
                {title}
              </div>
              {closable ? (
                <button
                  type="button"
                  className="rc-popup-panel__close"
                  aria-label="Close popup"
                  onClick={onClose}
                >
                  <Icon name="close" size={16} />
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="rc-popup-panel__body" style={bodyStyle}>
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
});
