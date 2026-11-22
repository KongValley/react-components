import { useState } from 'react';
import { InputNumber, Space } from '@lib';

export default function InputNumberBasic() {
  const [value, setValue] = useState<number | null>(3);

  return (
    <Space direction="vertical" size={14} style={{ width: '100%', maxWidth: 300 }}>
      <InputNumber
        min={1}
        max={10}
        value={value}
        onChange={setValue}
        placeholder="1-10"
      />
      <InputNumber min={0} max={100} step={5} defaultValue={20} precision={0} />
      <InputNumber defaultValue={0.5} step={0.1} precision={1} />
      <InputNumber size="small" defaultValue={3} />
      <InputNumber size="large" defaultValue={3} />
      <InputNumber status="error" defaultValue={5} />
    </Space>
  );
}
