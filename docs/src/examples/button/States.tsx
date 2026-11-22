import { useState } from 'react';
import { Button, Icon, Space, message } from '@lib';

export default function ButtonStates() {
  const [loading, setLoading] = useState(false);

  const simulate = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      message.success('操作完成');
    }, 1200);
  };

  return (
    <Space direction="vertical" size={14} style={{ width: '100%' }}>
      <Space wrap>
        <Button size="small">Small</Button>
        <Button>Middle</Button>
        <Button size="large">Large</Button>
      </Space>
      <Space wrap>
        <Button variant="primary" icon={<Icon name="plus" />}>
          新建
        </Button>
        <Button shape="circle" icon={<Icon name="search" />} aria-label="搜索" />
        <Button shape="round" icon={<Icon name="check" />}>
          确认
        </Button>
        <Button variant="primary" loading={loading} onClick={simulate}>
          {loading ? '处理中' : '模拟加载'}
        </Button>
      </Space>
      <Button variant="primary" block>
        Block Button
      </Button>
    </Space>
  );
}
