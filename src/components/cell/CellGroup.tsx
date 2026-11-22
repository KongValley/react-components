import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';

export interface CellGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  /** Rounds the group and insets it from the screen edges. */
  inset?: boolean;
  children?: ReactNode;
}

/** Groups related cells and draws separators between them. */
export const CellGroup = forwardRef<HTMLDivElement, CellGroupProps>(function CellGroup(
  { title, description, inset = false, className, children, ...rest },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cx('rc-cell-group', inset && 'rc-cell-group--inset', className)}
    >
      {title !== undefined || description !== undefined ? (
        <div className="rc-cell-group__header">
          {title !== undefined ? <div className="rc-cell-group__title">{title}</div> : null}
          {description !== undefined ? (
            <div className="rc-cell-group__description">{description}</div>
          ) : null}
        </div>
      ) : null}
      <div className="rc-cell-group__body">{children}</div>
    </div>
  );
});
