import type { ComponentDoc } from './types';
import SafeAreaBasic from '../examples/safe-area/Basic';
import safeAreaBasicCode from '../examples/safe-area/Basic?raw';
import PopupBasic from '../examples/popup/Basic';
import popupBasicCode from '../examples/popup/Basic?raw';
import CellBasic from '../examples/cell/Basic';
import cellBasicCode from '../examples/cell/Basic?raw';
import NavBarBasic from '../examples/navbar/Basic';
import navBarBasicCode from '../examples/navbar/Basic?raw';
import TabBarBasic from '../examples/tabbar/Basic';
import tabBarBasicCode from '../examples/tabbar/Basic?raw';
import SearchBarBasic from '../examples/search-bar/Basic';
import searchBarBasicCode from '../examples/search-bar/Basic?raw';
import StepperBasic from '../examples/stepper/Basic';
import stepperBasicCode from '../examples/stepper/Basic?raw';
import ActionSheetBasic from '../examples/action-sheet/Basic';
import actionSheetBasicCode from '../examples/action-sheet/Basic?raw';
import PickerBasic from '../examples/picker/Basic';
import pickerBasicCode from '../examples/picker/Basic?raw';
import SwiperBasic from '../examples/swiper/Basic';
import swiperBasicCode from '../examples/swiper/Basic?raw';
import PullToRefreshBasic from '../examples/pull-to-refresh/Basic';
import pullToRefreshBasicCode from '../examples/pull-to-refresh/Basic?raw';

export const mobileDocs: ComponentDoc[] = [
  {
    key: 'safe-area',
    name: 'SafeArea 安全区',
    english: 'SafeArea',
    description:
      '为刘海屏与底部 Home 指示条预留空间的安全区容器，基于 env(safe-area-inset-*) 与 CSS 变量实现，在普通屏幕上自动退化为 0。',
    whenToUse:
      '移动端全屏页面、吸底操作栏、底部弹层等需要避开系统手势区域的场景；通常放在页面顶部或底部，由 NavBar / TabBar / Popup 自动处理时无需手动添加。',
    demos: [
      {
        title: '顶部与底部安全区',
        description:
          '示例通过覆盖 --rcui-safe-area-* 变量模拟刘海屏；真机会自动读取设备安全区。',
        code: safeAreaBasicCode,
        element: <SafeAreaBasic />,
      },
    ],
    api: [
      {
        prop: 'position',
        type: "'top' | 'bottom' | 'both'",
        defaultValue: "'bottom'",
        description: '需要避让安全区的边缘。',
      },
      {
        prop: '...rest',
        type: 'HTMLAttributes<HTMLDivElement>',
        description: '透传到容器 div，可添加背景或自定义样式。',
      },
    ],
  },
  {
    key: 'popup',
    name: 'Popup 弹出层',
    english: 'Popup',
    description:
      '移动端通用弹出层，支持底部、顶部、左右抽屉与居中对话框，内置遮罩、滚动锁定、焦点陷阱、ESC 关闭、安全区与底部拖拽关闭。',
    whenToUse:
      '需要从屏幕边缘滑入一块内容时使用；动作面板、选择器、筛选面板等更具体的组件都基于 Popup 构建。',
    demos: [
      {
        title: '不同方向的弹出层',
        description:
          '底部面板可按住顶部横条向下拖动关闭；居中模式带缩放淡入效果。',
        code: popupBasicCode,
        element: <PopupBasic />,
      },
    ],
    api: [
      { prop: 'open', type: 'boolean', defaultValue: 'false', description: '是否显示弹出层。' },
      {
        prop: 'position',
        type: "'bottom' | 'top' | 'left' | 'right' | 'center'",
        defaultValue: "'bottom'",
        description: '面板进入方向。',
      },
      { prop: 'title', type: 'ReactNode', description: '标题，渲染为居中标题栏。' },
      { prop: 'closable', type: 'boolean', defaultValue: 'false', description: '显示右上角关闭按钮。' },
      { prop: 'mask', type: 'boolean', defaultValue: 'true', description: '是否渲染遮罩。' },
      { prop: 'maskClosable', type: 'boolean', defaultValue: 'true', description: '点击遮罩是否关闭。' },
      { prop: 'keyboard', type: 'boolean', defaultValue: 'true', description: '按 ESC 是否关闭。' },
      { prop: 'round', type: 'boolean', defaultValue: 'true', description: '靠近屏幕边缘的圆角。' },
      { prop: 'safeArea', type: 'boolean', defaultValue: 'true', description: '底部/顶部安全区适配。' },
      { prop: 'showHandle', type: 'boolean', defaultValue: "position === 'bottom'", description: '显示拖拽横条。' },
      { prop: 'swipeToClose', type: 'boolean', defaultValue: 'true', description: '允许拖动横条关闭。' },
      { prop: 'bodyStyle', type: 'CSSProperties', description: '内容区样式，例如取消默认内边距。' },
      { prop: 'getContainer', type: '() => HTMLElement | null', description: '自定义 Portal 容器。' },
      { prop: 'zIndex', type: 'number', description: '自定义层级。' },
      { prop: 'onClose', type: '() => void', description: '请求关闭（遮罩、ESC、关闭按钮）。' },
      { prop: 'afterClose', type: '() => void', description: '退场动画结束后调用。' },
    ],
  },
  {
    key: 'cell',
    name: 'Cell 单元格',
    english: 'Cell',
    description:
      '移动端列表的基本单元，支持标题、描述、右侧值、图标、箭头与任意尾部内容；CellGroup 负责分组标题、圆角与分隔线。',
    whenToUse:
      '设置页、个人中心、列表详情等以行为单位展示信息的页面；可点击的 Cell 会自动获得键盘操作与 button 语义。',
    demos: [
      {
        title: '分组单元格',
        description:
          'inset 模式带圆角与左右留白；提供 onClick 后单元格可点击，箭头仅作视觉提示。',
        code: cellBasicCode,
        element: <CellBasic />,
      },
    ],
    api: [
      { prop: 'Cell.title', type: 'ReactNode', description: '主标题。' },
      { prop: 'Cell.description', type: 'ReactNode', description: '标题下方的辅助说明。' },
      { prop: 'Cell.value', type: 'ReactNode', description: '标题行右侧的次要文本。' },
      { prop: 'Cell.icon', type: 'ReactNode', description: '左侧图标。' },
      { prop: 'Cell.extra', type: 'ReactNode', description: '尾部自定义内容，如 Switch。' },
      { prop: 'Cell.arrow', type: 'boolean', defaultValue: 'false', description: '显示右侧箭头。' },
      { prop: 'Cell.clickable', type: 'boolean', description: '是否可点击，默认根据 onClick 推断。' },
      { prop: 'Cell.disabled', type: 'boolean', defaultValue: 'false', description: '禁用点击与键盘操作。' },
      { prop: 'Cell.align', type: "'center' | 'start'", defaultValue: "'center'", description: '多行内容的垂直对齐。' },
      { prop: 'Cell.onClick', type: 'MouseEventHandler', description: '点击回调。' },
      { prop: 'CellGroup.title', type: 'ReactNode', description: '分组标题。' },
      { prop: 'CellGroup.description', type: 'ReactNode', description: '分组说明。' },
      { prop: 'CellGroup.inset', type: 'boolean', defaultValue: 'false', description: '圆角卡片式分组。' },
    ],
  },
  {
    key: 'navbar',
    name: 'NavBar 导航栏',
    english: 'NavBar',
    description:
      '移动端顶部导航栏，标题居中，左右插槽可放置返回按钮与操作；支持顶部安全区、固定定位与占位元素。',
    whenToUse: '二级页面、详情页、设置页等需要返回或全局操作的页面顶部。',
    demos: [
      {
        title: '基础导航栏',
        description: '提供 onBack 时自动显示返回按钮；right 插槽可放图标按钮或文本操作。',
        code: navBarBasicCode,
        element: <NavBarBasic />,
      },
    ],
    api: [
      { prop: 'title', type: 'ReactNode', description: '居中标题。' },
      { prop: 'left', type: 'ReactNode', description: '左侧插槽，位于返回按钮之后。' },
      { prop: 'right', type: 'ReactNode', description: '右侧插槽。' },
      { prop: 'onBack', type: '() => void', description: '返回按钮回调。' },
      { prop: 'backArrow', type: 'boolean', defaultValue: 'true', description: '是否显示返回按钮。' },
      { prop: 'fixed', type: 'boolean', defaultValue: 'false', description: '固定到视口顶部。' },
      { prop: 'placeholder', type: 'boolean', defaultValue: 'true', description: 'fixed 时渲染等高占位。' },
      { prop: 'safeArea', type: 'boolean', defaultValue: 'true', description: '适配顶部安全区。' },
      { prop: 'border', type: 'boolean', defaultValue: 'true', description: '显示底部分隔线。' },
    ],
  },
  {
    key: 'tabbar',
    name: 'TabBar 标签栏',
    english: 'TabBar',
    description:
      '底部主导航标签栏，支持图标、选中图标、徽标、红点、禁用项与受控/非受控切换；可选固定定位与底部安全区。',
    whenToUse: '应用主框架的一级页面切换，建议 3-5 个标签并使用简短文案。',
    demos: [
      {
        title: '带徽标与红点的标签栏',
        description: '点击或使用左右方向键切换，选中项图标会播放一次性弹性动画。',
        code: tabBarBasicCode,
        element: <TabBarBasic />,
      },
    ],
    api: [
      { prop: 'items', type: 'TabBarItem[]', description: '标签项：key、title、icon、activeIcon、badge、dot、disabled。' },
      { prop: 'activeKey', type: 'string', description: '受控选中的 key。' },
      { prop: 'defaultActiveKey', type: 'string', defaultValue: '第一项', description: '非受控初始值。' },
      { prop: 'onChange', type: '(key: string) => void', description: '切换回调。' },
      { prop: 'fixed', type: 'boolean', defaultValue: 'false', description: '固定到视口底部。' },
      { prop: 'placeholder', type: 'boolean', defaultValue: 'true', description: 'fixed 时渲染等高占位。' },
      { prop: 'safeArea', type: 'boolean', defaultValue: 'true', description: '适配底部安全区。' },
    ],
  },
  {
    key: 'search-bar',
    name: 'SearchBar 搜索栏',
    english: 'SearchBar',
    description:
      '移动端搜索输入框，带搜索图标、清空按钮与取消操作，支持受控/非受控值、回车搜索与 IME 组合输入保护。',
    whenToUse: '列表筛选、全局搜索、发现页等需要快速输入关键词的场景。',
    demos: [
      {
        title: '基础搜索',
        description: '输入内容后出现清空按钮；按回车触发 onSearch，点击取消会清空并失焦。',
        code: searchBarBasicCode,
        element: <SearchBarBasic />,
      },
    ],
    api: [
      { prop: 'value', type: 'string', description: '受控值。' },
      { prop: 'defaultValue', type: "string", defaultValue: "''", description: '非受控初始值。' },
      { prop: 'onChange', type: '(value: string) => void', description: '输入变化回调。' },
      { prop: 'onSearch', type: '(value: string) => void', description: '回车或提交时触发。' },
      { prop: 'onCancel', type: '() => void', description: '点击取消按钮时触发。' },
      { prop: 'cancelText', type: 'ReactNode', defaultValue: "'Cancel'", description: '取消按钮文案。' },
      { prop: 'showCancel', type: 'boolean', defaultValue: 'true', description: '显示取消按钮。' },
      { prop: 'allowClear', type: 'boolean', defaultValue: 'true', description: '显示清空按钮。' },
      { prop: '...rest', type: 'InputHTMLAttributes', description: '其余属性透传到 input，可设置 placeholder、disabled 等。' },
    ],
  },
  {
    key: 'stepper',
    name: 'Stepper 步进器',
    english: 'Stepper',
    description:
      '数字步进器，支持最小/最大值、步长、小数精度、直接输入与长按连续调整，按钮采用紧凑的移动端触控布局。',
    whenToUse: '商品数量、座位数、金额等需要小幅连续调整的数值输入。',
    demos: [
      {
        title: '数量与小数',
        description: '长按加号或减号可加速调整；直接输入后回车或失焦会按范围与精度收敛。',
        code: stepperBasicCode,
        element: <StepperBasic />,
      },
    ],
    api: [
      { prop: 'value', type: 'number', description: '受控值。' },
      { prop: 'defaultValue', type: 'number', defaultValue: '0', description: '非受控初始值。' },
      { prop: 'onChange', type: '(value: number) => void', description: '数值变化回调。' },
      { prop: 'min', type: 'number', defaultValue: '0', description: '最小值。' },
      { prop: 'max', type: 'number', defaultValue: 'Infinity', description: '最大值。' },
      { prop: 'step', type: 'number', defaultValue: '1', description: '每次调整的步长。' },
      { prop: 'precision', type: 'number', description: '保留小数位，默认取 step 的小数位。' },
      { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用整个组件。' },
      { prop: 'readOnly', type: 'boolean', defaultValue: 'false', description: '禁止手动输入，按钮仍可用。' },
      { prop: 'inputWidth', type: 'number | string', description: '输入框宽度。' },
      { prop: 'longPress', type: 'boolean', defaultValue: 'true', description: '长按按钮连续调整。' },
    ],
  },
  {
    key: 'action-sheet',
    name: 'ActionSheet 动作面板',
    english: 'ActionSheet',
    description:
      '从底部弹出的动作列表，支持标题、描述、图标、危险操作、禁用项与取消按钮，点击遮罩或 ESC 会触发取消回调。',
    whenToUse: '需要让用户在少量互斥操作中做出选择，例如上传头像、分享渠道、更多操作。',
    demos: [
      {
        title: '选择操作',
        description: '选择后默认关闭面板；可通过 closeOnSelect={false} 保持打开。',
        code: actionSheetBasicCode,
        element: <ActionSheetBasic />,
      },
    ],
    api: [
      { prop: 'open', type: 'boolean', defaultValue: 'false', description: '是否显示。' },
      { prop: 'actions', type: 'ActionSheetAction[]', description: '操作项：key、text、description、icon、danger、disabled。' },
      { prop: 'title', type: 'ReactNode', description: '面板标题。' },
      { prop: 'description', type: 'ReactNode', description: '标题下方的说明。' },
      { prop: 'cancelText', type: 'ReactNode', defaultValue: "'Cancel'", description: '取消按钮文案。' },
      { prop: 'showCancel', type: 'boolean', defaultValue: 'true', description: '显示取消按钮。' },
      { prop: 'closeOnSelect', type: 'boolean', defaultValue: 'true', description: '选择后自动关闭。' },
      { prop: 'maskClosable', type: 'boolean', defaultValue: 'true', description: '点击遮罩关闭。' },
      { prop: 'safeArea', type: 'boolean', defaultValue: 'true', description: '适配底部安全区。' },
      { prop: 'onSelect', type: '(action, index) => void', description: '点击操作项回调。' },
      { prop: 'onClose', type: '() => void', description: '请求关闭。' },
      { prop: 'onCancel', type: '() => void', description: '遮罩、ESC 或取消按钮触发的取消回调。' },
      { prop: 'afterClose', type: '() => void', description: '退场动画结束回调。' },
    ],
  },
  {
    key: 'picker',
    name: 'Picker 选择器',
    english: 'Picker',
    description:
      '底部滚轮选择器，支持单列或多列、受控/非受控值、确认后提交、点击选项与键盘方向键操作，滚动使用原生 scroll-snap 与惯性。',
    whenToUse: '城市、日期、规格等需要从固定枚举中滚动选择的移动端场景。',
    demos: [
      {
        title: '多列选择',
        description: '滚动时仅更新高亮，点击确定才会触发 onChange；取消或点击遮罩会恢复已确认的值。',
        code: pickerBasicCode,
        element: <PickerBasic />,
      },
    ],
    api: [
      { prop: 'open', type: 'boolean', defaultValue: 'false', description: '是否显示。' },
      { prop: 'columns', type: 'PickerColumn[]', description: '列配置：key 与 values（label/value）。' },
      { prop: 'value', type: 'PickerValue[]', description: '受控值，每个元素对应一列。' },
      { prop: 'defaultValue', type: 'PickerValue[]', description: '非受控初始值。' },
      { prop: 'onChange', type: '(value, options) => void', description: '确认选择后触发。' },
      { prop: 'onConfirm', type: '(value, options) => void', description: '确认时的额外回调。' },
      { prop: 'onCancel', type: '() => void', description: '取消或遮罩关闭时触发。' },
      { prop: 'onClose', type: '() => void', description: '请求关闭。' },
      { prop: 'title', type: 'ReactNode', description: '标题。' },
      { prop: 'cancelText', type: 'ReactNode', defaultValue: "'Cancel'", description: '取消按钮文案。' },
      { prop: 'confirmText', type: 'ReactNode', defaultValue: "'Confirm'", description: '确认按钮文案。' },
      { prop: 'maskClosable', type: 'boolean', defaultValue: 'true', description: '点击遮罩关闭。' },
      { prop: 'safeArea', type: 'boolean', defaultValue: 'true', description: '适配底部安全区。' },
      { prop: 'afterClose', type: '() => void', description: '退场动画结束回调。' },
    ],
  },
  {
    key: 'swiper',
    name: 'Swiper 轮播',
    english: 'Swiper',
    description:
      '移动端轮播组件，支持循环、自动播放、指针拖拽、指示点、键盘方向键与受控索引；使用 CSS transform 实现丝滑切换。',
    whenToUse: '运营位 Banner、卡片推荐、图片画廊等需要横向滑动浏览的内容。',
    demos: [
      {
        title: '自动播放与循环',
        description: '左右拖动或点击指示点切换；系统开启减少动态效果时自动播放会暂停。',
        code: swiperBasicCode,
        element: <SwiperBasic />,
      },
    ],
    api: [
      { prop: 'children', type: 'ReactNode', description: '轮播内容，每个直接子节点为一页。' },
      { prop: 'index', type: 'number', description: '受控索引。' },
      { prop: 'defaultIndex', type: 'number', defaultValue: '0', description: '非受控初始索引。' },
      { prop: 'onChange', type: '(index: number) => void', description: '切换完成回调。' },
      { prop: 'autoplay', type: 'boolean', defaultValue: 'false', description: '自动播放。' },
      { prop: 'interval', type: 'number', defaultValue: '3000', description: '自动播放间隔（毫秒）。' },
      { prop: 'duration', type: 'number', defaultValue: '300', description: '切换动画时长（毫秒）。' },
      { prop: 'loop', type: 'boolean', defaultValue: 'false', description: '循环播放，使用边缘克隆页无缝衔接。' },
      { prop: 'showIndicators', type: 'boolean', defaultValue: 'true', description: '显示指示点。' },
      { prop: 'allowTouchMove', type: 'boolean', defaultValue: 'true', description: '允许拖拽切换。' },
      { prop: 'height', type: 'number | string', defaultValue: '180', description: '轮播高度。' },
    ],
  },
  {
    key: 'pull-to-refresh',
    name: 'PullToRefresh 下拉刷新',
    english: 'PullToRefresh',
    description:
      '包裹可滚动内容，在滚动容器处于顶部时下拉触发刷新；内置阻尼、状态文案、最小加载时长与受控 refreshing。',
    whenToUse: '移动端列表、消息流、首页等需要重新拉取数据的场景。',
    demos: [
      {
        title: '下拉刷新列表',
        description:
          '在触摸设备或移动模拟模式下从顶部下拉；桌面端可点击按钮模拟刷新过程。',
        code: pullToRefreshBasicCode,
        element: <PullToRefreshBasic />,
      },
    ],
    api: [
      { prop: 'onRefresh', type: '() => void | Promise<unknown>', description: '触发刷新，支持返回 Promise。' },
      { prop: 'refreshing', type: 'boolean', description: '受控刷新状态；不传则由组件管理。' },
      { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用下拉手势。' },
      { prop: 'threshold', type: 'number', defaultValue: '56', description: '触发刷新所需的下拉距离。' },
      { prop: 'maxDistance', type: 'number', defaultValue: '96', description: '最大下拉距离。' },
      { prop: 'minimumSpinTime', type: 'number', defaultValue: '500', description: '加载状态最短展示时间（毫秒）。' },
      { prop: 'pullText', type: 'ReactNode', defaultValue: "'Pull to refresh'", description: '下拉中的提示文案。' },
      { prop: 'releaseText', type: 'ReactNode', defaultValue: "'Release to refresh'", description: '达到阈值后的提示文案。' },
      { prop: 'loadingText', type: 'ReactNode', defaultValue: "'Refreshing…'", description: '刷新中的提示文案。' },
    ],
  },
];
