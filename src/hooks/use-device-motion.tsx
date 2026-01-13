import { useState, useEffect } from 'react';

interface DeviceMotion {
  x: number;
  y: number;
  isSupported: boolean;
}

export function useDeviceMotion(): DeviceMotion {
  const [motion, setMotion] = useState<DeviceMotion>({ x: 0, y: 0, isSupported: false });

  useEffect(() => {
    // Check if device orientation is supported
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        const x = event.gamma ? event.gamma / 45 : 0; // -1 to 1
        const y = event.beta ? (event.beta - 45) / 45 : 0; // -1 to 1
        setMotion({ 
          x: Math.max(-1, Math.min(1, x)), 
          y: Math.max(-1, Math.min(1, y)), 
          isSupported: true 
        });
      };

      // Request permission on iOS 13+
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // We'll handle permission request on user interaction
        setMotion(prev => ({ ...prev, isSupported: true }));
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
        setMotion(prev => ({ ...prev, isSupported: true }));
      }

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, []);

  return motion;
}

// Hook to detect if user is on mobile
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
