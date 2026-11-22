import { useEffect, useRef } from 'react';
import { NAV_GROUPS } from '../docs/nav';

export function Sidebar({
  activeKey,
  open,
  onNavigate,
}: {
  activeKey?: string;
  open: boolean;
  onNavigate: () => void;
}) {
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeKey]);

  return (
    <aside className={`docs-sidebar${open ? ' docs-sidebar--open' : ''}`} aria-label="文档导航">
      <nav className="docs-nav">
        <a
          href="#/"
          className={`docs-nav__home${activeKey === undefined ? ' is-active' : ''}`}
          aria-current={activeKey === undefined ? 'page' : undefined}
          ref={activeKey === undefined ? activeRef : undefined}
          onClick={onNavigate}
        >
          <span className="docs-nav__home-icon">◆</span>
          概览
        </a>
        {NAV_GROUPS.map((group) => (
          <div className="docs-nav__group" key={group.title}>
            <div className="docs-nav__group-title">{group.title}</div>
            {group.items.map((item) => (
              <a
                key={item.key}
                href={`#/components/${item.key}`}
                className={`docs-nav__item${activeKey === item.key ? ' is-active' : ''}`}
                aria-current={activeKey === item.key ? 'page' : undefined}
                ref={activeKey === item.key ? activeRef : undefined}
                onClick={onNavigate}
              >
                {item.name}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
