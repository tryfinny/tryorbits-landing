import { useState, useEffect } from 'react';

export type DeviceType = 'ios' | 'android' | 'other';

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('other');

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    
    // Check for iOS devices
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      setDeviceType('ios');
    }
    // Check for Android devices
    else if (/Android/i.test(userAgent)) {
      setDeviceType('android');
    }
    // Default to 'other' for desktop and other devices
    else {
      setDeviceType('other');
    }
  }, []);

  return deviceType;
}
