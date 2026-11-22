import { Button, Space, message } from '@lib';

export default function MessageBasic() {
  return (
    <Space wrap>
      <Button onClick={() => message.success('保存成功')}>成功</Button>
      <Button onClick={() => message.info('这是一条信息提示')}>信息</Button>
      <Button onClick={() => message.warning('请检查输入内容')}>警告</Button>
      <Button onClick={() => message.error('操作失败，请重试')}>错误</Button>
      <Button
        onClick={() => {
          const close = message.loading('正在上传文件...', 0);
          window.setTimeout(() => {
            close();
            message.success('上传完成');
          }, 1300);
        }}
      >
        加载后完成
      </Button>
      <Button
        onClick={() =>
          message.open({
            content: '这条通知不会自动关闭',
            type: 'info',
            duration: 0,
            closable: true,
          })
        }
      >
        可手动关闭
      </Button>
    </Space>
  );
}
