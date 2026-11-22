import {
  createContext,
  forwardRef,
  useContext,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';

export type RowJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch';

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  /** Horizontal gutter, or [horizontal, vertical] gutter in pixels. */
  gutter?: number | [number, number];
  justify?: RowJustify;
  align?: RowAlign;
  wrap?: boolean;
  children?: ReactNode;
}

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns out of 24. */
  span?: number;
  /** Number of columns to offset from the left. */
  offset?: number;
  order?: number;
  /** CSS flex shorthand applied to the column. */
  flex?: number | string;
  children?: ReactNode;
}

const GuttersContext = createContext<readonly [number, number]>([0, 0]);

const JUSTIFY_MAP: Record<RowJustify, CSSProperties['justifyContent']> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  'space-between': 'space-between',
  'space-around': 'space-around',
  'space-evenly': 'space-evenly',
};

const ALIGN_MAP: Record<RowAlign, CSSProperties['alignItems']> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
  stretch: 'stretch',
};

export const Row = forwardRef<HTMLDivElement, RowProps>(function Row(
  {
    gutter = 0,
    justify = 'start',
    align = 'top',
    wrap = true,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const [horizontal, vertical] = Array.isArray(gutter) ? gutter : [gutter, 0];

  return (
    <GuttersContext.Provider value={[horizontal, vertical]}>
      <div
        ref={ref}
        className={cx('rc-row', !wrap && 'rc-row--nowrap', className)}
        style={{
          marginLeft: horizontal / -2,
          marginRight: horizontal / -2,
          rowGap: vertical || undefined,
          justifyContent: JUSTIFY_MAP[justify],
          alignItems: ALIGN_MAP[align],
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </GuttersContext.Provider>
  );
});

export const Col = forwardRef<HTMLDivElement, ColProps>(function Col(
  { span, offset = 0, order, flex, className, style, children, ...rest },
  ref,
) {
  const [horizontal] = useContext(GuttersContext);
  const width = span === undefined ? undefined : `${(span / 24) * 100}%`;

  return (
    <div
      ref={ref}
      className={cx('rc-col', className)}
      style={{
        flex: width ? `0 0 ${width}` : undefined,
        maxWidth: width,
        marginLeft: offset ? `${(offset / 24) * 100}%` : undefined,
        order,
        paddingLeft: horizontal / 2,
        paddingRight: horizontal / 2,
        ...(flex !== undefined
          ? { flex: typeof flex === 'number' ? `${flex} ${flex} auto` : flex }
          : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
