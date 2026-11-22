import { Button, Form, Input, Select, Space, message } from '@lib';

const ROLES = [
  { label: '管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '访客', value: 'viewer' },
];

export default function FormBasic() {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      style={{ maxWidth: 460 }}
      onFinish={(values) => {
        message.success(`欢迎，${String(values.username)}！`);
      }}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, max: 16, message: '用户名长度为 3-16 个字符' },
        ]}
      >
        <Input placeholder="请输入用户名" allowClear showCount maxLength={16} />
      </Form.Item>

      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '邮箱格式不正确' },
        ]}
      >
        <Input placeholder="name@example.com" />
      </Form.Item>

      <Form.Item
        name="role"
        label="角色"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Select placeholder="请选择角色" options={ROLES} />
      </Form.Item>

      <Form.Item name="bio" label="简介" extra="最多 120 个字符，支持自动增高">
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 4 }}
          maxLength={120}
          showCount
          placeholder="介绍一下自己..."
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button variant="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
