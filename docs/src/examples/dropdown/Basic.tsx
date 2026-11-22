import { Button, Dropdown, Icon, Space, message, type DropdownMenu } from '@lib';

const menu: DropdownMenu = {
  items: [
    { key: 'edit', label: '编辑', icon: <Icon name="copy" size={14} /> },
    { key: 'duplicate', label: '复制副本', icon: <Icon name="copy" size={14} /> },
    { key: 'divider', type: 'divider' },
    { key: 'delete', label: '删除项目', danger: true, icon: <Icon name="close" size={14} /> },
  ],
  onClick: (key) => {
    if (key === 'delete') message.error('项目已删除');
    else message.info(`执行操作：${key}`);
  },
};

export default function DropdownBasic() {
  return (
    <Space wrap>
      <Dropdown menu={menu}>
        <Button>
          点击触发
          <Icon name="chevron-down" size={12} />
        </Button>
      </Dropdown>
      <Dropdown menu={menu} trigger="hover">
        <Button variant="dashed">悬停触发</Button>
      </Dropdown>
      <Dropdown menu={menu} placement="bottom-end">
        <Button variant="text">右下对齐</Button>
      </Dropdown>
      <Dropdown
        menu={{
          items: [
            { key: 'profile', label: '个人资料', icon: <Icon name="user" size={14} /> },
            { key: 'settings', label: '账户设置', icon: <Icon name="menu" size={14} /> },
          ],
        }}
      >
        <Button shape="circle" icon={<Icon name="more" />} aria-label="更多操作" />
      </Dropdown>
    </Space>
  );
}
