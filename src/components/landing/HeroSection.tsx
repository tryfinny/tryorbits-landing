import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { PhoneMockup } from "./PhoneMockup";
import { AppStoreButtons } from "./AppStoreButtons";
import { Sparkles, Star } from "lucide-react";
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

// Floating particle component with organic motion
function FloatingParticle({
  delay,
  x,
  y,
  size,
  color
}: {
  delay: number;
  x: string;
  y: string;
  size: number;
  color: string;
}) {
  return <motion.div className={`absolute rounded-full ${color}`} style={{
    left: x,
    top: y,
    width: size,
    height: size
  }} initial={{
    opacity: 0,
    scale: 0
  }} animate={{
    opacity: [0, 0.5, 0.3, 0.5, 0],
    scale: [0, 1, 1.1, 1, 0],
    y: [0, -40, -20, -60, -80],
    x: [0, 8, -8, 10, 0]
  }} transition={{
    duration: 8,
    repeat: Infinity,
    delay,
    ease: [0.25, 0.46, 0.45, 0.94]
  }} />;
}

// Morphing blob background
function MorphingBlob({
  className,
  delay = 0
}: {
  className: string;
  delay?: number;
}) {
  return <motion.div className={`absolute rounded-full blur-3xl ${className}`} animate={{
    scale: [1, 1.15, 1.08, 1.2, 1],
    x: [0, 20, -15, 8, 0],
    y: [0, -15, 20, -8, 0],
    rotate: [0, 30, 60, 30, 0]
  }} transition={{
    duration: 20,
    repeat: Infinity,
    delay,
    ease: "easeInOut"
  }} />;
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
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const {
    scrollYProgress
  } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Ultra-smooth spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    mass: 0.5
  });

  // Parallax transforms - reduced on mobile for performance
  // Keep content visible - no fade out on scroll
  const scale = useTransform(smoothProgress, [0, 0.4], [1, 0.98]);
  const phoneY = useTransform(smoothProgress, [0, 1], [0, isMobile ? 30 : 50]);
  return <section ref={containerRef} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 py-16 sm:py-20 pb-32 sm:pb-40 overflow-visible">
      {/* Layered gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/50" />

      {/* Morphing background blobs - smaller on mobile */}
      <MorphingBlob className="top-10 left-[5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] orb-lavender opacity-30 sm:opacity-40" delay={0} />
      <MorphingBlob className="top-40 right-[10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] orb-peach opacity-25 sm:opacity-30" delay={5} />
      <MorphingBlob className="bottom-20 left-[20%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] orb-sky opacity-20 sm:opacity-25" delay={10} />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.01] sm:opacity-[0.015]" style={{
      backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
      backgroundSize: "50px 50px"
    }} />

      {/* Floating particles - fewer on mobile */}
      {!isMobile && <>
          <FloatingParticle delay={0} x="15%" y="20%" size={8} color="bg-lavender" />
          <FloatingParticle delay={1} x="80%" y="30%" size={6} color="bg-peach" />
          <FloatingParticle delay={2} x="25%" y="60%" size={10} color="bg-sky" />
          <FloatingParticle delay={3} x="70%" y="70%" size={7} color="bg-sage" />
        </>}
      <FloatingParticle delay={4} x="50%" y="15%" size={5} color="bg-primary/30" />
      <FloatingParticle delay={5} x="10%" y="80%" size={8} color="bg-lavender" />

      {/* Main content */}
      <motion.div className="relative z-10 max-w-7xl mx-auto w-full" style={{
      scale
    }}>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-center lg:text-left">
            {/* Badge with tap feedback */}
            <motion.div variants={fadeUpSpring} whileTap={{
            scale: 0.97
          }} className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/10 mb-6 sm:mb-8 overflow-hidden cursor-pointer touch-manipulation">
              {/* Continuous shimmer */}
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" animate={{
              x: ["-200%", "200%"]
            }} transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }} />
              <motion.div animate={{
              rotate: [0, 360]
            }} transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }} className="relative">
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-xs sm:text-sm font-medium text-foreground/80 relative">
                AI-Powered
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUpSpring} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6 sm:mb-8">
              <span>Orbits makes home
 </span>
              <br className="hidden sm:block" />
              <motion.span className="relative inline-block" initial={{
              opacity: 0,
              scale: 0.8,
              y: 20
            }} animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }} transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 12
            }}>
                <motion.span className="relative z-10" initial={{
                backgroundPosition: "100% 50%"
              }} animate={{
                backgroundPosition: "0% 50%"
              }} transition={{
                delay: 0.5,
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }} style={{
                background: "linear-gradient(90deg, hsl(260 45% 40%), hsl(var(--primary)), hsl(260 45% 40%))",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                  effortless
                </motion.span>
                {/* Underline animation */}
                <motion.div 
                  className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-lavender to-primary rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: 0.7,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }} 
                />
              </motion.span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeUpSpring} className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Welcome to Orbits, the assistant for home. Whether its managing your grocery list, juggling your family
              calendars, or finding a new babysitter, Orbits can take care of it for you all by itself (and more!)
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
                bg: "bg-lavender"
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
                  early adopters
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right - Phone Mockup */}
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
        }} className="relative mt-4 lg:mt-0">
            <PhoneMockup className="w-full h-[450px] sm:h-[500px] lg:h-[650px] flex items-center justify-center" />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator - hidden on mobile */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 1.2,
      duration: 0.5
    }} className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden sm:flex">
        <motion.span className="text-xs uppercase tracking-widest text-muted-foreground/50" animate={{
        opacity: [0.3, 0.7, 0.3]
      }} transition={{
        duration: 2,
        repeat: Infinity
      }}>
          Scroll to explore
        </motion.span>
        <motion.div className="w-6 h-9 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-1.5 cursor-pointer" animate={{
        y: [0, 4, 0]
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}>
          <motion.div animate={{
          y: [0, 12, 0],
          opacity: [1, 0.3, 1]
        }} transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94]
        }} className="w-1.5 h-2.5 rounded-full bg-gradient-to-b from-primary/50 to-lavender/50" />
        </motion.div>
      </motion.div>
    </section>;
}