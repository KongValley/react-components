import { Button, Form, Input, InputNumber, Switch, message } from '@lib';

export default function FormHorizontal() {
  return (
    <Form
      layout="horizontal"
      labelWidth={104}
      style={{ maxWidth: 600 }}
      initialValues={{ name: 'RC UI', seats: 8, enabled: true }}
      onFinish={() => message.success('配置已保存')}
      onFinishFailed={() => message.error('请检查表单内容')}
    >
      <Form.Item
        name="name"
        label="项目名称"
        rules={[{ required: true, message: '请输入项目名称' }]}
      >
        <Input placeholder="请输入项目名称" />
      </Form.Item>
      <Form.Item name="seats" label="席位数">
        <InputNumber min={1} max={200} style={{ maxWidth: 180 }} />
      </Form.Item>
      <Form.Item name="enabled" label="启用项目" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label=" " style={{ marginBottom: 0 }}>
        <Button variant="primary" htmlType="submit">
          保存配置
        </Button>
      </Form.Item>
    </Form>
  );
}
