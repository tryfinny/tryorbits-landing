import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    content: "This app completely transformed how I manage my day. The AI suggestions are scarily accurate!",
    rating: 5,
  },
  {
    name: 'Marcus Williams',
    role: 'Startup Founder',
    content: "I've tried every productivity app out there. This is the first one that actually stuck. Game changer.",
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Content Creator',
    content: "The smart scheduling feature alone saved me 2 hours every day. Absolutely worth it.",
    rating: 5,
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="relative"
    >
      <div className="bg-card p-8 rounded-3xl card-shadow border border-border/50 h-full">
        {/* Quote icon */}
        <Quote className="w-8 h-8 text-primary/30 mb-4" />

        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ delay: index * 0.06 + i * 0.04 + 0.15, duration: 0.2 }}
            >
              <Star className="w-5 h-5 fill-primary text-primary" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <p className="text-foreground/90 mb-6 leading-relaxed">"{testimonial.content}"</p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent" />
          <div>
            <p className="font-semibold text-sm">{testimonial.name}</p>
            <p className="text-muted-foreground text-sm">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LiveNotification() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(14);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full card-shadow border border-border/50"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-green-500"
      />
      <span className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{count}</span> people signed up today
      </span>
    </motion.div>
  );
}

export function SocialProofSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.35 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Loved by <span className="text-gradient">thousands</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join the community of people who've transformed their productivity.
          </p>
          <LiveNotification />
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* App store ratings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          <div className="flex items-center gap-3 px-6 py-3 bg-card rounded-2xl card-shadow">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="font-semibold">4.9</span>
            <span className="text-muted-foreground text-sm">on App Store</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-card rounded-2xl card-shadow">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="font-semibold">4.8</span>
            <span className="text-muted-foreground text-sm">on Google Play</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
