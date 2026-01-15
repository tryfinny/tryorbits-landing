import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { CheckCircle2, Calendar, Bell, Star, TrendingUp, Wrench, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-device-motion';

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
  isMobile 
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
        damping: 14 
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
  isMobile
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
        top: `${mobileY}%` 
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

// Stats card component with tap feedback
function StatsCard({ value, label, trend, delay }: { value: string; label: string; trend: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileTap={{ scale: 0.97 }}
      className="glass rounded-xl p-3 flex-1 touch-manipulation"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-lg font-bold text-foreground">{value}</span>
        <span className="text-[9px] text-sage font-medium">{trend}</span>
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </motion.div>
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
      style={{ perspective: '1200px' }}
    >
      {/* Floating badges around phone - visible on tablet+ */}
      <FloatingBadge x={-15} y={20} delay={0.8} className="z-20 hidden sm:block" isMobile={isMobile}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-sage to-sky flex items-center justify-center">
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-foreground">Calendars synced!</span>
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
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative mx-auto w-[260px] sm:w-[300px] lg:w-[320px]"
      >
        {/* Glow effect behind phone */}
        <motion.div
          className="absolute inset-0 rounded-[3rem] blur-3xl"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--lavender)) 0%, hsl(var(--peach)) 50%, hsl(var(--sky)) 100%)',
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
              ? '0 50px 100px -20px rgba(0,0,0,0.5), 0 30px 60px -30px rgba(0,0,0,0.4)'
              : '0 25px 50px -12px rgba(0,0,0,0.4), 0 12px 24px -12px rgba(0,0,0,0.3)',
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Side buttons */}
          <div className="absolute -left-[3px] top-28 w-[3px] h-8 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[3px] top-44 w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[3px] top-60 w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -right-[3px] top-36 w-[3px] h-16 bg-[#2a2a2a] rounded-r-sm" />
          
          {/* Screen */}
          <div className="relative bg-background rounded-[2.5rem] overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <motion.div
                className="bg-black rounded-full px-5 sm:px-6 py-1.5 flex items-center gap-2"
                animate={{ width: isActive ? 110 : 95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#1a1a1a] border border-[#333]" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#1a1a1a]" />
              </motion.div>
            </div>
            
            {/* Screen content */}
            <div className="pt-14 pb-6 sm:pb-8 px-3 sm:px-4 min-h-[480px] sm:min-h-[560px] lg:min-h-[600px]">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-4"
              >
                <p className="text-[10px] text-muted-foreground mb-1">Good morning</p>
                <h3 className="text-base sm:text-lg font-bold text-foreground">Sarah ✨</h3>
              </motion.div>
              
              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-2 mb-4"
              >
                <StatsCard value="4" label="Family events" trend="today" delay={0.6} />
                <StatsCard value="2" label="Auto-scheduled" trend="✓" delay={0.7} />
              </motion.div>
              
              {/* Section title */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-between mb-3"
              >
                <span className="text-xs font-semibold text-foreground">Recent Activity</span>
                <span className="text-[10px] text-primary">View all</span>
              </motion.div>
              
              {/* Notifications list */}
              <div className="space-y-2">
                <NotificationItem
                  icon={Wrench}
                  title="HVAC service booked"
                  subtitle="Filter change scheduled for Tue 9 AM"
                  time="Just now"
                  color="bg-gradient-to-br from-sage to-sky"
                  delay={0.9}
                  isMobile={isMobile}
                />
                <NotificationItem
                  icon={Users}
                  title="Calendar synced with Mike"
                  subtitle="Soccer practice added for both"
                  time="5m ago"
                  color="bg-gradient-to-br from-sky to-primary"
                  delay={1.0}
                  isMobile={isMobile}
                />
                <NotificationItem
                  icon={Calendar}
                  title="Emma's dentist moved"
                  subtitle="Mike confirmed the new time slot"
                  time="1h ago"
                  color="bg-gradient-to-br from-peach to-accent"
                  delay={1.1}
                  isMobile={isMobile}
                />
                <NotificationItem
                  icon={Bell}
                  title="Gutter cleaning reminder"
                  subtitle="Tap to auto-schedule a pro"
                  time="2h ago"
                  color="bg-gradient-to-br from-lavender to-peach"
                  delay={1.2}
                  isMobile={isMobile}
                />
              </div>
              
              {/* Bottom navigation hint */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2"
              >
                <div className="w-28 sm:w-32 h-1 bg-foreground/20 rounded-full" />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Reflection effect */}
        <motion.div
          className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 w-[90%] h-16 sm:h-20 rounded-full blur-2xl"
          style={{
            background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.15), transparent)',
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
            background: `hsl(var(--${['lavender', 'peach', 'sky', 'sage', 'primary', 'lavender'][i]}) / 0.4)`,
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
