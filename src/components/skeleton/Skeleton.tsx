import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface SkeletonAvatarConfig {
  size?: number | 'small' | 'default' | 'large';
  shape?: 'circle' | 'square';
}

export interface SkeletonTitleConfig {
  width?: number | string;
}

export interface SkeletonParagraphConfig {
  rows?: number;
  width?: number | string | Array<number | string>;
}

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** When omitted, children presence decides whether the skeleton renders. */
  loading?: boolean;
  /** Enables the shimmer animation. */
  active?: boolean;
  avatar?: boolean | SkeletonAvatarConfig;
  title?: boolean | SkeletonTitleConfig;
  paragraph?: boolean | SkeletonParagraphConfig;
  round?: boolean;
  children?: ReactNode;
}

const AVATAR_SIZE: Record<Exclude<NonNullable<SkeletonAvatarConfig['size']>, number>, number> = {
  small: 24,
  default: 40,
  large: 56,
};

function width(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  {
    loading,
    active = false,
    avatar = false,
    title = true,
    paragraph = true,
    round = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const show = loading === undefined ? children === undefined || children === null : loading;

  if (!show) return <>{children}</>;

  const avatarConfig: SkeletonAvatarConfig | null =
    avatar === true ? {} : avatar || null;
  const titleConfig: SkeletonTitleConfig | null =
    title === true ? {} : title || null;
  const paragraphConfig: SkeletonParagraphConfig | null =
    paragraph === true ? {} : paragraph || null;

  const avatarSizeValue = avatarConfig?.size ?? 'default';
  const avatarSize =
    typeof avatarSizeValue === 'number' ? avatarSizeValue : AVATAR_SIZE[avatarSizeValue];
  const avatarShape = avatarConfig?.shape ?? 'circle';
  const rows = paragraphConfig?.rows ?? 3;
  const paragraphWidth = paragraphConfig?.width;

  return (
    <div
      ref={ref}
      className={cx(
        'rc-skeleton',
        active && 'rc-skeleton--active',
        avatarConfig && 'rc-skeleton--with-avatar',
        round && 'rc-skeleton--round',
        className,
      )}
      aria-busy="true"
      aria-live="polite"
      {...rest}
    >
      {avatarConfig ? (
        <div
          className={cx('rc-skeleton__avatar', `rc-skeleton__avatar--${avatarShape}`)}
          style={{ width: avatarSize, height: avatarSize }}
        />
      ) : null}
      <div className="rc-skeleton__content">
        {titleConfig ? (
          <div
            className="rc-skeleton__title"
            style={{ width: width(titleConfig.width) ?? '38%' }}
          />
        ) : null}
        {paragraphConfig ? (
          <div className="rc-skeleton__paragraph">
            {Array.from({ length: rows }, (_, index) => {
              const customWidth = Array.isArray(paragraphWidth)
                ? paragraphWidth[index]
                : paragraphWidth;
              const rowWidth =
                width(customWidth) ?? (index === rows - 1 ? '61%' : '100%');
              return (
                <div
                  key={index}
                  className="rc-skeleton__line"
                  style={{ width: rowWidth }}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
});
