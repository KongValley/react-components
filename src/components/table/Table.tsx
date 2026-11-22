import {
  forwardRef,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
} from 'react';
import { Icon } from '../../icons';
import { getValue, type NamePath } from '../../utils/object';
import { cx } from '../../utils/cx';
import { Checkbox } from '../checkbox/Checkbox';
import { Empty } from '../empty/Empty';
import { Pagination, type PaginationProps } from '../pagination/Pagination';
import { Spin } from '../spin/Spin';

export type SortOrder = 'ascend' | 'descend';

export interface TableColumn<T> {
  key?: string;
  title: ReactNode;
  dataIndex?: NamePath;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, record: T, index: number) => ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  defaultSortOrder?: SortOrder;
  ellipsis?: boolean;
  className?: string;
}

export interface TableRowSelection<T> {
  selectedRowKeys?: Array<string | number>;
  defaultSelectedRowKeys?: Array<string | number>;
  onChange?: (selectedRowKeys: Array<string | number>, selectedRows: T[]) => void;
  getCheckboxProps?: (record: T) => { disabled?: boolean };
}

export interface TablePaginationConfig
  extends Omit<PaginationProps, 'current' | 'pageSize' | 'total' | 'onChange'> {
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
}

export type RowKey = string | ((record: any) => string | number);

export interface TableProps<T extends Record<string, any> = Record<string, any>>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  columns: TableColumn<T>[];
  dataSource?: T[];
  rowKey?: string | ((record: T) => string | number);
  loading?: boolean;
  bordered?: boolean;
  size?: 'default' | 'middle' | 'small';
  showHeader?: boolean;
  emptyText?: ReactNode;
  rowSelection?: TableRowSelection<T>;
  pagination?: false | TablePaginationConfig;
  onRow?: (record: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
}

function selectableCompare(a: unknown, b: unknown): number {
  if (Object.is(a, b)) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

function columnKeyOf<T>(column: TableColumn<T>, index: number): string {
  if (column.key !== undefined) return column.key;
  if (column.dataIndex !== undefined) {
    return Array.isArray(column.dataIndex)
      ? column.dataIndex.join('.')
      : String(column.dataIndex);
  }
  return `column-${index}`;
}

function TableInner<T extends Record<string, any>>(
  {
    columns,
    dataSource = [],
    rowKey,
    loading = false,
    bordered = false,
    size = 'default',
    showHeader = true,
    emptyText,
    rowSelection,
    pagination = false,
    onRow,
    className,
    ...rest
  }: TableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [sortState, setSortState] = useState<{ key: string; order: SortOrder } | null>(() => {
    const index = columns.findIndex((column) => column.defaultSortOrder);
    if (index < 0) return null;
    return {
      key: columnKeyOf(columns[index], index),
      order: columns[index].defaultSortOrder as SortOrder,
    };
  });

  const [innerPage, setInnerPage] = useState(1);
  const [innerPageSize, setInnerPageSize] = useState(
    pagination === false ? 10 : (pagination.pageSize ?? 10),
  );
  const [innerSelected, setInnerSelected] = useState<Array<string | number>>(
    rowSelection?.defaultSelectedRowKeys ?? [],
  );

  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') return rowKey(record);
    if (typeof rowKey === 'string') {
      const key = (record as Record<string, unknown>)[rowKey];
      if (typeof key === 'string' || typeof key === 'number') return key;
    }
    const fallback = (record as Record<string, unknown>).key;
    if (typeof fallback === 'string' || typeof fallback === 'number') return fallback;
    return index;
  };

  const entries = useMemo(
    () =>
      dataSource.map((record, index) => ({
        record,
        index,
        key: getRowKey(record, index),
      })),
    // getRowKey closes over rowKey only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataSource, rowKey],
  );

  const columnEntries = useMemo(
    () => columns.map((column, index) => ({ column, key: columnKeyOf(column, index) })),
    [columns],
  );

  const sortedEntries = useMemo(() => {
    if (!sortState) return entries;
    const target = columnEntries.find((entry) => entry.key === sortState.key);
    if (!target || !target.column.sorter) return entries;
    const { column } = target;
    const comparator =
      typeof column.sorter === 'function'
        ? column.sorter
        : (a: T, b: T) => selectableCompare(getValue(a, column.dataIndex ?? ''), getValue(b, column.dataIndex ?? ''));
    const direction = sortState.order === 'ascend' ? 1 : -1;
    return [...entries].sort((a, b) => direction * comparator(a.record, b.record));
  }, [entries, sortState, columnEntries]);

  const localPagination = pagination !== false && pagination.total === undefined;
  const pageSize = pagination === false ? sortedEntries.length || 10 : (pagination.pageSize ?? innerPageSize);
  const current = pagination === false ? 1 : (pagination.current ?? innerPage);
  const total = pagination === false ? sortedEntries.length : (pagination.total ?? sortedEntries.length);
  const pageEntries =
    pagination === false || !localPagination
      ? sortedEntries
      : sortedEntries.slice((current - 1) * pageSize, current * pageSize);

  const selectedKeys = rowSelection?.selectedRowKeys ?? innerSelected;

  const notifySelection = (keys: Array<string | number>) => {
    if (rowSelection?.selectedRowKeys === undefined) setInnerSelected(keys);
    const selectedRows = entries
      .filter((entry) => keys.includes(entry.key))
      .map((entry) => entry.record);
    rowSelection?.onChange?.(keys, selectedRows);
  };

  const toggleRow = (key: string | number, checked: boolean) => {
    notifySelection(
      checked ? [...selectedKeys, key] : selectedKeys.filter((item) => item !== key),
    );
  };

  const selectablePageEntries = pageEntries.filter(
    (entry) => !rowSelection?.getCheckboxProps?.(entry.record).disabled,
  );
  const selectedOnPage = selectablePageEntries.filter((entry) =>
    selectedKeys.includes(entry.key),
  ).length;
  const allSelected =
    selectablePageEntries.length > 0 && selectedOnPage === selectablePageEntries.length;
  const someSelected = selectedOnPage > 0 && !allSelected;

  const toggleAll = (checked: boolean) => {
    const pageKeys = selectablePageEntries.map((entry) => entry.key);
    const next = checked
      ? Array.from(new Set([...selectedKeys, ...pageKeys]))
      : selectedKeys.filter((key) => !pageKeys.includes(key));
    notifySelection(next);
  };

  const toggleSort = (key: string, sortable: boolean) => {
    if (!sortable) return;
    setSortState((previous) => {
      if (!previous || previous.key !== key) return { key, order: 'ascend' };
      if (previous.order === 'ascend') return { key, order: 'descend' };
      return null;
    });
  };

  const handlePageChange = (page: number, nextPageSize: number) => {
    if (pagination === false) return;
    if (pagination.current === undefined) setInnerPage(page);
    if (pagination.pageSize === undefined) setInnerPageSize(nextPageSize);
    pagination.onChange?.(page, nextPageSize);
  };

  const columnCount = columns.length + (rowSelection ? 1 : 0);

  const paginationNode =
    pagination === false ? null : (
      <Pagination
        {...pagination}
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
        className="rcui-table__pagination"
      />
    );

  return (
    <div
      ref={ref}
      className={cx(
        'rcui-table-wrapper',
        size === 'middle' && 'rcui-table-wrapper--middle',
        size === 'small' && 'rcui-table-wrapper--small',
        bordered && 'rcui-table-wrapper--bordered',
        className,
      )}
      {...rest}
    >
      <div className="rcui-table-scroll">
        <Spin spinning={loading}>
          <table
            className={cx(
              'rcui-table',
              columns.some((column) => column.ellipsis) && 'rcui-table--fixed',
            )}
        >
          {columns.some((column) => column.ellipsis || column.width !== undefined) ? (
            <colgroup>
              {rowSelection ? <col style={{ width: 44 }} /> : null}
              {columnEntries.map(({ column, key }) => (
                <col key={key} style={column.width !== undefined ? { width: column.width } : undefined} />
              ))}
            </colgroup>
          ) : null}
          {showHeader ? (
            <thead>
              <tr>
                {rowSelection ? (
                  <th className="rcui-table__selection" scope="col">
                    <Checkbox
                      aria-label="Select all rows"
                      checked={allSelected}
                      indeterminate={someSelected}
                      disabled={selectablePageEntries.length === 0}
                      onChange={(event) => toggleAll(event.target.checked)}
                    />
                  </th>
                ) : null}
                {columnEntries.map(({ column, key }) => {
                  const active = sortState?.key === key;
                  return (
                    <th
                      key={key}
                      scope="col"
                      className={cx(
                        'rcui-table__cell',
                        column.align && `rcui-table__cell--${column.align}`,
                        column.ellipsis && 'rcui-table__cell--ellipsis',
                        column.className,
                      )}
                      aria-sort={
                        active
                          ? sortState?.order === 'ascend'
                            ? 'ascending'
                            : 'descending'
                          : column.sorter
                            ? 'none'
                            : undefined
                      }
                    >
                      {column.sorter ? (
                        <button
                          type="button"
                          className="rcui-table__sorter"
                          onClick={() => toggleSort(key, Boolean(column.sorter))}
                        >
                          <span>{column.title}</span>
                          <span className="rcui-table__sorter-icons" aria-hidden="true">
                            <Icon
                              name="chevron-up"
                              size={10}
                              className={cx(
                                'rcui-table__sorter-icon',
                                active && sortState?.order === 'ascend' && 'is-active',
                              )}
                            />
                            <Icon
                              name="chevron-down"
                              size={10}
                              className={cx(
                                'rcui-table__sorter-icon',
                                active && sortState?.order === 'descend' && 'is-active',
                              )}
                            />
                          </span>
                        </button>
                      ) : (
                        column.title
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {pageEntries.length === 0 ? (
              <tr className="rcui-table__empty-row">
                <td colSpan={columnCount} className="rcui-table__cell">
                  <Empty description={emptyText ?? 'No data'} />
                </td>
              </tr>
            ) : (
              pageEntries.map(({ record, index, key }) => {
                const rowProps = onRow?.(record, index) ?? {};
                const checkboxProps = rowSelection?.getCheckboxProps?.(record) ?? {};
                return (
                  <tr
                    key={key}
                    data-row-key={key}
                    {...rowProps}
                    className={cx('rcui-table__row', rowProps.className)}
                  >
                    {rowSelection ? (
                      <td className="rcui-table__selection">
                        <Checkbox
                          aria-label={`Select row ${key}`}
                          checked={selectedKeys.includes(key)}
                          disabled={checkboxProps.disabled}
                          onChange={(event) => toggleRow(key, event.target.checked)}
                        />
                      </td>
                    ) : null}
                    {columnEntries.map(({ column, key: columnKey }) => {
                      const value =
                        column.dataIndex !== undefined
                          ? getValue(record, column.dataIndex)
                          : undefined;
                      return (
                        <td
                          key={columnKey}
                          className={cx(
                            'rcui-table__cell',
                            column.align && `rcui-table__cell--${column.align}`,
                            column.ellipsis && 'rcui-table__cell--ellipsis',
                            column.className,
                          )}
                        >
                          {column.render
                            ? column.render(value, record, index)
                            : ((value as ReactNode) ?? null)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </Spin>
      </div>
      {paginationNode}
    </div>
  );
}

type TableComponent = <T extends Record<string, any> = Record<string, any>>(
  props: TableProps<T> & RefAttributes<HTMLDivElement>,
) => ReactElement | null;

export const Table = forwardRef(TableInner) as unknown as TableComponent;
