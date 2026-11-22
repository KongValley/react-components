import {
  Children,
  Fragment,
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';

export type SpaceSize = 'small' | 'middle' | 'large' | number;
export type SpaceAlign = 'start' | 'center' | 'end' | 'baseline';

export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  /** Preset, pixel value, or [horizontal, vertical] pair. */
  size?: SpaceSize | [SpaceSize, SpaceSize];
  align?: SpaceAlign;
  wrap?: boolean;
  /** Rendered between every child. */
  split?: ReactNode;
}

const SIZE_MAP: Record<Exclude<SpaceSize, number>, number> = {
  small: 8,
  middle: 12,
  large: 16,
};

const ALIGN_MAP: Record<SpaceAlign, CSSProperties['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  baseline: 'baseline',
};

function resolveSize(size: SpaceSize): number {
  return typeof size === 'number' ? size : SIZE_MAP[size];
}

export const Space = forwardRef<HTMLDivElement, SpaceProps>(function Space(
  {
    direction = 'horizontal',
    size = 'middle',
    align = 'center',
    wrap = false,
    split,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const gap = Array.isArray(size)
    ? ([resolveSize(size[0]), resolveSize(size[1])] as const)
    : ([resolveSize(size), resolveSize(size)] as const);

  const gapStyle: CSSProperties =
    direction === 'vertical'
      ? { rowGap: gap[0] }
      : { columnGap: gap[0], rowGap: wrap ? gap[1] : undefined };

  const items = Children.toArray(children);

  return (
    <div
      ref={ref}
      className={cx(
        'rcui-space',
        `rcui-space--${direction}`,
        wrap && 'rcui-space--wrap',
        className,
      )}
      style={{ ...gapStyle, alignItems: ALIGN_MAP[align], ...style }}
      {...rest}
    >
      {items.map((child, index) => (
        <Fragment key={(child as { key?: string }).key ?? `item-${index}`}>
          {index > 0 && split ? <span className="rcui-space__split">{split}</span> : null}
          <span className="rcui-space__item">{child}</span>
        </Fragment>
      ))}
    </div>
  );
});
