import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    content: "This app completely transformed how I manage my day. The AI suggestions are scarily accurate!",
    rating: 5,
    gradient: 'from-lavender to-primary/30',
    bgColor: 'bg-lavender/10',
  },
  {
    name: 'Marcus Williams',
    role: 'Startup Founder',
    content: "I've tried every productivity app out there. This is the first one that actually stuck. Game changer.",
    rating: 5,
    gradient: 'from-peach to-golden/30',
    bgColor: 'bg-peach/10',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Content Creator',
    content: "The smart scheduling feature alone saved me 2 hours every day. Absolutely worth it.",
    rating: 5,
    gradient: 'from-sky to-sage/30',
    bgColor: 'bg-sky/10',
  },
];

// Smooth animated counter
function AnimatedCounter({ value, duration = 2.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Easing function for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// 3D Testimonial Card
function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 10, y: -x * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: -20 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 80, rotateX: -20 }}
      transition={{ 
        type: "spring",
        stiffness: 60,
        damping: 15,
        delay: index * 0.15,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <motion.div 
        className={`${testimonial.bgColor} p-8 lg:p-10 rounded-[2rem] border border-border/30 h-full relative overflow-hidden backdrop-blur-sm`}
        animate={{ 
          rotateX: tilt.x,
          rotateY: tilt.y,
          boxShadow: isHovered 
            ? '0 40px 80px -30px hsl(var(--primary) / 0.2)' 
            : '0 15px 40px -20px hsl(var(--primary) / 0.08)',
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-20`}
          animate={isHovered ? { opacity: 0.35 } : { opacity: 0.2 }}
          transition={{ duration: 0.4 }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-200%' }}
          animate={isHovered ? { x: '200%' } : { x: '-200%' }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Quote icon */}
        <motion.div
          animate={isHovered ? { scale: 1.15, rotate: 10, y: -5 } : { scale: 1, rotate: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-6"
          style={{ transform: 'translateZ(20px)' }}
        >
          <Quote className="w-12 h-12 text-primary/15" />
        </motion.div>

        {/* Stars with staggered animation */}
        <div className="flex gap-1.5 mb-6" style={{ transform: 'translateZ(15px)' }}>
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 12,
                delay: index * 0.15 + i * 0.08 + 0.3,
              }}
              whileHover={{ scale: 1.3, rotate: 15 }}
            >
              <Star className="w-5 h-5 fill-golden text-golden" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <motion.p 
          className="text-foreground/90 mb-8 leading-relaxed text-lg lg:text-xl relative z-10"
          style={{ transform: 'translateZ(10px)' }}
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          "{testimonial.content}"
        </motion.p>

        {/* Author */}
        <div className="flex items-center gap-4 relative z-10" style={{ transform: 'translateZ(25px)' }}>
          <motion.div 
            className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 150, damping: 12 }}
          >
            {testimonial.name.charAt(0)}
          </motion.div>
          <div>
            <motion.p 
              className="font-semibold text-lg"
              animate={isHovered ? { x: 5 } : { x: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {testimonial.name}
            </motion.p>
            <motion.p 
              className="text-muted-foreground"
              animate={isHovered ? { x: 5 } : { x: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.02 }}
            >
              {testimonial.role}
            </motion.p>
          </div>
        </div>

        {/* Corner glow */}
        <motion.div
          className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${testimonial.gradient} rounded-full blur-3xl`}
          animate={isHovered ? { scale: 1.5, opacity: 0.4 } : { scale: 1, opacity: 0.15 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
}

// Live signup notification
function LiveNotification() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(14);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      whileHover={{ scale: 1.03, y: -3 }}
      className="inline-flex items-center gap-4 px-6 py-4 glass rounded-full border border-border/30 cursor-pointer"
    >
      {/* Pulsing dot */}
      <div className="relative">
        <motion.div
          className="w-3 h-3 rounded-full bg-sage"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 w-3 h-3 rounded-full bg-sage"
          animate={{ scale: [1, 2.5], opacity: [0.5, 0.15] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      <span className="text-muted-foreground">
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
      
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-4 h-4 text-golden" />
      </motion.div>
    </motion.div>
  );
}

// Rating badge with hover effects
function FloatingRatingBadge({ rating, store, delay, gradient }: { rating: string; store: string; delay: number; gradient: string }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`flex items-center gap-4 px-8 py-5 bg-gradient-to-br ${gradient} rounded-2xl border border-border/30 cursor-pointer relative overflow-hidden backdrop-blur-sm`}
    >
      {/* Shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-200%' }}
        animate={isHovered ? { x: '200%' } : { x: '-200%' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      
      <div className="flex gap-1 relative z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={isHovered ? { rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            <Star className="w-5 h-5 fill-golden text-golden" />
          </motion.div>
        ))}
      </div>
      <span className="font-bold text-xl relative z-10">{rating}</span>
      <span className="text-muted-foreground relative z-10">{store}</span>
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

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const backgroundY1 = useTransform(smoothProgress, [0, 1], [80, -80]);
  const backgroundY2 = useTransform(smoothProgress, [0, 1], [-60, 60]);

  return (
    <section ref={containerRef} className="relative pt-10 pb-20 lg:pt-12 lg:pb-28 px-6 bg-gradient-to-b from-secondary/30 to-background overflow-hidden">
      {/* Parallax background orbs */}
      <motion.div 
        className="absolute top-20 left-[5%] w-[400px] h-[400px] orb-peach opacity-30"
        style={{ y: backgroundY1 }}
      />
      <motion.div 
        className="absolute bottom-20 right-[10%] w-[500px] h-[500px] orb-lavender opacity-25"
        style={{ y: backgroundY2 }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] orb-sage opacity-15"
        style={{ rotate: useTransform(smoothProgress, [0, 1], [0, 20]) }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 60 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="text-center mb-20 lg:mb-28"
        >
          <motion.span 
            className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
          >
            💜 Testimonials
          </motion.span>
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-8"
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
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: '200% 200%' }}
            >
              <AnimatedCounter value={2400} />+
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            Join the community of people who've transformed their productivity.
          </motion.p>
          <LiveNotification />
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* App store ratings */}
        <div className="mt-20 flex flex-wrap justify-center gap-6">
          <FloatingRatingBadge rating="4.9" store="on App Store" delay={0.1} gradient="from-lavender/20 to-primary/5" />
          <FloatingRatingBadge rating="4.8" store="on Google Play" delay={0.2} gradient="from-sage/20 to-sky/5" />
        </div>
      </div>
    </section>
  );
}
