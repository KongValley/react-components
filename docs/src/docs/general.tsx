import type { ComponentDoc } from './types';
import ButtonBasic from '../examples/button/Basic';
import buttonBasicCode from '../examples/button/Basic?raw';
import ButtonStates from '../examples/button/States';
import buttonStatesCode from '../examples/button/States?raw';
import IconGallery from '../examples/icon/Gallery';
import iconGalleryCode from '../examples/icon/Gallery?raw';
import TypographyBasic from '../examples/typography/Basic';
import typographyBasicCode from '../examples/typography/Basic?raw';
import TypographyEllipsis from '../examples/typography/Ellipsis';
import typographyEllipsisCode from '../examples/typography/Ellipsis?raw';
import DividerBasic from '../examples/divider/Basic';
import dividerBasicCode from '../examples/divider/Basic?raw';
import SpaceBasic from '../examples/space/Basic';
import spaceBasicCode from '../examples/space/Basic?raw';

export const generalDocs: ComponentDoc[] = [
  {
    key: 'button',
    name: 'Button 按钮',
    english: 'Button',
    description:
      '按钮用于触发一个操作、提交表单或打开浮层。提供五种视觉变体、三种尺寸与加载态，支持图标、圆形和块级布局。',
    whenToUse:
      '一个页面中主操作建议只使用一个 primary 按钮；危险操作使用 danger 语义，配合二次确认。',
    demos: [
      {
        title: '按钮类型',
        description: '通过 variant 切换视觉层级，danger 为破坏性操作提供红色语义。',
        code: buttonBasicCode,
        element: <ButtonBasic />,
      },
      {
        title: '尺寸、图标与加载状态',
        description:
          'loading 会自动禁用交互并展示旋转图标；纯图标按钮请提供 aria-label。',
        code: buttonStatesCode,
        element: <ButtonStates />,
      },
    ],
    api: [
      { prop: 'variant', type: "'default' | 'primary' | 'dashed' | 'text' | 'link'", defaultValue: "'default'", description: '按钮视觉变体。' },
      { prop: 'danger', type: 'boolean', defaultValue: 'false', description: '应用危险操作配色。' },
      { prop: 'size', type: "'small' | 'middle' | 'large'", defaultValue: "'middle'", description: '按钮尺寸。' },
      { prop: 'shape', type: "'default' | 'round' | 'circle'", defaultValue: "'default'", description: '圆角或圆形按钮。' },
      { prop: 'loading', type: 'boolean', defaultValue: 'false', description: '展示加载图标并禁用按钮。' },
      { prop: 'icon', type: 'ReactNode', description: '按钮图标。' },
      { prop: 'iconPosition', type: "'start' | 'end'", defaultValue: "'start'", description: '图标位置。' },
      { prop: 'block', type: 'boolean', defaultValue: 'false', description: '宽度撑满容器。' },
      { prop: 'htmlType', type: "'button' | 'submit' | 'reset'", defaultValue: "'button'", description: '原生 button type。' },
      { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用按钮。' },
      { prop: '...rest', type: 'ButtonHTMLAttributes', description: '透传到原生 button 元素。' },
    ],
  },
  {
    key: 'icon',
    name: 'Icon 图标',
    english: 'Icon',
    description:
      '内置一套统一线宽的 SVG 图标，无需额外图标依赖。图标默认作为装饰元素对屏幕阅读器隐藏。',
    demos: [
      {
        title: '图标总览',
        description: '通过 name 使用内置图标，size 控制尺寸，spin 开启旋转动画。',
        code: iconGalleryCode,
        element: <IconGallery />,
      },
    ],
    api: [
      { prop: 'name', type: 'IconName', description: '图标名称，内置 27 个常用图标。' },
      { prop: 'size', type: 'number | string', defaultValue: "'1em'", description: '图标宽高，数字按 px 处理。' },
      { prop: 'spin', type: 'boolean', defaultValue: 'false', description: '应用旋转动画。' },
      { prop: '...rest', type: 'SVGProps<SVGSVGElement>', description: '透传到 svg 元素，可覆盖 stroke 等属性。' },
    ],
  },
  {
    key: 'typography',
    name: 'Typography 排版',
    english: 'Typography',
    description:
      '提供标题、正文、行内文本与链接的语义化排版组件，支持语义色、装饰样式、省略与复制。',
    demos: [
      {
        title: '标题与文本',
        description: 'Title 支持 1-5 级标题；Text 与 Paragraph 提供语义色和行内装饰。',
        code: typographyBasicCode,
        element: <TypographyBasic />,
      },
      {
        title: '省略与复制',
        description: 'ellipsis 支持单行或指定行数；copyable 会在文本后追加复制按钮。',
        code: typographyEllipsisCode,
        element: <TypographyEllipsis />,
      },
    ],
    api: [
      { prop: 'level', type: '1 | 2 | 3 | 4 | 5', defaultValue: '1', description: 'Title 的标题级别。' },
      { prop: 'type', type: "'secondary' | 'success' | 'warning' | 'danger'", description: '语义颜色。' },
      { prop: 'strong / italic / underline / delete / code / mark', type: 'boolean', defaultValue: 'false', description: '行内装饰样式。' },
      { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用态文本颜色。' },
      { prop: 'ellipsis', type: 'boolean | { rows?: number }', description: '单行省略或按行数多行省略。' },
      { prop: 'copyable', type: 'boolean | { text?, onCopy?, tooltips? }', description: '展示复制按钮，可自定义复制文本与提示。' },
      { prop: 'href / onClick', type: 'string / MouseEventHandler', description: '仅 Typography.Link 支持。' },
    ],
  },
  {
    key: 'divider',
    name: 'Divider 分割线',
    english: 'Divider',
    description: '区隔内容的分割线，支持水平、垂直两种方向，可带标题文字、虚线样式。',
    demos: [
      {
        title: '基础用法',
        description: '文字位置支持 left / center / right，垂直分割线常用于行内元素之间。',
        code: dividerBasicCode,
        element: <DividerBasic />,
      },
    ],
    api: [
      { prop: 'type', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: '分割线方向。' },
      { prop: 'orientation', type: "'left' | 'center' | 'right'", defaultValue: "'center'", description: '文字位置。' },
      { prop: 'dashed', type: 'boolean', defaultValue: 'false', description: '使用虚线样式。' },
      { prop: 'plain', type: 'boolean', defaultValue: 'false', description: '文字使用更轻的字号与颜色。' },
      { prop: 'children', type: 'ReactNode', description: '分割线中的文字内容。' },
    ],
  },
  {
    key: 'space',
    name: 'Space 间距',
    english: 'Space',
    description:
      '为行内或块级子元素设置统一间距，支持水平/垂直排列、预设或自定义间距、换行与分隔符。',
    demos: [
      {
        title: '基础用法',
        description: 'size 支持 small / middle / large 或像素数值，也可以传入 [水平, 垂直] 数组。',
        code: spaceBasicCode,
        element: <SpaceBasic />,
      },
    ],
    api: [
      { prop: 'direction', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: '排列方向。' },
      { prop: 'size', type: "'small' | 'middle' | 'large' | number | [size, size]", defaultValue: "'middle'", description: '子元素间距。' },
      { prop: 'align', type: "'start' | 'center' | 'end' | 'baseline'", defaultValue: "'center'", description: '交叉轴对齐方式。' },
      { prop: 'wrap', type: 'boolean', defaultValue: 'false', description: '空间不足时是否换行。' },
      { prop: 'split', type: 'ReactNode', description: '相邻子元素之间的分隔内容。' },
    ],
  },
];
