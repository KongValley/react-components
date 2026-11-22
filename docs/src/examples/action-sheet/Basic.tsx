import { useState } from 'react';
import { ActionSheet, Button, type ActionSheetAction } from '@lib';
import { MobileFrame } from '../../components/MobileFrame';

const ACTIONS: ActionSheetAction[] = [
  { key: 'camera', text: '拍照' },
  { key: 'album', text: '从相册选择' },
  { key: 'view', text: '查看大图' },
  { key: 'remove', text: '删除头像', danger: true },
];

export default function ActionSheetBasic() {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState('还没有选择');

  return (
    <>
      <MobileFrame>
        <div className="docs-mobile-stack">
          <p className="docs-mobile-caption">
            当前选择：<span className="docs-inline-value">{choice}</span>
          </p>
          <Button block onClick={() => setOpen(true)}>
            更换头像
          </Button>
          <p className="docs-mobile-caption">
            动作面板从底部弹出，危险操作使用红色语义，点击遮罩或取消按钮关闭。
          </p>
        </div>
      </MobileFrame>

      <ActionSheet
        open={open}
        title="上传头像"
        description="选择一种方式更新你的头像"
        actions={ACTIONS}
        cancelText="取消"
        onSelect={(action) => setChoice(String(action.text))}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
