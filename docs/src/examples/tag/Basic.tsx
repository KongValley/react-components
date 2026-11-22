import { useState } from 'react';
import { Space, Tag } from '@lib';

export default function TagBasic() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'CSS']);

  return (
    <Space direction="vertical" size={18}>
      <Space wrap>
        <Tag>Default</Tag>
        <Tag color="primary">Primary</Tag>
        <Tag color="success">Success</Tag>
        <Tag color="warning">Warning</Tag>
        <Tag color="danger">Danger</Tag>
        <Tag color="info">Info</Tag>
        <Tag color="#7c3aed" bordered>
          Custom
        </Tag>
      </Space>
      <Space wrap>
        {tags.map((tag) => (
          <Tag
            key={tag}
            color="primary"
            closable
            onClose={() => setTags((previous) => previous.filter((item) => item !== tag))}
          >
            {tag}
          </Tag>
        ))}
      </Space>
    </Space>
  );
}
