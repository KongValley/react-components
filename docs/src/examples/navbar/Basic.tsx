import { Button, Icon, NavBar, Text, message } from '@lib';
import { MobileFrame } from '../../components/MobileFrame';

export default function NavBarBasic() {
  return (
    <MobileFrame>
      <NavBar
        title="订单详情"
        onBack={() => message.info('返回上一页')}
        right={
          <Button
            variant="text"
            shape="circle"
            aria-label="更多操作"
            icon={<Icon name="more" size={18} />}
          />
        }
      />
      <div className="docs-mobile-body">
        导航栏高 44px，自动适配顶部安全区。
        <br />
        提供 onBack 时会渲染返回按钮。
      </div>
      <div className="docs-mobile-pad" style={{ flex: 'none' }}>
        <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
          标题始终居中，左右插槽可放置自定义操作
        </Text>
      </div>
    </MobileFrame>
  );
}
