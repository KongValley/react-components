import type { ReactNode } from 'react';
import { Popup } from '../popup';
import { cx } from '../../utils/cx';

export interface ActionSheetAction {
  key?: string;
  text: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export interface ActionSheetProps {
  open?: boolean;
  actions: ActionSheetAction[];
  title?: ReactNode;
  description?: ReactNode;
  cancelText?: ReactNode;
  showCancel?: boolean;
  maskClosable?: boolean;
  safeArea?: boolean;
  /** Closes the sheet after a selection. Defaults to true. */
  closeOnSelect?: boolean;
  className?: string;
  onSelect?: (action: ActionSheetAction, index: number) => void;
  onClose?: () => void;
  onCancel?: () => void;
  afterClose?: () => void;
  getContainer?: () => HTMLElement | null;
  zIndex?: number;
}

/** A bottom sheet containing a list of contextual actions. */
export function ActionSheet({
  open = false,
  actions,
  title,
  description,
  cancelText = 'Cancel',
  showCancel = true,
  maskClosable = true,
  safeArea = true,
  closeOnSelect = true,
  className,
  onSelect,
  onClose,
  onCancel,
  afterClose,
  getContainer,
  zIndex,
}: ActionSheetProps) {
  const handleSelect = (action: ActionSheetAction, index: number) => {
    if (action.disabled) return;
    onSelect?.(action, index);
    if (closeOnSelect) onClose?.();
  };

  const handleDismiss = () => {
    onCancel?.();
    onClose?.();
  };

  const heading = title !== undefined || description !== undefined;

  return (
    <Popup
      open={open}
      position="bottom"
      round
      safeArea={safeArea}
      maskClosable={maskClosable}
      className={cx('rcui-action-sheet', className)}
      bodyStyle={{ padding: 0 }}
      onClose={handleDismiss}
      afterClose={afterClose}
      getContainer={getContainer}
      zIndex={zIndex}
      aria-label={typeof title === 'string' ? title : 'Action sheet'}
    >
      {heading ? (
        <div className="rcui-action-sheet__header">
          {title !== undefined ? (
            <div className="rcui-action-sheet__title">{title}</div>
          ) : null}
          {description !== undefined ? (
            <div className="rcui-action-sheet__description">{description}</div>
          ) : null}
        </div>
      ) : null}
      <div
        className="rcui-action-sheet__list"
        role="group"
        aria-label={typeof title === 'string' ? title : 'Actions'}
      >
        {actions.map((action, index) => (
          <button
            key={action.key ?? index}
            type="button"
            className={cx(
              'rcui-action-sheet__item',
              action.danger && 'rcui-action-sheet__item--danger',
              action.description !== undefined && 'rcui-action-sheet__item--detailed',
            )}
            disabled={action.disabled}
            onClick={() => handleSelect(action, index)}
          >
            {action.icon !== undefined ? (
              <span className="rcui-action-sheet__icon">{action.icon}</span>
            ) : null}
            <span className="rcui-action-sheet__text">
              <span className="rcui-action-sheet__label">{action.text}</span>
              {action.description !== undefined ? (
                <span className="rcui-action-sheet__desc">{action.description}</span>
              ) : null}
            </span>
          </button>
        ))}
      </div>
      {showCancel ? (
        <button
          type="button"
          className="rcui-action-sheet__cancel"
          onClick={handleDismiss}
        >
          {cancelText}
        </button>
      ) : null}
    </Popup>
  );
}
