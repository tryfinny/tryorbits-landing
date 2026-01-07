import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Zap, Calendar, Shield } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI That Understands You',
    description: 'Our AI learns your patterns and preferences, offering personalized suggestions that get smarter over time.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Complete tasks in seconds. Our optimized engine ensures zero lag, even with complex operations.',
    color: 'from-accent to-accent/60',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Automatically organize your day based on priorities, deadlines, and your energy levels.',
    color: 'from-primary to-accent',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays yours. End-to-end encryption ensures complete privacy and security.',
    color: 'from-muted-foreground to-muted-foreground/60',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group"
    >
      <div className="relative p-8 bg-card rounded-3xl card-shadow border border-border/50 h-full transition-all duration-300 hover:border-primary/30">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
        >
          <Icon className="w-7 h-7 text-background" />
        </motion.div>

        {/* Content */}
        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Features</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Everything you need to{' '}
            <span className="text-gradient">thrive</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to simplify your life and amplify your productivity.
          </p>
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
