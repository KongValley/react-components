import { useState } from 'react';
import { Stepper } from '@lib';
import { MobileFrame } from '../../components/MobileFrame';

export default function StepperBasic() {
  const [quantity, setQuantity] = useState(2);
  const [amount, setAmount] = useState(0.5);

  return (
    <MobileFrame>
      <div className="docs-mobile-stack">
        <div className="docs-mobile-row">
          <span>购买数量</span>
          <Stepper
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={9}
            aria-label="购买数量"
          />
        </div>
        <div className="docs-mobile-row">
          <span>充值金额</span>
          <Stepper
            value={amount}
            onChange={setAmount}
            min={0}
            max={9.9}
            step={0.1}
            precision={1}
            inputWidth={56}
            aria-label="充值金额"
          />
        </div>
        <p className="docs-mobile-caption">
          支持直接输入数值，失焦或回车后按 min / max 与精度收敛；长按加号可以连续调整。
        </p>
      </div>
    </MobileFrame>
  );
}
