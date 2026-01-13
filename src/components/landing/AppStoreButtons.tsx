import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Apple } from 'lucide-react';
import { useRef } from 'react';

// Magnetic button with 3D tilt effect
function MagneticButton({ children, className, href }: { children: React.ReactNode; className?: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring physics
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  // 3D rotation transforms
  const rotateX = useTransform(ySpring, [-20, 20], [8, -8]);
  const rotateY = useTransform(xSpring, [-20, 20], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
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

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        x: xSpring, 
        y: ySpring,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileTap={{ scale: 0.97 }}
      className={`relative ${className}`}
    >
      {children}
    </motion.a>
  );
}

export function AppStoreButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start perspective-1000">
      {/* App Store Button */}
      <MagneticButton 
        href="#"
        className="group"
      >
        <motion.div
          className="relative inline-flex items-center gap-4 px-7 py-4 bg-foreground text-background rounded-2xl overflow-hidden"
          whileHover={{ 
            boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.3)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-200%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.2), transparent 70%)',
            }}
          />
          
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Apple className="w-8 h-8 relative z-10" />
          </motion.div>
          <div className="text-left relative z-10">
            <p className="text-xs opacity-70 leading-none">Download on the</p>
            <p className="text-lg font-semibold leading-tight">App Store</p>
          </div>
          
          {/* Corner sparkle */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-golden rounded-full"
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.div>
      </MagneticButton>

      {/* Google Play Button */}
      <MagneticButton 
        href="#"
        className="group"
      >
        <motion.div
          className="relative inline-flex items-center gap-4 px-7 py-4 bg-foreground text-background rounded-2xl overflow-hidden"
          whileHover={{ 
            boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.3)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-200%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.2), transparent 70%)',
            }}
          />
          
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
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
          
          {/* Corner sparkle */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-sage rounded-full"
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          />
        </motion.div>
      </MagneticButton>
    </div>
  );
}
