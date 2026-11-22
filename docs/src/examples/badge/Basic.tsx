import { Avatar, Badge, Space } from '@lib';

export default function BadgeBasic() {
  return (
    <Space wrap size={28} align="center">
      <Badge count={5}>
        <Avatar shape="square">RC</Avatar>
      </Badge>
      <Badge count={120} overflowCount={99}>
        <Avatar shape="square">UI</Avatar>
      </Badge>
      <Badge dot>
        <Avatar shape="square">α</Avatar>
      </Badge>
      <Badge count={0} showZero>
        <Avatar shape="square">0</Avatar>
      </Badge>
      <Badge count="NEW" color="#7c3aed">
        <Avatar shape="square">NEW</Avatar>
      </Badge>
      <Badge count={8} />
    </Space>
  );
}
