import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { PhoneMockup } from "./PhoneMockup";
import { AppStoreButtons } from "./AppStoreButtons";
import { Sparkles, Star, CheckCircle2, Calendar, Bell, TrendingUp, Wrench, Users, ShoppingCart, Clock, Mail, Home, Package } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-device-motion";

// Stagger container with refined timing
const staggerContainer = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Spring-based fade up
const fadeUpSpring = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

// Floating particle component with organic motion - disabled on mobile for performance
function FloatingParticle({
  delay,
  x,
  y,
  size,
  color,
  isMobile,
}: {
  delay: number;
  x: string;
  y: string;
  size: number;
  color: string;
  isMobile?: boolean;
}) {
  // Skip animation entirely on mobile
  if (isMobile) return null;
  
  return (
    <motion.div
      className={`absolute rounded-full ${color}`}
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0.3 }}
      animate={{
        opacity: [0.3, 0.5, 0.3],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

// Morphing blob background - static on mobile for performance
function MorphingBlob({
  className,
  delay = 0,
  isMobile,
}: {
  className: string;
  delay?: number;
  isMobile?: boolean;
}) {
  // Static on mobile - no animation
  if (isMobile) {
    return <div className={`absolute rounded-full blur-2xl ${className}`} />;
  }
  
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.4, 0.3],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

// Animated counter
function AnimatedNumber({
  value
}: {
  value: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true
  });
  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(eased * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    const timeout = setTimeout(() => requestAnimationFrame(animate), 300);
    return () => clearTimeout(timeout);
  }, [value, isInView]);
  return <span ref={ref}>{displayValue.toLocaleString()}</span>;
}

const COMPLETED_ACTIONS = [
  { icon: ShoppingCart, text: "Grocery list sent to Instacart", iconBg: "bg-sage/80" },
  { icon: Calendar, text: "Synced family calendars", iconBg: "bg-sky/80" },
  { icon: Wrench, text: "HVAC service booked for Tuesday", iconBg: "bg-peach/80" },
  { icon: Bell, text: "School form reminder set", iconBg: "bg-lavender/80" },
  { icon: Users, text: "Reminded Jon to renew car registration", iconBg: "bg-peach/80" },
  { icon: Star, text: "Fixed soccer and parent-teacher night overlap", iconBg: "bg-sky/80" },
  { icon: Clock, text: "Rescheduled dentist appointments", iconBg: "bg-sage/80" },
  { icon: CheckCircle2, text: "Ordered birthday gift for Lily", iconBg: "bg-lavender/80" },
  { icon: Users, text: "Re-assigned Tuesday's school pickup to Ellie", iconBg: "bg-sky/80" },
  { icon: Mail, text: "Extracted school newsletter details", iconBg: "bg-lavender/80" },
  { icon: Home, text: "Scheduled spring lawn care service", iconBg: "bg-sage/80" },
  { icon: TrendingUp, text: "Water bill down 15% this month", iconBg: "bg-sky/80" },
  { icon: Package, text: "Amazon delivery arriving Thursday", iconBg: "bg-peach/80" },
  { icon: Sparkles, text: "AI auto-sorted 12 inbox emails", iconBg: "bg-lavender/80" },
];

const FEED_VISIBLE_COUNT = 4;

function CompletedActionsFeed() {
  const nextIdRef = useRef(FEED_VISIBLE_COUNT);
  const isMobile = useIsMobile();
  const [items, setItems] = useState(
    COMPLETED_ACTIONS.slice(0, FEED_VISIBLE_COUNT).map((action, i) => ({ ...action, id: i }))
  );

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        const id = nextIdRef.current;
        const action = COMPLETED_ACTIONS[id % COMPLETED_ACTIONS.length];
        setItems(prev => [{ ...action, id }, ...prev.slice(0, FEED_VISIBLE_COUNT - 1)]);
        nextIdRef.current++;
      }, 2000);
    }, 1500);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const currentItem = items[0];
  const CurrentIcon = currentItem.icon;

  return (
    <>
      {/* Desktop: column to the left of phone */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 100, damping: 20 }}
        className="absolute right-[calc(50%+160px)] top-[18%] w-[200px] hidden lg:flex flex-col z-20"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1 - i * 0.15, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="glass rounded-xl px-3.5 py-3 mb-3 flex items-center gap-3 border border-white/15 shadow-sm"
              >
                <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-foreground/80 leading-tight">
                  {item.text}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Mobile/tablet: 2 cycling notifications above phone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, type: "spring", stiffness: 100, damping: 20 }}
        className="lg:hidden flex flex-col items-center gap-2 mb-6 relative z-10"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {items.slice(0, 2).map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: -12 }}
                animate={{ opacity: 1 - i * 0.15, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="glass rounded-xl px-4 py-2.5 flex items-center gap-2.5 border border-white/15 shadow-sm"
              >
                <div className={`w-7 h-7 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-medium text-foreground/80">
                  {item.text}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Only use scroll-based animations on desktop
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Disable spring physics on mobile for performance
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 100 : 50,
    damping: isMobile ? 30 : 20,
    mass: 0.5,
  });

  // Skip parallax on mobile entirely
  const scale = useTransform(smoothProgress, [0, 0.4], [1, isMobile ? 1 : 0.98]);
  const phoneY = useTransform(smoothProgress, [0, 1], [0, isMobile ? 0 : 50]);
  
  return (
    <section
      ref={containerRef}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 py-16 sm:py-20 pb-32 sm:pb-40 overflow-visible"
    >
      {/* Layered gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/50" />

      {/* Morphing background blobs - static on mobile */}
      <MorphingBlob className="top-10 left-[5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] orb-lavender opacity-30 sm:opacity-40" delay={0} isMobile={isMobile} />
      <MorphingBlob className="top-40 right-[10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] orb-peach opacity-25 sm:opacity-30" delay={5} isMobile={isMobile} />
      <MorphingBlob className="bottom-20 left-[20%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] orb-sky opacity-20 sm:opacity-25" delay={10} isMobile={isMobile} />

      {/* Subtle grid pattern overlay - hidden on mobile */}
      {!isMobile && (
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      )}

      {/* Floating particles - desktop only */}
      {!isMobile && (
        <>
          <FloatingParticle delay={0} x="15%" y="20%" size={8} color="bg-lavender" isMobile={isMobile} />
          <FloatingParticle delay={1} x="80%" y="30%" size={6} color="bg-peach" isMobile={isMobile} />
          <FloatingParticle delay={2} x="25%" y="60%" size={10} color="bg-sky" isMobile={isMobile} />
          <FloatingParticle delay={3} x="70%" y="70%" size={7} color="bg-sage" isMobile={isMobile} />
          <FloatingParticle delay={4} x="50%" y="15%" size={5} color="bg-primary/30" isMobile={isMobile} />
          <FloatingParticle delay={5} x="10%" y="80%" size={8} color="bg-lavender" isMobile={isMobile} />
        </>
      )}

      {/* Main content */}
      <motion.div className="relative z-10 max-w-7xl mx-auto w-full" style={{
      scale
    }}>
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-center lg:text-left">
            {/* Badge with tap feedback */}
            <motion.div
              variants={fadeUpSpring}
              whileTap={{ scale: 0.97 }}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/10 mb-6 sm:mb-8 overflow-hidden cursor-pointer touch-manipulation"
            >
              {/* Shimmer - desktop only */}
              {!isMobile && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                />
              )}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-xs sm:text-sm font-medium text-foreground/80 relative">
                A calmer home starts here
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUpSpring} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.3] mb-6 sm:mb-8">
              <span>Less juggling,</span>
              <br />
              <motion.span
                className="underline-reveal"
                style={{ "--underline-delay": "0.7s" } as React.CSSProperties}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100,
                  damping: 12
                }}
              >
                <motion.span
                  className="relative z-10"
                  initial={{
                    backgroundPosition: "100% 50%"
                  }}
                  animate={{
                    backgroundPosition: "0% 50%"
                  }}
                  transition={{
                    delay: 0.5,
                    duration: 1.2,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  style={{
                    background: "linear-gradient(90deg, hsl(170 30% 35%), hsl(var(--primary)), hsl(170 30% 35%))",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  more living
                </motion.span>
              </motion.span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeUpSpring} className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Groceries, school forms, appointments, home repairs — Orbits takes care of the details so your family can enjoy the moments.
            </motion.p>

            {/* App Store Buttons */}
            <motion.div variants={fadeUpSpring} className="mb-8 sm:mb-10">
              <AppStoreButtons />
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUpSpring} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start mb-8">
              {/* Stacked avatars with tap feedback */}
              <motion.div className="flex -space-x-3" whileTap={{
              scale: 0.95
            }}>
                {[{
                initials: "JM",
                bg: "bg-lavender"
              }, {
                initials: "SK",
                bg: "bg-peach"
              }, {
                initials: "AR",
                bg: "bg-sky"
              }, {
                initials: "TL",
                bg: "bg-sage"
              }, {
                initials: "DP",
                bg: "bg-peach"
              }].map((user, i) => <motion.div key={i} initial={{
                opacity: 0,
                scale: 0,
                x: -20
              }} animate={{
                opacity: 1,
                scale: 1,
                x: 0
              }} transition={{
                type: "spring",
                stiffness: 200,
                damping: 12,
                delay: 0.5 + i * 0.06
              }} className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${user.bg} border-2 border-background cursor-pointer relative shadow-lg flex items-center justify-center`}>
                    <span className="text-[10px] sm:text-xs font-medium text-white/90">{user.initials}</span>
                  </motion.div>)}
              </motion.div>

              {/* Stats */}
              <motion.div className="flex items-center gap-2" initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: 0.9,
              duration: 0.4
            }}>
                <p className="text-sm text-muted-foreground">
                  Join{" "}
                  <span className="font-semibold text-foreground">
                    <AnimatedNumber value={2400} />+
                  </span>{" "}
                  families running calmer homes
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right - Phone Mockup + Completed Actions */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.9,
          y: 30
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} transition={{
          type: "spring",
          stiffness: 60,
          damping: 20,
          delay: 0.2
        }} style={{
          y: phoneY
        }} className="relative lg:mt-0">
            <CompletedActionsFeed />
            <PhoneMockup className="w-full h-[450px] sm:h-[500px] lg:h-[650px] flex items-start lg:items-center justify-center overflow-hidden lg:overflow-visible" />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator - desktop only */}
      {!isMobile && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest text-muted-foreground/50">
              Scroll to explore
            </span>
            <div className="w-6 h-9 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-1.5">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-2.5 rounded-full bg-gradient-to-b from-primary/50 to-lavender/50"
              />
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}