import { useState } from 'react';
import { Radio, Space, type RadioValue } from '@lib';

const OPTIONS = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
];

export default function RadioBasic() {
  const [value, setValue] = useState<RadioValue>('react');

  return (
    <Space direction="vertical" size={18}>
      <Radio.Group value={value} onChange={setValue} options={OPTIONS} />
      <Radio.Group
        defaultValue="card"
        optionType="button"
        buttonStyle="solid"
        options={[
          { label: '卡片视图', value: 'card' },
          { label: '列表视图', value: 'list' },
          { label: '表格视图', value: 'table' },
        ]}
      />
      <Radio.Group
        defaultValue="small"
        optionType="button"
        size="small"
        options={[
          { label: '日', value: 'day' },
          { label: '周', value: 'week' },
          { label: '月', value: 'month' },
        ]}
      />
      <Radio.Group defaultValue="a" disabled options={OPTIONS.slice(0, 2)} />
    </Space>
  );
}
