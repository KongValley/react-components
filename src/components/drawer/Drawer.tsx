import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons';
import { Portal } from '../../internal/Portal';
import { usePresence } from '../../hooks/usePresence';
import { useLockScroll } from '../../hooks/useLockScroll';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { cx } from '../../utils/cx';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open?: boolean;
  title?: ReactNode;
  extra?: ReactNode;
  footer?: ReactNode;
  placement?: DrawerPlacement;
  /** Panel width for left/right placements. */
  width?: number | string;
  /** Panel height for top/bottom placements. */
  height?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  getContainer?: () => HTMLElement | null;
  zIndex?: number;
  children?: ReactNode;
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    open = false,
    title,
    extra,
    footer,
    placement = 'right',
    width = 378,
    height = 378,
    closable = true,
    maskClosable = true,
    keyboard = true,
    onClose,
    afterClose,
    getContainer,
    zIndex,
    className,
    children,
    ...rest
  },
  forwardedRef,
) {
  const { mounted, active } = usePresence(open, 300);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const openedRef = useRef(false);

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

  if (!mounted) return null;

  const horizontal = placement === 'left' || placement === 'right';
  const hasHeader = title !== undefined || extra !== undefined || closable;

  return (
    <Portal container={getContainer?.()}>
      <div
        className="rcui-drawer-root"
        style={zIndex !== undefined ? { zIndex } : undefined}
      >
        <div
          className={cx('rcui-drawer-mask', active && 'rcui-drawer-mask--active')}
          aria-hidden="true"
          onClick={maskClosable ? onClose : undefined}
        />
        <div
          {...rest}
          ref={(node) => {
            panelRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          className={cx(
            'rcui-drawer',
            `rcui-drawer--${placement}`,
            active && 'rcui-drawer--active',
            className,
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title !== undefined ? titleId : undefined}
          tabIndex={-1}
          style={horizontal ? { width } : { height }}
        >
          {hasHeader ? (
            <div className="rcui-drawer__header">
              <div className="rcui-drawer__title" id={title !== undefined ? titleId : undefined}>
                {title}
              </div>
              {extra !== undefined ? <div className="rcui-drawer__extra">{extra}</div> : null}
              {closable ? (
                <button
                  type="button"
                  className="rcui-drawer__close"
                  aria-label="Close drawer"
                  onClick={onClose}
                >
                  <Icon name="close" size={16} />
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="rcui-drawer__body">{children}</div>
          {footer !== undefined ? <div className="rcui-drawer__footer">{footer}</div> : null}
        </div>
      </div>
    </Portal>
  );
});
