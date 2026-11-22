import { useEffect, useState, type ReactNode } from 'react';
import { isPromiseLike } from '../../utils';
import { Button } from '../button/Button';

interface ModalFooterOptions {
  open: boolean;
  footer?: ReactNode | null;
  okText: ReactNode;
  cancelText: ReactNode;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmLoading: boolean;
}

/** Builds the shared footer for desktop and mobile modal presentations. */
export function useModalFooter({
  open,
  footer,
  okText,
  cancelText,
  onOk,
  onCancel,
  confirmLoading,
}: ModalFooterOptions): ReactNode {
  const [innerLoading, setInnerLoading] = useState(false);

  useEffect(() => {
    if (!open) setInnerLoading(false);
  }, [open]);

  const handleOk = () => {
    if (!onOk) return;
    const result = onOk();
    if (isPromiseLike(result)) {
      setInnerLoading(true);
      Promise.resolve(result).then(
        () => setInnerLoading(false),
        () => setInnerLoading(false),
      );
    }
  };

  if (footer === null) return null;
  if (footer !== undefined) {
    return <div className="rc-modal__footer">{footer}</div>;
  }
  if (!onOk && !onCancel) return null;

  return (
    <div className="rc-modal__footer">
      {onCancel ? (
        <Button variant="default" onClick={onCancel}>
          {cancelText}
        </Button>
      ) : null}
      {onOk ? (
        <Button
          variant="primary"
          loading={confirmLoading || innerLoading}
          onClick={handleOk}
        >
          {okText}
        </Button>
      ) : null}
    </div>
  );
}
