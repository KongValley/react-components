import { useState } from 'react';
import {
  Button,
  Space,
  Table,
  Tag,
  message,
  type TableColumn,
  type TableRowSelection,
} from '@lib';

interface Task {
  key: string;
  title: string;
  owner: string;
  priority: number;
  state: 'todo' | 'doing' | 'done';
}

const STATE_LABEL: Record<Task['state'], string> = {
  todo: '待处理',
  doing: '进行中',
  done: '已完成',
};

const columns: TableColumn<Task>[] = [
  {
    title: '任务',
    dataIndex: 'title',
    key: 'title',
    sorter: (a, b) => a.title.localeCompare(b.title),
  },
  { title: '负责人', dataIndex: 'owner', key: 'owner', width: 120 },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    width: 120,
    sorter: (a, b) => a.priority - b.priority,
    render: (value) => <Tag color={Number(value) > 2 ? 'danger' : 'warning'}>P{String(value)}</Tag>,
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width: 110,
    render: (value) => (
      <Tag color={value === 'done' ? 'success' : value === 'doing' ? 'primary' : 'default'}>
        {STATE_LABEL[value as Task['state']]}
      </Tag>
    ),
  },
  {
    title: '操作',
    key: 'actions',
    width: 90,
    render: (_value, record) => (
      <Button
        variant="link"
        size="small"
        onClick={() => message.info(`编辑：${record.title}`)}
      >
        编辑
      </Button>
    ),
  },
];

const data: Task[] = [
  { key: '1', title: '设计组件规范', owner: '林夏', priority: 3, state: 'done' },
  { key: '2', title: '实现表单校验', owner: '陈默', priority: 1, state: 'doing' },
  { key: '3', title: '补充文档示例', owner: '苏晴', priority: 2, state: 'todo' },
  { key: '4', title: '优化构建体积', owner: '何川', priority: 2, state: 'doing' },
  { key: '5', title: '无障碍检查', owner: '沈知', priority: 1, state: 'todo' },
  { key: '6', title: '发布候选版本', owner: '陈默', priority: 3, state: 'todo' },
];

export default function TableAdvanced() {
  const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([]);

  const rowSelection: TableRowSelection<Task> = {
    selectedRowKeys: selectedKeys,
    onChange: (keys) => setSelectedKeys(keys),
  };

  return (
    <Space direction="vertical" size={14} style={{ width: '100%' }}>
      <Space>
        <Button
          disabled={selectedKeys.length === 0}
          onClick={() => {
            message.success(`已删除 ${selectedKeys.length} 项`);
            setSelectedKeys([]);
          }}
        >
          删除所选
        </Button>
        <span style={{ color: 'var(--rcui-color-text-secondary)', fontSize: 13 }}>
          已选择 {selectedKeys.length} 项
        </span>
      </Space>
      <Table<Task>
        columns={columns}
        dataSource={data}
        rowKey="key"
        rowSelection={rowSelection}
        pagination={{
          pageSize: 4,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条任务`,
        }}
      />
    </Space>
  );
}
