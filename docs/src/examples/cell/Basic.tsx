import { useState } from 'react';
import { Cell, CellGroup, Icon, Switch, message } from '@lib';
import { MobileFrame } from '../../components/MobileFrame';

export default function CellBasic() {
  const [notifications, setNotifications] = useState(true);

  return (
    <MobileFrame>
      <div className="docs-cell-demo">
        <CellGroup title="账号信息" description="点击单元格查看交互反馈" inset>
          <Cell
            title="头像"
            value="RC"
            arrow
            onClick={() => message.info('打开头像选择器')}
          />
          <Cell
            title="昵称"
            description="每 30 天可以修改一次"
            value="Zoe"
            arrow
            onClick={() => message.info('编辑昵称')}
          />
          <Cell title="手机号" value="138 **** 0000" />
        </CellGroup>

        <CellGroup title="偏好设置" inset>
          <Cell
            title="消息通知"
            description="接收系统与业务消息"
            icon={<Icon name="bell" size={18} />}
            extra={
              <Switch
                checked={notifications}
                onChange={setNotifications}
                aria-label="消息通知"
              />
            }
          />
          <Cell
            title="清理缓存"
            value="12.6 MB"
            arrow
            onClick={() => message.success('缓存已清理')}
          />
          <Cell title="当前版本" value="0.3.0" disabled />
        </CellGroup>
      </div>
    </MobileFrame>
  );
}
