import { Select } from '@lib';

const options = [
  { label: '设计部', value: 'design' },
  { label: '研发部', value: 'engineering' },
  { label: '市场部', value: 'marketing', disabled: true },
  { label: '人事部', value: 'people' },
];

export default function SelectBasic() {
  return (
    <Select
      options={options}
      defaultValue="design"
      placeholder="请选择部门"
      allowClear
      style={{ maxWidth: 320 }}
      onChange={(value) => console.log('selected:', value)}
    />
  );
}
