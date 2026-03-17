import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Wrench, User, type LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-device-motion";

const orbits = [
  {
    icon: Users,
    title: "Family",
    description:
      "Shared calendars, pet info, and family schedules — everyone stays on the same page without the endless group chat.",
    color: "peach",
    gradient: "from-peach/20 to-lavender/10",
  },
  {
    icon: Wrench,
    title: "Upkeep",
    description:
      "Keep track of your home, your car, your appliances. Orbits remembers the maintenance so you don't have to.",
    color: "sky",
    gradient: "from-sky/20 to-sage/10",
  },
  {
    icon: User,
    title: "You",
    description:
      "Your own corner for lists, reminders, and notes. A little breathing room just for you.",
    color: "lavender",
    gradient: "from-lavender/20 to-sky/10",
  },
];

export function HowItWorksSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });
  const isMobile = useIsMobile();

  return (
    <section className="relative pt-8 pb-12 lg:pt-12 lg:pb-16 px-6 overflow-hidden">
      <div className="absolute top-0 left-[15%] w-[350px] lg:w-[450px] h-[350px] lg:h-[450px] orb-sage opacity-20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-[10%] w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] orb-peach opacity-20 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-10 lg:mb-14"
        >
          <motion.span
            className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
          >
            How it all comes together
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-6xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.15 }}
          >
            Spaces for{" "}
            <motion.span
              className="underline-reveal"
              style={{ "--underline-delay": "0.7s" } as React.CSSProperties}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 12 }}
            >
              <motion.span
                className="relative z-10"
                initial={{ backgroundPosition: "100% 50%" }}
                animate={isHeaderInView ? { backgroundPosition: "0% 50%" } : { backgroundPosition: "100% 50%" }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                    background: "linear-gradient(90deg, hsl(170 30% 35%), hsl(var(--primary)), hsl(170 30% 35%))",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                every
              </motion.span>
            </motion.span>{" "}
            part of home
          </motion.h2>
          <motion.p
            className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            Everything your household needs, all in one place — no more bouncing between apps.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
          {orbits.map((orbit, index) => (
            <OrbitCard key={orbit.title} orbit={orbit} index={index} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OrbitCard({
  orbit,
  index,
  isMobile,
}: {
  orbit: (typeof orbits)[number];
  index: number;
  isMobile: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 18,
        delay: index * 0.12,
      }}
    >
      <motion.div
        className="relative p-8 lg:p-10 rounded-[2rem] border border-border/50 h-full overflow-hidden text-center"
        style={{
          backgroundColor: `hsl(var(--${orbit.color}) / 0.15)`,
        }}
        whileHover={
          !isMobile
            ? {
                y: -6,
                boxShadow: "0 30px 60px -20px hsl(var(--primary) / 0.12)",
              }
            : undefined
        }
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 0%, hsl(var(--${orbit.color})) 0%, transparent 60%)`,
            opacity: 0.15,
          }}
        />

        <motion.div
          className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-border/40`}
          style={{
            backgroundColor: `hsl(var(--${orbit.color}) / 0.25)`,
          }}
        >
          {(() => { const Icon = orbit.icon; return <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-foreground/70" />; })()}
        </motion.div>

        <h3 className="text-2xl lg:text-3xl font-medium tracking-[-0.01em] mb-3 relative z-10">
          {orbit.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed relative z-10 text-base lg:text-lg">
          {orbit.description}
        </p>

        <motion.div
          className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${orbit.color} rounded-full blur-3xl opacity-20`}
        />
      </motion.div>
    </motion.div>
  );
}
