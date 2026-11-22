import type { ComponentDoc } from './types';
import GridBasic from '../examples/grid/Basic';
import gridBasicCode from '../examples/grid/Basic?raw';
import LayoutBasic from '../examples/layout/Basic';
import layoutBasicCode from '../examples/layout/Basic?raw';
import CardBasic from '../examples/card/Basic';
import cardBasicCode from '../examples/card/Basic?raw';

export const layoutDocs: ComponentDoc[] = [
  {
    key: 'grid',
    name: 'Grid 栅格',
    english: 'Grid',
    description:
      '基于 24 栅格的响应式布局基础。Row 负责横向排列与间距，Col 通过 span、offset、order 控制列宽与位置。',
    whenToUse: '适合构建表单、卡片列表、统计面板等规整的网格结构。',
    demos: [
      {
        title: '基础栅格',
        description: 'Row 的 gutter 支持数字或 [水平, 垂直] 数组，Col 的 span 为 1-24。',
        code: gridBasicCode,
        element: <GridBasic />,
      },
    ],
    api: [
      { prop: 'gutter', type: 'number | [number, number]', defaultValue: '0', description: 'Row 的列间距，数组第二项为行间距。' },
      { prop: 'justify', type: "'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'", defaultValue: "'start'", description: '主轴对齐方式。' },
      { prop: 'align', type: "'top' | 'middle' | 'bottom' | 'stretch'", defaultValue: "'top'", description: '交叉轴对齐方式。' },
      { prop: 'wrap', type: 'boolean', defaultValue: 'true', description: '是否允许换行。' },
      { prop: 'span', type: 'number', description: 'Col 占据的栅格数（1-24）。' },
      { prop: 'offset', type: 'number', defaultValue: '0', description: 'Col 左侧偏移的栅格数。' },
      { prop: 'order', type: 'number', description: 'Col 的排列顺序。' },
      { prop: 'flex', type: 'number | string', description: '自定义 flex 值，优先级高于 span。' },
    ],
  },
  {
    key: 'layout',
    name: 'Layout 布局',
    english: 'Layout',
    description:
      '页面级布局容器，提供 Header、Sider、Content、Footer 四个子组件，基于 flex 组合出常见后台框架。',
    whenToUse: '用于搭建应用外壳；内容页内部优先使用 Grid 或普通 flex 布局。',
    demos: [
      {
        title: '后台布局',
        description:
          'Layout 会自动识别直接子级的 Sider 并切换为横向布局；Sider 支持折叠宽度与自定义触发器。',
        code: layoutBasicCode,
        element: <LayoutBasic />,
      },
    ],
    api: [
      { prop: 'hasSider', type: 'boolean', description: 'Layout 是否包含 Sider，嵌套时建议显式指定。' },
      { prop: 'Sider.width', type: 'number | string', defaultValue: '220', description: '展开时的宽度。' },
      { prop: 'Sider.collapsedWidth', type: 'number | string', defaultValue: '72', description: '折叠后的宽度。' },
      { prop: 'Sider.collapsed', type: 'boolean', description: '受控的折叠状态。' },
      { prop: 'Sider.defaultCollapsed', type: 'boolean', defaultValue: 'false', description: '非受控初始折叠状态。' },
      { prop: 'Sider.onCollapse', type: '(collapsed: boolean) => void', description: '点击触发器时回调。' },
      { prop: 'Sider.collapsible', type: 'boolean', defaultValue: 'false', description: '显示底部折叠触发器。' },
      { prop: 'Sider.trigger', type: 'ReactNode | null', description: '自定义触发器内容，null 隐藏。' },
      { prop: 'Header / Footer / Content', type: 'HTMLAttributes', description: '语义化 header/main/footer 元素，接收原生属性。' },
    ],
  },
  {
    key: 'card',
    name: 'Card 卡片',
    english: 'Card',
    description:
      '将相关信息组织在独立容器中，支持标题栏、封面、底部操作区、悬浮阴影与加载占位。',
    whenToUse: '用于概览信息、资源条目、数据面板等需要独立边界的场景。',
    demos: [
      {
        title: '基础卡片',
        description: 'Card.Meta 用于图文混排；loading 会以骨架屏替换正文内容。',
        code: cardBasicCode,
        element: <CardBasic />,
      },
    ],
    api: [
      { prop: 'title', type: 'ReactNode', description: '卡片标题。' },
      { prop: 'extra', type: 'ReactNode', description: '标题右侧的额外内容。' },
      { prop: 'cover', type: 'ReactNode', description: '顶部封面区域。' },
      { prop: 'actions', type: 'ReactNode[]', description: '底部均分操作栏。' },
      { prop: 'bordered', type: 'boolean', defaultValue: 'true', description: '是否展示边框。' },
      { prop: 'hoverable', type: 'boolean', defaultValue: 'false', description: '悬浮时显示阴影与手型指针。' },
      { prop: 'loading', type: 'boolean', defaultValue: 'false', description: '以骨架屏替换正文。' },
      { prop: 'size', type: "'default' | 'small'", defaultValue: "'default'", description: '内边距尺寸。' },
      { prop: 'Card.Meta.avatar / title / description', type: 'ReactNode', description: '图文混排元信息。' },
    ],
  },
];
