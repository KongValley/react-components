import { Divider, Text } from '@lib';

export default function DividerBasic() {
  return (
    <div>
      <Text>上方内容</Text>
      <Divider />
      <Text>使用分割文字</Text>
      <Divider>分割文字</Divider>
      <Divider orientation="left">左侧标题</Divider>
      <Divider orientation="right" dashed>
        右侧虚线标题
      </Divider>
      <Divider plain>轻量文字</Divider>
      <Text>文本</Text>
      <Divider type="vertical" />
      <Text>文本</Text>
      <Divider type="vertical" />
      <Text>文本</Text>
    </div>
  );
}
