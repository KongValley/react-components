import { Button, Divider, Popover, Space, Tag } from '@lib';

export default function PopoverBasic() {
  return (
    <Space wrap size={14}>
      <Popover
        title="项目信息"
        content={
          <div style={{ maxWidth: 240 }}>
            <p style={{ margin: '0 0 10px', color: 'var(--rc-color-text-secondary)' }}>
              RC UI 是一套面向企业后台的 React 组件库。
            </p>
            <Space wrap>
              <Tag color="primary">React</Tag>
              <Tag color="success">TypeScript</Tag>
            </Space>
            <Divider style={{ margin: '12px 0' }} />
            <Button variant="link" size="small">
              查看详情
            </Button>
          </div>
        }
      >
        <Button>点击打开</Button>
      </Popover>

      <Popover trigger="hover" content="悬停时显示，移出后自动关闭。">
        <Button variant="dashed">悬停触发</Button>
      </Popover>

      <Popover placement="right" content="浮层会根据可用空间自动翻转。">
        <Button variant="text">右侧弹出</Button>
      </Popover>
    </Space>
  );
}
