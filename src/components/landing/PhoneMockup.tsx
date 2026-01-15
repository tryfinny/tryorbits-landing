import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { CheckCircle2, Calendar, Bell, Star, TrendingUp, Wrench, Users, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-device-motion";

interface PhoneMockupProps {
  className?: string;
}

// Notification item component with tap feedback
function NotificationItem({
  icon: Icon,
  title,
  subtitle,
  time,
  color,
  delay,
  isMobile,
}: {
  icon: typeof CheckCircle2;
  title: string;
  subtitle: string;
  time: string;
  color: string;
  delay: number;
  isMobile: boolean;
}) {
  const [isTapped, setIsTapped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 120,
        damping: 14,
      }}
      whileHover={!isMobile ? { scale: 1.02, x: 4 } : undefined}
      whileTap={{ scale: 0.98 }}
      onTouchStart={() => setIsTapped(true)}
      onTouchEnd={() => setIsTapped(false)}
      className="glass rounded-2xl p-3 flex items-center gap-3 cursor-pointer group touch-manipulation relative overflow-hidden"
    >
      {/* Tap ripple */}
      <motion.div
        className="absolute inset-0 bg-primary/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isTapped ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />

      <motion.div
        className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-sm relative z-10`}
        whileTap={{ rotate: [0, -10, 10, 0], scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-xs font-medium text-foreground truncate">{title}</p>
        <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>
      </div>
      <span className="text-[9px] text-muted-foreground/60 shrink-0 relative z-10">{time}</span>
    </motion.div>
  );
}

// Floating badge component with enhanced mobile visibility
function FloatingBadge({
  children,
  className,
  delay,
  x,
  y,
  isMobile,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
  x: number;
  y: number;
  isMobile: boolean;
}) {
  // On mobile, position badges within view
  const mobileX = Math.max(10, Math.min(x, 70));
  const mobileY = y;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 150, damping: 15 }}
      className={`absolute ${className}`}
      style={{
        left: isMobile ? `${mobileX}%` : `${x}%`,
        top: `${mobileY}%`,
      }}
    >
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.5,
        }}
        className="glass rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-lg border border-white/20"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// AI Card component matching reference design
function AICard({
  children,
  bgColor = "bg-sky/20",
  delay,
  className = "",
}: {
  children: React.ReactNode;
  bgColor?: string;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100, damping: 15 }}
      className={`${bgColor} rounded-2xl p-3.5 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Action button component
function ActionButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-lg text-[13px] font-medium flex items-center gap-1.5 ${
        variant === "primary"
          ? "bg-sage/80 text-sage-foreground"
          : "bg-white/60 text-foreground border border-foreground/10"
      }`}
    >
      {children}
    </motion.button>
  );
}

export function PhoneMockup({ className }: PhoneMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const isMobile = useIsMobile();

  // Mouse/touch tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsActive(false);
  };

  // Mobile touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || !containerRef.current) return;
    setIsActive(true);
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 0.5); // Reduced tilt on mobile
    mouseY.set(y * 0.5);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 0.5);
    mouseY.set(y * 0.5);
  };

  const handleTouchEnd = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsActive(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ perspective: "1200px" }}
    >
      {/* Floating badges around phone - visible on tablet+ */}
      <FloatingBadge x={-15} y={20} delay={0.8} className="z-20 hidden sm:block" isMobile={isMobile}>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky" />
          <span className="text-[10px] sm:text-xs font-medium text-foreground">2 calendars synced</span>
        </div>
      </FloatingBadge>

      <FloatingBadge x={85} y={35} delay={1.2} className="z-20 hidden sm:block" isMobile={isMobile}>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-golden text-golden" />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-foreground">4.9 rating</span>
        </div>
      </FloatingBadge>

      <FloatingBadge x={-10} y={70} delay={1.6} className="z-20 hidden sm:block" isMobile={isMobile}>
        <div className="flex items-center gap-2">
          <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sage" />
          <span className="text-[10px] sm:text-xs font-medium text-foreground">HVAC scheduled ✓</span>
        </div>
      </FloatingBadge>

      {/* Phone frame with 3D tilt */}
      <motion.div style={{ rotateX, rotateY }} className="relative mx-auto w-[260px] sm:w-[300px] lg:w-[320px]">
        {/* Glow effect behind phone */}
        <motion.div
          className="absolute inset-0 rounded-[3rem] blur-3xl"
          style={{
            background: "linear-gradient(135deg, hsl(var(--lavender)) 0%, hsl(var(--peach)) 50%, hsl(var(--sky)) 100%)",
          }}
          animate={{
            opacity: isActive ? 0.5 : 0.3,
            scale: isActive ? 1.1 : 1.05,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Phone body */}
        <motion.div
          className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[3rem] p-2.5 sm:p-3 shadow-2xl touch-manipulation"
          animate={{
            boxShadow: isActive
              ? "0 50px 100px -20px rgba(0,0,0,0.5), 0 30px 60px -30px rgba(0,0,0,0.4)"
              : "0 25px 50px -12px rgba(0,0,0,0.4), 0 12px 24px -12px rgba(0,0,0,0.3)",
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Side buttons */}
          <div className="absolute -left-[3px] top-28 w-[3px] h-8 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[3px] top-44 w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[3px] top-60 w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -right-[3px] top-36 w-[3px] h-16 bg-[#2a2a2a] rounded-r-sm" />

          {/* Screen - force light mode */}
          <div className="relative bg-[#F9F3E9] rounded-[2.5rem] overflow-hidden">
            {/* Screen content */}
            <div className="pt-3 pb-3 px-4 sm:px-5 min-h-[380px] sm:min-h-[420px] lg:min-h-[460px]">
              {/* Header with date and weather */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-2"
              >
                <h3 className="text-lg sm:text-xl font-serif font-medium text-[#1a1a1a] mb-0.5 whitespace-nowrap">
                  Good morning, Ellie
                </h3>
                <p className="text-xs text-[#6b6b6b] whitespace-nowrap">
                  Tuesday, April 9 · <span className="text-golden">☀️ 72°</span>
                </p>
              </motion.div>

              {/* Calendar sync card */}
              <AICard
                bgColor="bg-gradient-to-br from-sky/30 to-sky/15 border border-sky/20"
                delay={0.5}
                className="mb-2"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm">📅</span>
                  <span className="text-[13px] font-serif font-medium text-[#1a1a1a] whitespace-nowrap">
                    Family Calendar
                  </span>
                  <RefreshCw className="w-3.5 h-3.5 text-sage ml-auto" />
                </div>
                
                {/* Single row calendar with emoji markers */}
                <div className="bg-white/60 rounded-2xl px-3 py-2 mb-2">
                  <div className="flex justify-between text-[9px] text-[#999] mb-1.5">
                    <span>S</span>
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#555] w-4 text-center">8</span>
                    <span className="text-center">🌟</span>
                    <span className="text-center">😊</span>
                    <span className="bg-peach/60 rounded-full w-6 h-6 flex items-center justify-center">🎉</span>
                    <span className="text-[#555] w-4 text-center">12</span>
                    <span className="text-[#555] w-4 text-center">13</span>
                    <span className="text-[#555] w-4 text-center">14</span>
                  </div>
                </div>

                {/* Event item */}
                <div className="flex items-center gap-2.5 bg-white/60 rounded-2xl px-3 py-2">
                  <span className="text-base">🎉</span>
                  <div>
                    <p className="text-[12px] font-medium text-[#2a2a2a]">Birthday Party (Lily)</p>
                    <p className="text-[10px] text-[#6a6a6a]">3:00 PM</p>
                  </div>
                </div>
              </AICard>

              {/* Progress tracker card */}
              <AICard
                bgColor="bg-gradient-to-br from-lavender/50 to-lavender/30 border border-lavender/40"
                delay={0.8}
                className="mb-2"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">📊</span>
                  <span className="text-[13px] font-serif font-medium text-[#1a1a1a]">Progress Tracker</span>
                </div>
                <div className="space-y-2">
                  {/* Grocery List */}
                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[11px] font-medium text-[#2a2a2a]">Grocery List</span>
                      <span className="text-[10px] text-[#6a6a6a]">60%</span>
                    </div>
                    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-sage rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                  {/* School Supplies */}
                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[11px] font-medium text-[#2a2a2a]">School Supplies</span>
                      <span className="text-[10px] text-[#6a6a6a]">10%</span>
                    </div>
                    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-sage rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                  {/* Chores */}
                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[11px] font-medium text-[#2a2a2a]">Chores</span>
                      <span className="text-[10px] text-[#6a6a6a]">75%</span>
                    </div>
                    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-sage rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </AICard>

              {/* Auto-scheduled maintenance card - fades out to hint at more content */}
              <div className="relative">
                <AICard
                  bgColor="bg-gradient-to-br from-sage/30 to-sage/15 border border-sage/20"
                  delay={1.0}
                  className="mb-2"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">🏠</span>
                    <span className="text-[13px] font-serif font-medium text-[#1a1a1a]">HVAC Service Booked</span>
                  </div>
                  <p className="text-[13px] text-[#3a3a3a] leading-relaxed mb-2">
                    Filter replacement due. AirFlow Pro booked for Tuesday 9AM.
                  </p>
                  <div className="flex gap-2">
                    <ActionButton variant="primary">Confirm</ActionButton>
                    <ActionButton variant="secondary">Reschedule</ActionButton>
                  </div>
                </AICard>
                {/* Fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#F9F3E9] via-[#F9F3E9]/70 to-transparent pointer-events-none" />
              </div>

              {/* Bottom navigation hint - home indicator */}
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2">
                <div className="w-32 sm:w-36 h-1.5 bg-[#1a1a1a] rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reflection effect */}
        <motion.div
          className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 w-[90%] h-16 sm:h-20 rounded-full blur-2xl"
          style={{
            background: "linear-gradient(to bottom, hsl(var(--primary) / 0.15), transparent)",
          }}
          animate={{
            opacity: isActive ? 0.6 : 0.3,
            scaleX: isActive ? 1.1 : 1,
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>

      {/* Ambient floating particles - fewer on mobile */}
      {[...Array(isMobile ? 3 : 6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${20 + i * (isMobile ? 25 : 12)}%`,
            top: `${30 + (i % 3) * 20}%`,
            background: `hsl(var(--${["lavender", "peach", "sky", "sage", "primary", "lavender"][i]}) / 0.4)`,
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, i % 2 === 0 ? 8 : -8, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
