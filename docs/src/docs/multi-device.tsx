import type { ComponentDoc } from './types';
import ConfigProviderBasic from '../examples/config-provider/Basic';
import configProviderBasicCode from '../examples/config-provider/Basic?raw';

export const multiDeviceDocs: ComponentDoc[] = [
  {
    key: 'config-provider',
    name: 'ConfigProvider 多端配置',
    english: 'Multi-device',
    description:
      '用一套上下文统一设备判定：支持自动监听视口断点、强制移动端/桌面端，并让 Modal、Select 等组件在移动端自动切换为底部弹层与触控列表。',
    whenToUse:
      '需要同时覆盖桌面 Web 与移动端 H5，并希望保持同一套组件 API 时使用。移动端专用组件（NavBar、TabBar、PullToRefresh 等）可以继续按需组合。',
    demos: [
      {
        title: '一套组件，两种形态',
        description:
          '切换设备模式观察 Modal 与 Select 的形态变化；选择“自动检测”后，把浏览器缩到 768px 以下也会切换。',
        code: configProviderBasicCode,
        element: <ConfigProviderBasic />,
      },
    ],
    api: [
      {
        prop: 'device',
        type: "'auto' | 'mobile' | 'desktop'",
        defaultValue: "'auto'",
        description: '自动跟随视口，或强制指定设备。',
      },
      {
        prop: 'breakpoint',
        type: 'number',
        defaultValue: '768',
        description: '自动模式下的移动端最大宽度（px）。',
      },
      {
        prop: 'adaptive',
        type: 'boolean',
        defaultValue: 'false',
        description:
          '为后代组件提供默认 adaptive 值；Modal 与 Select 会自动响应。',
      },
      {
        prop: 'applyToRoot',
        type: 'boolean',
        defaultValue: 'false',
        description: '把解析结果写入 <html data-rc-device="...">，便于自定义 CSS。',
      },
      {
        prop: 'useDevice()',
        type: '() => DeviceContextValue',
        description:
          '读取 device、isMobile、breakpoint、adaptive、source；没有 Provider 时也会自动检测视口。',
      },
      {
        prop: 'MobileOnly / DesktopOnly',
        type: 'React component',
        description:
          '按当前设备条件渲染，支持 fallback；适合在同一个页面组合两种布局。',
      },
      {
        prop: 'Modal.adaptive',
        type: 'boolean',
        description:
          '单个组件覆盖上下文配置：桌面端对话框，移动端底部弹层（支持拖拽关闭）。',
      },
      {
        prop: 'Select.adaptive',
        type: 'boolean',
        description:
          '桌面端下拉列表，移动端底部选项面板；多选模式提供 Clear / Done 操作。',
      },
    ],
  },
];
