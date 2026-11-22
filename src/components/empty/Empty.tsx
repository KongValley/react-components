import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  description?: ReactNode;
  /** Custom illustration; defaults to the built-in empty state. */
  image?: ReactNode;
  imageStyle?: CSSProperties;
  children?: ReactNode;
}

const DefaultImage = () => (
  <svg width="64" height="41" viewBox="0 0 64 41" aria-hidden="true" focusable="false">
    <ellipse cx="32" cy="34" rx="27" ry="6" fill="var(--rc-color-bg-muted)" />
    <path
      d="M11 22 20 6h24l9 16v8a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3z"
      fill="var(--rc-color-bg-container)"
      stroke="var(--rc-color-border-strong)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M11 22h13l3 5h10l3-5h13"
      fill="none"
      stroke="var(--rc-color-border-strong)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M32 13v5m0 3v.5"
      stroke="var(--rc-color-text-tertiary)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty(
  { description = 'No data', image, imageStyle, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('rc-empty', className)} {...rest}>
      <div className="rc-empty__image" style={imageStyle}>
        {image ?? <DefaultImage />}
      </div>
      {description !== null && description !== undefined ? (
        <div className="rc-empty__description">{description}</div>
      ) : null}
      {children !== undefined ? <div className="rc-empty__actions">{children}</div> : null}
    </div>
  );
});
