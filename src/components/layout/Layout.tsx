import {
  Children,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks/useControllableState';

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** Usually auto-detected from a direct <Sider> child; override when nested. */
  hasSider?: boolean;
  children?: ReactNode;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface ContentProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface SiderProps extends HTMLAttributes<HTMLElement> {
  width?: number | string;
  collapsedWidth?: number | string;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  collapsible?: boolean;
  /** Custom trigger content; set to null to hide the built-in trigger. */
  trigger?: ReactNode | null;
  children?: ReactNode;
}

const LayoutRoot = forwardRef<HTMLDivElement, LayoutProps>(function Layout(
  { hasSider, className, children, ...rest },
  ref,
) {
  const detectedSider = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === Sider,
  );
  const withSider = hasSider ?? detectedSider;

  return (
    <div
      ref={ref}
      className={cx('rc-layout', withSider && 'rc-layout--has-sider', className)}
      {...rest}
    >
      {children}
    </div>
  );
});

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  { className, children, ...rest },
  ref,
) {
  return (
    <header ref={ref} className={cx('rc-layout-header', className)} {...rest}>
      {children}
    </header>
  );
});

export const Content = forwardRef<HTMLElement, ContentProps>(function Content(
  { className, children, ...rest },
  ref,
) {
  return (
    <main ref={ref} className={cx('rc-layout-content', className)} {...rest}>
      {children}
    </main>
  );
});

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { className, children, ...rest },
  ref,
) {
  return (
    <footer ref={ref} className={cx('rc-layout-footer', className)} {...rest}>
      {children}
    </footer>
  );
});

const Sider = forwardRef<HTMLElement, SiderProps>(function Sider(
  {
    width = 220,
    collapsedWidth = 72,
    collapsed,
    defaultCollapsed = false,
    onCollapse,
    collapsible = false,
    trigger,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const [isCollapsed, setCollapsed] = useControllableState({
    value: collapsed,
    defaultValue: defaultCollapsed,
    onChange: onCollapse,
  });

  const currentWidth = isCollapsed ? collapsedWidth : width;
  const showTrigger = collapsible && trigger !== null;

  return (
    <aside
      ref={ref}
      className={cx('rc-layout-sider', isCollapsed && 'rc-layout-sider--collapsed', className)}
      style={{ width: currentWidth, flex: `0 0 ${typeof currentWidth === 'number' ? `${currentWidth}px` : currentWidth}`, ...style }}
      {...rest}
    >
      <div className="rc-layout-sider__children">{children}</div>
      {showTrigger ? (
        <button
          type="button"
          className="rc-layout-sider__trigger"
          onClick={() => setCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
        >
          {trigger ?? <Icon name={isCollapsed ? 'chevron-right' : 'chevron-left'} />}
        </button>
      ) : null}
    </aside>
  );
});

type LayoutComponent = typeof LayoutRoot & {
  Header: typeof Header;
  Content: typeof Content;
  Footer: typeof Footer;
  Sider: typeof Sider;
};

export const Layout = Object.assign(LayoutRoot, {
  Header,
  Content,
  Footer,
  Sider,
}) as LayoutComponent;
