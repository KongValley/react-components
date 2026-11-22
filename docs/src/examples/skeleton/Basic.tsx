import { useState } from 'react';
import { Space, Skeleton, Switch } from '@lib';

export default function SkeletonBasic() {
  const [loading, setLoading] = useState(true);

  return (
    <Space direction="vertical" size={18} style={{ width: '100%', maxWidth: 560 }}>
      <Space>
        <Switch checked={loading} onChange={setLoading} />
        <span>显示骨架屏</span>
      </Space>

      <Skeleton loading={loading} active avatar paragraph={{ rows: 3 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--rc-color-primary-bg)',
              color: 'var(--rc-color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
            }}
          >
            RC
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 15 }}>内容加载完成</h3>
            <p style={{ margin: 0, color: 'var(--rc-color-text-secondary)', lineHeight: 1.7 }}>
              骨架屏在数据加载期间保持页面结构稳定，减少布局跳动。
            </p>
          </div>
        </div>
      </Skeleton>

      <Skeleton active title={false} paragraph={{ rows: 2, width: ['92%', '70%'] }} />
    </Space>
  );
}
