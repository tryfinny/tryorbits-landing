import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-device-motion";
import { useDeviceType } from "@/hooks/use-device-type";

// Magnetic button with 3D tilt effect + mobile tap feedback
function MagneticButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
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
      style={
        !isMobile
          ? {
              x: xSpring,
              y: ySpring,
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
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
    <div className="flex justify-center lg:justify-start perspective-1000">
      <MagneticButton href="/install" className="group">
        <motion.div
          className="relative inline-flex items-center gap-4 px-8 py-4 bg-[#1a1a1a] text-white rounded-2xl overflow-hidden min-h-[60px]"
          whileHover={
            !isMobile
              ? {
                  boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.3)",
                }
              : undefined
          }
          transition={{ duration: 0.3 }}
        >
          {/* Continuous pulse glow on mobile */}
          {isMobile && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.3), transparent 70%)",
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
            initial={{ x: "-200%" }}
            animate={{ x: ["−200%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          />

          <motion.div
            whileHover={!isMobile ? { scale: 1.1, rotate: -5 } : undefined}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <svg className="w-7 h-7 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </motion.div>
          <div className="text-left relative z-10">
            <p className="text-lg font-semibold leading-tight">Download Orbits</p>
          </div>
        </motion.div>
      </MagneticButton>
    </div>
  );
}
