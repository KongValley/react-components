import { useState } from 'react';
import { Card, Space, Spin, Switch } from '@lib';

export default function SpinBasic() {
  const [spinning, setSpinning] = useState(true);

  return (
    <Space direction="vertical" size={18} style={{ width: '100%', maxWidth: 520 }}>
      <Space>
        <Switch checked={spinning} onChange={setSpinning} />
        <span>加载中</span>
      </Space>

      <Spin spinning={spinning} tip="正在加载数据...">
        <Card title="本周数据">
          <p style={{ margin: 0, color: 'var(--rcui-color-text-secondary)', lineHeight: 1.8 }}>
            组件库本周新增 12 个组件、4 个交互示例，并完善了键盘操作与焦点管理。
          </p>
        </Card>
      </Spin>

      <Space size={28} align="center">
        <Spin size="small" />
        <Spin />
        <Spin size="large" />
      </Space>
    </Space>
  );
}
