import { Icon, Input, Space } from '@lib';

export default function InputBasic() {
  return (
    <Space direction="vertical" size={14} style={{ width: '100%', maxWidth: 480 }}>
      <Input placeholder="基础输入框" />
      <Input
        prefix={<Icon name="search" size={14} />}
        placeholder="带前缀、清除与字数统计"
        allowClear
        showCount
        maxLength={20}
      />
      <Input suffix="USD" placeholder="带后缀" />
      <Input addonBefore="https://" addonAfter=".com" placeholder="域名" />
      <Space wrap>
        <Input size="small" placeholder="Small" />
        <Input placeholder="Middle" />
        <Input size="large" placeholder="Large" />
      </Space>
      <Input status="error" placeholder="错误状态" defaultValue="invalid" />
    </Space>
  );
}
