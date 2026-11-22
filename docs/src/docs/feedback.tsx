import type { ComponentDoc } from './types';
import AlertBasic from '../examples/alert/Basic';
import alertBasicCode from '../examples/alert/Basic?raw';
import ModalBasic from '../examples/modal/Basic';
import modalBasicCode from '../examples/modal/Basic?raw';
import ModalConfirm from '../examples/modal/Confirm';
import modalConfirmCode from '../examples/modal/Confirm?raw';
import DrawerBasic from '../examples/drawer/Basic';
import drawerBasicCode from '../examples/drawer/Basic?raw';
import MessageBasic from '../examples/message/Basic';
import messageBasicCode from '../examples/message/Basic?raw';

export const feedbackDocs: ComponentDoc[] = [
  {
    key: 'alert',
    name: 'Alert 警告提示',
    english: 'Alert',
    description:
      '页面内的静态提示条，用于传达信息、成功、警告或错误状态。支持描述文本、图标、可关闭、操作按钮与通栏样式。',
    demos: [
      {
        title: '基础用法',
        description: '四种语义类型共享同一套布局，showIcon 会展示对应的状态图标。',
        code: alertBasicCode,
        element: <AlertBasic />,
      },
    ],
    api: [
      { prop: 'type', type: "'info' | 'success' | 'warning' | 'error'", defaultValue: "'info'", description: '语义类型。' },
      { prop: 'message', type: 'ReactNode', description: '提示标题。' },
      { prop: 'description', type: 'ReactNode', description: '补充描述文本。' },
      { prop: 'showIcon', type: 'boolean', defaultValue: 'false', description: '展示状态图标。' },
      { prop: 'icon', type: 'ReactNode', description: '自定义图标。' },
      { prop: 'closable', type: 'boolean', defaultValue: 'false', description: '展示关闭按钮。' },
      { prop: 'onClose', type: '() => void', description: '关闭时回调。' },
      { prop: 'action', type: 'ReactNode', description: '右侧操作区。' },
      { prop: 'banner', type: 'boolean', defaultValue: 'false', description: '通栏样式，去掉圆角。' },
    ],
  },
  {
    key: 'modal',
    name: 'Modal 对话框',
    english: 'Modal',
    description:
      '模态对话框，承载需要用户聚焦处理的内容。内置遮罩、ESC 关闭、滚动锁定、焦点陷阱与进出场动画；开启 adaptive 后会在移动端自动切换为底部弹层。',
    whenToUse:
      '需要打断当前流程、确认危险操作或收集关键信息时使用。简单提示优先考虑 Message。',
    demos: [
      {
        title: '基础对话框',
        description: 'onOk 返回 Promise 时会自动展示确认按钮的加载状态。',
        code: modalBasicCode,
        element: <ModalBasic />,
      },
      {
        title: '命令式确认框',
        description: 'Modal.confirm 返回实例，支持异步 onOk，失败时保持对话框打开。',
        code: modalConfirmCode,
        element: <ModalConfirm />,
      },
    ],
    api: [
      { prop: 'open', type: 'boolean', defaultValue: 'false', description: '是否打开对话框。' },
      { prop: 'title', type: 'ReactNode', description: '标题。' },
      { prop: 'children', type: 'ReactNode', description: '正文内容。' },
      { prop: 'footer', type: 'ReactNode | null', description: '自定义底部；null 隐藏。' },
      { prop: 'okText / cancelText', type: 'ReactNode', defaultValue: "'OK' / 'Cancel'", description: '按钮文案。' },
      { prop: 'onOk / onCancel', type: '() => void | Promise<void> / () => void', description: '确认/取消回调。' },
      { prop: 'confirmLoading', type: 'boolean', defaultValue: 'false', description: '确认按钮加载状态。' },
      { prop: 'closable / maskClosable / keyboard', type: 'boolean', defaultValue: 'true', description: '关闭按钮、点击遮罩、ESC 关闭。' },
      { prop: 'width', type: 'number | string', defaultValue: '520', description: '对话框宽度。' },
      { prop: 'centered', type: 'boolean', defaultValue: 'false', description: '垂直居中。' },
      { prop: 'adaptive', type: 'boolean', description: '移动端渲染为底部弹层；默认继承 ConfigProvider.adaptive。' },
      { prop: 'afterClose', type: '() => void', description: '关闭动画结束后触发。' },
      { prop: 'Modal.confirm(options)', type: 'ConfirmInstance', description: '命令式确认框：title、content、type、adaptive、onOk、onCancel。' },
    ],
  },
  {
    key: 'drawer',
    name: 'Drawer 抽屉',
    english: 'Drawer',
    description:
      '从屏幕边缘滑出的面板，适合承载表单、详情或辅助设置。支持上下左右四个方向与自定义页脚。',
    demos: [
      {
        title: '基础用法',
        description: '通过 placement 切换方向，width/height 控制面板尺寸。',
        code: drawerBasicCode,
        element: <DrawerBasic />,
      },
    ],
    api: [
      { prop: 'open', type: 'boolean', defaultValue: 'false', description: '是否打开。' },
      { prop: 'title / extra', type: 'ReactNode', description: '标题与标题右侧额外内容。' },
      { prop: 'footer', type: 'ReactNode', description: '自定义页脚。' },
      { prop: 'placement', type: "'left' | 'right' | 'top' | 'bottom'", defaultValue: "'right'", description: '滑出方向。' },
      { prop: 'width / height', type: 'number | string', defaultValue: '378', description: '左右/上下方向的尺寸。' },
      { prop: 'closable / maskClosable / keyboard', type: 'boolean', defaultValue: 'true', description: '关闭按钮、遮罩点击、ESC 关闭。' },
      { prop: 'onClose', type: '() => void', description: '关闭回调。' },
      { prop: 'afterClose', type: '() => void', description: '关闭动画结束后触发。' },
      { prop: 'getContainer', type: '() => HTMLElement | null', description: '自定义 Portal 容器。' },
      { prop: 'zIndex', type: 'number', description: '自定义层级。' },
    ],
  },
  {
    key: 'message',
    name: 'Message 全局提示',
    english: 'Message',
    description:
      '轻量的全局反馈，从页面顶部居中弹出，自动消失。通过命令式 API 调用，无需在组件树中声明。',
    whenToUse:
      '操作成功、失败或异步任务的轻提示。需要用户确认时使用 Modal，需要页面内常驻提示时使用 Alert。',
    demos: [
      {
        title: '基础用法',
        description: 'duration 单位为秒，设为 0 时不会自动关闭；loading 返回关闭函数。',
        code: messageBasicCode,
        element: <MessageBasic />,
      },
    ],
    api: [
      { prop: 'message.success / info / warning / error', type: '(content, duration?) => () => void', description: '快捷方法，返回手动关闭函数。' },
      { prop: 'message.loading', type: '(content, duration?) => () => void', description: '加载提示，默认不自动关闭。' },
      { prop: 'message.open', type: '(config | ReactNode) => () => void', description: '完整配置入口。' },
      { prop: 'content', type: 'ReactNode', description: '提示内容。' },
      { prop: 'duration', type: 'number', defaultValue: '3', description: '自动关闭秒数，0 表示常驻。' },
      { prop: 'type', type: "'info' | 'success' | 'warning' | 'error' | 'loading'", defaultValue: "'info'", description: '提示类型。' },
      { prop: 'closable', type: 'boolean', defaultValue: 'false', description: '展示手动关闭按钮。' },
      { prop: 'key', type: 'string | number', description: '相同 key 会更新同一条消息。' },
      { prop: 'onClose', type: '() => void', description: '消息移除后回调。' },
      { prop: 'message.destroy(key?)', type: '(key?) => void', description: '立即关闭全部或指定 key 的消息。' },
    ],
  },
];
