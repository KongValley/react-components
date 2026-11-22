import { Button, Space, Tooltip } from '@lib';

export default function TooltipBasic() {
  return (
    <Space wrap size={14}>
      <Tooltip title="顶部提示">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip title="右侧提示" placement="right">
        <Button>Right</Button>
      </Tooltip>
      <Tooltip title="底部提示" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip title="点击触发" trigger="click">
        <Button variant="dashed">Click</Button>
      </Tooltip>
      <Tooltip title="延迟 500ms 出现" delay={500}>
        <Button variant="text">Delay</Button>
      </Tooltip>
      <Tooltip title="这是一条较长的提示，用于说明自动翻转与最大宽度。它会在空间不足时自动切换到另一侧。">
        <Button variant="link">Long text</Button>
      </Tooltip>
    </Space>
  );
}
