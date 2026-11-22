import { Button, Empty, Space } from '@lib';

export default function EmptyBasic() {
  return (
    <Space direction="vertical" size={28} style={{ width: '100%' }}>
      <Empty />
      <Empty description="没有找到匹配的结果，试试调整筛选条件">
        <Button variant="primary">重置筛选</Button>
      </Empty>
    </Space>
  );
}
