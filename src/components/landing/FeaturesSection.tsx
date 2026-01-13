import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Brain, Zap, Calendar, Shield, Home, Users, Wallet, Bell } from 'lucide-react';

const features = [
  {
    icon: Home,
    title: 'Home Management',
    description: 'Track maintenance, manage supplies, and keep your household running smoothly.',
    color: 'bg-sage',
    gradient: 'from-sage/20 to-sky/10',
    iconBg: 'bg-sage/20',
    accentColor: 'text-sage-foreground',
  },
  {
    icon: Users,
    title: 'Family Calendar',
    description: 'Coordinate schedules, activities, and events for everyone in your family.',
    color: 'bg-peach',
    gradient: 'from-peach/20 to-lavender/10',
    iconBg: 'bg-peach/20',
    accentColor: 'text-peach-foreground',
  },
  {
    icon: Wallet,
    title: 'Smart Budgeting',
    description: 'Monitor spending, track bills, and gain insights into your family finances.',
    color: 'bg-sky',
    gradient: 'from-sky/20 to-sage/10',
    iconBg: 'bg-sky/20',
    accentColor: 'text-sky-foreground',
  },
  {
    icon: Bell,
    title: 'Intelligent Alerts',
    description: 'Get timely reminders and proactive suggestions tailored to your routine.',
    color: 'bg-lavender',
    gradient: 'from-lavender/20 to-peach/10',
    iconBg: 'bg-lavender/20',
    accentColor: 'text-lavender-foreground',
  },
];

// 3D Tilt Card Component
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [transform, setTransform] = useState('');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const tiltX = (y - 0.5) * 15;
    const tiltY = (x - 0.5) * -15;
    
    setTransform(`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-300 ease-out ${className}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      {/* Glare effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, white ${0}%, transparent 60%)`,
          opacity: glare.opacity,
        }}
      />
      {children}
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [isHovered, setIsHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: -20 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 80, rotateX: -20 }}
      transition={{ 
        type: "spring",
        stiffness: 60,
        damping: 15,
        delay: index * 0.1,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <TiltCard>
        <motion.div 
          className={`relative p-8 lg:p-10 bg-gradient-to-br ${feature.gradient} rounded-[2rem] border border-border/30 h-full overflow-hidden backdrop-blur-sm`}
          animate={isHovered ? { 
            boxShadow: '0 30px 60px -20px hsl(var(--primary) / 0.15)',
          } : {
            boxShadow: '0 10px 40px -20px hsl(var(--primary) / 0.05)',
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Animated background pattern */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 70% 30%, hsl(var(--${feature.color.replace('bg-', '')})) 0%, transparent 50%)`,
            }}
            animate={isHovered ? { scale: 1.2, opacity: 0.4 } : { scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.5 }}
          />

          {/* Multi-layer shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-200%', opacity: 0 }}
            animate={isHovered ? { x: '200%', opacity: 1 } : { x: '-200%', opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Floating corner accent */}
          <motion.div
            className={`absolute -top-10 -right-10 w-32 h-32 ${feature.color} rounded-full blur-3xl`}
            animate={isHovered ? { scale: 1.5, opacity: 0.6 } : { scale: 1, opacity: 0.3 }}
            transition={{ duration: 0.5 }}
          />

          {/* Icon with 3D pop effect */}
          <motion.div
            animate={isHovered ? { 
              y: -8, 
              rotateZ: 5,
              scale: 1.1,
            } : { 
              y: 0, 
              rotateZ: 0,
              scale: 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="relative z-10 mb-6"
          >
            <motion.div
              className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl ${feature.iconBg} flex items-center justify-center relative`}
              animate={isHovered ? { 
                boxShadow: `0 15px 30px -10px hsl(var(--${feature.color.replace('bg-', '')}) / 0.4)`,
              } : {
                boxShadow: 'none',
              }}
            >
              {/* Icon glow */}
              <motion.div
                className={`absolute inset-0 rounded-2xl ${feature.color} blur-xl`}
                animate={isHovered ? { opacity: 0.4, scale: 1.2 } : { opacity: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <Icon className={`w-8 h-8 lg:w-10 lg:h-10 ${feature.accentColor} relative z-10`} />
            </motion.div>
          </motion.div>

          {/* Content with staggered reveal on hover */}
          <motion.h3 
            className="text-xl lg:text-2xl font-semibold mb-4 relative z-10"
            animate={isHovered ? { x: 8 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {feature.title}
          </motion.h3>
          <motion.p 
            className="text-muted-foreground leading-relaxed relative z-10 text-base lg:text-lg"
            animate={isHovered ? { x: 8 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.03 }}
          >
            {feature.description}
          </motion.p>

          {/* Interactive corner detail */}
          <motion.div
            className="absolute bottom-4 right-4 w-8 h-8 rounded-full border-2 border-muted/30 flex items-center justify-center"
            animate={isHovered ? { 
              scale: 1.2, 
              borderColor: `hsl(var(--${feature.color.replace('bg-', '')}))`,
              rotate: 90,
            } : { 
              scale: 1,
              rotate: 0,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.div
              className={`w-2 h-2 rounded-full ${feature.color}`}
              animate={isHovered ? { scale: 1.5 } : { scale: 1 }}
            />
          </motion.div>
        </motion.div>
      </TiltCard>
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

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const backgroundY1 = useTransform(smoothProgress, [0, 1], [100, -100]);
  const backgroundY2 = useTransform(smoothProgress, [0, 1], [-50, 50]);
  const backgroundRotate = useTransform(smoothProgress, [0, 1], [0, 45]);

  return (
    <section ref={containerRef} className="relative py-32 lg:py-40 px-6 overflow-hidden">
      {/* Parallax background orbs */}
      <motion.div 
        className="absolute top-0 right-[10%] w-[500px] h-[500px] orb-lavender opacity-30"
        style={{ y: backgroundY1, rotate: backgroundRotate }}
      />
      <motion.div 
        className="absolute bottom-0 left-[5%] w-[400px] h-[400px] orb-peach opacity-25"
        style={{ y: backgroundY2 }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] orb-sky opacity-15"
        style={{ rotate: useTransform(smoothProgress, [0, 1], [0, -30]) }}
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
            ✨ Features
          </motion.span>
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-8"
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
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: '200% 200%' }}
            >
              thrive
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            Powerful features designed to simplify your life and amplify your productivity.
          </motion.p>
        </motion.div>

        {/* Features grid with offset layout */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              style={{ 
                marginTop: index % 2 === 1 ? '3rem' : '0',
              }}
            >
              <FeatureCard feature={feature} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
