import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { CheckCircle2, Calendar, Bell, Star, TrendingUp, Zap } from 'lucide-react';

interface PhoneMockupProps {
  className?: string;
}

// Notification item component
function NotificationItem({ 
  icon: Icon, 
  title, 
  subtitle, 
  time, 
  color, 
  delay 
}: { 
  icon: typeof CheckCircle2; 
  title: string; 
  subtitle: string; 
  time: string; 
  color: string;
  delay: number;
}) {
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
      whileHover={{ scale: 1.02, x: 4 }}
      className="glass rounded-2xl p-3 flex items-center gap-3 cursor-pointer group"
    >
      <motion.div 
        className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-sm`}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.4 }}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{title}</p>
        <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>
      </div>
      <span className="text-[9px] text-muted-foreground/60 shrink-0">{time}</span>
    </motion.div>
  );
}

// Floating badge component
function FloatingBadge({ 
  children, 
  className, 
  delay,
  x,
  y 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay: number;
  x: number;
  y: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 150, damping: 15 }}
      className={`absolute ${className}`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.div
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: delay * 0.5,
        }}
        className="glass rounded-xl px-3 py-2 shadow-lg border border-white/20"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Stats card component
function StatsCard({ value, label, trend, delay }: { value: string; label: string; trend: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      className="glass rounded-xl p-3 flex-1"
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
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1200px' }}
    >
      {/* Floating badges around phone */}
      <FloatingBadge x={-15} y={20} delay={0.8} className="z-20 hidden lg:block">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sage to-sky flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-medium text-foreground">Task completed!</span>
        </div>
      </FloatingBadge>
      
      <FloatingBadge x={85} y={35} delay={1.2} className="z-20 hidden lg:block">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-golden text-golden" />
            ))}
          </div>
          <span className="text-xs font-medium text-foreground">4.9 rating</span>
        </div>
      </FloatingBadge>
      
      <FloatingBadge x={-10} y={70} delay={1.6} className="z-20 hidden lg:block">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-sage" />
          <span className="text-xs font-medium text-foreground">+23% productivity</span>
        </div>
      </FloatingBadge>

      {/* Phone frame with 3D tilt */}
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative mx-auto w-[280px] sm:w-[300px] lg:w-[320px]"
      >
        {/* Glow effect behind phone */}
        <motion.div
          className="absolute inset-0 rounded-[3rem] blur-3xl"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--lavender)) 0%, hsl(var(--peach)) 50%, hsl(var(--sky)) 100%)',
          }}
          animate={{
            opacity: isHovered ? 0.5 : 0.3,
            scale: isHovered ? 1.1 : 1.05,
          }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Phone body */}
        <motion.div
          className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[3rem] p-3 shadow-2xl"
          animate={{
            boxShadow: isHovered 
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
                className="bg-black rounded-full px-6 py-1.5 flex items-center gap-2"
                animate={{ width: isHovered ? 120 : 100 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a] border border-[#333]" />
                <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
              </motion.div>
            </div>
            
            {/* Screen content */}
            <div className="pt-14 pb-8 px-4 min-h-[520px] sm:min-h-[560px] lg:min-h-[600px]">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-5"
              >
                <p className="text-[10px] text-muted-foreground mb-1">Good morning</p>
                <h3 className="text-lg font-bold text-foreground">Sarah ✨</h3>
              </motion.div>
              
              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-2 mb-4"
              >
                <StatsCard value="12" label="Tasks today" trend="+3" delay={0.6} />
                <StatsCard value="89%" label="Completion" trend="↑5%" delay={0.7} />
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
              <div className="space-y-2.5">
                <NotificationItem
                  icon={Zap}
                  title="Focus session completed"
                  subtitle="45 minutes of deep work"
                  time="2m ago"
                  color="bg-gradient-to-br from-peach to-accent"
                  delay={0.9}
                />
                <NotificationItem
                  icon={Calendar}
                  title="Meeting with Alex"
                  subtitle="Project review at 3:00 PM"
                  time="1h ago"
                  color="bg-gradient-to-br from-sky to-primary"
                  delay={1.0}
                />
                <NotificationItem
                  icon={CheckCircle2}
                  title="Daily goals achieved"
                  subtitle="You're on a 7-day streak!"
                  time="3h ago"
                  color="bg-gradient-to-br from-sage to-sky"
                  delay={1.1}
                />
                <NotificationItem
                  icon={Bell}
                  title="Reminder: Exercise"
                  subtitle="Time for your afternoon walk"
                  time="5h ago"
                  color="bg-gradient-to-br from-lavender to-peach"
                  delay={1.2}
                />
              </div>
              
              {/* Bottom navigation hint */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2"
              >
                <div className="w-32 h-1 bg-foreground/20 rounded-full" />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Reflection effect */}
        <motion.div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[90%] h-20 rounded-full blur-2xl"
          style={{
            background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.15), transparent)',
          }}
          animate={{
            opacity: isHovered ? 0.6 : 0.3,
            scaleX: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
      
      {/* Ambient floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 3) * 20}%`,
            background: `hsl(var(--${['lavender', 'peach', 'sky', 'sage', 'primary', 'lavender'][i]}) / 0.4)`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, i % 2 === 0 ? 10 : -10, 0],
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
