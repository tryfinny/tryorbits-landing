import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { AppStoreButtons } from './AppStoreButtons';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isArrowHovered, setIsArrowHovered] = useState(false);

  return (
    <section className="relative pt-8 pb-16 lg:pt-10 lg:pb-20 px-6 overflow-hidden">
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Static background orbs - no animations for performance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] orb-lavender opacity-30 blur-3xl rounded-full" />
      <div className="absolute top-20 left-[15%] w-[300px] h-[300px] orb-peach opacity-25 blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-[15%] w-[250px] h-[250px] orb-sky opacity-30 blur-3xl rounded-full" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        {/* Badge - simplified, no continuous animations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.1 }}
          className="relative inline-flex items-center gap-3 px-6 py-3 glass rounded-full border border-primary/10 mb-12 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-golden" />
          <span className="text-sm font-medium">Try it free</span>
          <Heart className="w-4 h-4 text-peach fill-peach" />
        </motion.div>

        {/* Headline - simplified, no infinite animations */}
        <motion.h2 
          className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-serif font-medium tracking-[-0.01em] mb-10 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.15 }}
        >
          Ready for a calmer{' '}
          <br className="hidden sm:block" />
          <span className="text-gradient">home</span>?
        </motion.h2>

        <motion.p 
          className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-14 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.25 }}
        >
          Download Orbits and see how much easier your week can feel.
        </motion.p>

        {/* App Store Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <AppStoreButtons location="cta_section" />
        </motion.div>

        {/* Secondary CTA */}
        <motion.a
          href="/about"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
          onHoverStart={() => setIsArrowHovered(true)}
          onHoverEnd={() => setIsArrowHovered(false)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-lg"
        >
          <span className="relative">
            Learn more about us
            <motion.span
              className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-lavender"
              initial={{ width: 0 }}
              animate={isArrowHovered ? { width: '100%' } : { width: 0 }}
              transition={{ duration: 0.3 }}
            />
          </span>
          <motion.div
            animate={isArrowHovered ? { x: 4 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </motion.a>
      </motion.div>
    </section>
  );
}