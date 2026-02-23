import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { track } from "@/lib/analytics";

function AnimatedStat({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => requestAnimationFrame(animate), 200);
    return () => clearTimeout(timeout);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  {
    value: 2400,
    suffix: "+",
    label: "households on Orbits",
    color: "text-lavender",
  },
  {
    value: 3,
    suffix: "+ hrs",
    label: "saved per week, per family",
    color: "text-sage",
  },
  {
    value: 4,
    suffix: ".8★",
    label: "App Store rating",
    color: "text-golden",
  },
  {
    value: 100,
    suffix: "%",
    label: "free to download",
    color: "text-sky",
  },
];

export function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const hasTracked = useRef(false);

  useEffect(() => {
    if (isInView && !hasTracked.current) {
      hasTracked.current = true;
      track("stats_bar_viewed", { location: "landing_page" });
    }
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-10 lg:py-14 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/40 via-background to-secondary/40" />
      <div className="absolute inset-0 border-y border-border/30" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 80, damping: 18 }}
              className="flex flex-col items-center text-center gap-1"
            >
              <span className={`text-3xl lg:text-4xl font-bold font-sans tracking-tight ${stat.color}`}>
                <AnimatedStat value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-sm text-muted-foreground leading-snug">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
