import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
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

export interface DropdownMenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface DropdownDivider {
  key?: string;
  type: 'divider';
}

export type DropdownItem = DropdownMenuItem | DropdownDivider;

export interface DropdownMenu {
  items: DropdownItem[];
  onClick?: (key: string) => void;
}

export interface DropdownProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  menu: DropdownMenu;
  trigger?: 'click' | 'hover';
  placement?: Placement;
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

function isDivider(item: DropdownItem): item is DropdownDivider {
  return (item as DropdownDivider).type === 'divider';
}

export function Dropdown({
  menu,
  trigger = 'click',
  placement = 'bottom-start',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
  ...rest
}: DropdownProps) {
  const triggerRef = useRef<HTMLElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

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

  useClickOutside([triggerRef, popupRef], hide, open);
  useEscapeKey(() => {
    if (open) {
      hide();
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, open);

  useEffect(() => {
    if (!open || trigger !== 'click') return;
    const frame = window.requestAnimationFrame(() => {
      const first = itemRefs.current.find((item) => item && !item.disabled);
      first?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, trigger]);

  const original = child.props as Record<string, unknown>;
  const childProps: Record<string, unknown> = {
    ref: mergedRef,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
  };

  if (disabled) childProps['aria-disabled'] = true;

  const openFromKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!disabled) setOpen(true);
    }
  };

  if (trigger === 'click') {
    childProps.onClick = compose(original.onClick as AnyHandler, toggle);
  } else {
    childProps.onMouseEnter = compose(original.onMouseEnter as AnyHandler, hoverOpen);
    childProps.onMouseLeave = compose(original.onMouseLeave as AnyHandler, hoverClose);
    childProps.onFocus = compose(original.onFocus as AnyHandler, hoverOpen);
    childProps.onBlur = compose(original.onBlur as AnyHandler, hoverClose);
  }
  childProps.onKeyDown = compose(
    original.onKeyDown as AnyHandler,
    openFromKeyboard,
  );

  const selectItem = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    item.onClick?.();
    menu.onClick?.(item.key);
    hide();
    triggerRef.current?.focus({ preventScroll: true });
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      hide();
      triggerRef.current?.focus({ preventScroll: true });
      return;
    }
    if (event.key === 'Tab') {
      hide();
      return;
    }

    const buttons = itemRefs.current.filter(
      (item): item is HTMLButtonElement => item !== null && !item.disabled,
    );
    if (buttons.length === 0) return;
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);

    let nextIndex = index;
    if (event.key === 'ArrowDown') nextIndex = index < 0 ? 0 : (index + 1) % buttons.length;
    else if (event.key === 'ArrowUp') {
      nextIndex = index <= 0 ? buttons.length - 1 : index - 1;
    } else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = buttons.length - 1;
    else return;

    event.preventDefault();
    buttons[nextIndex].focus({ preventScroll: true });
  };

  const visible = open && !disabled;

  return (
    <>
      {cloneElement(child, childProps)}
      <Popup
        ref={popupRef}
        open={visible}
        anchorRef={triggerRef}
        placement={placement}
        offset={6}
        className={cx('rcui-dropdown', className)}
        onMouseEnter={trigger === 'hover' ? hoverOpen : undefined}
        onMouseLeave={trigger === 'hover' ? hoverClose : undefined}
        {...rest}
      >
        <div
          className="rcui-dropdown__menu"
          id={menuId}
          role="menu"
          onKeyDown={handleMenuKeyDown}
        >
          {menu.items.map((item, index) => {
            if (isDivider(item)) {
              return (
                <div
                  key={item.key ?? `divider-${index}`}
                  className="rcui-dropdown__divider"
                  role="separator"
                />
              );
            }
            return (
              <button
                key={item.key}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                type="button"
                role="menuitem"
                className={cx(
                  'rcui-dropdown__item',
                  item.danger && 'rcui-dropdown__item--danger',
                )}
                disabled={item.disabled}
                onClick={() => selectItem(item)}
              >
                {item.icon !== undefined ? (
                  <span className="rcui-dropdown__item-icon">{item.icon}</span>
                ) : null}
                <span className="rcui-dropdown__item-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </Popup>
    </>
  );
}
