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
  const deviceType = useDeviceType();

  const appleIcon = (
    <svg className="w-10 h-10 relative z-10" viewBox="0 0 800 800" fill="currentColor">
      <path d="M396.6,183.8l16.2-28c10-17.5,32.3-23.4,49.8-13.4s23.4,32.3,13.4,49.8L319.9,462.4h112.9c36.6,0,57.1,43,41.2,72.8H143c-20.2,0-36.4-16.2-36.4-36.4c0-20.2,16.2-36.4,36.4-36.4h92.8l118.8-205.9l-37.1-64.4c-10-17.5-4.1-39.6,13.4-49.8c17.5-10,39.6-4.1,49.8,13.4L396.6,183.8L396.6,183.8z M256.2,572.7l-35,60.7c-10,17.5-32.3,23.4-49.8,13.4S148,614.5,158,597l26-45C213.4,542.9,237.3,549.9,256.2,572.7L256.2,572.7z M557.6,462.6h94.7c20.2,0,36.4,16.2,36.4,36.4c0,20.2-16.2,36.4-36.4,36.4h-52.6l35.5,61.6c10,17.5,4.1,39.6-13.4,49.8c-17.5,10-39.6,4.1-49.8-13.4c-59.8-103.7-104.7-181.3-134.5-233c-30.5-52.6-8.7-105.4,12.8-123.3C474.2,318.1,509.9,380,557.6,462.6L557.6,462.6z" />
    </svg>
  );

  const googlePlayIcon = (
    <svg className="w-9 h-9 relative z-10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
    </svg>
  );

  const storeIcons =
    deviceType === "android"
      ? [
          { id: "google-play", icon: googlePlayIcon },
          { id: "app-store", icon: appleIcon },
        ]
      : [
          { id: "app-store", icon: appleIcon },
          { id: "google-play", icon: googlePlayIcon },
        ];
  const [leadingIcon, trailingIcon] = storeIcons;

  return (
    <div className="flex justify-center lg:justify-start perspective-1000">
      <MagneticButton href="/install" className="group">
        <motion.div
          className="relative inline-flex items-center gap-5 px-10 py-5 bg-[#1a1a1a] text-white rounded-2xl overflow-hidden min-h-[72px]"
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
            className="flex items-center gap-4"
            whileHover={!isMobile ? { scale: 1.1 } : undefined}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="flex items-center justify-center w-10">{leadingIcon.icon}</span>
            <div className="text-left relative z-10">
              <p className="text-xl font-semibold leading-tight">Get Orbits</p>
            </div>
            <span className="flex items-center justify-center w-10">{trailingIcon.icon}</span>
          </motion.div>
        </motion.div>
      </MagneticButton>
    </div>
  );
}
