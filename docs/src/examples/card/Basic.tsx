import { Avatar, Button, Card, Icon, Tag } from '@lib';

export default function CardBasic() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 16,
      }}
    >
      <Card
        title="项目概览"
        extra={<Button variant="link">更多</Button>}
        actions={[
          <span key="edit" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <Icon name="copy" size={14} />
            复制
          </span>,
          <span key="settings" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <Icon name="more" size={14} />
            设置
          </span>,
        ]}
      >
        <p style={{ margin: '0 0 12px', color: 'var(--rc-color-text-secondary)', lineHeight: 1.7 }}>
          使用 Card 承载一组相关信息，支持页头、操作区和底部操作栏。
        </p>
        <Tag color="success">进行中</Tag>
      </Card>

      <Card
        hoverable
        cover={
          <div
            style={{
              height: 110,
              background: 'linear-gradient(135deg, var(--rc-color-primary), #8b5cf6)',
            }}
          />
        }
      >
        <Card.Meta
          avatar={<Avatar>RC</Avatar>}
          title="设计系统"
          description="统一视觉令牌与组件规范，让产品保持一致的体验。"
        />
      </Card>

      <Card title="加载中" loading />
    </div>
  );
}
