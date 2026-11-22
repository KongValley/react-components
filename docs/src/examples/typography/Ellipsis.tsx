import { Paragraph, Text } from '@lib';

const LONG_TEXT =
  '这是一段用于演示省略与复制能力的长文本。RC UI 会根据容器宽度自动截断内容，并在末端展示省略号，同时提供一键复制按钮，方便用户快速获取完整信息。';

export default function TypographyEllipsis() {
  return (
    <div style={{ display: 'grid', gap: 18, maxWidth: 520 }}>
      <Text ellipsis copyable={{ tooltips: ['复制全文', '已复制'] }}>
        {LONG_TEXT}
      </Text>
      <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
        {LONG_TEXT}
        {LONG_TEXT}
      </Paragraph>
    </div>
  );
}
