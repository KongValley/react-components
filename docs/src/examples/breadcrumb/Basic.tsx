import { Breadcrumb, Icon, Space } from '@lib';

const items = [
  { title: '首页', href: '#/' },
  { title: '组件', href: '#/components/button' },
  { title: 'Breadcrumb 面包屑' },
];

export default function BreadcrumbBasic() {
  return (
    <Space direction="vertical" size={16}>
      <Breadcrumb items={items} />
      <Breadcrumb
        separator={<Icon name="chevron-right" size={12} />}
        items={[
          { title: '工作台', href: '#/' },
          { title: '项目列表', href: '#/components/card' },
          { title: '设计系统' },
        ]}
      />
      <Breadcrumb>
        <a href="#/">首页</a>
        <a href="#/components/button">按钮</a>
        <span>使用说明</span>
      </Breadcrumb>
    </Space>
  );
}
