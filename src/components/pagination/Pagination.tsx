import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons';
import { Select } from '../select/Select';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils';

type PageItem = number | 'prev-more' | 'next-more';

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  current?: number;
  defaultCurrent?: number;
  pageSize?: number;
  defaultPageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  simple?: boolean;
  disabled?: boolean;
}

function buildPages(current: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'next-more', totalPages];
  }
  if (current >= totalPages - 3) {
    return [
      1,
      'prev-more',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [1, 'prev-more', current - 1, current, current + 1, 'next-more', totalPages];
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(function Pagination(
  {
    current,
    defaultCurrent = 1,
    pageSize,
    defaultPageSize = 10,
    total = 0,
    onChange,
    showSizeChanger = false,
    pageSizeOptions = [10, 20, 50, 100],
    showQuickJumper = false,
    showTotal,
    simple = false,
    disabled = false,
    className,
    ...rest
  },
  ref,
) {
  const [innerCurrent, setInnerCurrent] = useState(defaultCurrent);
  const [innerPageSize, setInnerPageSize] = useState(defaultPageSize);
  const [jumpValue, setJumpValue] = useState('');

  const size = pageSize ?? innerPageSize;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const safeCurrent = clamp(current ?? innerCurrent, 1, totalPages);

  const changePage = (page: number) => {
    if (disabled) return;
    const next = clamp(page, 1, totalPages);
    if (next === safeCurrent) return;
    if (current === undefined) setInnerCurrent(next);
    onChange?.(next, size);
  };

  const changeSize = (nextSize: number) => {
    if (disabled || !Number.isFinite(nextSize) || nextSize <= 0) return;
    if (nextSize === size) return;
    if (pageSize === undefined) setInnerPageSize(nextSize);
    if (current === undefined) setInnerCurrent(1);
    onChange?.(1, nextSize);
  };

  const jumpTo = (next: number) => {
    changePage(next);
  };

  const pages = buildPages(safeCurrent, totalPages);
  const range: [number, number] = [
    total === 0 ? 0 : (safeCurrent - 1) * size + 1,
    Math.min(safeCurrent * size, total),
  ];

  const options = Array.from(new Set([...pageSizeOptions, size]))
    .sort((a, b) => a - b)
    .map((option) => ({ label: `${option} / page`, value: option }));

  return (
    <div
      ref={ref}
      className={cx('rc-pagination', simple && 'rc-pagination--simple', className)}
      role="navigation"
      aria-label="Pagination"
      {...rest}
    >
      {showTotal ? <span className="rc-pagination__total">{showTotal(total, range)}</span> : null}

      <button
        type="button"
        className="rc-pagination__item rc-pagination__item--arrow"
        aria-label="Previous page"
        disabled={disabled || safeCurrent <= 1}
        onClick={() => changePage(safeCurrent - 1)}
      >
        <Icon name="chevron-left" size={14} />
      </button>

      {simple ? (
        <span className="rc-pagination__simple">
          <span className="rc-pagination__simple-current">{safeCurrent}</span>
          <span className="rc-pagination__simple-sep">/</span>
          <span>{totalPages}</span>
        </span>
      ) : (
        pages.map((item) => {
          if (item === 'prev-more' || item === 'next-more') {
            const direction = item === 'prev-more' ? -5 : 5;
            return (
              <button
                key={item}
                type="button"
                className="rc-pagination__item rc-pagination__item--jump"
                aria-label={item === 'prev-more' ? 'Jump back 5 pages' : 'Jump forward 5 pages'}
                disabled={disabled}
                onClick={() => jumpTo(safeCurrent + direction)}
              >
                <span aria-hidden="true">…</span>
              </button>
            );
          }
          return (
            <button
              key={item}
              type="button"
              className={cx(
                'rc-pagination__item',
                item === safeCurrent && 'rc-pagination__item--active',
              )}
              aria-label={`Page ${item}`}
              aria-current={item === safeCurrent ? 'page' : undefined}
              disabled={disabled}
              onClick={() => changePage(item)}
            >
              {item}
            </button>
          );
        })
      )}

      <button
        type="button"
        className="rc-pagination__item rc-pagination__item--arrow"
        aria-label="Next page"
        disabled={disabled || safeCurrent >= totalPages}
        onClick={() => changePage(safeCurrent + 1)}
      >
        <Icon name="chevron-right" size={14} />
      </button>

      {!simple && showSizeChanger ? (
        <span className="rc-pagination__size">
          <Select
            size="small"
            options={options}
            value={size}
            disabled={disabled}
            onChange={(next) => changeSize(Number(next))}
            aria-label="Page size"
          />
        </span>
      ) : null}

      {!simple && showQuickJumper ? (
        <span className="rc-pagination__jumper">
          <span>Jump to</span>
          <input
            className="rc-pagination__jumper-input"
            value={jumpValue}
            disabled={disabled}
            aria-label="Page number"
            onChange={(event) => setJumpValue(event.target.value.replace(/[^\d]/g, ''))}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              const page = Number(jumpValue);
              if (Number.isFinite(page) && page >= 1) {
                jumpTo(page);
                setJumpValue('');
              }
            }}
          />
        </span>
      ) : null}
    </div>
  );
});
