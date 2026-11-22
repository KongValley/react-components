import type { ComponentDoc } from './types';
import TableBasic from '../examples/table/Basic';
import tableBasicCode from '../examples/table/Basic?raw';
import TableAdvanced from '../examples/table/Advanced';
import tableAdvancedCode from '../examples/table/Advanced?raw';
import PaginationBasic from '../examples/pagination/Basic';
import paginationBasicCode from '../examples/pagination/Basic?raw';
import TagBasic from '../examples/tag/Basic';
import tagBasicCode from '../examples/tag/Basic?raw';
import BadgeBasic from '../examples/badge/Basic';
import badgeBasicCode from '../examples/badge/Basic?raw';
import AvatarBasic from '../examples/avatar/Basic';
import avatarBasicCode from '../examples/avatar/Basic?raw';
import TooltipBasic from '../examples/tooltip/Basic';
import tooltipBasicCode from '../examples/tooltip/Basic?raw';
import PopoverBasic from '../examples/popover/Basic';
import popoverBasicCode from '../examples/popover/Basic?raw';
import EmptyBasic from '../examples/empty/Basic';
import emptyBasicCode from '../examples/empty/Basic?raw';
import SkeletonBasic from '../examples/skeleton/Basic';
import skeletonBasicCode from '../examples/skeleton/Basic?raw';
import SpinBasic from '../examples/spin/Basic';
import spinBasicCode from '../examples/spin/Basic?raw';

export const dataDisplayDocs: ComponentDoc[] = [
  {
    key: 'table',
    name: 'Table 表格',
    english: 'Table',
    description:
      '展示结构化数据的基础表格。支持列配置、自定义渲染、客户端排序、行选择与分页，加载态使用 Spin 覆盖。',
    whenToUse: '数据需要按行列对比时使用。列数很多或需要固定列的场景建议后续扩展版。',
    demos: [
      {
        title: '基础表格',
        description: 'columns 定义列，dataSource 提供数据，pagination 未提供 total 时自动做本地分页。',
        code: tableBasicCode,
        element: <TableBasic />,
      },
      {
        title: '排序、选择与操作',
        description: '点击表头在升序、降序与不排序之间循环；行选择支持受控与全选。',
        code: tableAdvancedCode,
        element: <TableAdvanced />,
      },
    ],
    api: [
      { prop: 'columns', type: 'TableColumn<T>[]', description: '列配置：title、dataIndex、render、sorter、width、align 等。' },
      { prop: 'dataSource', type: 'T[]', defaultValue: '[]', description: '数据源。' },
      { prop: 'rowKey', type: 'string | (record) => string | number', description: '行唯一键，缺省读取 record.key。' },
      { prop: 'loading', type: 'boolean', defaultValue: 'false', description: '展示加载遮罩。' },
      { prop: 'bordered', type: 'boolean', defaultValue: 'false', description: '展示完整单元格边框。' },
      { prop: 'size', type: "'default' | 'middle' | 'small'", defaultValue: "'default'", description: '单元格内边距。' },
      { prop: 'rowSelection', type: 'TableRowSelection<T>', description: '行选择配置：selectedRowKeys、onChange、getCheckboxProps。' },
      { prop: 'pagination', type: 'false | TablePaginationConfig', defaultValue: 'false', description: '分页配置；传 total 时视为服务端分页。' },
      { prop: 'onRow', type: '(record, index) => HTMLAttributes', description: '为行绑定点击等原生事件。' },
      { prop: 'emptyText', type: 'ReactNode', defaultValue: "'No data'", description: '空数据文案。' },
      { prop: 'showHeader', type: 'boolean', defaultValue: 'true', description: '是否显示表头。' },
    ],
  },
  {
    key: 'pagination',
    name: 'Pagination 分页',
    english: 'Pagination',
    description:
      '数据量较大时用于分页浏览。支持页码省略、每页条数切换、快速跳转、总数展示与简洁模式。',
    demos: [
      {
        title: '基础用法',
        description: '页码按钮超过 7 页时自动省略中间页码，省略号可一次跳转 5 页。',
        code: paginationBasicCode,
        element: <PaginationBasic />,
      },
    ],
    api: [
      { prop: 'current / defaultCurrent', type: 'number', defaultValue: '1', description: '受控/非受控页码。' },
      { prop: 'pageSize / defaultPageSize', type: 'number', defaultValue: '10', description: '每页条数。' },
      { prop: 'total', type: 'number', defaultValue: '0', description: '数据总数。' },
      { prop: 'onChange', type: '(page, pageSize) => void', description: '页码或每页条数变化时触发。' },
      { prop: 'showSizeChanger', type: 'boolean', defaultValue: 'false', description: '展示每页条数选择器。' },
      { prop: 'pageSizeOptions', type: 'number[]', defaultValue: '[10, 20, 50, 100]', description: '每页条数候选项。' },
      { prop: 'showQuickJumper', type: 'boolean', defaultValue: 'false', description: '展示快速跳转输入框。' },
      { prop: 'showTotal', type: '(total, range) => ReactNode', description: '展示总数与当前范围。' },
      { prop: 'simple', type: 'boolean', defaultValue: 'false', description: '简洁模式，仅保留上一页/下一页。' },
      { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用所有操作。' },
    ],
  },
  {
    key: 'tag',
    name: 'Tag 标签',
    english: 'Tag',
    description:
      '用于标记分类、状态或属性的小号标签。支持预设语义色、任意自定义色、边框与关闭按钮。',
    demos: [
      {
        title: '基础用法',
        description: '自定义颜色通过 CSS 变量注入，背景与边框会自动生成对应的浅色。',
        code: tagBasicCode,
        element: <TagBasic />,
      },
    ],
    api: [
      { prop: 'color', type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | string", defaultValue: "'default'", description: '预设语义色或任意 CSS 颜色。' },
      { prop: 'bordered', type: 'boolean', defaultValue: 'false', description: '展示边框。' },
      { prop: 'closable', type: 'boolean', defaultValue: 'false', description: '展示关闭按钮。' },
      { prop: 'onClose', type: '(event) => void', description: '点击关闭按钮时触发，需自行移除数据。' },
      { prop: 'icon', type: 'ReactNode', description: '文字前的图标。' },
    ],
  },
  {
    key: 'badge',
    name: 'Badge 徽标',
    english: 'Badge',
    description:
      '附着在元素角落的数量或状态提示，支持数字、溢出上限、圆点、自定义颜色与独立展示。',
    demos: [
      {
        title: '基础用法',
        description: 'count 为 0 时默认隐藏，showZero 可强制展示；overflowCount 控制 99+ 阈值。',
        code: badgeBasicCode,
        element: <BadgeBasic />,
      },
    ],
    api: [
      { prop: 'count', type: 'ReactNode', description: '徽标内容。' },
      { prop: 'dot', type: 'boolean', defaultValue: 'false', description: '展示为小圆点。' },
      { prop: 'overflowCount', type: 'number', defaultValue: '99', description: '数字超过该值时显示 N+。' },
      { prop: 'showZero', type: 'boolean', defaultValue: 'false', description: 'count 为 0 时仍然展示。' },
      { prop: 'color', type: 'string', description: '自定义徽标背景色。' },
      { prop: 'children', type: 'ReactNode', description: '被标记的元素；不传时独立展示徽标。' },
    ],
  },
  {
    key: 'avatar',
    name: 'Avatar 头像',
    english: 'Avatar',
    description:
      '用户或实体的头像展示，支持图片、文字、图标三种回退方式，圆形/方形与预设尺寸。',
    demos: [
      {
        title: '基础用法',
        description: '图片加载失败时自动回退到 children 或图标内容。',
        code: avatarBasicCode,
        element: <AvatarBasic />,
      },
    ],
    api: [
      { prop: 'src / srcSet', type: 'string', description: '图片地址。' },
      { prop: 'alt', type: 'string', description: '图片替代文本，同时作为回退态的无障碍标签。' },
      { prop: 'size', type: 'number | "small" | "default" | "large"', defaultValue: "'default'", description: '尺寸，数字按像素处理。' },
      { prop: 'shape', type: "'circle' | 'square'", defaultValue: "'circle'", description: '头像形状。' },
      { prop: 'icon', type: 'ReactNode', description: '无图片时的图标回退。' },
      { prop: 'onError', type: '() => boolean | void', description: '图片加载失败回调，返回 false 可保留破图。' },
      { prop: 'children', type: 'ReactNode', description: '文字回退内容。' },
    ],
  },
  {
    key: 'tooltip',
    name: 'Tooltip 文字提示',
    english: 'Tooltip',
    description:
      '轻量的文字说明浮层，默认悬停或聚焦触发，支持四个方向、延迟展示、箭头与受控状态。',
    demos: [
      {
        title: '基础用法',
        description: '浮层定位基于真实 DOM 尺寸，空间不足时自动翻转；键盘聚焦同样触发。',
        code: tooltipBasicCode,
        element: <TooltipBasic />,
      },
    ],
    api: [
      { prop: 'title', type: 'ReactNode', description: '提示内容。' },
      { prop: 'placement', type: 'Placement', defaultValue: "'top'", description: '优先出现位置。' },
      { prop: 'trigger', type: "'hover' | 'focus' | 'click'", defaultValue: "'hover'", description: '触发方式。' },
      { prop: 'arrow', type: 'boolean', defaultValue: 'true', description: '是否展示箭头。' },
      { prop: 'delay', type: 'number', defaultValue: '100', description: '显示延迟（毫秒）。' },
      { prop: 'open / defaultOpen', type: 'boolean', description: '受控/非受控展开状态。' },
      { prop: 'onOpenChange', type: '(open: boolean) => void', description: '展开状态变化回调。' },
      { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用提示。' },
      { prop: 'children', type: 'ReactElement', description: '必须为可接收 ref 的单个元素。' },
    ],
  },
  {
    key: 'popover',
    name: 'Popover 弹出框',
    english: 'Popover',
    description:
      '可承载交互内容的浮层卡片，支持标题、任意内容、点击/悬停触发、自动翻转与箭头。',
    demos: [
      {
        title: '基础用法',
        description: '浮层内容可交互；悬停模式在移出触发器与浮层后延迟关闭。',
        code: popoverBasicCode,
        element: <PopoverBasic />,
      },
    ],
    api: [
      { prop: 'content', type: 'ReactNode', description: '浮层内容。' },
      { prop: 'title', type: 'ReactNode', description: '浮层标题。' },
      { prop: 'placement', type: 'Placement', defaultValue: "'bottom'", description: '优先出现位置。' },
      { prop: 'trigger', type: "'click' | 'hover'", defaultValue: "'click'", description: '触发方式。' },
      { prop: 'arrow', type: 'boolean', defaultValue: 'true', description: '是否展示箭头。' },
      { prop: 'open / defaultOpen', type: 'boolean', description: '受控/非受控展开状态。' },
      { prop: 'onOpenChange', type: '(open: boolean) => void', description: '展开状态变化回调。' },
      { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用弹出。' },
      { prop: 'children', type: 'ReactElement', description: '必须为可接收 ref 的单个元素。' },
    ],
  },
  {
    key: 'empty',
    name: 'Empty 空状态',
    english: 'Empty',
    description: '数据为空时的占位提示，内置插画，可自定义描述、插画与操作区。',
    demos: [
      {
        title: '基础用法',
        description: '可单独使用，也可以作为 Table 的 emptyText 或列表的空态。',
        code: emptyBasicCode,
        element: <EmptyBasic />,
      },
    ],
    api: [
      { prop: 'description', type: 'ReactNode', defaultValue: "'No data'", description: '空态描述文字。' },
      { prop: 'image', type: 'ReactNode', description: '自定义插画，默认使用内置 SVG。' },
      { prop: 'imageStyle', type: 'CSSProperties', description: '插画容器样式。' },
      { prop: 'children', type: 'ReactNode', description: '底部操作区。' },
    ],
  },
  {
    key: 'skeleton',
    name: 'Skeleton 骨架屏',
    english: 'Skeleton',
    description:
      '在数据返回前保持页面结构稳定的占位组件，支持头像、标题、段落行数与闪烁动画。',
    demos: [
      {
        title: '基础用法',
        description: 'loading 为 false 时渲染 children，实现加载态与真实内容的平滑切换。',
        code: skeletonBasicCode,
        element: <SkeletonBasic />,
      },
    ],
    api: [
      { prop: 'loading', type: 'boolean', description: '是否展示骨架屏；不传时根据 children 是否存在决定。' },
      { prop: 'active', type: 'boolean', defaultValue: 'false', description: '开启闪烁动画。' },
      { prop: 'avatar', type: 'boolean | { size?, shape? }', defaultValue: 'false', description: '头像占位。' },
      { prop: 'title', type: 'boolean | { width? }', defaultValue: 'true', description: '标题占位。' },
      { prop: 'paragraph', type: 'boolean | { rows?, width? }', defaultValue: 'true', description: '段落占位，最后一行默认 61% 宽度。' },
      { prop: 'round', type: 'boolean', defaultValue: 'false', description: '占位条使用全圆角。' },
    ],
  },
  {
    key: 'spin',
    name: 'Spin 加载中',
    english: 'Spin',
    description:
      '加载状态指示器，可独立展示，也可包裹内容显示加载遮罩，并支持延迟出现避免闪烁。',
    demos: [
      {
        title: '基础用法',
        description: '包裹内容时通过 aria-busy 标记忙碌状态，遮罩会阻止重复交互。',
        code: spinBasicCode,
        element: <SpinBasic />,
      },
    ],
    api: [
      { prop: 'spinning', type: 'boolean', defaultValue: 'true', description: '是否处于加载状态。' },
      { prop: 'size', type: "'small' | 'default' | 'large'", defaultValue: "'default'", description: '图标尺寸。' },
      { prop: 'tip', type: 'ReactNode', description: '加载提示文字。' },
      { prop: 'delay', type: 'number', defaultValue: '0', description: '延迟展示毫秒数，避免快速请求闪烁。' },
      { prop: 'children', type: 'ReactNode', description: '被加载遮罩覆盖的内容。' },
    ],
  },
];
