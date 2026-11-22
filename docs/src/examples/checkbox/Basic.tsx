import { useState } from 'react';
import { Checkbox, Divider, Space, type CheckboxValue } from '@lib';

const OPTIONS = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
];

export default function CheckboxBasic() {
  const [selected, setSelected] = useState<CheckboxValue[]>(['react']);
  const allChecked = selected.length === OPTIONS.length;
  const indeterminate = selected.length > 0 && !allChecked;

  return (
    <Space direction="vertical" size={14}>
      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        onChange={(event) =>
          setSelected(event.target.checked ? OPTIONS.map((option) => option.value) : [])
        }
      >
        全选
      </Checkbox>
      <Divider style={{ margin: 0 }} />
      <Checkbox.Group
        options={OPTIONS}
        value={selected}
        onChange={setSelected}
      />
      <Divider style={{ margin: 0 }} />
      <Checkbox.Group
        direction="vertical"
        defaultValue={['a']}
        options={[
          { label: '选项 A', value: 'a' },
          { label: '选项 B（禁用）', value: 'b', disabled: true },
          { label: '选项 C', value: 'c' },
        ]}
      />
    </Space>
  );
}
