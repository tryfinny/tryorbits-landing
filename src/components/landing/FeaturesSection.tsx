import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-device-motion";

const features = [
  {
    emoji: "📅",
    title: "Household Calendar",
    description: "One family calendar. Zero confusion. See everyone's schedule, spot conflicts instantly, and stop the endless group texts.",
    color: "bg-sage",
    gradient: "from-sage/20 to-sky/10",
    iconBg: "bg-sage/20",
    bgOpacity: 0.18,
  },
  {
    emoji: "🏠",
    title: "Home Maintenance",
    description: "Never forget an oil change or filter swap again. Add your stuff, Orbits handles the reminders and even gets you quotes.",
    color: "bg-sky",
    gradient: "from-sky/20 to-sage/10",
    iconBg: "bg-sky/20",
    bgOpacity: 0.28,
  },
  {
    emoji: "✅",
    title: "The Basics",
    description: "Toss the whiteboard. Lists, tasks, reminders, docs — everything you need, finally in one place.",
    color: "bg-lavender",
    gradient: "from-lavender/20 to-peach/10",
    iconBg: "bg-lavender/20",
    bgOpacity: 0.28,
  },
  {
    emoji: "✉️",
    title: "Email Handling",
    description: "Dance class moved? Calendar updates itself. Dentist reminder? Orbits drafts your reply. You just hit send.",
    color: "bg-peach",
    gradient: "from-peach/20 to-lavender/10",
    iconBg: "bg-peach/20",
    bgOpacity: 0.45,
    comingSoon: true,
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

interface Feature {
  emoji: string;
  title: string;
  description: string;
  color: string;
  gradient: string;
  iconBg: string;
  bgOpacity: number;
  comingSoon?: boolean;
}

function FeatureCard({
  feature,
  index,
  isMobile,
}: {
  feature: Feature;
  index: number;
  isMobile: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isActive, setIsActive] = useState(false);

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
          className={`relative p-6 lg:p-10 rounded-[2rem] border border-border/50 h-full overflow-hidden`}
          style={{ 
            backgroundColor: `hsl(var(--${feature.color.replace("bg-", "")}) / ${feature.bgOpacity})`,
          }}
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
          {/* Top accent glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(ellipse at 80% 0%, hsl(var(--${feature.color.replace("bg-", "")})) 0%, transparent 50%)`,
            }}
            animate={isActive ? { scale: 1.2, opacity: 0.35 } : { scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Bottom fill for consistent visibility */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, hsl(var(--${feature.color.replace("bg-", "")}) / 0.15) 0%, transparent 50%)`,
            }}
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

          {/* Header row: Icon + Title inline */}
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <motion.div
              animate={
                isActive
                  ? { scale: 1.08 }
                  : { scale: 1 }
              }
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center relative border border-border/40`}
                style={{
                  backgroundColor: `hsl(var(--${feature.color.replace("bg-", "")}) / 0.25)`,
                }}
                animate={
                  isActive
                    ? {
                        boxShadow: `0 10px 20px -8px hsl(var(--${feature.color.replace("bg-", "")}) / 0.4)`,
                      }
                    : {
                        boxShadow: `0 4px 12px -4px hsl(var(--${feature.color.replace("bg-", "")}) / 0.2)`,
                      }
                }
              >
                {/* Icon glow */}
                <motion.div
                  className={`absolute inset-0 rounded-xl ${feature.color} blur-xl`}
                  animate={isActive ? { opacity: 0.5, scale: 1.3 } : { opacity: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                />
                <span className="text-xl lg:text-2xl relative z-10">{feature.emoji}</span>
              </motion.div>
            </motion.div>

            <motion.h3
              className="text-xl lg:text-2xl font-sans font-medium tracking-[-0.01em] relative z-10"
              animate={isActive ? { x: isMobile ? 0 : 4 } : { x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {feature.title}
            </motion.h3>

            {/* Coming Soon chip */}
            {feature.comingSoon && (
              <span className="ml-auto px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider bg-foreground/70 text-background border border-foreground/20 rounded-full relative z-10">
                Coming Soon
              </span>
            )}
          </div>

          {/* Description */}
          <motion.p
            className="text-muted-foreground leading-relaxed relative z-10 text-sm lg:text-lg"
            animate={isActive ? { x: isMobile ? 0 : 4 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.02 }}
          >
            {feature.description}
          </motion.p>

          {/* Rippling corner dot - hidden for coming soon cards */}
          {!feature.comingSoon && (
            <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center">
              {/* Ripple rings */}
              <motion.div
                className={`absolute w-3 h-3 rounded-full border-2`}
                style={{ borderColor: `hsl(var(--${feature.color.replace("bg-", "")}))` }}
                animate={{ 
                  scale: [1, 2.5],
                  opacity: [0.6, 0],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeOut",
                }}
              />
              <motion.div
                className={`absolute w-3 h-3 rounded-full border-2`}
                style={{ borderColor: `hsl(var(--${feature.color.replace("bg-", "")}))` }}
                animate={{ 
                  scale: [1, 2.5],
                  opacity: [0.6, 0],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeOut",
                  delay: 0.5,
                }}
              />
              {/* Center dot */}
              <div 
                className={`w-2.5 h-2.5 rounded-full ${feature.color} relative z-10`}
              />
            </div>
          )}
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
            </motion.span>{" "}
            every week.
          </motion.h2>
          <motion.p
            className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            Spend less time managing your home and more time enjoying it.
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
