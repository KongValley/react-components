import { useState } from 'react';
import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  message,
  type DrawerPlacement,
} from '@lib';

export default function DrawerBasic() {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<DrawerPlacement>('right');

  const show = (next: DrawerPlacement) => {
    setPlacement(next);
    setOpen(true);
  };

  return (
    <>
      <Space wrap>
        <Button variant="primary" onClick={() => show('right')}>
          右侧抽屉
        </Button>
        <Button onClick={() => show('left')}>左侧抽屉</Button>
        <Button onClick={() => show('bottom')}>底部抽屉</Button>
      </Space>

      <Drawer
        open={open}
        placement={placement}
        title="编辑成员"
        onClose={() => setOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button
              variant="primary"
              onClick={() => {
                setOpen(false);
                message.success('成员信息已更新');
              }}
            >
              保存
            </Button>
          </Space>
        }
      >
        <Form layout="vertical">
          <Form.Item label="姓名" required>
            <Input defaultValue="林夏" />
          </Form.Item>
          <Form.Item label="邮箱" required>
            <Input defaultValue="linxia@example.com" />
          </Form.Item>
          <Form.Item label="角色">
            <Select
              defaultValue="designer"
              options={[
                { label: '设计师', value: 'designer' },
                { label: '工程师', value: 'engineer' },
                { label: '产品经理', value: 'pm' },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
