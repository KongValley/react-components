import { useState } from 'react';
import { Button, Cell, CellGroup, PullToRefresh } from '@lib';
import { MobileFrame } from '../../components/MobileFrame';

const INITIAL_ITEMS = ['设计稿评审', '接口联调', '发布 v0.4.0'];

export default function PullToRefreshBasic() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
        setItems((previous) => [`${time} 同步的新任务`, ...previous].slice(0, 4));
        setRefreshing(false);
        resolve();
      }, 900);
    });
  };

  return (
    <MobileFrame>
      <PullToRefresh
        onRefresh={refresh}
        refreshing={refreshing}
        pullText="下拉刷新"
        releaseText="松开立即刷新"
        loadingText="正在同步…"
      >
        <div className="docs-ptr">
          <div className="docs-ptr__banner">
            <span>待办列表</span>
            <span>{items.length} 项</span>
          </div>
          <CellGroup inset>
            {items.map((item, index) => (
              <Cell
                key={`${item}-${index}`}
                title={item}
                description={index === 0 ? '刚刚更新' : undefined}
                arrow
              />
            ))}
          </CellGroup>
          <Button block onClick={refresh} disabled={refreshing}>
            {refreshing ? '刷新中…' : '模拟刷新（桌面）'}
          </Button>
          <p className="docs-mobile-caption">
            在触摸设备或浏览器的移动模拟模式下，从列表顶部向下拉动即可触发刷新。
          </p>
        </div>
      </PullToRefresh>
    </MobileFrame>
  );
}
