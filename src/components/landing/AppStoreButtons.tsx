import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Apple } from 'lucide-react';
import { useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-device-motion';

// Magnetic button with 3D tilt effect + mobile tap feedback
function MagneticButton({ children, className, href }: { children: React.ReactNode; className?: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isMobile = useIsMobile();
  const [isTapped, setIsTapped] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring physics
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  // 3D rotation transforms (only on desktop)
  const rotateX = useTransform(ySpring, [-20, 20], [8, -8]);
  const rotateY = useTransform(xSpring, [-20, 20], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) / 3);
    y.set((e.clientY - centerY) / 3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Mobile tap handlers
  const handleTapStart = () => {
    setIsTapped(true);
  };
  
  const handleTapEnd = () => {
    setIsTapped(false);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTapStart}
      onTouchEnd={handleTapEnd}
      onTouchCancel={handleTapEnd}
      style={!isMobile ? { 
        x: xSpring, 
        y: ySpring,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      } : undefined}
      whileTap={{ scale: 0.95 }}
      className={`relative touch-manipulation ${className}`}
    >
      {children}
      
      {/* Mobile tap ripple effect */}
      {isMobile && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTapped ? 0.15 : 0 }}
          transition={{ duration: 0.15 }}
        />
      )}
    </motion.a>
  );
}

export function AppStoreButtons() {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start perspective-1000">
      {/* App Store Button */}
      <MagneticButton 
        href="#"
        className="group"
      >
        <motion.div
          className="relative inline-flex items-center gap-4 px-7 py-4 bg-[#1a1a1a] text-white rounded-2xl overflow-hidden min-h-[60px]"
          whileHover={!isMobile ? { 
            boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.3)',
          } : undefined}
          transition={{ duration: 0.3 }}
        >
          {/* Continuous pulse glow on mobile for attention */}
          {isMobile && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.3), transparent 70%)',
              }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-200%' }}
            animate={{ x: ['−200%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          />
          
          <motion.div
            whileHover={!isMobile ? { scale: 1.1, rotate: -5 } : undefined}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Apple className="w-8 h-8 relative z-10" />
          </motion.div>
          <div className="text-left relative z-10">
            <p className="text-xs opacity-70 leading-none">Download on the</p>
            <p className="text-lg font-semibold leading-tight">App Store</p>
          </div>
          
        </motion.div>
      </MagneticButton>

      {/* Google Play Button */}
      <MagneticButton 
        href="#"
        className="group"
      >
        <motion.div
          className="relative inline-flex items-center gap-4 px-7 py-4 bg-[#1a1a1a] text-white rounded-2xl overflow-hidden min-h-[60px]"
          whileHover={!isMobile ? { 
            boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.3)',
          } : undefined}
          transition={{ duration: 0.3 }}
        >
          {/* Continuous pulse glow on mobile for attention */}
          {isMobile && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--sage) / 0.3), transparent 70%)',
              }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          )}
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-200%' }}
            animate={{ x: ['−200%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
          />
          
          <motion.div
            whileHover={!isMobile ? { scale: 1.1, rotate: 5 } : undefined}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <svg className="w-7 h-7 relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
            </svg>
          </motion.div>
          <div className="text-left relative z-10">
            <p className="text-xs opacity-70 leading-none">Get it on</p>
            <p className="text-lg font-semibold leading-tight">Google Play</p>
          </div>
          
        </motion.div>
      </MagneticButton>
    </div>
  );
}
