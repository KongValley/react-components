import { Input, Space } from '@lib';

export default function InputPassword() {
  return (
    <Space direction="vertical" size={14} style={{ width: '100%', maxWidth: 360 }}>
      <Input.Password placeholder="请输入密码" />
      <Input.Password
        placeholder="关闭可见性切换"
        visibilityToggle={false}
      />
      <Input.Password placeholder="密码错误" status="error" defaultValue="123456" />
    </Space>
  );
}
