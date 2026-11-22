import { Table, Tag, type TableColumn } from '@lib';

interface User {
  key: string;
  name: string;
  role: string;
  age: number;
  status: 'active' | 'offline';
}

const columns: TableColumn<User>[] = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 140 },
  { title: '角色', dataIndex: 'role', key: 'role' },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 90, align: 'center' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 110,
    render: (value) =>
      value === 'active' ? (
        <Tag color="success">在线</Tag>
      ) : (
        <Tag>离线</Tag>
      ),
  },
];

const data: User[] = [
  { key: '1', name: '林夏', role: '产品设计师', age: 28, status: 'active' },
  { key: '2', name: '陈默', role: '前端工程师', age: 31, status: 'active' },
  { key: '3', name: '苏晴', role: '数据分析师', age: 26, status: 'offline' },
  { key: '4', name: '何川', role: '后端工程师', age: 34, status: 'active' },
  { key: '5', name: '沈知', role: '运营经理', age: 29, status: 'offline' },
];

export default function TableBasic() {
  return (
    <Table<User>
      columns={columns}
      dataSource={data}
      rowKey="key"
      pagination={{ pageSize: 3, showSizeChanger: true }}
    />
  );
}
