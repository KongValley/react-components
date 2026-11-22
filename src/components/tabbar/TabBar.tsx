import {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { cx } from '../../utils/cx';

export interface TabBarItem {
  key: string;
  title: ReactNode;
  icon?: ReactNode;
  activeIcon?: ReactNode;
  badge?: ReactNode;
  dot?: boolean;
  disabled?: boolean;
}

export interface TabBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabBarItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  /** Fixes the bar to the bottom of the viewport. */
  fixed?: boolean;
  /** Reserves layout space while `fixed` is enabled. */
  placeholder?: boolean;
  /** Respects the bottom safe-area inset. */
  safeArea?: boolean;
}

function formatBadge(badge: ReactNode): ReactNode {
  if (typeof badge === 'number' && badge > 99) return '99+';
  return badge;
}

/** Bottom navigation bar with icons, labels and badges. */
export const TabBar = forwardRef<HTMLDivElement, TabBarProps>(function TabBar(
  {
    items,
    activeKey,
    defaultActiveKey,
    onChange,
    fixed = false,
    placeholder = true,
    safeArea = true,
    className,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const [currentKey, setCurrentKey] = useControllableState({
    value: activeKey,
    defaultValue: defaultActiveKey ?? items[0]?.key ?? '',
    onChange,
  });
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const findEnabled = (from: number, step: 1 | -1): number => {
    for (let offset = 1; offset <= items.length; offset += 1) {
      const index = (from + step * offset + items.length) % items.length;
      if (!items[index]?.disabled) return index;
    }
    return from;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let target: number | undefined;
    if (event.key === 'ArrowRight') target = findEnabled(index, 1);
    else if (event.key === 'ArrowLeft') target = findEnabled(index, -1);
    else if (event.key === 'Home') target = findEnabled(-1, 1);
    else if (event.key === 'End') target = findEnabled(items.length, -1);

    if (target === undefined) return;
    event.preventDefault();
    const item = items[target];
    if (!item || item.disabled) return;
    setCurrentKey(item.key);
    itemRefs.current[target]?.focus({ preventScroll: true });
  };

  const showPlaceholder = fixed && placeholder;

  return (
    <>
      <div
        {...rest}
        ref={ref}
        className={cx(
          'rcui-tabbar',
          fixed && 'rcui-tabbar--fixed',
          safeArea && 'rcui-tabbar--safe-area',
          className,
        )}
      >
        <div
          className="rcui-tabbar__inner"
          role="tablist"
          aria-label={ariaLabel ?? 'Bottom navigation'}
        >
          {items.map((item, index) => {
            const active = item.key === currentKey;
            const hasBadge = !active && (item.dot || (item.badge !== undefined && item.badge !== null));
            return (
              <button
                key={item.key}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                aria-selected={active}
                aria-disabled={item.disabled || undefined}
                disabled={item.disabled}
                tabIndex={active ? 0 : -1}
                className={cx(
                  'rcui-tabbar__item',
                  active && 'rcui-tabbar__item--active',
                  item.disabled && 'rcui-tabbar__item--disabled',
                )}
                onClick={() => {
                  if (item.disabled) return;
                  setCurrentKey(item.key);
                }}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className="rcui-tabbar__icon">
                  {active && item.activeIcon !== undefined ? item.activeIcon : item.icon}
                  {hasBadge ? (
                    item.dot ? (
                      <span className="rcui-tabbar__badge rcui-tabbar__badge--dot" />
                    ) : (
                      <span className="rcui-tabbar__badge">{formatBadge(item.badge)}</span>
                    )
                  ) : null}
                </span>
                <span className="rcui-tabbar__title">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>
      {showPlaceholder ? (
        <div
          className={cx(
            'rcui-tabbar-placeholder',
            safeArea && 'rcui-tabbar-placeholder--safe-area',
          )}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
});
