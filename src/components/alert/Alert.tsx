import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons';
import type { IconName } from '../../icons';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cx } from '../../utils/cx';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  type?: AlertType;
  message: ReactNode;
  description?: ReactNode;
  showIcon?: boolean;
  icon?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  /** Full-bleed style without rounded corners. */
  banner?: boolean;
  action?: ReactNode;
}

const TYPE_ICON: Record<AlertType, IconName> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    type = 'info',
    message,
    description,
    showIcon = false,
    icon,
    closable = false,
    onClose,
    banner = false,
    action,
    className,
    ...rest
  },
  ref,
) {
  const [phase, setPhase] = useState<'open' | 'closing' | 'closed'>('open');
  const timerRef = useRef<number | undefined>(undefined);
  const reducedMotion = useReducedMotion();

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    [],
  );

  if (phase === 'closed') return null;

  const handleClose = () => {
    if (phase !== 'open') return;
    setPhase('closing');
    onClose?.();
    timerRef.current = window.setTimeout(
      () => setPhase('closed'),
      reducedMotion ? 0 : 180,
    );
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cx(
        'rcui-alert',
        `rcui-alert--${type}`,
        description !== undefined && 'rcui-alert--with-description',
        banner && 'rcui-alert--banner',
        phase === 'closing' && 'rcui-alert--closing',
        className,
      )}
      {...rest}
    >
      {showIcon ? (
        <span className="rcui-alert__icon">
          {icon ?? <Icon name={TYPE_ICON[type]} size={16} />}
        </span>
      ) : null}
      <div className="rcui-alert__body">
        <div className="rcui-alert__message">{message}</div>
        {description !== undefined ? (
          <div className="rcui-alert__description">{description}</div>
        ) : null}
      </div>
      {action !== undefined ? <div className="rcui-alert__action">{action}</div> : null}
      {closable ? (
        <button
          type="button"
          className="rcui-alert__close"
          aria-label="Close alert"
          onClick={handleClose}
        >
          <Icon name="close" size={14} />
        </button>
      ) : null}
    </div>
  );
});
