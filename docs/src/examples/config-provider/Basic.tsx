import { useState } from 'react';
import {
  Button,
  ConfigProvider,
  DesktopOnly,
  MobileOnly,
  Modal,
  Select,
  Space,
  Tag,
  useDevice,
  type ConfigProviderDevice,
  type SelectValue,
} from '@lib';

const DEVICES: Array<{ value: ConfigProviderDevice; label: string }> = [
  { value: 'auto', label: '自动检测' },
  { value: 'mobile', label: '强制移动端' },
  { value: 'desktop', label: '强制桌面端' },
];

const OPTIONS = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
];

function DeviceBadge() {
  const { device, source } = useDevice();
  return (
    <Tag color="primary">
      {device}
      {source === 'manual' ? ' · 强制' : ' · 自动'}
    </Tag>
  );
}

export default function ConfigProviderBasic() {
  const [device, setDevice] = useState<ConfigProviderDevice>('auto');
  const [modalOpen, setModalOpen] = useState(false);
  const [city, setCity] = useState<SelectValue | null>('shanghai');

  return (
    <ConfigProvider device={device} adaptive>
      <div className="docs-multi">
        <div className="docs-multi__toolbar">
          <span className="docs-multi__label">设备模式</span>
          <Space wrap>
            {DEVICES.map((option) => (
              <Button
                key={option.value}
                size="small"
                variant={device === option.value ? 'primary' : 'default'}
                onClick={() => setDevice(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </Space>
        </div>

        <div className="docs-multi__panel">
          <div className="docs-multi__status">
            <span>当前渲染</span>
            <DeviceBadge />
            <MobileOnly>
              <Tag color="success">移动端布局</Tag>
            </MobileOnly>
            <DesktopOnly>
              <Tag color="info">桌面端布局</Tag>
            </DesktopOnly>
          </div>

          <p className="docs-mobile-caption">
            同一套 Modal 与 Select：移动端自动变成底部弹层和选项面板，桌面端保持对话框与下拉列表。
            “自动检测”会跟随 768px 断点，也可以手动强制设备。
          </p>

          <Space wrap>
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              打开 Modal
            </Button>
            <Select
              options={OPTIONS}
              value={city}
              onChange={(next) =>
                setCity(Array.isArray(next) ? (next[0] ?? null) : next)
              }
              mobileTitle="选择城市"
              style={{ width: 180 }}
            />
            <Select
              mode="multiple"
              options={OPTIONS}
              defaultValue={['beijing', 'shanghai']}
              mobileTitle="选择关注城市"
              style={{ width: 220 }}
            />
          </Space>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title="多端 Modal"
        centered
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        <p style={{ margin: 0 }}>
          这个弹窗在桌面端居中显示，在移动端自动变为可拖拽关闭的底部弹层，
          业务代码不需要区分设备。
        </p>
      </Modal>
    </ConfigProvider>
  );
}
