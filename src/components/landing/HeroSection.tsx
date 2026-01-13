import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { PhoneMockup } from './PhoneMockup';
import { AppStoreButtons } from './AppStoreButtons';
import { Sparkles, Star } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

// Stagger container with refined timing
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

// Spring-based fade up with refined physics
const fadeUpSpring = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
    },
  },
};

// Character-by-character reveal with 3D rotation
const letterAnimation = {
  hidden: { opacity: 0, y: 40, rotateX: -60, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: "spring" as const,
      stiffness: 150,
      damping: 12,
      delay: i * 0.025,
    },
  }),
};

// Word reveal animation
const wordAnimation = {
  hidden: { opacity: 0, y: 20, rotateX: -30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      delay: i * 0.08,
    },
  }),
};

function AnimatedText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <motion.span className={`inline-block ${className}`} style={{ perspective: '1000px' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={i + delay}
          variants={letterAnimation}
          initial="hidden"
          animate="visible"
          className="inline-block origin-bottom"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

function AnimatedWords({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span className={className}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={wordAnimation}
          initial="hidden"
          animate="visible"
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Floating particle component with organic motion
function FloatingParticle({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: number; color: string }) {
  return (
    <motion.div
      className={`absolute rounded-full ${color}`}
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.3, 0.6, 0],
        scale: [0, 1, 1.2, 1, 0],
        y: [0, -60, -30, -80, -100],
        x: [0, 10, -10, 15, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    />
  );
}

// Morphing blob background
function MorphingBlob({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.2, 1.1, 1.3, 1],
        x: [0, 30, -20, 10, 0],
        y: [0, -20, 30, -10, 0],
        rotate: [0, 45, 90, 45, 0],
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

// Animated counter with spring physics
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
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
    
    const timeout = setTimeout(() => requestAnimationFrame(animate), 800);
    return () => clearTimeout(timeout);
  }, [value]);
  
  return <span>{displayValue.toLocaleString()}</span>;
}

// Parallax wrapper
function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Ultra-smooth spring physics
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 0.5 });
  
  // Parallax transforms
  const y1 = useTransform(smoothProgress, [0, 1], [0, -150]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, -250]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const opacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.4], [1, 0.95]);
  const phoneY = useParallax(smoothProgress, 50);
  const phoneRotate = useTransform(smoothProgress, [0, 1], [0, -5]);

  // Mouse parallax for decorative elements
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden"
    >
      {/* Layered gradient backgrounds */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/50"
        style={{ opacity }}
      />
      
      {/* Morphing background blobs - muted pastel colors */}
      <MorphingBlob className="top-10 left-[5%] w-[500px] h-[500px] orb-lavender opacity-40" delay={0} />
      <MorphingBlob className="top-40 right-[10%] w-[400px] h-[400px] orb-peach opacity-30" delay={5} />
      <MorphingBlob className="bottom-20 left-[20%] w-[600px] h-[600px] orb-sky opacity-25" delay={10} />
      <MorphingBlob className="bottom-40 right-[5%] w-[350px] h-[350px] orb-sage opacity-35" delay={15} />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Floating particles */}
      <FloatingParticle delay={0} x="15%" y="20%" size={8} color="bg-lavender" />
      <FloatingParticle delay={1} x="80%" y="30%" size={6} color="bg-peach" />
      <FloatingParticle delay={2} x="25%" y="60%" size={10} color="bg-sky" />
      <FloatingParticle delay={3} x="70%" y="70%" size={7} color="bg-sage" />
      <FloatingParticle delay={4} x="50%" y="15%" size={5} color="bg-primary/30" />
      <FloatingParticle delay={5} x="10%" y="80%" size={9} color="bg-lavender" />
      <FloatingParticle delay={6} x="90%" y="50%" size={6} color="bg-peach" />
      <FloatingParticle delay={7} x="40%" y="85%" size={8} color="bg-sky" />

      {/* Main content with parallax */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto w-full"
        style={{ scale, opacity, x: mousePosition.x * 0.1, y: mousePosition.y * 0.1 }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge with enhanced shimmer */}
            <motion.div
              variants={fadeUpSpring}
              whileHover={{ scale: 1.03, y: -2 }}
              className="relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass border border-primary/10 mb-8 overflow-hidden cursor-pointer group"
            >
              {/* Multi-layer shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
              />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-foreground/80 relative">AI-Powered Productivity</span>
              <motion.div
                className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-sage"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Headline with character-by-character animation */}
            <motion.h1
              variants={fadeUpSpring}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-8"
              style={{ perspective: '1000px' }}
            >
              <AnimatedText text="Your life, " />
              <br className="hidden sm:block" />
              <motion.span 
                className="text-gradient inline-block"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ backgroundSize: '200% 200%' }}
              >
                <AnimatedText text="beautifully" delay={12} />
              </motion.span>
              <br />
              <AnimatedText text="organized" delay={22} />
            </motion.h1>

            {/* Subheadline with word animation */}
            <motion.p
              variants={fadeUpSpring}
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              <AnimatedWords text="The AI assistant that learns how you work, anticipates your needs, and helps you accomplish more with less effort." />
            </motion.p>

            {/* App Store Buttons with entrance animation */}
            <motion.div 
              variants={fadeUpSpring}
              className="mb-10"
            >
              <AppStoreButtons />
            </motion.div>

            {/* Enhanced social proof */}
            <motion.div
              variants={fadeUpSpring}
              className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
            >
              {/* Stacked avatars with stagger animation */}
              <div className="flex -space-x-3">
                {[
                  'from-lavender to-primary/50',
                  'from-peach to-accent',
                  'from-sky to-primary/30',
                  'from-sage to-sky',
                  'from-primary/30 to-lavender',
                ].map((gradient, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: -30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 12,
                      delay: 0.6 + i * 0.08,
                    }}
                    whileHover={{ 
                      scale: 1.15, 
                      zIndex: 10,
                      y: -5,
                    }}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} border-2 border-background cursor-pointer relative shadow-lg`}
                  />
                ))}
              </div>
              
              {/* Stats */}
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 1.2 + i * 0.05, type: "spring", stiffness: 200 }}
                    >
                      <Star className="w-4 h-4 fill-golden text-golden" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <motion.span 
                    className="font-semibold text-foreground"
                  >
                    <AnimatedNumber value={50000} />+
                  </motion.span>{' '}
                  happy users
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right - Phone Mockup with smooth animations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 60,
              damping: 20,
              delay: 0.3,
            }}
            style={{ y: phoneY }}
            className="relative"
          >
            <PhoneMockup className="w-full h-[500px] lg:h-[650px] flex items-center justify-center" />
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <motion.span 
          className="text-xs uppercase tracking-widest text-muted-foreground/60"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to explore
        </motion.span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-1.5 cursor-pointer hover:border-primary/40 transition-colors"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ 
              y: [0, 16, 0],
              opacity: [1, 0.3, 1],
              scaleY: [1, 0.8, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-1.5 h-3 rounded-full bg-gradient-to-b from-primary/60 to-lavender/60"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
