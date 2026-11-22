import { useEffect, useState } from 'react';
import { Icon } from '@lib';
import { Sidebar } from './components/Sidebar';
import { ComponentDocPage } from './components/ComponentDocPage';
import { DOC_MAP } from './docs';
import { useHashRoute } from './hooks/useHashRoute';
import { useTheme } from './hooks/useTheme';
import { Home } from './pages/Home';

export function App() {
  const route = useHashRoute();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const doc = route.kind === 'doc' ? DOC_MAP.get(route.key) : undefined;
  const activeKey = doc?.key;

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route]);

  useEffect(() => {
    document.title = doc
      ? `${doc.name} · RC UI`
      : route.kind === 'not-found'
        ? '页面未找到 · RC UI'
        : 'RC UI · React 组件库';
  }, [doc, route.kind]);

  return (
    <div className="docs-app">
      <header className="docs-header">
        <button
          type="button"
          className="docs-menu"
          aria-label="打开导航"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((previous) => !previous)}
        >
          <Icon name="menu" size={18} />
        </button>
        <a className="docs-logo" href="#/">
          <span className="docs-logo__mark">rc</span>
          <span className="docs-logo__text">
            RC UI
            <em>React components</em>
          </span>
        </a>
        <span className="docs-version">v0.4.0</span>
        <div className="docs-header__spacer" />
        <button
          type="button"
          className="docs-theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
          title={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
          <span>{theme === 'dark' ? '浅色' : '深色'}</span>
        </button>
      </header>

      <Sidebar
        activeKey={activeKey}
        open={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />
      {sidebarOpen ? (
        <div
          className="docs-overlay"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <main className="docs-main">
        <div className="docs-content">
          {doc ? (
            <ComponentDocPage doc={doc} />
          ) : route.kind === 'not-found' ? (
            <div className="docs-not-found">
              <span>404</span>
              <h1>页面不存在</h1>
              <p>你访问的组件文档暂时不存在，也许链接有误。</p>
              <a className="docs-link-button" href="#/">
                返回首页
              </a>
            </div>
          ) : (
            <Home />
          )}
        </div>
        <footer className="docs-footer">
          RC UI · MIT License · Built with React &amp; CSS variables
        </footer>
      </main>
    </div>
  );
}
