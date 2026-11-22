import { useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Icon } from '../../icons';
import type { IconName } from '../../icons';
import { canUseDOM } from '../../utils/dom';
import { cx } from '../../utils/cx';
import { Modal } from './Modal';

export type ConfirmType = 'info' | 'success' | 'warning' | 'error';

export interface ConfirmOptions {
  title?: ReactNode;
  content?: ReactNode;
  okText?: ReactNode;
  cancelText?: ReactNode;
  type?: ConfirmType;
  icon?: ReactNode;
  width?: number | string;
  centered?: boolean;
  /** Uses the mobile bottom-sheet presentation when the device is mobile. */
  adaptive?: boolean;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  afterClose?: () => void;
}

export interface ConfirmInstance {
  destroy: () => void;
}

const ICONS: Record<ConfirmType, IconName> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

/** Imperative confirmation dialog rendered into a dedicated portal host. */
export function confirm(options: ConfirmOptions = {}): ConfirmInstance {
  if (!canUseDOM) return { destroy: () => {} };

  const type = options.type ?? 'info';
  const container = document.createElement('div');
  container.className = 'rcui-modal-confirm-host';
  document.body.appendChild(container);
  const root = createRoot(container);
  let cleaned = false;

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    root.unmount();
    container.remove();
    options.afterClose?.();
  };

  function ConfirmDialog() {
    const [open, setOpen] = useState(true);
    const close = () => setOpen(false);

    return (
      <Modal
        open={open}
        title={options.title}
        afterClose={cleanup}
        onCancel={() => {
          options.onCancel?.();
          close();
        }}
        onOk={async () => {
          await options.onOk?.();
          close();
        }}
        okText={options.okText ?? 'OK'}
        cancelText={options.cancelText ?? 'Cancel'}
        centered={options.centered ?? true}
        width={options.width ?? 416}
        adaptive={options.adaptive}
        closable={false}
        maskClosable={false}
      >
        <div className="rcui-modal-confirm">
          <span className={cx('rcui-modal-confirm__icon', `rcui-modal-confirm__icon--${type}`)}>
            {options.icon ?? <Icon name={ICONS[type]} size={22} />}
          </span>
          <div className="rcui-modal-confirm__content">{options.content}</div>
        </div>
      </Modal>
    );
  }

  root.render(<ConfirmDialog />);

  return { destroy: cleanup };
}
