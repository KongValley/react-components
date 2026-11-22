import {
  Children,
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';

export interface BreadcrumbItem {
  title: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items?: BreadcrumbItem[];
  separator?: ReactNode;
  itemRender?: (item: BreadcrumbItem, index: number, items: BreadcrumbItem[]) => ReactNode;
  children?: ReactNode;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, separator = '/', itemRender, className, children, ...rest },
  ref,
) {
  const itemList = items ?? [];
  const useItems = items !== undefined;
  const nodes = (useItems ? itemList : Children.toArray(children)) as ReactNode[];
  const total = nodes.length;

  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cx('rcui-breadcrumb', className)}
      {...rest}
    >
      <ol className="rcui-breadcrumb__list">
        {nodes.map((node, index) => {
          const last = index === total - 1;
          let content: ReactNode;

          if (useItems) {
            const item = itemList[index];
            if (itemRender) {
              content = itemRender(item, index, itemList);
            } else if (last) {
              content = (
                <span className="rcui-breadcrumb__current" aria-current="page">
                  {item.title}
                </span>
              );
            } else if (item.href !== undefined) {
              content = (
                <a
                  className="rcui-breadcrumb__link"
                  href={item.href}
                  onClick={item.onClick}
                >
                  {item.title}
                </a>
              );
            } else {
              content = <span className="rcui-breadcrumb__text">{item.title}</span>;
            }
          } else {
            content = node;
          }

          return (
            <li key={index} className="rcui-breadcrumb__item">
              {content}
              {!last ? (
                <span className="rcui-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
