import { Divider, Link, Paragraph, Space, Text, Title } from '@lib';

export default function TypographyBasic() {
  return (
    <div style={{ maxWidth: 720 }}>
      <Title level={2}>设计原则</Title>
      <Paragraph>
        好的界面应当让内容自己说话。RC UI 通过统一的字号、行高与颜色层级，
        帮助页面建立清晰的信息结构。
      </Paragraph>

      <Divider />
      <Title level={4}>语义类型</Title>
      <Space direction="vertical" size={6}>
        <Text>默认文本</Text>
        <Text type="secondary">次要文本</Text>
        <Text type="success">成功文本</Text>
        <Text type="warning">警告文本</Text>
        <Text type="danger">错误文本</Text>
        <Text disabled>禁用文本</Text>
      </Space>

      <Divider />
      <Title level={4}>行内样式</Title>
      <Paragraph>
        支持 <Text strong>加粗</Text>、<Text italic>斜体</Text>、
        <Text underline>下划线</Text>、<Text delete>删除线</Text>、
        <Text code>const x = 1</Text> 与 <Text mark>高亮标记</Text>。
        访问 <Link href="#/components/typography">组件文档</Link> 了解更多。
      </Paragraph>
    </div>
  );
}
