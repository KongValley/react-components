import { SafeArea } from '@lib';
import { MobileFrame } from '../../components/MobileFrame';

export default function SafeAreaBasic() {
  return (
    <MobileFrame>
      <div className="docs-safe-demo">
        <SafeArea position="top" className="docs-safe-demo__top" />
        <div className="docs-safe-demo__body">
          顶部 28px、底部 34px
          <br />
          这里通过 CSS 变量模拟刘海屏安全区，真机上会读取 env(safe-area-inset-*)
        </div>
        <SafeArea position="bottom" className="docs-safe-demo__bottom" />
      </div>
    </MobileFrame>
  );
}
