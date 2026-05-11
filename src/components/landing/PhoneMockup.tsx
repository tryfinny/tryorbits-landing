import { motion, useMotionValue, useSpring, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { CheckCircle2, Calendar, RefreshCw, Sun, Star, Smile, PartyPopper, BarChart3, Home, MessageCircle, ChevronLeft, RotateCcw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-device-motion";

interface PhoneMockupProps {
  className?: string;
}

// Notification item component with tap feedback
function NotificationItem({
  icon: Icon,
  title,
  subtitle,
  time,
  color,
  delay,
  isMobile,
}: {
  icon: typeof CheckCircle2;
  title: string;
  subtitle: string;
  time: string;
  color: string;
  delay: number;
  isMobile: boolean;
}) {
  const [isTapped, setIsTapped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 120,
        damping: 14,
      }}
      whileHover={!isMobile ? { scale: 1.02, x: 4 } : undefined}
      whileTap={{ scale: 0.98 }}
      onTouchStart={() => setIsTapped(true)}
      onTouchEnd={() => setIsTapped(false)}
      className="glass rounded-2xl p-3 flex items-center gap-3 cursor-pointer group touch-manipulation relative overflow-hidden"
    >
      {/* Tap ripple */}
      <motion.div
        className="absolute inset-0 bg-primary/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isTapped ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />

      <motion.div
        className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-sm relative z-10`}
        whileTap={{ rotate: [0, -10, 10, 0], scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-xs font-medium text-foreground truncate">{title}</p>
        <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>
      </div>
      <span className="text-[9px] text-muted-foreground/60 shrink-0 relative z-10">{time}</span>
    </motion.div>
  );
}


// AI Card component matching reference design
function AICard({
  children,
  bgColor = "bg-sky/20",
  className = "",
}: {
  children: React.ReactNode;
  bgColor?: string;
  className?: string;
}) {
  return (
    <div className={`${bgColor} rounded-2xl px-3.5 py-2.5 ${className}`}>
      {children}
    </div>
  );
}

// Animated progress bar component - shows full width, animates fill when scrolled
function AnimatedProgressBar({
  percentage,
  delay,
  isInView,
}: {
  percentage: number;
  delay: number;
  isInView: boolean;
}) {
  return (
    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-sage rounded-full"
        initial={{ width: `${percentage}%`, scaleX: 0, originX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ delay, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// Action button component
function ActionButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-lg text-[13px] font-medium flex items-center gap-1.5 ${
        variant === "primary"
          ? "bg-sage/80 text-sage-foreground"
          : "bg-white/60 text-foreground border border-foreground/10"
      }`}
    >
      {children}
    </motion.button>
  );
}

function AnimatedIcon({
  children,
  delay,
  isInView,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  isInView: boolean;
  className?: string;
}) {
  return (
    <motion.span
      className={`inline-flex items-center justify-center ${className}`}
      animate={isInView ? { 
        scale: [1, 1.4, 1],
      } : {}}
      transition={{
        delay,
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.span>
  );
}

const AVATAR_SIZE = 28;

const GROUP_CHAT_MESSAGES = [
  { sender: "Lauren", side: "left" as const, text: "Can you grab Lily from her playdate at 4? Last minute meeting" },
  { sender: "Lauren", side: "left" as const, text: "Also we keep forgetting dog food — can you grab?" },
  { sender: "You", side: "right" as const, text: "Yep I'll get her, address?" },
  { sender: "You", side: "right" as const, text: "And which dog food again?" },
  { sender: "Bit", side: "left" as const, text: "🐶 \"Purina\" added to Grocery\n📅 \"Playdate with Lily\" reassigned to Dad" },
  { sender: "Bit", side: "left" as const, text: "P.S. added a reminder for 3:20PM, Maps shows there might be more traffic than usual." },
];

function BitFaceAvatar({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="44 34 132 132" width={size} height={size} className="shrink-0 rounded-full" style={{ backgroundColor: "#b4e0cb" }}>
      <circle cx={110} cy={100} r={66} fill="#b4e0cb" />
      <ellipse cx={93} cy={89} rx={6} ry={7.5} fill="#071b24" />
      <circle cx={90} cy={86} r={2.5} fill="white" opacity={0.75} />
      <ellipse cx={127} cy={89} rx={6} ry={7.5} fill="#071b24" />
      <circle cx={124} cy={86} r={2.5} fill="white" opacity={0.75} />
      <path d="M100 106Q110 114 120 106" fill="none" stroke="#071b24" strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={76} cy={101} r={8} fill="#f0d8ef" opacity={0.55} />
      <circle cx={144} cy={101} r={8} fill="#f0d8ef" opacity={0.55} />
    </svg>
  );
}

function PersonAvatar({ initials, color, size = 28 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ width: size, height: size, backgroundColor: color }}
    >
      <span className="text-white font-semibold" style={{ fontSize: size * 0.36 }}>{initials}</span>
    </div>
  );
}

function GroupChatScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const totalToShow = GROUP_CHAT_MESSAGES.length;

  useEffect(() => {
    if (visibleCount >= totalToShow) {
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
    const nextMsg = GROUP_CHAT_MESSAGES[visibleCount];
    const isBitNext = nextMsg?.sender === "Bit";
    const delay = visibleCount === 0 ? 500 : isBitNext ? 800 : 600;
    const timer = setTimeout(() => setVisibleCount(c => c + 1), delay);
    return () => clearTimeout(timer);
  }, [visibleCount, onComplete]);

  const nextIsBit = visibleCount < totalToShow && GROUP_CHAT_MESSAGES[visibleCount]?.sender === "Bit";

  return (
    <div className="flex flex-col h-full">
      {/* iOS status bar */}
      <div className="bg-[#F7F7F7] px-5 pt-3 pb-0 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#000]">9:41</span>
        <div className="flex items-center gap-[3px]">
          <svg width="13" height="10" viewBox="0 0 18 12" fill="#000"><rect x="0" y="5" width="3" height="7" rx="0.5"/><rect x="4" y="3.5" width="3" height="8.5" rx="0.5"/><rect x="8" y="1.5" width="3" height="10.5" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
          <svg width="12" height="10" viewBox="0 0 16 12" fill="#000"><path d="M8 3.6a5.8 5.8 0 0 1 4.1 1.7l1.1-1.1A7.6 7.6 0 0 0 8 1.8a7.6 7.6 0 0 0-5.2 2.4l1.1 1.1A5.8 5.8 0 0 1 8 3.6z"/><path d="M8 6.8a3 3 0 0 1 2.1.9l1.1-1.1A4.8 4.8 0 0 0 8 5a4.8 4.8 0 0 0-3.2 1.6l1.1 1.1A3 3 0 0 1 8 6.8z"/><circle cx="8" cy="10" r="1.5"/></svg>
          <svg width="20" height="10" viewBox="0 0 27 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2" stroke="#000" strokeOpacity="0.35"/><rect x="24" y="3.5" width="2" height="5" rx="1" fill="#000" fillOpacity="0.35"/><rect x="2" y="2" width="16" height="8" rx="1" fill="#34C759"/></svg>
        </div>
      </div>

      {/* Nav bar */}
      <div className="bg-[#F7F7F7] border-b border-[#D1D1D6] px-3 pt-0.5 pb-1.5">
        <div className="flex items-center justify-between">
          <ChevronLeft className="w-5 h-5 text-[#007AFF]" />
          <div className="flex flex-col items-center">
            <div className="flex -space-x-1.5 mb-0.5">
              <PersonAvatar initials="L" color="#E8915B" size={20} />
              <div className="w-[20px] h-[20px] rounded-full border-[1.5px] border-[#F7F7F7] overflow-hidden">
                <BitFaceAvatar size={20} />
              </div>
            </div>
            <span className="text-[10px] font-medium text-[#8E8E93]">Family Group Chat</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-white px-2 pt-1.5 pb-1 overflow-hidden">
        <div className="flex-1 flex flex-col gap-[3px]">
          {GROUP_CHAT_MESSAGES.slice(0, visibleCount).map((msg, i) => {
            const isBit = msg.sender === "Bit";
            const isRight = msg.side === "right";
            const prevMsg = i > 0 ? GROUP_CHAT_MESSAGES[i - 1] : null;
            const senderChanged = prevMsg?.sender !== msg.sender;
            const nextMsg = i < totalToShow - 1 ? GROUP_CHAT_MESSAGES[i + 1] : null;
            const isLastInGroup = !nextMsg || nextMsg.sender !== msg.sender;
            const showAvatar = !isRight && isLastInGroup;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={senderChanged && i > 0 ? "mt-2" : ""}
              >
                {senderChanged && !isRight && (
                  <p className="text-[10px] text-[#8E8E93] mb-[2px] ml-9">{msg.sender}</p>
                )}
                <div className={`flex items-end gap-1.5 ${isRight ? "justify-end" : "justify-start"}`}>
                  {!isRight && showAvatar && (
                    isBit ? <BitFaceAvatar size={AVATAR_SIZE} /> : <PersonAvatar initials="L" color="#E8915B" size={AVATAR_SIZE} />
                  )}
                  {!isRight && !showAvatar && <div style={{ width: AVATAR_SIZE }} />}
                  <div
                    className="px-3 py-[6px]"
                    style={{
                      backgroundColor: isRight ? "#007AFF" : "#E9E9EB",
                      borderRadius: isRight
                        ? (isLastInGroup ? "18px 18px 4px 18px" : "18px")
                        : (isLastInGroup ? "18px 18px 18px 4px" : "18px"),
                      maxWidth: "75%",
                      lineHeight: "15px",
                    }}
                  >
                    <span className={`text-[13px] ${isRight ? "text-white" : "text-[#000]"}`} style={{ whiteSpace: "pre-line" }}>
                      {msg.text}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {visibleCount > 0 && visibleCount < totalToShow && nextIsBit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2"
            >
              <p className="text-[10px] text-[#8E8E93] mb-[2px] ml-9">Bit</p>
              <div className="flex items-end gap-1.5 justify-start">
                <BitFaceAvatar size={AVATAR_SIZE} />
                <div
                  className="px-3 py-[7px] flex items-center gap-1"
                  style={{ backgroundColor: "#E9E9EB", borderRadius: "18px 18px 18px 4px" }}
                >
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-[5px] h-[5px] rounded-full bg-[#8E8E93]" />
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="w-[5px] h-[5px] rounded-full bg-[#8E8E93]" />
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} className="w-[5px] h-[5px] rounded-full bg-[#8E8E93]" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="bg-[#F7F7F7] border-t border-[#D1D1D6] px-2.5 py-1.5 flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#8E8E93]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </div>
        <div className="flex-1 bg-white rounded-full border border-[#C6C6C8] px-3 py-1">
          <span className="text-[12px] text-[#8E8E93]">iMessage</span>
        </div>
      </div>
    </div>
  );
}

function DashboardScreen({ isInView }: { isInView: boolean }) {
  return (
    <div className="pt-0 pb-3 px-4 sm:px-5 h-full overflow-hidden">
      {/* iOS status bar */}
      <div className="px-1 pt-3 pb-1 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#1a1a1a]">9:41</span>
        <div className="flex items-center gap-[3px]">
          <svg width="13" height="10" viewBox="0 0 18 12" fill="#1a1a1a"><rect x="0" y="5" width="3" height="7" rx="0.5"/><rect x="4" y="3.5" width="3" height="8.5" rx="0.5"/><rect x="8" y="1.5" width="3" height="10.5" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
          <svg width="12" height="10" viewBox="0 0 16 12" fill="#1a1a1a"><path d="M8 3.6a5.8 5.8 0 0 1 4.1 1.7l1.1-1.1A7.6 7.6 0 0 0 8 1.8a7.6 7.6 0 0 0-5.2 2.4l1.1 1.1A5.8 5.8 0 0 1 8 3.6z"/><path d="M8 6.8a3 3 0 0 1 2.1.9l1.1-1.1A4.8 4.8 0 0 0 8 5a4.8 4.8 0 0 0-3.2 1.6l1.1 1.1A3 3 0 0 1 8 6.8z"/><circle cx="8" cy="10" r="1.5"/></svg>
          <svg width="20" height="10" viewBox="0 0 27 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2" stroke="#1a1a1a" strokeOpacity="0.35"/><rect x="24" y="3.5" width="2" height="5" rx="1" fill="#1a1a1a" fillOpacity="0.35"/><rect x="2" y="2" width="16" height="8" rx="1" fill="#4a7c6f"/></svg>
        </div>
      </div>
      {/* Header with date and weather */}
      <div className="mb-2 ml-1">
        <h3 className="text-lg sm:text-xl font-serif font-medium text-[#1a1a1a] mb-0.5 whitespace-nowrap">
          Good morning, Ellie
        </h3>
        <p className="text-xs text-[#6b6b6b] whitespace-nowrap">
          Tuesday, April 9 · <span className="text-golden inline-flex items-center gap-0.5"><Sun className="w-3 h-3" /> 72°</span>
        </p>
      </div>

      {/* Calendar sync card */}
      <AICard
        bgColor="bg-gradient-to-br from-sky/30 to-sky/15 border border-sky/20"
        className="mb-2"
      >
        <div className="flex items-center gap-2 mb-2">
          <AnimatedIcon delay={0.3} isInView={isInView}><Calendar className="w-5 h-5 text-[#2a7d9c]" /></AnimatedIcon>
          <span className="text-[13px] font-sans font-medium text-[#1a1a1a] whitespace-nowrap">
            Family Calendar
          </span>
          <motion.div
            className="ml-auto"
            animate={isInView ? { rotate: 360 } : { rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            <RefreshCw className="w-3.5 h-3.5 text-sage" />
          </motion.div>
        </div>

        {/* Single row calendar with icon markers */}
        <div className="bg-white/60 rounded-2xl px-3 py-2 mb-2">
          <div className="flex justify-between text-[9px] text-[#999] mb-1.5">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#555] w-4 text-center">8</span>
            <AnimatedIcon delay={0.5} isInView={isInView}><Star className="w-3.5 h-3.5 text-[#b8860b] fill-[#daa520]" /></AnimatedIcon>
            <AnimatedIcon delay={0.6} isInView={isInView}><Smile className="w-3.5 h-3.5 text-[#c47a4a]" /></AnimatedIcon>
            <motion.span
              className="bg-peach/60 rounded-full w-6 h-6 flex items-center justify-center"
              animate={isInView ? { scale: [1, 1.5, 1] } : {}}
              transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
            >
              <PartyPopper className="w-3.5 h-3.5 text-[#c47a4a]" />
            </motion.span>
            <span className="text-[#555] w-4 text-center">12</span>
            <span className="text-[#555] w-4 text-center">13</span>
            <span className="text-[#555] w-4 text-center">14</span>
          </div>
        </div>

        {/* Event item */}
        <div className="flex items-center gap-2.5 bg-white/60 rounded-2xl px-3 py-2">
          <AnimatedIcon delay={0.8} isInView={isInView}><PartyPopper className="w-5 h-5 text-[#c47a4a]" /></AnimatedIcon>
          <div>
            <p className="text-[12px] font-medium text-[#2a2a2a]">Birthday Party (Lily)</p>
            <p className="text-[10px] text-[#6a6a6a]">3:00 PM</p>
          </div>
        </div>
      </AICard>

      {/* Progress tracker card */}
      <AICard
        bgColor="bg-gradient-to-br from-lavender/50 to-lavender/30 border border-lavender/40"
        className="mb-2"
      >
        <div className="flex items-center gap-2 mb-2">
          <AnimatedIcon delay={0.5} isInView={isInView}><BarChart3 className="w-5 h-5 text-[#6b5b95]" /></AnimatedIcon>
          <span className="text-[13px] font-sans font-medium text-[#1a1a1a]">Progress Tracker</span>
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[11px] font-medium text-[#2a2a2a]">Grocery List</span>
              <span className="text-[10px] text-[#6a6a6a]">60%</span>
            </div>
            <AnimatedProgressBar percentage={60} delay={0.7} isInView={isInView} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[11px] font-medium text-[#2a2a2a]">School Supplies</span>
              <span className="text-[10px] text-[#6a6a6a]">10%</span>
            </div>
            <AnimatedProgressBar percentage={10} delay={0.8} isInView={isInView} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[11px] font-medium text-[#2a2a2a]">Chores</span>
              <span className="text-[10px] text-[#6a6a6a]">75%</span>
            </div>
            <AnimatedProgressBar percentage={75} delay={0.9} isInView={isInView} />
          </div>
        </div>
      </AICard>

      {/* Auto-scheduled maintenance card */}
      <div className="relative">
        <AICard
          bgColor="bg-gradient-to-br from-sage/30 to-sage/15 border border-sage/20"
          className="mb-2"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <AnimatedIcon delay={0.7} isInView={isInView}><Home className="w-5 h-5 text-[#4a7c6f]" /></AnimatedIcon>
            <span className="text-[13px] font-sans font-medium text-[#1a1a1a]">HVAC Service Booked</span>
          </div>
          <p className="text-[13px] text-[#3a3a3a] leading-relaxed mb-2">
            Filter replacement due. AirFlow Pro booked for Tuesday 9AM.
          </p>
          <div className="flex gap-2">
            <ActionButton variant="primary">Confirm</ActionButton>
            <ActionButton variant="secondary">Reschedule</ActionButton>
          </div>
        </AICard>
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9F3E9] via-[#F9F3E9]/70 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export function PhoneMockup({ className }: PhoneMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const isMobile = useIsMobile();
  const isInView = useInView(bottomRef, { once: true, margin: "0px" });

  // Always call all hooks unconditionally (React rules of hooks)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Always create transforms and springs, but values stay at 0 on mobile since mouseX/mouseY never update
  const rotateXTransform = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const rotateYTransform = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);
  const rotateX = useSpring(rotateXTransform, { stiffness: 150, damping: 20, mass: 0.5 });
  const rotateY = useSpring(rotateYTransform, { stiffness: 150, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsActive(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={!isMobile ? handleMouseMove : undefined}
      onMouseEnter={!isMobile ? () => setIsActive(true) : undefined}
      onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      style={!isMobile ? { perspective: "1200px" } : undefined}
    >
      {/* Phone frame with 3D tilt - static on mobile */}
      <motion.div style={!isMobile ? { rotateX, rotateY } : undefined} className="relative mx-auto w-[290px]">
        {/* Glow effect behind phone - static on mobile */}
        <div
          className="absolute inset-0 rounded-[3rem] blur-3xl opacity-30"
          style={{
            background: "linear-gradient(135deg, hsl(var(--lavender)) 0%, hsl(var(--peach)) 50%, hsl(var(--sky)) 100%)",
          }}
        />

        {/* Phone body - static shadow on mobile */}
        <div
          className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[3rem] p-2.5 sm:p-3 shadow-2xl touch-manipulation"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4), 0 12px 24px -12px rgba(0,0,0,0.3)"
          }}
        >
          {/* Side buttons */}
          <div className="absolute -left-[3px] top-28 w-[3px] h-8 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[3px] top-44 w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[3px] top-60 w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -right-[3px] top-36 w-[3px] h-16 bg-[#2a2a2a] rounded-r-sm" />

          {/* Screen - force light mode */}
          <div className="relative rounded-[2.5rem] overflow-hidden h-[560px] sm:h-[570px]" style={{ backgroundColor: showDashboard ? "#F9F3E9" : "#FFFFFF" }}>
            <AnimatePresence mode="wait">
              {!showDashboard ? (
                <motion.div
                  key={`chat-${chatKey}`}
                  className="h-full flex flex-col"
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3, ease: "easeIn" }}
                >
                  <GroupChatScreen onComplete={() => setShowDashboard(true)} />
                </motion.div>
              ) : (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <DashboardScreen isInView={showDashboard} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Replay button — where the home indicator was */}
            <AnimatePresence>
              {showDashboard && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => { setShowDashboard(false); setChatKey(k => k + 1); }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-7 h-7 rounded-full bg-[#C7C7CC]/70 hover:bg-[#C7C7CC]/80 cursor-pointer transition-colors"
                >
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-[#1a1a1a]/40"
                    animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.div
                    animate={{ rotate: [0, -360, -720] }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#1a1a1a]/60" />
                  </motion.div>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Ref to detect when bottom of phone is visible */}
            <div ref={bottomRef} className="absolute bottom-0 left-0 w-full h-1" />
          </div>
        </div>

        {/* Reflection effect - static on mobile */}
        <div
          className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 w-[90%] h-16 sm:h-20 rounded-full blur-2xl opacity-30"
          style={{
            background: "linear-gradient(to bottom, hsl(var(--primary) / 0.15), transparent)",
          }}
        />
      </motion.div>

      {/* Ambient floating particles - desktop only */}
      {!isMobile &&
        [...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              background: `hsl(var(--${["lavender", "peach", "sky", "sage"][i]}) / 0.4)`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
}
