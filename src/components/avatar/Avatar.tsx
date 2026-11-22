import { forwardRef, useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons';
import { cx } from '../../utils/cx';

export type AvatarSize = number | 'small' | 'default' | 'large';

const SIZE_MAP: Record<Exclude<AvatarSize, number>, number> = {
  small: 24,
  default: 32,
  large: 40,
};

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  srcSet?: string;
  alt?: string;
  icon?: ReactNode;
  /** Pixel size or preset. */
  size?: AvatarSize;
  shape?: 'circle' | 'square';
  /** Return false to keep the broken image; defaults to showing the fallback. */
  onError?: () => boolean | void;
  children?: ReactNode;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    src,
    srcSet,
    alt,
    icon,
    size = 'default',
    shape = 'circle',
    onError,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const [failed, setFailed] = useState(false);
  const pixels = typeof size === 'number' ? size : SIZE_MAP[size];
  const showImage = Boolean(src) && !failed;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const fallback =
    children ??
    icon ?? (
      <Icon name="user" size={Math.round(pixels * 0.55)} />
    );

  return (
    <span
      ref={ref}
      className={cx(
        'rc-avatar',
        `rc-avatar--${shape}`,
        !showImage && 'rc-avatar--fallback',
        className,
      )}
      style={{
        width: pixels,
        height: pixels,
        fontSize: Math.max(10, Math.round(pixels * 0.4)),
        ...style,
      }}
      role={!showImage && alt ? 'img' : undefined}
      aria-label={!showImage ? alt : undefined}
      {...rest}
    >
      {showImage ? (
        <img
          className="rc-avatar__image"
          src={src}
          srcSet={srcSet}
          alt={alt ?? ''}
          onError={() => {
            const keep = onError?.();
            if (keep !== false) setFailed(true);
          }}
        />
      ) : (
        <span className="rc-avatar__content">{fallback}</span>
      )}
    </span>
  );
});
