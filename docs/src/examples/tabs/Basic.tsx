import { Badge, Button, Icon, Tabs, Tag } from '@lib';

const panelStyle = {
  color: 'var(--rc-color-text-secondary)',
  lineHeight: 1.8,
  fontSize: 13.5,
} as const;

export default function TabsBasic() {
  return (
    <div style={{ display: 'grid', gap: 28 }}>
      <Tabs
        defaultActiveKey="overview"
        extra={
          <Button size="small" variant="primary">
            新建
          </Button>
        }
        items={[
          {
            key: 'overview',
            label: '概览',
            icon: <Icon name="search" size={14} />,
            children: (
              <div style={panelStyle}>
                <p style={{ marginTop: 0 }}>
                  概览面板展示项目的核心指标。<Tag color="success">运行正常</Tag>
                </p>
                <p style={{ marginBottom: 0 }}>
                  当前版本 v0.3.0，共 44 个多端组件，支持明暗双主题与设备自适应。
                </p>
              </div>
            ),
          },
          {
            key: 'members',
            label: (
              <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                成员
                <Badge count={6} />
              </span>
            ),
            children: <div style={panelStyle}>成员面板内容。</div>,
          },
          {
            key: 'settings',
            label: '设置',
            children: <div style={panelStyle}>设置面板内容。</div>,
          },
          {
            key: 'disabled',
            label: '禁用',
            disabled: true,
            children: <div style={panelStyle}>不可见。</div>,
          },
        ]}
      />

      <Tabs
        type="card"
        defaultActiveKey="a"
        items={[
          { key: 'a', label: '标签页 A', children: <div style={panelStyle}>卡片样式标签页。</div> },
          { key: 'b', label: '标签页 B', children: <div style={panelStyle}>第二页内容。</div> },
          { key: 'c', label: '标签页 C', children: <div style={panelStyle}>第三页内容。</div> },
        ]}
      />
    </div>
  );
}
