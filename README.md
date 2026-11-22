# RC UI

一套为现代 React 应用打造的轻量多端组件库：**44 个组件、桌面/移动端自动适配、零运行时依赖、CSS 变量主题、完整 TypeScript 类型**。

组件由 React Hooks 与原生 CSS 实现，不引入 styled-components、dayjs 等运行时依赖，产物包含 ESM / CJS 与单文件样式，适合企业中后台、管理控制台、移动端 H5 和独立产品使用。

## 特性

- **44 个开箱即用的多端组件**：覆盖通用、布局、数据录入、数据展示、反馈、导航、多端与移动端八大分类。
- **一套 API 适配多端**：`ConfigProvider` + `useDevice` 自动判定设备；`Modal`、`Select` 可在移动端自动切换为底部弹层，业务代码无需分叉。
- **零运行时依赖**：仅以 `react` / `react-dom` 作为 peer dependency。
- **CSS 变量主题**：所有颜色、圆角、字号、间距、阴影均为 CSS 变量，覆盖变量即可品牌定制。
- **明暗双主题**：默认浅色，设置 `data-theme="dark"` 即切换深色，无需额外配置。
- **完整 TypeScript**：strict 模式编写，所有组件、Props、实例类型均导出。
- **可访问性**：语义化结构、键盘操作（Select / Tabs / Dropdown / Modal 等）、焦点陷阱、ARIA 属性。
- **可组合的浮层体系**：Tooltip / Popover / Dropdown / Select 共用自研定位引擎，自动翻转、跟随滚动。
- **移动端手势组件**：底部弹出层、动作面板、滚轮选择器、轮播、下拉刷新等，内置安全区、滚动锁定、触摸拖拽与指针手势。
- **细腻的过渡动效**：浮层、标签页指示器、开关、复选框、表单反馈等内置克制的进出场与微交互，统一使用运动令牌，并尊重 `prefers-reduced-motion`。
- **零全局污染**：只作用于带有 `rcui-` 前缀的元素，不重置宿主应用的全局样式。

## 安装

```bash
npm install @rc/components
# 或 pnpm add @rc/components / yarn add @rc/components
```

要求 React 18 及以上版本：

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

## 快速开始

```tsx
import { Button, Space } from '@rc/components';
import '@rc/components/style.css';

export function App() {
  return (
    <Space>
      <Button>取消</Button>
      <Button variant="primary">保存</Button>
    </Space>
  );
}
```

样式默认集中为单个 `style.css`，在应用入口引入一次即可。组件 JS 可从包根按需 tree-shaking。

如果需要把组件样式放入独立的 CSS Cascade Layer，改用分层版本（二选一，不要同时引入）：

```ts
import '@rc/components/style.layer.css';
```

### 暗色模式

```ts
// 切换至暗色
document.documentElement.dataset.theme = 'dark';

// 恢复浅色
delete document.documentElement.dataset.theme;
```

### 品牌定制

```css
:root {
  --rcui-color-primary: #0f766e;
  --rcui-color-primary-hover: #0d9488;
  --rcui-color-primary-bg: #f0fdfa;
  --rcui-color-primary-border: #99f6e4;
  --rcui-radius: 4px;
  --rcui-font-family: 'Inter', 'PingFang SC', sans-serif;
}
```

完整令牌清单见 [`src/styles/tokens.css`](src/styles/tokens.css)。

### 样式命名空间

自 **0.4.0** 起，所有运行时命名统一使用 `rcui-` 前缀，避免与 `rc-select`、`rc-tabs` 等 rc-* 生态组件产生类名或变量冲突：

- 类名：`.rcui-btn`、`.rcui-table__cell`
- CSS 变量：`--rcui-color-primary`
- keyframes：`rcui-fade-in`
- 设备属性：`data-rcui-device="mobile|desktop"`

包导入路径不变，仍为 `@rc/components`。从 0.3 升级时，业务侧的样式覆写需要同步替换 `rc-` → `rcui-`、`--rc-` → `--rcui-`、`data-rc-device` → `data-rcui-device`。

### Cascade Layers

`style.layer.css` 把全部组件样式包在 `@layer rcui` 中，适合嵌入已有大量全局样式的宿主系统。先声明层顺序，再引入分层样式：

```css
/* layers.css */
@layer reset, rcui, app;
```

```ts
import './layers.css';
import '@rc/components/style.layer.css';
import './app.css';
```

之后宿主自己的样式可以放在 `app` 层中稳定覆盖组件库，无需堆叠选择器或使用 `!important`：

```css
@layer app {
  .checkout .rcui-btn--primary {
    border-radius: 999px;
  }
}
```

注意：

- `style.css` 与 `style.layer.css` 只能选一个引入。
- 未分层的宿主 CSS 永远优先于 `@layer rcui`，这也是宿主覆盖组件样式的推荐方式。
- 如果宿主使用 Tailwind Preflight 等未分层 reset，它们也会优先于组件样式；请把 reset 放进更低层（如 `@layer reset`），或改用普通 `style.css`。
- Cascade Layers 需要现代浏览器；旧浏览器请继续使用 `style.css`。
- 分层文件与普通文件内容一致，仅多一层 `@layer rcui { ... }` 包装。

### 动效

交互动效统一使用运动令牌，可在宿主侧覆盖：

```css
:root {
  --rcui-duration-fast: 0.12s;
  --rcui-duration: 0.2s;
  --rcui-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --rcui-ease-spring: cubic-bezier(0.34, 1.4, 0.64, 1);
}
```

组件内置浮层进出场、Tabs 滑动指示器、开关/复选框弹性反馈、表单错误进入、Alert 关闭过渡等效果；当系统开启 `prefers-reduced-motion: reduce` 时，动画与过渡会自动降级为近乎瞬时。

## 组件总览

| 分类 | 组件 |
| --- | --- |
| 通用 | Button、Icon、Typography（Title / Text / Paragraph / Link）、Divider、Space |
| 布局 | Grid（Row / Col）、Layout（Header / Sider / Content / Footer）、Card（含 Card.Meta） |
| 数据录入 | Input（TextArea / Password）、InputNumber、Select、Checkbox（Group）、Radio（Group）、Switch、Form（Form.Item / useForm） |
| 数据展示 | Table、Pagination、Tag、Badge、Avatar、Tooltip、Popover、Empty、Skeleton、Spin |
| 反馈 | Alert、Modal（含 Modal.confirm）、Drawer、message |
| 导航 | Tabs、Breadcrumb、Dropdown |
| 多端 | ConfigProvider（useDevice / MobileOnly / DesktopOnly） |
| 移动端 | SafeArea、Popup、Cell（CellGroup）、NavBar、TabBar、SearchBar、Stepper、ActionSheet、Picker、Swiper、PullToRefresh |

## 常用示例

### 表单校验

```tsx
import { Button, Form, Input, Select, message } from '@rc/components';

export function ProfileForm() {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      style={{ maxWidth: 420 }}
      onFinish={(values) => message.success(`欢迎，${String(values.name)}`)}
    >
      <Form.Item
        name="name"
        label="用户名"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, max: 16, message: '长度为 3-16 个字符' },
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        name="email"
        label="邮箱"
        rules={[{ type: 'email', message: '邮箱格式不正确' }]}
      >
        <Input placeholder="name@example.com" />
      </Form.Item>
      <Form.Item name="role" label="角色">
        <Select
          options={[
            { label: '管理员', value: 'admin' },
            { label: '成员', value: 'member' },
          ]}
        />
      </Form.Item>
      <Button variant="primary" htmlType="submit">
        提交
      </Button>
    </Form>
  );
}
```

支持的校验能力：`required`、`min` / `max`、`len`、`pattern`、`type`（string / number / email / url）、异步 `validator`、`transform`；`Form.Item` 支持嵌套 `name` 路径、自定义 `valuePropName` / `trigger` / `getValueFromEvent`。

### 命令式反馈

```tsx
import { Modal, message } from '@rc/components';

message.success('保存成功');
message.error('操作失败，请重试');

const instance = Modal.confirm({
  title: '删除项目',
  content: '该操作不可撤销，确定继续吗？',
  okText: '删除',
  onOk: async () => {
    await deleteProject();
  },
});

// 需要时立即销毁
instance.destroy();
```

### 表格

```tsx
import { Table, Tag, type TableColumn } from '@rc/components';

interface User {
  key: string;
  name: string;
  age: number;
}

const columns: TableColumn<User>[] = [
  { title: '姓名', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
  { title: '年龄', dataIndex: 'age', align: 'center' },
  {
    title: '状态',
    render: () => <Tag color="success">在线</Tag>,
  },
];

<Table<User>
  columns={columns}
  dataSource={users}
  rowKey="key"
  pagination={{ pageSize: 10, showSizeChanger: true }}
/>;
```

### 多端适配

```tsx
import { Button, ConfigProvider, Modal, Select } from '@rc/components';

export function AdaptiveApp() {
  return (
    <ConfigProvider adaptive>
      <Select
        options={[
          { label: '北京', value: 'beijing' },
          { label: '上海', value: 'shanghai' },
        ]}
        mobileTitle="选择城市"
      />
      <Modal open title="提示" onOk={() => {}}>
        桌面端显示对话框，移动端自动变为底部弹层。
      </Modal>
    </ConfigProvider>
  );
}
```

`ConfigProvider` 默认按 768px 断点自动检测，也可以传入 `device="mobile" | "desktop"` 强制设备。业务代码可通过 `useDevice()` 获取当前设备，或用 `MobileOnly` / `DesktopOnly` 条件渲染两种布局；单独组件也可用 `adaptive` 覆盖全局配置。

### 移动端页面

```tsx
import { useState } from 'react';
import { Cell, CellGroup, NavBar, Switch, TabBar } from '@rc/components';

const tabs = [
  { key: 'home', title: '首页' },
  { key: 'settings', title: '设置' },
];

export function MobileSettings() {
  const [active, setActive] = useState('home');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--rcui-color-bg-layout)' }}>
      <NavBar title="设置" onBack={() => window.history.back()} />
      <CellGroup inset title="账号">
        <Cell title="昵称" value="Zoe" arrow />
        <Cell title="消息通知" extra={<Switch defaultChecked />} />
      </CellGroup>
      <TabBar fixed items={tabs} activeKey={active} onChange={setActive} />
    </div>
  );
}
```

底部弹层、动作面板、选择器与标签栏会自动处理 `env(safe-area-inset-*)`；需要手动避让时使用 `SafeArea`。

## 开发

```bash
npm install          # 安装依赖
npm run dev          # 启动文档站（http://127.0.0.1:5173）
npm run typecheck    # 检查 src 与 docs 两套 tsconfig
npm test             # Vitest + Testing Library
npm run test:watch   # 监听模式
npm run build        # 构建库：ESM + CJS + 类型 + style.css + style.layer.css
npm run build:docs   # 构建静态文档站到 dist-docs/
npm run preview:docs # 预览文档构建产物
```

### 目录结构

```
src/
  components/<name>/     # 组件源码、样式与测试
  hooks/                 # 受控状态、浮层定位、焦点陷阱等
  icons/                 # 内置 SVG 图标
  internal/              # Portal / Popup 等内部基础设施
  styles/                # 设计令牌、基础样式
  utils/                 # 路径读写、class 合并等
  index.ts               # 全量导出
docs/
  src/examples/          # 文档中的可运行示例（同时用于代码展示）
  src/docs/              # 文档数据与 API 表格
  src/pages/             # 首页
```

### 构建产物

```
dist/
  index.js        # ESM
  index.cjs       # CommonJS
  index.js.map
  index.cjs.map
  style.css       # 汇总样式
  style.layer.css # 汇总样式（包在 @layer rcui 中）
  types/          # .d.ts 声明
```

`package.json` 的 `exports` 已配置：

```json
{
  ".": {
    "types": "./dist/types/index.d.ts",
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  },
  "./style.css": "./dist/style.css",
  "./style.layer.css": "./dist/style.layer.css"
}
```

## 可访问性

- 尊重 `prefers-reduced-motion`：系统开启减少动态效果时，组件动画与过渡会自动关闭。
- Select 使用 `combobox` / `listbox` 语义，支持方向键、Enter、Esc、Backspace 删除标签。
- Tabs 使用 `tablist` / `tab` / `tabpanel`，方向键自动切换。
- Modal / Drawer / Popup 使用 `role="dialog"`、`aria-modal`、焦点陷阱、关闭后焦点回归、滚动锁定。
- Form 为标签与控件建立 `htmlFor` 关联，错误信息使用 `role="alert"` 与 `aria-describedby`。
- TabBar 使用 `tablist` / `tab`，Picker 使用 `listbox` / `option`，均支持方向键操作。
- 纯图标按钮需要传入 `aria-label`（例如 `<Button shape="circle" icon={<Icon name="search" />} aria-label="搜索" />`）。

## 当前边界（v0.4）

- 不含虚拟滚动、固定列、树形表格。
- 不含 DatePicker、Upload、Tree、Cascader 等重型组件。
- 移动端组件面向触摸优先场景，PullToRefresh 仅响应触摸手势；桌面端可通过受控 `refreshing` 展示加载状态。
- 自适应形态当前覆盖 Modal 与 Select；Table 在窄屏使用横向滚动，复杂表格的卡片化重排需业务自定义 `render`。
- 组件库不做 SSR 专用测试，但所有 `document` / `window` 访问均有运行时保护。
- 文案默认英文，可通过组件 Props 覆盖；未内置复杂国际化。

## License

[MIT](LICENSE)
