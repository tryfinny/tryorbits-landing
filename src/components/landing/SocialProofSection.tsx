import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    content: "This app completely transformed how I manage my day. The AI suggestions are scarily accurate!",
    rating: 5,
    avatar: 'from-rose-400 to-orange-400',
  },
  {
    name: 'Marcus Williams',
    role: 'Startup Founder',
    content: "I've tried every productivity app out there. This is the first one that actually stuck. Game changer.",
    rating: 5,
    avatar: 'from-blue-400 to-cyan-400',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Content Creator',
    content: "The smart scheduling feature alone saved me 2 hours every day. Absolutely worth it.",
    rating: 5,
    avatar: 'from-purple-400 to-pink-400',
  },
];

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateY: -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : { opacity: 0, y: 50, rotateY: -10 }}
      transition={{ 
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: index * 0.12,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative perspective-1000"
    >
      <motion.div 
        className="bg-card p-8 rounded-3xl card-shadow border border-border/50 h-full relative overflow-hidden"
        whileHover={{ 
          y: -10,
          rotateX: 5,
          boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.2)',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Quote icon with animation */}
        <motion.div
          animate={isHovered ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Quote className="w-10 h-10 text-primary/20 mb-4" />
        </motion.div>

        {/* Animated stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: index * 0.1 + i * 0.08 + 0.2,
              }}
              whileHover={{ scale: 1.3, rotate: 15 }}
            >
              <Star className="w-5 h-5 fill-primary text-primary" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <motion.p 
          className="text-foreground/90 mb-6 leading-relaxed text-lg"
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          "{testimonial.content}"
        </motion.p>

        {/* Author with animated avatar */}
        <div className="flex items-center gap-4">
          <motion.div 
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.avatar} flex items-center justify-center text-white font-bold`}
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {testimonial.name.charAt(0)}
          </motion.div>
          <div>
            <motion.p 
              className="font-semibold"
              animate={isHovered ? { x: 5 } : { x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {testimonial.name}
            </motion.p>
            <motion.p 
              className="text-muted-foreground text-sm"
              animate={isHovered ? { x: 5 } : { x: 0 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.02 }}
            >
              {testimonial.role}
            </motion.p>
          </div>
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl"
          animate={isHovered ? { scale: 1.5, opacity: 0.8 } : { scale: 1, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}

function LiveNotification() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(14);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-3 px-5 py-3 bg-card rounded-full card-shadow border border-border/50 cursor-pointer"
    >
      <motion.div
        className="relative"
      >
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-green-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500"
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
      <span className="text-sm text-muted-foreground">
        <motion.span 
          key={count}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-foreground inline-block"
        >
          {count}
        </motion.span>{' '}
        people signed up today
      </span>
    </motion.div>
  );
}

function FloatingRatingBadge({ rating, store, delay }: { rating: string; store: string; delay: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5, scale: 1.05 }}
      className="flex items-center gap-3 px-6 py-4 bg-card rounded-2xl card-shadow cursor-pointer relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      <div className="flex gap-0.5 relative z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={isHovered ? { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Star className="w-4 h-4 fill-primary text-primary" />
          </motion.div>
        ))}
      </div>
      <span className="font-bold text-lg relative z-10">{rating}</span>
      <span className="text-muted-foreground text-sm relative z-10">{store}</span>
    </motion.div>
  );
}

export function SocialProofSection() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const backgroundY = useTransform(smoothProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} className="relative py-32 px-6 bg-secondary/30 overflow-hidden">
      {/* Parallax background */}
      <motion.div 
        className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        style={{ y: backgroundY }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        style={{ y: useTransform(smoothProgress, [0, 1], [-50, 50]) }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-20"
        >
          <motion.span 
            className="inline-block text-primary font-medium text-sm uppercase tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
          >
            Testimonials
          </motion.span>
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.15 }}
          >
            Loved by{' '}
            <motion.span 
              className="text-gradient inline-block"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              <AnimatedCounter value={50000} duration={2.5} />+
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            Join the community of people who've transformed their productivity.
          </motion.p>
          <LiveNotification />
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* App store ratings */}
        <div className="mt-20 flex flex-wrap justify-center gap-6">
          <FloatingRatingBadge rating="4.9" store="on App Store" delay={0.1} />
          <FloatingRatingBadge rating="4.8" store="on Google Play" delay={0.2} />
        </div>
      </div>
    </section>
  );
}
