import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { Popup } from '../../internal/Popup';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useControllableState } from '../../hooks/useControllableState';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useMergedRef } from '../../hooks/useMergedRef';
import { cx } from '../../utils/cx';
import type { Placement } from '../../hooks/useFloating';

export type TooltipTrigger = 'hover' | 'focus' | 'click';

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'title'> {
  title?: ReactNode;
  placement?: Placement;
  trigger?: TooltipTrigger;
  arrow?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Delay in ms before showing (hover/focus triggers). */
  delay?: number;
  disabled?: boolean;
  children: ReactElement;
}

type AnyHandler = ((...args: any[]) => void) | undefined;

function compose(...handlers: AnyHandler[]) {
  return (...args: any[]) => {
    for (const handler of handlers) handler?.(...args);
  };
}

export function Tooltip({
  title,
  placement = 'top',
  trigger = 'hover',
  arrow = true,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  delay = 100,
  disabled = false,
  className,
  children,
  ...rest
}: TooltipProps) {
  const triggerRef = useRef<HTMLElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const tooltipId = useId();

  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    [],
  );

  const hide = () => {
    window.clearTimeout(timerRef.current);
    setOpen(false);
  };

  const show = () => {
    if (disabled) return;
    window.clearTimeout(timerRef.current);
    if (delay > 0) {
      timerRef.current = window.setTimeout(() => setOpen(true), delay);
    } else {
      setOpen(true);
    }
  };

  const toggle = () => {
    if (disabled) return;
    if (open) hide();
    else show();
  };

  const child = children as ReactElement<any>;
  const childRef =
    (child as unknown as { ref?: Ref<HTMLElement> }).ref ??
    (child.props as { ref?: Ref<HTMLElement> }).ref;
  const mergedRef = useMergedRef<HTMLElement>(triggerRef, childRef);

  useClickOutside([triggerRef, popupRef], hide, open && trigger === 'click');
  useEscapeKey(() => {
    if (open) hide();
  }, open);

  const childProps: Record<string, unknown> = { ref: mergedRef };
  const original = child.props as Record<string, unknown>;

  if (trigger === 'hover') {
    childProps.onMouseEnter = compose(original.onMouseEnter as AnyHandler, show);
    childProps.onMouseLeave = compose(original.onMouseLeave as AnyHandler, hide);
    childProps.onFocus = compose(original.onFocus as AnyHandler, show);
    childProps.onBlur = compose(original.onBlur as AnyHandler, hide);
  } else if (trigger === 'focus') {
    childProps.onFocus = compose(original.onFocus as AnyHandler, show);
    childProps.onBlur = compose(original.onBlur as AnyHandler, hide);
  } else {
    childProps.onClick = compose(original.onClick as AnyHandler, toggle);
  }

  if (open) {
    const describedBy = original['aria-describedby'];
    childProps['aria-describedby'] =
      typeof describedBy === 'string' && describedBy
        ? `${describedBy} ${tooltipId}`
        : tooltipId;
  }

  const visible = open && !disabled && title !== undefined && title !== null;

  return (
    <>
      {cloneElement(child, childProps)}
      <Popup
        ref={popupRef}
        open={visible}
        anchorRef={triggerRef}
        placement={placement}
        offset={6}
        className={cx('rc-tooltip', className)}
        id={tooltipId}
        role="tooltip"
        {...rest}
      >
        <div className="rc-tooltip__content">{title}</div>
        {arrow ? <span className="rc-tooltip__arrow" aria-hidden="true" /> : null}
      </Popup>
    </>
  );
}
