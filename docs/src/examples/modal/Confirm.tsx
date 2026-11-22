import { Button, Modal, Space, message } from '@lib';

export default function ModalConfirm() {
  const remove = (name: string, shouldFail = false) => {
    Modal.confirm({
      title: '删除项目',
      type: 'warning',
      content: `确定要删除「${name}」吗？该操作不可撤销。`,
      okText: '删除',
      cancelText: '取消',
      onOk: () =>
        new Promise<void>((resolve, reject) => {
          window.setTimeout(() => {
            if (shouldFail) {
              message.error('删除失败，请稍后重试');
              reject(new Error('failed'));
            } else {
              message.success('项目已删除');
              resolve();
            }
          }, 700);
        }),
    });
  };

  return (
    <Space wrap>
      <Button variant="primary" danger onClick={() => remove('RC UI')}>
        删除项目
      </Button>
      <Button onClick={() => remove('RC UI', true)}>模拟删除失败</Button>
    </Space>
  );
}
