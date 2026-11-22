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
        'rcui-card',
        bordered && 'rcui-card--bordered',
        hoverable && 'rcui-card--hoverable',
        size === 'small' && 'rcui-card--small',
        loading && 'rcui-card--loading',
        className,
      )}
      aria-busy={loading || undefined}
      {...rest}
    >
      {cover ? <div className="rcui-card__cover">{cover}</div> : null}
      {hasHeader ? (
        <div className="rcui-card__header">
          <div className="rcui-card__title">{title}</div>
          {extra !== undefined ? <div className="rcui-card__extra">{extra}</div> : null}
        </div>
      ) : null}
      <div className="rcui-card__body">
        {loading ? (
          <div className="rcui-card__skeleton" aria-hidden="true">
            <span className="rcui-card__skeleton-line rcui-card__skeleton-line--title" />
            <span className="rcui-card__skeleton-line" />
            <span className="rcui-card__skeleton-line" />
            <span className="rcui-card__skeleton-line rcui-card__skeleton-line--short" />
          </div>
        ) : (
          children
        )}
      </div>
      {hasActions ? (
        <ul className="rcui-card__actions">
          {actions!.map((action, index) => (
            <li key={index} className="rcui-card__action">
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
    <div ref={ref} className={cx('rcui-card-meta', className)} {...rest}>
      {avatar !== undefined ? <div className="rcui-card-meta__avatar">{avatar}</div> : null}
      <div className="rcui-card-meta__detail">
        {title !== undefined ? <div className="rcui-card-meta__title">{title}</div> : null}
        {description !== undefined ? (
          <div className="rcui-card-meta__description">{description}</div>
        ) : null}
      </div>
    </div>
  );
});

type CardComponent = ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>> & {
  Meta: typeof CardMeta;
};

export const Card = Object.assign(CardRoot, { Meta: CardMeta }) as CardComponent;
