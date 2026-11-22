import { useState } from 'react';
import { Icon, Layout } from '@lib';

const { Header, Sider, Content, Footer } = Layout;

const NAV = [
  { icon: 'search' as const, label: '工作台' },
  { icon: 'user' as const, label: '成员管理' },
  { icon: 'check' as const, label: '任务中心' },
  { icon: 'more' as const, label: '系统设置' },
];

export default function LayoutBasic() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout
      style={{
        height: 420,
        overflow: 'hidden',
        border: '1px solid var(--rc-color-border-secondary)',
        borderRadius: 12,
      }}
    >
      <Header
        style={{
          height: 56,
          lineHeight: '56px',
          background: 'var(--rc-color-primary)',
          borderBottom: 0,
          color: '#fff',
          fontWeight: 600,
        }}
      >
        RC Admin
      </Header>
      <Layout hasSider>
        <Sider
          width={200}
          collapsedWidth={64}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          collapsible
        >
          <div style={{ display: 'grid', gap: 4, padding: '0 10px' }}>
            {NAV.map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 6,
                  color: 'var(--rc-color-text-secondary)',
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={item.icon} size={15} />
                {!collapsed ? item.label : null}
              </div>
            ))}
          </div>
        </Sider>
        <Content style={{ padding: 20 }}>
          <h3 style={{ margin: 0 }}>内容区域</h3>
          <p style={{ color: 'var(--rc-color-text-secondary)', lineHeight: 1.8 }}>
            Layout 使用 flex 布局组合 Header、Sider、Content 与 Footer。
            Sider 内置折叠触发器，折叠后可通过 onCollapse 同步外部状态。
          </p>
        </Content>
      </Layout>
      <Footer style={{ padding: '12px 20px' }}>RC UI © 2026</Footer>
    </Layout>
  );
}
