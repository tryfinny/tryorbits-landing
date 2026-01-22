import { useState } from 'react';

export type DeviceType = 'ios' | 'android' | 'other';

const getDeviceType = (): DeviceType => {
  if (typeof navigator === 'undefined') {
    return 'other';
  }

  const userAgent = navigator.userAgent || navigator.vendor || '';
  const isIOS =
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(userAgent);

  if (isIOS) {
    return 'ios';
  }

  if (isAndroid) {
    return 'android';
  }

  return 'other';
};

export function useDeviceType(): DeviceType {
  const [deviceType] = useState<DeviceType>(getDeviceType);
  return deviceType;
}
