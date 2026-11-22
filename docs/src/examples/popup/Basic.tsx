import { useState } from 'react';
import { Button, Popup, Space, Text, type PopupPosition } from '@lib';
import { MobileFrame } from '../../components/MobileFrame';

export default function PopupBasic() {
  const [position, setPosition] = useState<PopupPosition | null>(null);

  return (
    <>
      <MobileFrame>
        <div className="docs-mobile-stack docs-mobile-stack--center">
          <p className="docs-mobile-caption">
            弹出层负责遮罩、滚动锁定、焦点陷阱与安全区适配，支持四个方向与居中模式。
          </p>
          <Space wrap>
            <Button onClick={() => setPosition('bottom')}>底部弹出</Button>
            <Button onClick={() => setPosition('center')}>居中弹出</Button>
            <Button onClick={() => setPosition('left')}>左侧抽屉</Button>
          </Space>
        </div>
      </MobileFrame>

      <Popup
        open={position !== null}
        position={position ?? 'bottom'}
        title={position === 'center' ? '确认操作' : '弹出层'}
        closable
        onClose={() => setPosition(null)}
      >
        <Text>
          这是一个 {position ?? 'bottom'} 方向的弹出面板。底部面板可以按住顶部横条向下拖动关闭，
          打开时会锁定页面滚动并把焦点限制在面板内。
        </Text>
        <Space style={{ marginTop: 20, justifyContent: 'flex-end', width: '100%' }}>
          <Button onClick={() => setPosition(null)}>取消</Button>
          <Button variant="primary" onClick={() => setPosition(null)}>
            知道了
          </Button>
        </Space>
      </Popup>
    </>
  );
}
