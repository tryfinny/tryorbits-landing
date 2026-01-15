import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Home, Users, Wallet, Bell } from "lucide-react";
import { useIsMobile } from "@/hooks/use-device-motion";

const features = [
  {
    icon: Home,
    title: "Home Management",
    description: "Track maintenance, manage supplies, and keep your household running smoothly.",
    color: "bg-sage",
    gradient: "from-sage/20 to-sky/10",
    iconBg: "bg-sage/20",
    accentColor: "text-sage-foreground",
  },
  {
    icon: Users,
    title: "Family Calendar",
    description: "Coordinate schedules, activities, and events for everyone in your family.",
    color: "bg-peach",
    gradient: "from-peach/20 to-lavender/10",
    iconBg: "bg-peach/20",
    accentColor: "text-peach-foreground",
  },
  {
    icon: Wallet,
    title: "Smart Budgeting",
    description: "Monitor spending, track bills, and gain insights into your family finances.",
    color: "bg-sky",
    gradient: "from-sky/20 to-sage/10",
    iconBg: "bg-sky/20",
    accentColor: "text-sky-foreground",
  },
  {
    icon: Bell,
    title: "Intelligent Alerts",
    description: "Get timely reminders and proactive suggestions tailored to your routine.",
    color: "bg-lavender",
    gradient: "from-lavender/20 to-peach/10",
    iconBg: "bg-lavender/20",
    accentColor: "text-lavender-foreground",
  },
];

// 3D Tilt Card Component with mobile tap support
function TiltCard({
  children,
  className,
  isMobile,
}: {
  children: React.ReactNode;
  className?: string;
  isMobile: boolean;
}) {
  const [transform, setTransform] = useState("");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isTapped, setIsTapped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const tiltX = (y - 0.5) * 15;
    const tiltY = (x - 0.5) * -15;

    setTransform(`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  // Mobile touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || !ref.current) return;
    setIsTapped(true);
    const rect = ref.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    setGlare({ x: x * 100, y: y * 100, opacity: 0.25 });
  };

  const handleTouchEnd = () => {
    setIsTapped(false);
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      animate={isMobile ? { scale: isTapped ? 0.98 : 1 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative transition-transform duration-300 ease-out touch-manipulation ${className}`}
      style={{ transform: isMobile ? undefined : transform, transformStyle: "preserve-3d" }}
    >
      {/* Glare/tap ripple effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, white ${0}%, transparent 60%)`,
          opacity: glare.opacity,
        }}
      />
      {children}
    </motion.div>
  );
}

function FeatureCard({
  feature,
  index,
  isMobile,
}: {
  feature: (typeof features)[0];
  index: number;
  isMobile: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isActive, setIsActive] = useState(false);
  const Icon = feature.icon;

  // On mobile, use tap instead of hover
  const handleInteractionStart = () => setIsActive(true);
  const handleInteractionEnd = () => setIsActive(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 18,
        delay: index * 0.1,
      }}
      onHoverStart={!isMobile ? handleInteractionStart : undefined}
      onHoverEnd={!isMobile ? handleInteractionEnd : undefined}
      onTouchStart={isMobile ? handleInteractionStart : undefined}
      onTouchEnd={isMobile ? handleInteractionEnd : undefined}
      className="group"
    >
      <TiltCard isMobile={isMobile}>
        <motion.div
          className={`relative p-6 lg:p-10 bg-gradient-to-br ${feature.gradient} rounded-[2rem] border border-border/30 h-full overflow-hidden backdrop-blur-sm`}
          animate={
            isActive
              ? {
                  boxShadow: "0 30px 60px -20px hsl(var(--primary) / 0.15)",
                }
              : {
                  boxShadow: "0 10px 40px -20px hsl(var(--primary) / 0.05)",
                }
          }
          transition={{ duration: 0.3 }}
        >
          {/* Animated background pattern */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 70% 30%, hsl(var(--${feature.color.replace("bg-", "")})) 0%, transparent 50%)`,
            }}
            animate={isActive ? { scale: 1.2, opacity: 0.4 } : { scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.4 }}
          />

          {/* Shimmer effect - continuous on mobile */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
            initial={{ x: "-200%", opacity: 0 }}
            animate={
              isMobile
                ? { x: ["−200%", "200%"], opacity: [0, 1, 0] }
                : isActive
                  ? { x: "200%", opacity: 1 }
                  : { x: "-200%", opacity: 0 }
            }
            transition={
              isMobile
                ? { duration: 3, repeat: Infinity, repeatDelay: 2 + index * 0.5, ease: "easeInOut" }
                : { duration: 0.6, ease: "easeInOut" }
            }
          />

          {/* Floating corner accent */}
          <motion.div
            className={`absolute -top-10 -right-10 w-32 h-32 ${feature.color} rounded-full blur-3xl`}
            animate={isActive ? { scale: 1.5, opacity: 0.6 } : { scale: 1, opacity: 0.3 }}
            transition={{ duration: 0.4 }}
          />

          {/* Icon with pop effect */}
          <motion.div
            animate={
              isActive
                ? {
                    y: -6,
                    scale: 1.08,
                  }
                : {
                    y: 0,
                    scale: 1,
                  }
            }
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-10 mb-5"
          >
            <motion.div
              className={`w-14 h-14 lg:w-20 lg:h-20 rounded-2xl ${feature.iconBg} flex items-center justify-center relative`}
              animate={
                isActive
                  ? {
                      boxShadow: `0 15px 30px -10px hsl(var(--${feature.color.replace("bg-", "")}) / 0.4)`,
                    }
                  : {
                      boxShadow: "none",
                    }
              }
            >
              {/* Icon glow */}
              <motion.div
                className={`absolute inset-0 rounded-2xl ${feature.color} blur-xl`}
                animate={isActive ? { opacity: 0.5, scale: 1.3 } : { opacity: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
              />
              <Icon className={`w-7 h-7 lg:w-10 lg:h-10 ${feature.accentColor} relative z-10`} />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.h3
            className="text-xl lg:text-2xl font-heading font-medium tracking-[-0.01em] mb-3 relative z-10"
            animate={isActive ? { x: isMobile ? 0 : 6 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {feature.title}
          </motion.h3>
          <motion.p
            className="text-muted-foreground leading-relaxed relative z-10 text-sm lg:text-lg"
            animate={isActive ? { x: isMobile ? 0 : 6 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.02 }}
          >
            {feature.description}
          </motion.p>

          {/* Interactive corner detail */}
          <motion.div
            className="absolute bottom-4 right-4 w-8 h-8 rounded-full border-2 border-muted/30 flex items-center justify-center"
            animate={
              isActive
                ? {
                    scale: 1.2,
                    borderColor: `hsl(var(--${feature.color.replace("bg-", "")}))`,
                    rotate: 90,
                  }
                : {
                    scale: 1,
                    rotate: 0,
                  }
            }
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.div
              className={`w-2 h-2 rounded-full ${feature.color}`}
              animate={isActive ? { scale: 1.5 } : { scale: 1 }}
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
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const backgroundY1 = useTransform(smoothProgress, [0, 1], [100, -100]);
  const backgroundY2 = useTransform(smoothProgress, [0, 1], [-50, 50]);
  const backgroundRotate = useTransform(smoothProgress, [0, 1], [0, 45]);

  return (
    <section ref={containerRef} className="relative pt-12 pb-12 lg:pt-16 lg:pb-16 px-6 overflow-hidden">
      {/* Parallax background orbs */}
      <motion.div
        className="absolute top-0 right-[10%] w-[400px] lg:w-[500px] h-[400px] lg:h-[500px] orb-lavender opacity-30"
        style={{ y: backgroundY1, rotate: backgroundRotate }}
      />
      <motion.div
        className="absolute bottom-0 left-[5%] w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] orb-peach opacity-25"
        style={{ y: backgroundY2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[800px] h-[600px] lg:h-[800px] orb-sky opacity-15"
        style={{ rotate: useTransform(smoothProgress, [0, 1], [0, -30]) }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16 lg:mb-28"
        >
          <motion.span
            className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
          >
            ✨ Features
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-6xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.15 }}
          >
            Features to help you save{" "}
            <motion.span
              className="relative inline-block"
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
                  background: "linear-gradient(90deg, hsl(260 45% 40%), hsl(var(--primary)), hsl(260 45% 40%))",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                hours
              </motion.span>
              {/* Underline animation */}
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary via-lavender to-primary rounded-full origin-left"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={isHeaderInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
              {/* Sparkle effect - one time */}
              <motion.span
                className="absolute -top-1 -right-2 w-2 h-2 bg-golden rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={isHeaderInView ? { scale: [0, 1.5, 1], opacity: [0, 1, 0.8] } : { scale: 0, opacity: 0 }}
                transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
              />
            </motion.span>
            every week.
          </motion.h2>
          <motion.p
            className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            Powerful features designed to simplify your life and amplify your productivity.
          </motion.p>
        </motion.div>

        {/* Features grid - single column on mobile for better touch targets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              style={
                !isMobile
                  ? {
                      marginTop: index % 2 === 1 ? "3rem" : "0",
                    }
                  : undefined
              }
            >
              <FeatureCard feature={feature} index={index} isMobile={isMobile} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
