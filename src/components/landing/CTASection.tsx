import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import { AppStoreButtons } from './AppStoreButtons';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export function CTASection() {
  const containerRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isArrowHovered, setIsArrowHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const backgroundScale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 1.2]);
  const backgroundOpacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative py-32 px-6 overflow-hidden">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-background to-secondary/30"
        style={{ opacity: backgroundOpacity }}
      />
      
      {/* Pulsing center glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-3xl"
        style={{ scale: backgroundScale }}
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating orbs */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-primary/20"
          style={{
            left: `${20 + i * 20}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, i % 2 === 0 ? 20 : -20, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-10 overflow-hidden cursor-pointer"
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="text-sm font-medium">Free to download</span>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-4 h-4 text-primary fill-primary" />
          </motion.div>
        </motion.div>

        {/* Headline with character reveal */}
        <motion.h2 
          className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-8 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.15 }}
        >
          Ready to transform your{' '}
          <motion.span 
            className="text-gradient inline-block"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          >
            productivity
          </motion.span>
          ?
        </motion.h2>

        <motion.p 
          className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.25 }}
        >
          Download now and join thousands of users who've already discovered a better way to work.
        </motion.p>

        {/* App Store Buttons with enhanced entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
          className="flex justify-center mb-10"
        >
          <AppStoreButtons />
        </motion.div>

        {/* Secondary CTA with magnetic effect */}
        <motion.a
          href="#"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
          onHoverStart={() => setIsArrowHovered(true)}
          onHoverEnd={() => setIsArrowHovered(false)}
          whileHover={{ scale: 1.02 }}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span className="relative">
            Learn more about our features
            <motion.span
              className="absolute -bottom-0.5 left-0 h-0.5 bg-primary"
              initial={{ width: 0 }}
              animate={isArrowHovered ? { width: '100%' } : { width: 0 }}
              transition={{ duration: 0.3 }}
            />
          </span>
          <motion.div
            animate={isArrowHovered ? { x: 5 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.a>
      </motion.div>
    </section>
  );
}
