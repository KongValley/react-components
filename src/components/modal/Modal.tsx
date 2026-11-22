import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons';
import { Portal } from '../../internal/Portal';
import { usePresence } from '../../hooks/usePresence';
import { useLockScroll } from '../../hooks/useLockScroll';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useDevice } from '../../hooks/useDevice';
import { cx } from '../../utils/cx';
import { Popup } from '../popup/Popup';
import { useModalFooter } from './useModalFooter';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open?: boolean;
  title?: ReactNode;
  children?: ReactNode;
  /** Custom footer. Pass null to hide it entirely. */
  footer?: ReactNode | null;
  okText?: ReactNode;
  cancelText?: ReactNode;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmLoading?: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  width?: number | string;
  centered?: boolean;
  /** Renders as a bottom sheet on mobile devices. */
  adaptive?: boolean;
  afterClose?: () => void;
  getContainer?: () => HTMLElement | null;
  zIndex?: number;
}

type ModalShellProps = Omit<
  ModalProps,
  'footer' | 'okText' | 'cancelText' | 'onOk' | 'confirmLoading' | 'adaptive'
> & {
  forwardedRef: ForwardedRef<HTMLDivElement>;
  footerNode: ReactNode;
};

function DesktopModal({
  open = false,
  title,
  children,
  onCancel,
  closable = true,
  maskClosable = true,
  keyboard = true,
  width = 520,
  centered = false,
  afterClose,
  getContainer,
  zIndex,
  className,
  forwardedRef,
  footerNode,
  ...rest
}: ModalShellProps) {
  const { mounted, active } = usePresence(open, 230);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const openedRef = useRef(false);

  useLockScroll(mounted);
  useFocusTrap(modalRef, open && mounted);
  useEscapeKey(() => {
    if (open) onCancel?.();
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

  return (
    <Portal container={getContainer?.()}>
      <div
        className={cx('rc-modal-root', centered && 'rc-modal-root--centered')}
        style={zIndex !== undefined ? { zIndex } : undefined}
      >
        <div className={cx('rc-modal-mask', active && 'rc-modal-mask--active')} aria-hidden="true" />
        <div
          className="rc-modal-wrap"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && maskClosable) onCancel?.();
          }}
        >
          <div
            {...rest}
            ref={(node) => {
              modalRef.current = node;
              if (typeof forwardedRef === 'function') forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }}
            className={cx('rc-modal', active && 'rc-modal--active', className)}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title !== undefined ? titleId : undefined}
            tabIndex={-1}
            style={{ width }}
          >
            {title !== undefined || closable ? (
              <div className="rc-modal__header">
                <div className="rc-modal__title" id={title !== undefined ? titleId : undefined}>
                  {title}
                </div>
                {closable ? (
                  <button
                    type="button"
                    className="rc-modal__close"
                    aria-label="Close dialog"
                    onClick={onCancel}
                  >
                    <Icon name="close" size={16} />
                  </button>
                ) : null}
              </div>
            ) : null}
            <div className="rc-modal__body">{children}</div>
            {footerNode}
          </div>
        </div>
      </div>
    </Portal>
  );
}

function ModalSheet({
  open = false,
  title,
  children,
  onCancel,
  closable = true,
  maskClosable = true,
  keyboard = true,
  width: _width,
  centered: _centered,
  afterClose,
  getContainer,
  zIndex,
  className,
  forwardedRef,
  footerNode,
  ...rest
}: ModalShellProps) {
  return (
    <Popup
      {...rest}
      ref={forwardedRef}
      open={open}
      position="bottom"
      title={title}
      closable={closable}
      maskClosable={maskClosable}
      keyboard={keyboard}
      onClose={onCancel}
      afterClose={afterClose}
      getContainer={getContainer}
      zIndex={zIndex}
      className={cx('rc-modal-sheet', className)}
      bodyStyle={{ padding: 0 }}
    >
      <div className="rc-modal__body">{children}</div>
      {footerNode}
    </Popup>
  );
}

/**
 * Dialog that stays a centered/layered modal on desktop. Enable `adaptive`
 * (or `ConfigProvider adaptive`) to render it as a bottom sheet on mobile.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(props, ref) {
  const {
    open = false,
    footer,
    okText = 'OK',
    cancelText = 'Cancel',
    onOk,
    onCancel,
    confirmLoading = false,
    adaptive,
    ...rest
  } = props;
  const { isMobile, adaptive: contextAdaptive } = useDevice();
  const footerNode = useModalFooter({
    open,
    footer,
    okText,
    cancelText,
    onOk,
    onCancel,
    confirmLoading,
  });
  const shouldAdapt = adaptive ?? contextAdaptive;

  if (shouldAdapt && isMobile) {
    return (
      <ModalSheet
        {...rest}
        open={open}
        onCancel={onCancel}
        forwardedRef={ref}
        footerNode={footerNode}
      />
    );
  }

  return (
    <DesktopModal
      {...rest}
      open={open}
      onCancel={onCancel}
      forwardedRef={ref}
      footerNode={footerNode}
    />
  );
});
