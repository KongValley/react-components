export interface NavItem {
  key: string;
  name: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: '通用',
    items: [
      { key: 'button', name: 'Button 按钮' },
      { key: 'icon', name: 'Icon 图标' },
      { key: 'typography', name: 'Typography 排版' },
      { key: 'divider', name: 'Divider 分割线' },
      { key: 'space', name: 'Space 间距' },
    ],
  },
  {
    title: '布局',
    items: [
      { key: 'grid', name: 'Grid 栅格' },
      { key: 'layout', name: 'Layout 布局' },
      { key: 'card', name: 'Card 卡片' },
    ],
  },
  {
    title: '数据录入',
    items: [
      { key: 'input', name: 'Input 输入框' },
      { key: 'input-number', name: 'InputNumber 数字输入框' },
      { key: 'select', name: 'Select 选择器' },
      { key: 'checkbox', name: 'Checkbox 复选框' },
      { key: 'radio', name: 'Radio 单选框' },
      { key: 'switch', name: 'Switch 开关' },
      { key: 'form', name: 'Form 表单' },
    ],
  },
  {
    title: '数据展示',
    items: [
      { key: 'table', name: 'Table 表格' },
      { key: 'pagination', name: 'Pagination 分页' },
      { key: 'tag', name: 'Tag 标签' },
      { key: 'badge', name: 'Badge 徽标' },
      { key: 'avatar', name: 'Avatar 头像' },
      { key: 'tooltip', name: 'Tooltip 文字提示' },
      { key: 'popover', name: 'Popover 弹出框' },
      { key: 'empty', name: 'Empty 空状态' },
      { key: 'skeleton', name: 'Skeleton 骨架屏' },
      { key: 'spin', name: 'Spin 加载中' },
    ],
  },
  {
    title: '反馈',
    items: [
      { key: 'alert', name: 'Alert 警告提示' },
      { key: 'modal', name: 'Modal 对话框' },
      { key: 'drawer', name: 'Drawer 抽屉' },
      { key: 'message', name: 'Message 全局提示' },
    ],
  },
  {
    title: '导航',
    items: [
      { key: 'tabs', name: 'Tabs 标签页' },
      { key: 'breadcrumb', name: 'Breadcrumb 面包屑' },
      { key: 'dropdown', name: 'Dropdown 下拉菜单' },
    ],
  },
  {
    title: '多端',
    items: [
      { key: 'config-provider', name: 'ConfigProvider 多端配置' },
    ],
  },
  {
    title: '移动端',
    items: [
      { key: 'safe-area', name: 'SafeArea 安全区' },
      { key: 'popup', name: 'Popup 弹出层' },
      { key: 'cell', name: 'Cell 单元格' },
      { key: 'navbar', name: 'NavBar 导航栏' },
      { key: 'tabbar', name: 'TabBar 标签栏' },
      { key: 'search-bar', name: 'SearchBar 搜索栏' },
      { key: 'stepper', name: 'Stepper 步进器' },
      { key: 'action-sheet', name: 'ActionSheet 动作面板' },
      { key: 'picker', name: 'Picker 选择器' },
      { key: 'swiper', name: 'Swiper 轮播' },
      { key: 'pull-to-refresh', name: 'PullToRefresh 下拉刷新' },
    ],
  },
];

export const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.title })),
);
