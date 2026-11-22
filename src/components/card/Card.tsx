import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from 'react';
import { cx } from '../../utils/cx';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  extra?: ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  size?: 'default' | 'small';
  cover?: ReactNode;
  /** Rendered as a divided footer strip. */
  actions?: ReactNode[];
  /** Replaces the body with a skeleton placeholder. */
  loading?: boolean;
  children?: ReactNode;
}

export interface CardMetaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  avatar?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    title,
    extra,
    bordered = true,
    hoverable = false,
    size = 'default',
    cover,
    actions,
    loading = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const hasHeader = title !== undefined || extra !== undefined;
  const hasActions = Boolean(actions && actions.length > 0);

  return (
    <div
      ref={ref}
      className={cx(
        'rc-card',
        bordered && 'rc-card--bordered',
        hoverable && 'rc-card--hoverable',
        size === 'small' && 'rc-card--small',
        loading && 'rc-card--loading',
        className,
      )}
      aria-busy={loading || undefined}
      {...rest}
    >
      {cover ? <div className="rc-card__cover">{cover}</div> : null}
      {hasHeader ? (
        <div className="rc-card__header">
          <div className="rc-card__title">{title}</div>
          {extra !== undefined ? <div className="rc-card__extra">{extra}</div> : null}
        </div>
      ) : null}
      <div className="rc-card__body">
        {loading ? (
          <div className="rc-card__skeleton" aria-hidden="true">
            <span className="rc-card__skeleton-line rc-card__skeleton-line--title" />
            <span className="rc-card__skeleton-line" />
            <span className="rc-card__skeleton-line" />
            <span className="rc-card__skeleton-line rc-card__skeleton-line--short" />
          </div>
        ) : (
          children
        )}
      </div>
      {hasActions ? (
        <ul className="rc-card__actions">
          {actions!.map((action, index) => (
            <li key={index} className="rc-card__action">
              {action}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});

const CardMeta = forwardRef<HTMLDivElement, CardMetaProps>(function CardMeta(
  { avatar, title, description, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('rc-card-meta', className)} {...rest}>
      {avatar !== undefined ? <div className="rc-card-meta__avatar">{avatar}</div> : null}
      <div className="rc-card-meta__detail">
        {title !== undefined ? <div className="rc-card-meta__title">{title}</div> : null}
        {description !== undefined ? (
          <div className="rc-card-meta__description">{description}</div>
        ) : null}
      </div>
    </div>
  );
});

type CardComponent = ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>> & {
  Meta: typeof CardMeta;
};

export const Card = Object.assign(CardRoot, { Meta: CardMeta }) as CardComponent;
