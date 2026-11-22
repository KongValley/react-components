import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Table } from '../Table';

interface Row {
  key: string;
  name: string;
  age: number;
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a: Row, b: Row) => a.name.localeCompare(b.name),
  },
  { title: 'Age', dataIndex: 'age', key: 'age' },
];

const data: Row[] = [
  { key: '1', name: 'Charlie', age: 30 },
  { key: '2', name: 'Alice', age: 25 },
];

function bodyNames() {
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.textContent);
}

describe('Table', () => {
  it('renders rows and sorts by a sortable column', async () => {
    render(<Table columns={columns} dataSource={data} pagination={false} />);

    expect(bodyNames()[0]).toContain('Charlie');

    await userEvent.click(screen.getByRole('button', { name: /Name/ }));
    expect(bodyNames()[0]).toContain('Alice');

    const header = screen.getByRole('columnheader', { name: /Name/ });
    expect(header).toHaveAttribute('aria-sort', 'ascending');

    await userEvent.click(screen.getByRole('button', { name: /Name/ }));
    expect(bodyNames()[0]).toContain('Charlie');
    expect(header).toHaveAttribute('aria-sort', 'descending');
  });

  it('supports row selection', async () => {
    const onChange = vi.fn();
    render(
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowSelection={{ onChange }}
      />,
    );

    await userEvent.click(screen.getByRole('checkbox', { name: 'Select row 1' }));
    expect(onChange).toHaveBeenCalledWith(['1'], [data[0]]);

    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onChange).toHaveBeenLastCalledWith(['1', '2'], data);
  });

  it('renders an empty state', () => {
    render(<Table columns={columns} dataSource={[]} pagination={false} emptyText="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});
