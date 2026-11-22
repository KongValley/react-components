import { Input, Space } from '@lib';

export default function InputTextArea() {
  return (
    <Space direction="vertical" size={14} style={{ width: '100%', maxWidth: 520 }}>
      <Input.TextArea
        placeholder="请输入项目描述..."
        rows={4}
        showCount
        maxLength={200}
      />
      <Input.TextArea
        placeholder="高度随内容自动伸缩（2-5 行）"
        autoSize={{ minRows: 2, maxRows: 5 }}
        defaultValue="这是一段会自动增高的文本。继续输入更多内容时，文本域会在 2 到 5 行之间自动调整高度。"
      />
    </Space>
  );
}
