import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Icon,
  Input,
  Switch,
  Tag,
  Tooltip,
  message,
} from '@lib';
import { CodeBlock } from '../components/CodeBlock';
import { NAV_GROUPS } from '../docs/nav';
import { navigate } from '../hooks/useHashRoute';

const QUICK_START = `import { Button } from '@rc/components';
import '@rc/components/style.css';

export function App() {
  return <Button variant="primary">Hello RC UI</Button>;
}`;

const FEATURES = [
  {
    icon: 'success' as const,
    title: '零运行时依赖',
    description:
      '只依赖 React 本身，不引入 styled-components、dayjs 等运行时，产物体积可控。',
  },
  {
    icon: 'sun' as const,
    title: 'CSS 变量主题',
    description:
      '所有设计令牌以 CSS 变量暴露，覆盖变量即可品牌定制，内置明暗双主题。',
  },
  {
    icon: 'check' as const,
    title: '完整 TypeScript',
    description:
      'strict 模式编写，每个组件与 Props 均导出类型，编辑器内即可获得完整提示。',
  },
  {
    icon: 'user' as const,
    title: '可访问性优先',
    description:
      '语义化结构、键盘操作、焦点管理与 ARIA 属性贯穿 Select、Modal、Tabs 等交互组件。',
  },
];

const STATS = [
  { value: '44', label: '组件' },
  { value: '0', label: '运行时依赖' },
  { value: '2', label: '内置主题' },
  { value: '100%', label: 'TypeScript' },
];

export function Home() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero__copy">
          <div className="home-hero__meta">
            <Tag color="primary" bordered>
              v0.3.0
            </Tag>
            <span>零运行时依赖 · 深色模式 · TypeScript</span>
          </div>
          <h1>
            为现代 React 应用
            <br />
            打造的高质量组件库
          </h1>
          <p className="home-hero__lead">
            44 个开箱即用的多端组件，同一套 API 自动适配桌面与移动端，内置完整的键盘交互与无障碍支持。
            用一致的视觉语言，更快地构建企业级界面。
          </p>
          <div className="home-hero__actions">
            <Button variant="primary" size="large" onClick={() => navigate('/components/button')}>
              开始使用
            </Button>
            <Button size="large" onClick={() => navigate('/components/table')}>
              浏览组件
            </Button>
          </div>
          <div className="home-hero__install">
            <code>npm install @rc/components</code>
            <span>·</span>
            <code>import '@rc/components/style.css'</code>
          </div>
        </div>

        <div className="home-hero__preview">
          <Card
            className="home-preview-card"
            title="通知设置"
            extra={<Badge count={3} />}
            actions={[
              <Button variant="link" onClick={() => message.info('查看全部通知')}>
                查看全部
              </Button>,
            ]}
          >
            <div className="home-preview__user">
              <Avatar size={40} shape="square">
                RC
              </Avatar>
              <div className="home-preview__user-info">
                <strong>RC UI Workspace</strong>
                <span>组件库设计与开发</span>
              </div>
              <Tag color="success">在线</Tag>
            </div>
            <Input
              placeholder="搜索组件..."
              prefix={<Icon name="search" size={14} />}
              allowClear
            />
            <div className="home-preview__row">
              <Switch
                checked={notifications}
                onChange={setNotifications}
                checkedChildren="开"
                unCheckedChildren="关"
              />
              <span>启用实时通知</span>
            </div>
            <div className="home-preview__row home-preview__row--end">
              <Tooltip title="所有设置会自动保存">
                <Button variant="text">查看说明</Button>
              </Tooltip>
              <Button
                variant="primary"
                onClick={() => message.success('设置已保存')}
              >
                保存设置
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="home-stats" aria-label="组件库数据">
        {STATS.map((stat) => (
          <div className="home-stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="home-section">
        <div className="home-section__head">
          <h2>为什么选择 RC UI</h2>
          <p>把复杂留给组件，把简单留给业务。</p>
        </div>
        <div className="home-features">
          {FEATURES.map((feature) => (
            <div className="home-feature" key={feature.title}>
              <div className="home-feature__icon">
                <Icon name={feature.icon} size={18} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section home-quickstart">
        <div className="home-quickstart__copy">
          <h2>三分钟接入</h2>
          <p>
            组件库以 ESM / CJS 双格式发布，样式集中为单个 CSS 文件。
            通过 CSS 变量即可覆盖主色、圆角、字号等设计令牌。
          </p>
          <ul className="home-checklist">
            <li>
              <Icon name="check" size={14} />
              支持 React 18 及以上版本
            </li>
            <li>
              <Icon name="check" size={14} />
              组件按需 tree-shaking
            </li>
            <li>
              <Icon name="check" size={14} />
              暗色主题只需设置 data-theme=&quot;dark&quot;
            </li>
          </ul>
          <Button variant="primary" onClick={() => navigate('/components/form')}>
            查看表单示例
          </Button>
        </div>
        <CodeBlock code={QUICK_START} language="tsx" maxHeight={360} />
      </section>

      <section className="home-section">
        <div className="home-section__head">
          <h2>组件总览</h2>
          <p>八大分类，一套组件覆盖桌面后台、移动端 H5 与响应式多端场景。</p>
        </div>
        <div className="home-catalog">
          {NAV_GROUPS.map((group) => (
            <div className="home-catalog__group" key={group.title}>
              <h3>{group.title}</h3>
              <div className="home-catalog__items">
                {group.items.map((item) => (
                  <a
                    key={item.key}
                    className="home-catalog__item"
                    href={`#/components/${item.key}`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
