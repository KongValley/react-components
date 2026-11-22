import { Alert, Button, message } from '@lib';

export default function AlertBasic() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <Alert type="info" showIcon message="这是一条信息提示" />
      <Alert
        type="success"
        showIcon
        message="发布成功"
        description="新版本已经推送到生产环境，用户将逐步收到更新。"
      />
      <Alert
        type="warning"
        showIcon
        closable
        message="存储空间即将用尽"
        onClose={() => message.info('已忽略该提醒')}
      />
      <Alert
        type="error"
        showIcon
        message="数据加载失败"
        action={
          <Button size="small" variant="link" onClick={() => message.info('正在重试...')}>
            重试
          </Button>
        }
      />
      <Alert banner type="warning" showIcon message="系统将在今晚 23:00 进行例行维护" />
    </div>
  );
}
