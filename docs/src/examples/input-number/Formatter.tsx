import { InputNumber } from '@lib';

export default function InputNumberFormatter() {
  return (
    <InputNumber
      style={{ maxWidth: 280 }}
      defaultValue={1000}
      formatter={(value) =>
        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      parser={(display) => display.replace(/\$\s?|(,*)/g, '')}
    />
  );
}
