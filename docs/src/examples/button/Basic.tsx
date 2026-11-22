import { Button, Space } from '@lib';

export default function ButtonBasic() {
  return (
    <Space wrap size={[8, 12]}>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="dashed">Dashed</Button>
      <Button variant="text">Text</Button>
      <Button variant="link">Link</Button>
      <Button danger>Danger</Button>
      <Button variant="primary" danger>
        Delete
      </Button>
      <Button disabled>Disabled</Button>
    </Space>
  );
}
