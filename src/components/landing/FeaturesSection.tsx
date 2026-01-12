import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Brain, Zap, Calendar, Shield } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI That Understands You',
    description: 'Our AI learns your patterns and preferences, offering personalized suggestions that get smarter over time.',
    color: 'from-primary to-primary/60',
    gradient: 'radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.2), transparent 70%)',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Complete tasks in seconds. Our optimized engine ensures zero lag, even with complex operations.',
    color: 'from-accent to-accent/60',
    gradient: 'radial-gradient(circle at 70% 30%, hsl(var(--accent) / 0.3), transparent 70%)',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Automatically organize your day based on priorities, deadlines, and your energy levels.',
    color: 'from-primary to-accent',
    gradient: 'radial-gradient(circle at 50% 70%, hsl(var(--primary) / 0.15), transparent 70%)',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays yours. End-to-end encryption ensures complete privacy and security.',
    color: 'from-muted-foreground to-muted-foreground/60',
    gradient: 'radial-gradient(circle at 30% 70%, hsl(var(--muted) / 0.3), transparent 70%)',
  },
];

function MagneticCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 10;
    const y = (e.clientY - rect.top - rect.height / 2) / 10;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = feature.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 60, rotateX: -15 }}
      transition={{ 
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: index * 0.1,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group perspective-1000"
    >
      <MagneticCard>
        <motion.div 
          className="relative p-8 bg-card rounded-3xl card-shadow border border-border/50 h-full overflow-hidden"
          whileHover={{ 
            y: -8,
            boxShadow: '0 20px 60px -15px hsl(var(--primary) / 0.25)',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: feature.gradient }}
          />

          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          {/* Icon with 3D effect */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={isHovered ? { 
              y: [0, -5, 0],
              rotate: [0, 3, -3, 0],
            } : {}}
            transition={{ 
              duration: 0.8,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut"
            }}
            className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
          >
            {/* Icon glow */}
            <motion.div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} blur-xl`}
              animate={isHovered ? { opacity: 0.6, scale: 1.3 } : { opacity: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <Icon className="w-8 h-8 text-background relative z-10" />
          </motion.div>

          {/* Content with stagger */}
          <motion.h3 
            className="text-xl font-semibold mb-3 relative z-10"
            animate={isHovered ? { x: 5 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {feature.title}
          </motion.h3>
          <motion.p 
            className="text-muted-foreground leading-relaxed relative z-10"
            animate={isHovered ? { x: 5 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
          >
            {feature.description}
          </motion.p>

          {/* Corner accent */}
          <motion.div
            className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl"
            animate={isHovered ? { scale: 1.5, opacity: 0.8 } : { scale: 1, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </MagneticCard>
    </motion.div>
  );
}

export function FeaturesSection() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const backgroundY = useTransform(smoothProgress, [0, 1], [0, -50]);

  return (
    <section ref={containerRef} className="relative py-32 px-6 overflow-hidden">
      {/* Parallax background elements */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        style={{ y: backgroundY }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
        style={{ y: useTransform(smoothProgress, [0, 1], [0, 50]) }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Section header with reveal animation */}
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
            Features
          </motion.span>
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.15 }}
          >
            Everything you need to{' '}
            <motion.span 
              className="text-gradient inline-block"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              thrive
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            Powerful features designed to simplify your life and amplify your productivity.
          </motion.p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
