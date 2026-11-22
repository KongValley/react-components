import { Icon, type IconName } from '@lib';

const ICON_NAMES: IconName[] = [
  'check',
  'close',
  'chevron-down',
  'chevron-up',
  'chevron-left',
  'chevron-right',
  'search',
  'plus',
  'minus',
  'info',
  'success',
  'warning',
  'error',
  'loading',
  'eye',
  'eye-off',
  'copy',
  'user',
  'arrow-up',
  'arrow-down',
  'more',
  'menu',
  'sun',
  'moon',
  'home',
  'bell',
  'heart',
];

export default function IconGallery() {
  return (
    <div className="example-icon-grid">
      {ICON_NAMES.map((name) => (
        <div className="example-icon" key={name}>
          <Icon name={name} size={20} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
}
