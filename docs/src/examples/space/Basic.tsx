import { Button, Divider, Space, Tag } from '@lib';

export default function SpaceBasic() {
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Space wrap>
        <Button>取消</Button>
        <Button variant="primary">保存</Button>
        <Button variant="text">帮助</Button>
      </Space>

      <Divider plain>带分隔符</Divider>
      <Space split={<Divider type="vertical" />}>
        <Tag color="primary">React</Tag>
        <Tag color="success">TypeScript</Tag>
        <Tag color="warning">CSS</Tag>
      </Space>

      <Divider plain>垂直排列</Divider>
      <Space direction="vertical" align="start">
        <Button block>第一项</Button>
        <Button block>第二项</Button>
      </Space>
    </Space>
  );
}
