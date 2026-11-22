import type { ComponentDoc } from './types';
import TabsBasic from '../examples/tabs/Basic';
import tabsBasicCode from '../examples/tabs/Basic?raw';
import BreadcrumbBasic from '../examples/breadcrumb/Basic';
import breadcrumbBasicCode from '../examples/breadcrumb/Basic?raw';
import DropdownBasic from '../examples/dropdown/Basic';
import dropdownBasicCode from '../examples/dropdown/Basic?raw';

export const navigationDocs: ComponentDoc[] = [
  {
    key: 'tabs',
    name: 'Tabs 标签页',
    english: 'Tabs',
    description:
      '在同一区域切换不同内容分组。支持 line/card 两种样式、图标、徽标、额外操作区与方向键导航。',
    demos: [
      {
        title: '基础用法',
        description: 'role="tablist" 与方向键保证可访问性，禁用项会被键盘导航跳过。',
        code: tabsBasicCode,
        element: <TabsBasic />,
      },
    ],
    api: [
      { prop: 'items', type: 'TabItem[]', description: '标签页配置：key、label、children、icon、disabled。' },
      { prop: 'activeKey / defaultActiveKey', type: 'string', description: '受控/非受控激活项。' },
      { prop: 'onChange', type: '(key: string) => void', description: '切换标签时触发。' },
      { prop: 'type', type: "'line' | 'card'", defaultValue: "'line'", description: '标签样式。' },
      { prop: 'centered', type: 'boolean', defaultValue: 'false', description: '标签水平居中。' },
      { prop: 'extra', type: 'ReactNode', description: '标签栏右侧额外内容。' },
    ],
  },
  {
    key: 'breadcrumb',
    name: 'Breadcrumb 面包屑',
    english: 'Breadcrumb',
    description: '展示当前页面在层级结构中的位置，帮助用户快速回到上级页面。',
    demos: [
      {
        title: '基础用法',
        description: '最后一项自动标记 aria-current="page"，不渲染为链接。',
        code: breadcrumbBasicCode,
        element: <BreadcrumbBasic />,
      },
    ],
    api: [
      { prop: 'items', type: 'BreadcrumbItem[]', description: '节点配置：title、href、onClick。' },
      { prop: 'separator', type: 'ReactNode', defaultValue: "'/'", description: '自定义分隔符。' },
      { prop: 'itemRender', type: '(item, index, items) => ReactNode', description: '完全自定义节点渲染。' },
      { prop: 'children', type: 'ReactNode', description: '不传 items 时可直接传入子节点。' },
    ],
  },
  {
    key: 'dropdown',
    name: 'Dropdown 下拉菜单',
    english: 'Dropdown',
    description:
      '将一组操作收纳到触发元素下方，支持点击/悬停触发、图标、危险项、分隔线与键盘菜单导航。',
    demos: [
      {
        title: '基础用法',
        description: '菜单项通过 key 标识，选择后自动关闭并把焦点还给触发器。',
        code: dropdownBasicCode,
        element: <DropdownBasic />,
      },
    ],
    api: [
      { prop: 'menu', type: '{ items: DropdownItem[]; onClick?: (key) => void }', description: '菜单配置。' },
      { prop: 'trigger', type: "'click' | 'hover'", defaultValue: "'click'", description: '触发方式。' },
      { prop: 'placement', type: 'Placement', defaultValue: "'bottom-start'", description: '浮层位置。' },
      { prop: 'open / defaultOpen', type: 'boolean', description: '受控/非受控展开状态。' },
      { prop: 'onOpenChange', type: '(open: boolean) => void', description: '展开状态变化回调。' },
      { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用菜单。' },
      { prop: 'items[].icon', type: 'ReactNode', description: '菜单项图标。' },
      { prop: 'items[].danger', type: 'boolean', defaultValue: 'false', description: '危险操作配色。' },
      { prop: 'items[].disabled', type: 'boolean', defaultValue: 'false', description: '禁用菜单项。' },
      { prop: 'type: "divider"', type: 'DropdownDivider', description: '在 items 中插入分隔线。' },
    ],
  },
];
