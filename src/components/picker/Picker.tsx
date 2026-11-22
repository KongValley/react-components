import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Popup } from '../popup';
import { cx } from '../../utils/cx';

export type PickerValue = string | number;

export interface PickerOption {
  label: ReactNode;
  value: PickerValue;
}

export interface PickerColumn {
  key?: string;
  values: PickerOption[];
}

export interface PickerProps {
  open?: boolean;
  columns: PickerColumn[];
  value?: PickerValue[];
  defaultValue?: PickerValue[];
  /** Called after the user confirms a selection. */
  onChange?: (value: PickerValue[], options: PickerOption[]) => void;
  onConfirm?: (value: PickerValue[], options: PickerOption[]) => void;
  /** Called when the picker is dismissed without confirming. */
  onCancel?: () => void;
  onClose?: () => void;
  title?: ReactNode;
  cancelText?: ReactNode;
  confirmText?: ReactNode;
  maskClosable?: boolean;
  safeArea?: boolean;
  afterClose?: () => void;
  getContainer?: () => HTMLElement | null;
  zIndex?: number;
  className?: string;
}

const ITEM_HEIGHT = 36;

function toIndices(values: PickerValue[] | undefined, columns: PickerColumn[]): number[] {
  return columns.map((column, index) => {
    const current = values?.[index];
    if (current === undefined) return 0;
    const found = column.values.findIndex((option) => Object.is(option.value, current));
    return found >= 0 ? found : 0;
  });
}

/** Scrollable wheel picker with one or more columns. */
export function Picker({
  open = false,
  columns,
  value,
  defaultValue,
  onChange,
  onConfirm,
  onCancel,
  onClose,
  title,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  maskClosable = true,
  safeArea = true,
  afterClose,
  getContainer,
  zIndex,
  className,
}: PickerProps) {
  const [innerValue, setInnerValue] = useState<PickerValue[]>(defaultValue ?? []);
  const [indices, setIndices] = useState<number[]>(() =>
    toIndices(value ?? defaultValue, columns),
  );
  const wheelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const baseId = useId();

  useEffect(() => {
    if (!open) return;

    const initial = toIndices(value ?? innerValue, columns);
    setIndices(initial);

    let frame = 0;
    let attempts = 0;
    const syncScroll = () => {
      const wheels = wheelRefs.current;
      if (wheels.length === columns.length && wheels.every(Boolean)) {
        wheels.forEach((wheel, index) => {
          if (wheel) wheel.scrollTop = (initial[index] ?? 0) * ITEM_HEIGHT;
        });
        return;
      }
      attempts += 1;
      if (attempts < 20) frame = window.requestAnimationFrame(syncScroll);
    };
    frame = window.requestAnimationFrame(syncScroll);

    return () => window.cancelAnimationFrame(frame);
    // The selection is snapshotted when the picker opens; controlled updates
    // while open should not fight the user's scrolling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const selectIndex = (columnIndex: number, index: number) => {
    const column = columns[columnIndex];
    if (!column) return;
    const nextIndex = Math.max(0, Math.min(column.values.length - 1, index));
    setIndices((previous) => {
      if (previous[columnIndex] === nextIndex) return previous;
      const next = [...previous];
      next[columnIndex] = nextIndex;
      return next;
    });
    const wheel = wheelRefs.current[columnIndex];
    if (wheel) {
      if (typeof wheel.scrollTo === 'function') {
        wheel.scrollTo({ top: nextIndex * ITEM_HEIGHT, behavior: 'smooth' });
      } else {
        wheel.scrollTop = nextIndex * ITEM_HEIGHT;
      }
    }
  };

  const handleScroll = (columnIndex: number, scrollTop: number) => {
    const column = columns[columnIndex];
    if (!column) return;
    const index = Math.max(
      0,
      Math.min(column.values.length - 1, Math.round(scrollTop / ITEM_HEIGHT)),
    );
    setIndices((previous) => {
      if (previous[columnIndex] === index) return previous;
      const next = [...previous];
      next[columnIndex] = index;
      return next;
    });
  };

  const handleWheelKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    columnIndex: number,
  ) => {
    const column = columns[columnIndex];
    if (!column) return;
    const current = indices[columnIndex] ?? 0;
    let target: number | undefined;
    if (event.key === 'ArrowDown') target = current + 1;
    else if (event.key === 'ArrowUp') target = current - 1;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = column.values.length - 1;
    if (target === undefined) return;
    event.preventDefault();
    selectIndex(columnIndex, target);
  };

  const collect = () => {
    const nextValue: PickerValue[] = [];
    const nextOptions: PickerOption[] = [];
    columns.forEach((column, columnIndex) => {
      const option = column.values[indices[columnIndex] ?? 0];
      if (option) {
        nextValue.push(option.value);
        nextOptions.push(option);
      }
    });
    return { nextValue, nextOptions };
  };

  const handleConfirm = () => {
    const { nextValue, nextOptions } = collect();
    setInnerValue(nextValue);
    onChange?.(nextValue, nextOptions);
    onConfirm?.(nextValue, nextOptions);
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  return (
    <Popup
      open={open}
      position="bottom"
      round
      safeArea={safeArea}
      maskClosable={maskClosable}
      showHandle={false}
      className={cx('rc-picker', className)}
      bodyStyle={{ padding: 0 }}
      onClose={handleCancel}
      afterClose={afterClose}
      getContainer={getContainer}
      zIndex={zIndex}
      aria-label={typeof title === 'string' ? title : 'Picker'}
    >
      <div className="rc-picker__header">
        <button
          type="button"
          className="rc-picker__button"
          onClick={handleCancel}
        >
          {cancelText}
        </button>
        <div className="rc-picker__title">{title}</div>
        <button
          type="button"
          className="rc-picker__button rc-picker__button--confirm"
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
      <div className="rc-picker__columns">
        {columns.map((column, columnIndex) => {
          const columnId = `${baseId}-column-${columnIndex}`;
          const activeIndex = indices[columnIndex] ?? 0;
          return (
            <div className="rc-picker__column" key={column.key ?? columnIndex}>
              <div
                ref={(node) => {
                  wheelRefs.current[columnIndex] = node;
                }}
                className="rc-picker__wheel"
                role="listbox"
                tabIndex={0}
                aria-label={column.key ?? `Column ${columnIndex + 1}`}
                aria-activedescendant={`${columnId}-option-${activeIndex}`}
                onKeyDown={(event) => handleWheelKeyDown(event, columnIndex)}
                onScroll={(event) =>
                  handleScroll(columnIndex, event.currentTarget.scrollTop)
                }
              >
                {column.values.map((option, optionIndex) => (
                  <div
                    key={`${String(option.value)}-${optionIndex}`}
                    id={`${columnId}-option-${optionIndex}`}
                    className={cx(
                      'rc-picker__item',
                      optionIndex === activeIndex && 'rc-picker__item--active',
                    )}
                    role="option"
                    aria-selected={optionIndex === activeIndex}
                    onClick={() => selectIndex(columnIndex, optionIndex)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div className="rc-picker__indicator" aria-hidden="true" />
        <div className="rc-picker__fade rc-picker__fade--top" aria-hidden="true" />
        <div className="rc-picker__fade rc-picker__fade--bottom" aria-hidden="true" />
      </div>
    </Popup>
  );
}
