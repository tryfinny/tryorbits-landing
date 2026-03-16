import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

export function AiCalloutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-12 lg:py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-secondary/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] orb-golden opacity-10 blur-3xl rounded-full" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.05, type: "spring", stiffness: 100, damping: 15 }}
          className="mb-6"
        >
          <Quote className="w-10 h-10 lg:w-12 lg:h-12 text-primary/20 mx-auto" />
        </motion.div>
        <motion.p
          className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-medium tracking-[-0.01em] leading-snug text-foreground/80"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 80, damping: 18 }}
        >
          "Most apps give you a blank text box{" "}
          <span className="text-muted-foreground">
            and wish you luck.
          </span>{" "}
          Orbits does the work.{" "}
          <span className="text-gradient">
            You just say yes."
          </span>
        </motion.p>
        <motion.p
          className="text-base lg:text-lg text-muted-foreground mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 18 }}
        >
          — Taylor, mom of 2
        </motion.p>
      </motion.div>
    </section>
  );
}
