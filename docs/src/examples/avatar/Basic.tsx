import { Avatar, Icon, Space } from '@lib';

const DATA_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2563eb"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><text x="40" y="50" font-family="Arial" font-size="26" fill="white" text-anchor="middle">RC</text></svg>',
)}`;

export default function AvatarBasic() {
  return (
    <Space wrap size={16} align="center">
      <Avatar size="small">S</Avatar>
      <Avatar>M</Avatar>
      <Avatar size="large">L</Avatar>
      <Avatar size={52} shape="square">
        RC
      </Avatar>
      <Avatar src={DATA_IMAGE} alt="RC 用户" />
      <Avatar icon={<Icon name="user" size={16} />} />
      <Avatar style={{ background: 'var(--rcui-color-primary)', color: '#fff' }}>UI</Avatar>
    </Space>
  );
}
