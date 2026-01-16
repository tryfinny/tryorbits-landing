import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-device-motion';

interface MobileTouchCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function MobileTouchCard({ children, className, glowColor = 'primary' }: MobileTouchCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isTapped, setIsTapped] = useState(false);
  
  // Touch position tracking
  const touchX = useMotionValue(0.5);
  const touchY = useMotionValue(0.5);
  
  // Spring physics for smooth animations
  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 };
  const x = useSpring(touchX, springConfig);
  const y = useSpring(touchY, springConfig);
  
  // 3D transforms based on touch position - desktop only
  const rotateX = useTransform(y, [0, 1], [8, -8]);
  const rotateY = useTransform(x, [0, 1], [-8, 8]);
  
  // Glare position - desktop only
  const glareX = useTransform(x, [0, 1], [0, 100]);
  const glareY = useTransform(y, [0, 1], [0, 100]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!ref.current || isMobile) return; // Skip 3D on mobile
    const rect = ref.current.getBoundingClientRect();
    const touch = e.touches[0];
    touchX.set((touch.clientX - rect.left) / rect.width);
    touchY.set((touch.clientY - rect.top) / rect.height);
    setIsTapped(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!ref.current || isMobile) return; // Skip 3D on mobile
    const rect = ref.current.getBoundingClientRect();
    const touch = e.touches[0];
    touchX.set((touch.clientX - rect.left) / rect.width);
    touchY.set((touch.clientY - rect.top) / rect.height);
  };
  
  const handleTouchEnd = () => {
    touchX.set(0.5);
    touchY.set(0.5);
    setIsTapped(false);
  };
  
  // Mouse handlers for desktop
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    touchX.set((e.clientX - rect.left) / rect.width);
    touchY.set((e.clientY - rect.top) / rect.height);
  };
  
  const handleMouseLeave = () => {
    if (isMobile) return;
    touchX.set(0.5);
    touchY.set(0.5);
    setIsTapped(false);
  };

  // Simplified mobile version - no 3D transforms, no gradient glare
  if (isMobile) {
    return (
      <motion.div
        ref={ref}
        animate={{
          scale: isTapped ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`relative ${className}`}
        onTouchStart={() => setIsTapped(true)}
        onTouchEnd={() => setIsTapped(false)}
        onTouchCancel={() => setIsTapped(false)}
      >
        {/* Simple opacity overlay on tap - no gradient */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-foreground/5"
          animate={{ opacity: isTapped ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        />
        {children}
      </motion.div>
    );
  }

  // Desktop version with full 3D and glare
  return (
    <motion.div
      ref={ref}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsTapped(true)}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      animate={{
        scale: isTapped ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative ${className}`}
    >
      {/* Touch ripple / glare effect - desktop only */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
        style={{
          opacity: isTapped ? 0.2 : 0,
        }}
      >
        <motion.div
          className="absolute w-40 h-40 rounded-full"
          style={{
            left: glareX,
            top: glareY,
            x: '-50%',
            y: '-50%',
            background: `radial-gradient(circle, hsl(var(--${glowColor})) 0%, transparent 70%)`,
          }}
        />
      </motion.div>
      
      {/* Content */}
      {children}
    </motion.div>
  );
}
