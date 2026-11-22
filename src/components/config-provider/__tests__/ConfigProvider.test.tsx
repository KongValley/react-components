import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ConfigProvider } from '../ConfigProvider';
import { DesktopOnly, MobileOnly } from '../DeviceOnly';
import { useDevice } from '../../../hooks/useDevice';

function DeviceProbe() {
  const { device, isMobile, adaptive } = useDevice();
  return <span>{`${device}:${String(isMobile)}:${String(adaptive)}`}</span>;
}

describe('ConfigProvider', () => {
  it('forces a device and drives MobileOnly / DesktopOnly', () => {
    render(
      <ConfigProvider device="mobile" adaptive>
        <MobileOnly>
          <span>mobile layout</span>
        </MobileOnly>
        <DesktopOnly>
          <span>desktop layout</span>
        </DesktopOnly>
        <DeviceProbe />
      </ConfigProvider>,
    );

    expect(screen.getByText('mobile layout')).toBeInTheDocument();
    expect(screen.queryByText('desktop layout')).not.toBeInTheDocument();
    expect(screen.getByText('mobile:true:true')).toBeInTheDocument();
  });

  it('mirrors the resolved device to the root when requested', () => {
    const { unmount } = render(
      <ConfigProvider device="mobile" applyToRoot>
        <span>content</span>
      </ConfigProvider>,
    );

    expect(document.documentElement.getAttribute('data-rc-device')).toBe('mobile');
    unmount();
    expect(document.documentElement.hasAttribute('data-rc-device')).toBe(false);
  });
});
