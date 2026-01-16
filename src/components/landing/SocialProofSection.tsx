import { motion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Star, Quote, Sparkles } from "lucide-react";

const testimonials = [
  {
    name: "Jamie",
    role: "Mom of 2",
    content: "Finally an app that doesn't make me feel guilty for missing tasks. The gentle nudges actually help.",
    rating: 5,
    gradient: "from-lavender to-primary/30",
    bgColor: "bg-lavender/10",
  },
  {
    name: "Alex K.",
    role: "Helpful son to 2 parents",
    content: "Been using it for 3 weeks now. Still figuring out all the features but the calendar sync is solid.",
    rating: 4,
    gradient: "from-peach to-golden/30",
    bgColor: "bg-peach/10",
  },
  {
    name: "Morgan",
    role: "New bride",
    content: "My partner and I can finally focus on what matters instead of logistics.",
    rating: 5,
    gradient: "from-sky to-sage/30",
    bgColor: "bg-sky/10",
  },
  {
    name: "Sam R.",
    role: "First-time homeowner",
    content:
      "The home maintenance reminders are a lifesaver. Did you know you're supposed to clean your dryer vents? Orbits did!",
    rating: 5,
    gradient: "from-sage to-sky/30",
    bgColor: "bg-sage/10",
  },
  {
    name: "Taylor",
    role: "Mom of 2 kids, 2 dogs, and 1 husband",
    content: "Orbits is the only one my whole family actually uses.",
    rating: 5,
    gradient: "from-golden to-peach/30",
    bgColor: "bg-golden/10",
  },
  {
    name: "Jordan M.",
    role: "Dog dad",
    content: "Love having all of the vaccine info, records, and files for each part of my house in one place.",
    rating: 4,
    gradient: "from-primary to-lavender/30",
    bgColor: "bg-primary/10",
  },
  {
    name: "Casey",
    role: "Working mom of 1",
    content: "I was skeptical about yet another calendar app but Orbits does that and so much more.",
    rating: 5,
    gradient: "from-peach to-sage/30",
    bgColor: "bg-peach/10",
  },
  {
    name: "Riley P.",
    role: "Mom of twins",
    content: "We replaced our Skylight Calendar because of Orbits.",
    rating: 5,
    gradient: "from-sky to-lavender/30",
    bgColor: "bg-sky/10",
  },
  {
    name: "Drew",
    role: "Work-from-home dad",
    content: "Simple but powerful. The shared grocery list alone has saved us so many duplicate purchases.",
    rating: 4,
    gradient: "from-lavender to-sage/30",
    bgColor: "bg-lavender/10",
  },
  {
    name: "Avery T.",
    role: "Baby wrangler",
    content: "No more calling around for roof quotes - Orbits does it for you!",
    rating: 5,
    gradient: "from-sage to-golden/30",
    bgColor: "bg-sage/10",
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

// 3D Testimonial Card - now controlled by isActive prop for carousel
function TestimonialCard({ testimonial, isActive }: { testimonial: (typeof testimonials)[0]; isActive: boolean }) {
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
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={isActive ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -100, scale: 0.9 }}
      exit={{ opacity: 0, x: -100, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 18,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative perspective-1000 w-full"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className={`${testimonial.bgColor} p-8 lg:p-10 rounded-[2rem] border border-border/30 relative overflow-hidden md:backdrop-blur-sm shadow-sm`}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-20`}
          animate={isHovered ? { opacity: 0.35 } : { opacity: 0.2 }}
          transition={{ duration: 0.4 }}
        />

        {/* Shimmer effect on entry */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-200%" }}
          animate={isActive ? { x: ["−200%", "200%"] } : { x: "-200%" }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
        />

        {/* Quote icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="mb-6"
          style={{ transform: "translateZ(20px)" }}
        >
          <Quote className="w-12 h-12 text-primary/15" />
        </motion.div>

        {/* Content */}
        <motion.p
          className="text-foreground/90 mb-8 leading-relaxed text-lg lg:text-xl relative z-10"
          style={{ transform: "translateZ(10px)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
        >
          "{testimonial.content}"
        </motion.p>

        {/* Author */}
        <div className="flex items-center gap-4 relative z-10" style={{ transform: "translateZ(25px)" }}>
          <motion.div
            className={`w-14 h-14 aspect-square rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0`}
            initial={{ scale: 0, rotate: -180 }}
            animate={isActive ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.25 }}
          >
            {testimonial.name.charAt(0)}
          </motion.div>
          <div>
            <motion.p
              className="font-semibold text-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: 0.3 }}
            >
              {testimonial.name}
            </motion.p>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: 0.35 }}
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

// Testimonial Carousel - auto-advances every 4s
function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Carousel container */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <TestimonialCard key={activeIndex} testimonial={testimonials[activeIndex]} isActive={true} />
        </AnimatePresence>
      </div>
    </div>
  );
}

// Live signup notification - simplified animation
function LiveNotification() {
  const [visible, setVisible] = useState(false);
  const count = 24;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className="inline-flex items-center gap-4 px-6 py-4 glass rounded-full border border-border/30 cursor-pointer"
    >
      {/* Simple static dot */}
      <div className="w-3 h-3 rounded-full bg-sage" />
      <span className="text-muted-foreground">
        <span className="font-semibold text-foreground">{count}</span> people signed up today
      </span>
      <Sparkles className="w-4 h-4 text-golden" />
    </motion.div>
  );
}

// Rating badge with hover effects
function FloatingRatingBadge({
  rating,
  store,
  delay,
  gradient,
}: {
  rating: string;
  store: string;
  delay: number;
  gradient: string;
}) {
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
      className={`flex items-center gap-4 px-8 py-5 bg-gradient-to-br ${gradient} rounded-2xl border border-border/30 cursor-pointer relative overflow-hidden md:backdrop-blur-sm`}
    >
      {/* Shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-200%" }}
        animate={isHovered ? { x: "200%" } : { x: "-200%" }}
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

  return (
    <section
      ref={containerRef}
      className="relative pt-10 pb-8 lg:pt-12 lg:pb-12 px-6 bg-gradient-to-b from-secondary/30 to-background overflow-hidden"
    >
      {/* Static background orbs - no animation */}
      <div className="absolute top-20 left-[5%] w-[400px] h-[400px] orb-peach opacity-30 blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-[10%] w-[500px] h-[500px] orb-lavender opacity-25 blur-3xl rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] orb-sage opacity-15 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 60 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="text-center mb-10 lg:mb-14"
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
            className="text-3xl sm:text-4xl lg:text-6xl font-lora font-medium tracking-[-0.01em] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.15 }}
          >
            Loved by{" "}
            <motion.span
              className="text-gradient inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              <AnimatedCounter value={2400} />+
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of households running smoother with Orbits.
          </motion.p>
          <LiveNotification />
        </motion.div>

        {/* Testimonials carousel */}
        <TestimonialCarousel />

        {/* Early access badge */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-sage/20 to-sky/10 rounded-2xl border border-border/30">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Join our growing community of early adopters</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
