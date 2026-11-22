import { useState } from 'react';
import { Button, Form, Input, Modal } from '@lib';

export default function ModalBasic() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = () => {
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
    }, 800);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        打开对话框
      </Button>
      <Modal
        open={open}
        title="新建项目"
        okText="创建"
        cancelText="取消"
        confirmLoading={submitting}
        onOk={submit}
        onCancel={() => setOpen(false)}
      >
        <Form layout="vertical">
          <Form.Item label="项目名称" required>
            <Input placeholder="例如：RC UI 设计系统" />
          </Form.Item>
          <Form.Item label="项目描述">
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} placeholder="简要描述项目目标" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
