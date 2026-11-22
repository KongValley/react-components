import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { cx } from '../../utils/cx';

export interface TabItem {
  key: string;
  label: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  type?: 'line' | 'card';
  centered?: boolean;
  extra?: ReactNode;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    items,
    activeKey,
    defaultActiveKey,
    onChange,
    type = 'line',
    centered = false,
    extra,
    className,
    ...rest
  },
  ref,
) {
  const baseId = useId();
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const listRef = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState({ left: 0, width: 0, ready: false });
  const firstEnabled = items.find((item) => !item.disabled)?.key ?? '';

  const [value, setValue] = useControllableState<string>({
    value: activeKey,
    defaultValue: defaultActiveKey ?? firstEnabled,
    onChange,
  });

  const validValue = items.some((item) => item.key === value && !item.disabled)
    ? value
    : firstEnabled;
  const activeItem = items.find((item) => item.key === validValue);

  const measureInk = useCallback(() => {
    const list = listRef.current;
    const tab = tabRefs.current.get(validValue);
    if (!list || !tab) return;

    const left = tab.offsetLeft;
    const width = tab.offsetWidth;
    setInk((previous) =>
      previous.ready &&
      Math.abs(previous.left - left) < 0.5 &&
      Math.abs(previous.width - width) < 0.5
        ? previous
        : { left, width, ready: true },
    );
  }, [validValue]);

  useIsomorphicLayoutEffect(() => {
    if (type === 'line') measureInk();
  }, [type, measureInk, items]);

  useEffect(() => {
    if (type !== 'line') return;
    const list = listRef.current;
    if (!list) return;

    const activeTab = tabRefs.current.get(validValue);
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measureInk);
      observer.observe(list);
      if (activeTab) observer.observe(activeTab);
    }

    const onResize = () => measureInk();
    window.addEventListener('resize', onResize);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [type, measureInk, validValue]);

  const focusTab = (key: string) => {
    setValue(key);
    window.requestAnimationFrame(() => {
      tabRefs.current.get(key)?.focus({ preventScroll: true });
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((item) => !item.disabled);
    if (enabled.length === 0) return;
    const index = enabled.findIndex((item) => item.key === validValue);

    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % enabled.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + enabled.length) % enabled.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = enabled.length - 1;
    else return;

    event.preventDefault();
    focusTab(enabled[nextIndex].key);
  };

  return (
    <div
      ref={ref}
      className={cx(
        'rcui-tabs',
        `rcui-tabs--${type}`,
        centered && 'rcui-tabs--centered',
        className,
      )}
      {...rest}
    >
      <div className="rcui-tabs__nav">
        <div
          ref={listRef}
          className="rcui-tabs__list"
          role="tablist"
          aria-orientation="horizontal"
          onKeyDown={handleKeyDown}
        >
          {items.map((item) => {
            const selected = item.key === validValue;
            return (
              <button
                key={item.key}
                ref={(node) => {
                  if (node) tabRefs.current.set(item.key, node);
                  else tabRefs.current.delete(item.key);
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${item.key}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${item.key}`}
                tabIndex={selected ? 0 : -1}
                disabled={item.disabled}
                className={cx(
                  'rcui-tabs__tab',
                  selected && 'rcui-tabs__tab--active',
                )}
                onClick={() => {
                  if (item.disabled) return;
                  setValue(item.key);
                }}
              >
                {item.icon !== undefined ? (
                  <span className="rcui-tabs__tab-icon">{item.icon}</span>
                ) : null}
                {item.label}
              </button>
            );
          })}
          {type === 'line' ? (
            <span
              className="rcui-tabs__ink"
              aria-hidden="true"
              style={{
                width: ink.width,
                transform: `translate3d(${ink.left}px, 0, 0)`,
                opacity: ink.ready && ink.width > 0 ? 1 : 0,
              }}
            />
          ) : null}
        </div>
        {extra !== undefined ? <div className="rcui-tabs__extra">{extra}</div> : null}
      </div>
      <div
        key={validValue}
        className="rcui-tabs__content"
        role="tabpanel"
        id={`${baseId}-panel-${validValue}`}
        aria-labelledby={`${baseId}-tab-${validValue}`}
        tabIndex={0}
      >
        {activeItem?.children}
      </div>
    </div>
  );
});
