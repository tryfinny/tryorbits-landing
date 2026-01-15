import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import { AppStoreButtons } from './AppStoreButtons';
import { ArrowUp, Sparkles, Zap, Heart } from 'lucide-react';

// Floating orb with organic motion
function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        y: [0, -40, 0, 40, 0],
        x: [0, 20, 0, -20, 0],
        scale: [1, 1.1, 1, 0.9, 1],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export function CTASection() {
  const containerRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isArrowHovered, setIsArrowHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const backgroundScale = useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1, 1.1]);

  return (
    <section ref={containerRef} className="relative pt-8 pb-16 lg:pt-10 lg:pb-20 px-6 overflow-hidden">
      {/* Layered gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Central glowing orb */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] orb-lavender opacity-30"
        style={{ scale: backgroundScale }}
      />

      {/* Floating accent orbs */}
      <FloatingOrb className="top-20 left-[15%] w-[300px] h-[300px] orb-peach opacity-25" delay={0} />
      <FloatingOrb className="bottom-20 right-[15%] w-[250px] h-[250px] orb-sky opacity-30" delay={5} />
      <FloatingOrb className="top-1/3 right-[20%] w-[200px] h-[200px] orb-sage opacity-20" delay={10} />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${15 + i * 10}%`,
            top: `${25 + (i % 3) * 25}%`,
            background: i % 4 === 0 ? 'hsl(var(--lavender))' : 
                       i % 4 === 1 ? 'hsl(var(--peach))' :
                       i % 4 === 2 ? 'hsl(var(--sky))' : 'hsl(var(--sage))',
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, i % 2 === 0 ? 30 : -30, 0],
            opacity: [0.4, 0.6, 0.5],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.7,
          }}
        />
      ))}

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 30 }}
          transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -3 }}
          className="relative inline-flex items-center gap-3 px-6 py-3 glass rounded-full border border-primary/10 mb-12 overflow-hidden cursor-pointer group"
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          />
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-golden" />
          </motion.div>
          <span className="text-sm font-medium relative">Free to download</span>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-4 h-4 text-peach fill-peach" />
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h2 
          className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-serif font-medium tracking-[-0.01em] mb-10 leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.15 }}
        >
          Ready to simplify your{' '}
          <br className="hidden sm:block" />
          <motion.span 
            className="text-gradient inline-block"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundSize: '200% 200%' }}
          >
            household
          </motion.span>
          ?
        </motion.h2>

        <motion.p 
          className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-14 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.25 }}
        >
          Download Orbits and join thousands of households running smoother every day.
        </motion.p>

        {/* App Store Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <AppStoreButtons />
        </motion.div>

        {/* Secondary CTA */}
        <motion.a
          href="#"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.45 }}
          onHoverStart={() => setIsArrowHovered(true)}
          onHoverEnd={() => setIsArrowHovered(false)}
          whileHover={{ scale: 1.02 }}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group text-lg"
        >
          <span className="relative">
            Learn more about our features
            <motion.span
              className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-lavender"
              initial={{ width: 0 }}
              animate={isArrowHovered ? { width: '100%' } : { width: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </span>
          <motion.div
            animate={isArrowHovered ? { y: -6 } : { y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.div>
        </motion.a>
      </motion.div>
    </section>
  );
}
