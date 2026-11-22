import { useState } from 'react';
import { Button, Picker, type PickerColumn, type PickerValue } from '@lib';
import { MobileFrame } from '../../components/MobileFrame';

const COLUMNS: PickerColumn[] = [
  {
    key: '城市',
    values: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' },
      { label: '杭州', value: 'hangzhou' },
    ],
  },
  {
    key: '团队',
    values: [
      { label: '前端', value: 'frontend' },
      { label: '后端', value: 'backend' },
      { label: '设计', value: 'design' },
      { label: '产品', value: 'product' },
    ],
  },
];

function formatSelection(selection: PickerValue[]): string {
  return COLUMNS.map((column, index) => {
    const option = column.values.find((item) => item.value === selection[index]);
    return option ? String(option.label) : '';
  })
    .filter(Boolean)
    .join(' / ');
}

export default function PickerBasic() {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<PickerValue[]>(['shanghai', 'frontend']);

  return (
    <>
      <MobileFrame>
        <div className="docs-mobile-stack">
          <p className="docs-mobile-caption">
            当前配置：<span className="docs-inline-value">{formatSelection(selection)}</span>
          </p>
          <Button block onClick={() => setOpen(true)}>
            选择城市与团队
          </Button>
          <p className="docs-mobile-caption">
            滚轮使用 scroll-snap 对齐，支持触摸滑动、鼠标滚轮和方向键；确认后才会触发
            onChange。
          </p>
        </div>
      </MobileFrame>

      <Picker
        open={open}
        columns={COLUMNS}
        value={selection}
        onChange={(next) => setSelection(next)}
        onClose={() => setOpen(false)}
        title="选择配置"
        cancelText="取消"
        confirmText="确定"
      />
    </>
  );
}
