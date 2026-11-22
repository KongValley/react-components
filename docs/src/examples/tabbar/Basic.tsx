import { useState } from 'react';
import { Icon, TabBar, type TabBarItem } from '@lib';
import { MobileFrame } from '../../components/MobileFrame';

const ITEMS: TabBarItem[] = [
  {
    key: 'home',
    title: '首页',
    icon: <Icon name="home" size={22} />,
  },
  {
    key: 'discover',
    title: '发现',
    icon: <Icon name="search" size={22} />,
    badge: 3,
  },
  {
    key: 'message',
    title: '消息',
    icon: <Icon name="bell" size={22} />,
    dot: true,
  },
  {
    key: 'profile',
    title: '我的',
    icon: <Icon name="user" size={22} />,
  },
];

export default function TabBarBasic() {
  const [activeKey, setActiveKey] = useState('home');
  const current = ITEMS.find((item) => item.key === activeKey);

  return (
    <MobileFrame>
      <div className="docs-mobile-body">
        <div>
          <strong style={{ display: 'block', fontSize: 18, color: 'var(--rc-color-text)' }}>
            {current?.title}
          </strong>
          <span style={{ marginTop: 6, display: 'block' }}>
            切换标签时图标会播放一次弹性动画
          </span>
        </div>
      </div>
      <TabBar
        items={ITEMS}
        activeKey={activeKey}
        onChange={setActiveKey}
        aria-label="主导航"
      />
    </MobileFrame>
  );
}
