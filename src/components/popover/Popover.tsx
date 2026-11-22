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

export type PopoverTrigger = 'click' | 'hover';

export interface PopoverProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'title'> {
  content: ReactNode;
  title?: ReactNode;
  placement?: Placement;
  trigger?: PopoverTrigger;
  arrow?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: ReactElement;
}

type AnyHandler = ((...args: any[]) => void) | undefined;

function compose(...handlers: AnyHandler[]) {
  return (...args: any[]) => {
    for (const handler of handlers) handler?.(...args);
  };
}

export function Popover({
  content,
  title,
  placement = 'bottom',
  trigger = 'click',
  arrow = true,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
  ...rest
}: PopoverProps) {
  const triggerRef = useRef<HTMLElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const popoverId = useId();

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

  const toggle = () => {
    if (disabled) return;
    setOpen(!open);
  };

  const hoverOpen = () => {
    window.clearTimeout(timerRef.current);
    if (!disabled) setOpen(true);
  };

  const hoverClose = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(false), 120);
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

  if (trigger === 'click') {
    childProps.onClick = compose(original.onClick as AnyHandler, toggle);
  } else {
    childProps.onMouseEnter = compose(original.onMouseEnter as AnyHandler, hoverOpen);
    childProps.onMouseLeave = compose(original.onMouseLeave as AnyHandler, hoverClose);
    childProps.onFocus = compose(original.onFocus as AnyHandler, hoverOpen);
    childProps.onBlur = compose(original.onBlur as AnyHandler, hoverClose);
  }

  const visible = open && !disabled;

  return (
    <>
      {cloneElement(child, childProps)}
      <Popup
        ref={popupRef}
        open={visible}
        anchorRef={triggerRef}
        placement={placement}
        offset={8}
        className={cx('rc-popover', className)}
        id={popoverId}
        role="dialog"
        onMouseEnter={trigger === 'hover' ? hoverOpen : undefined}
        onMouseLeave={trigger === 'hover' ? hoverClose : undefined}
        {...rest}
      >
        {title !== undefined ? <div className="rc-popover__title">{title}</div> : null}
        <div className="rc-popover__content">{content}</div>
        {arrow ? <span className="rc-popover__arrow" aria-hidden="true" /> : null}
      </Popup>
    </>
  );
}
