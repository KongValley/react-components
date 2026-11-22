import { useState } from 'react';
import { Space, Switch } from '@lib';

export default function SwitchBasic() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Space direction="vertical" size={18}>
      <Space>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          checkedChildren="开"
          unCheckedChildren="关"
        />
        <span>{enabled ? '通知已开启' : '通知已关闭'}</span>
      </Space>
      <Space wrap>
        <Switch defaultChecked />
        <Switch />
        <Switch disabled />
        <Switch disabled defaultChecked />
      </Space>
      <Space wrap>
        <Switch size="small" defaultChecked />
        <Switch size="small" />
        <Switch loading />
      </Space>
    </Space>
  );
}
