import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { track } from "@/lib/analytics";

const steps = [
  {
    number: "01",
    title: "Tell Orbits about your home.",
    description:
      "Add your household members, appliances, routines, and preferences. Takes five minutes. Orbits remembers everything.",
    detail: "Your home profile, your family, your pets — all in one place.",
    color: "bg-lavender",
    accentColor: "text-lavender",
    borderColor: "border-lavender/30",
    bgColor: "bg-lavender/8",
  },
  {
    number: "02",
    title: "Orbits watches. You don't have to.",
    description:
      "It monitors your calendar, tracks inventory, reads your emails, and notices what needs attention — before you do.",
    detail: "Proactive. Silent. Always on.",
    color: "bg-sage",
    accentColor: "text-sage",
    borderColor: "border-sage/30",
    bgColor: "bg-sage/8",
  },
  {
    number: "03",
    title: "It handles the thing.",
    description:
      "Groceries ordered. Service quotes gathered. Calendar updated. Reminder sent. Not a notification — the actual task, done.",
    detail: "Not a reminder. An operator.",
    color: "bg-peach",
    accentColor: "text-peach",
    borderColor: "border-peach/30",
    bgColor: "bg-peach/8",
  },
];

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 70, damping: 18, delay: index * 0.12 }}
      className="relative"
    >
      {/* Connector line between steps (desktop) */}
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-10 left-[calc(100%+1px)] w-full h-px bg-gradient-to-r from-border/60 to-transparent z-0" />
      )}

      <div
        className={`relative p-7 lg:p-8 rounded-[1.75rem] border ${step.borderColor} overflow-hidden h-full`}
        style={{ backgroundColor: `hsl(var(--${step.color.replace("bg-", "")}) / 0.07)` }}
      >
        {/* Corner glow */}
        <div
          className={`absolute -top-8 -right-8 w-28 h-28 ${step.color} rounded-full blur-3xl opacity-30`}
        />

        {/* Step number */}
        <div className={`text-5xl lg:text-6xl font-bold font-sans ${step.accentColor} opacity-20 mb-4 leading-none`}>
          {step.number}
        </div>

        <h3 className="text-xl lg:text-2xl font-sans font-medium tracking-[-0.01em] mb-3 relative z-10">
          {step.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed text-sm lg:text-base mb-4 relative z-10">
          {step.description}
        </p>

        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${step.borderColor} relative z-10`}
          style={{ backgroundColor: `hsl(var(--${step.color.replace("bg-", "")}) / 0.12)` }}
        >
          <span className={`text-xs font-medium ${step.accentColor}`}>{step.detail}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });
  const hasTracked = useRef(false);

  useEffect(() => {
    if (isHeaderInView && !hasTracked.current) {
      hasTracked.current = true;
      track("how_it_works_section_viewed", { location: "landing_page" });
    }
  }, [isHeaderInView]);

  return (
    <section className="relative py-14 lg:py-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute top-0 right-[15%] w-[400px] h-[400px] orb-sky opacity-20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-[10%] w-[350px] h-[350px] orb-sage opacity-20 blur-3xl rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.span
            className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
          >
            ⚡ How it works
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.15 }}
          >
            What Orbits did{" "}
            <span
              style={{
                background: "linear-gradient(90deg, hsl(260 45% 40%), hsl(var(--primary)), hsl(260 45% 40%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              while you slept.
            </span>
          </motion.h2>
          <motion.p
            className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            Orbits isn't an app you open. It's an operator that runs in the background — handling things before you even know they need handling.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 mb-14 lg:mb-16">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* Scenario callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
          className="relative p-7 lg:p-10 rounded-[2rem] border border-border/40 bg-gradient-to-br from-lavender/10 via-background to-peach/10 overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 orb-lavender opacity-25 blur-3xl rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 orb-peach opacity-20 blur-3xl rounded-full" />

          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3">
              A real example
            </p>
            <p className="text-lg lg:text-2xl font-sans font-medium leading-relaxed mb-2">
              "It's snowing this weekend."
            </p>
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
              Orbits already got you three plow quotes. Bake sale Thursday? Groceries are scheduled for Wednesday evening. That's not a feature. That's the whole point.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
