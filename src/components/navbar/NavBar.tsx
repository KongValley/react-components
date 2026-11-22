import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons';
import { cx } from '../../utils/cx';

export interface NavBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  /** Custom content in the left slot, placed after the back button. */
  left?: ReactNode;
  right?: ReactNode;
  /** Providing `onBack` shows a back button unless `backArrow` is false. */
  onBack?: () => void;
  backArrow?: boolean;
  /** Fixes the bar to the top of the viewport. */
  fixed?: boolean;
  /** Reserves layout space while `fixed` is enabled. */
  placeholder?: boolean;
  /** Respects the top safe-area inset. */
  safeArea?: boolean;
  border?: boolean;
}

/** Compact top navigation bar for mobile screens. */
export const NavBar = forwardRef<HTMLElement, NavBarProps>(function NavBar(
  {
    title,
    left,
    right,
    onBack,
    backArrow = true,
    fixed = false,
    placeholder = true,
    safeArea = true,
    border = true,
    className,
    ...rest
  },
  ref,
) {
  const showBack = backArrow && onBack !== undefined;
  const showPlaceholder = fixed && placeholder;

  return (
    <>
      <header
        {...rest}
        ref={ref}
        className={cx(
          'rc-navbar',
          fixed && 'rc-navbar--fixed',
          safeArea && 'rc-navbar--safe-area',
          border && 'rc-navbar--border',
          className,
        )}
      >
        <div className="rc-navbar__inner">
          <div className="rc-navbar__left">
            {showBack ? (
              <button
                type="button"
                className="rc-navbar__back"
                aria-label="Go back"
                onClick={onBack}
              >
                <Icon name="chevron-left" size={22} />
              </button>
            ) : null}
            {left}
          </div>
          <div className="rc-navbar__title">{title}</div>
          <div className="rc-navbar__right">{right}</div>
        </div>
      </header>
      {showPlaceholder ? (
        <div
          className={cx(
            'rc-navbar-placeholder',
            safeArea && 'rc-navbar-placeholder--safe-area',
          )}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
});
