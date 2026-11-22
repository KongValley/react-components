import { Select } from '@lib';

const options = [
  {
    label: '前端',
    options: [
      { label: 'React', value: 'react' },
      { label: 'Vue', value: 'vue' },
      { label: 'Svelte', value: 'svelte' },
    ],
  },
  {
    label: '后端',
    options: [
      { label: 'Node.js', value: 'node' },
      { label: 'Go', value: 'go' },
      { label: 'Rust', value: 'rust' },
    ],
  },
];

export default function SelectSearch() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <Select
        mode="multiple"
        showSearch
        allowClear
        options={options}
        defaultValue={['react', 'node']}
        placeholder="选择技术栈"
        onChange={(value) => console.log('selected:', value)}
      />
      <Select
        showSearch
        options={options}
        placeholder="搜索并选择（单选）"
        notFoundContent="没有匹配项"
      />
    </div>
  );
}
