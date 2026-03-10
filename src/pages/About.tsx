import { motion, useInView } from 'framer-motion';
import { ArrowLeft, Sparkles, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { AppStoreButtons } from '@/components/landing/AppStoreButtons';

function StorySection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ type: 'spring', stiffness: 60, damping: 18, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const ORBIT_ICONS = [
  { emoji: '📅', label: 'Calendar', bg: 'hsl(260 30% 88%)' },
  { emoji: '🛒', label: 'Grocery', bg: 'hsl(25 60% 90%)' },
  { emoji: '🏠', label: 'Home', bg: 'hsl(200 40% 85%)' },
  { emoji: '✅', label: 'Tasks', bg: 'hsl(170 25% 70% / 0.5)' },
];

const BASE_ANGLES = [0, 1, 2, 3].map(
  (i) => (i * Math.PI * 2) / 4 - Math.PI / 2
);

const CIRCLE_RADIUS = 120;
const ORBIT_DURATION = 3;
const PULL_DURATION = 1;

function OrbitingMergeAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [phase, setPhase] = useState<'orbit' | 'pull' | 'logo'>('orbit');
  const [orbitAngle, setOrbitAngle] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let frame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      if (elapsed < ORBIT_DURATION) {
        setOrbitAngle((elapsed / ORBIT_DURATION) * Math.PI * 2 * 0.35);
        setPhase('orbit');
      } else if (elapsed < ORBIT_DURATION + PULL_DURATION) {
        setPhase('pull');
      } else {
        setPhase('logo');
        return;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView]);

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center"
      style={{ width: 320, height: 420, margin: '0 auto' }}
    >
      {ORBIT_ICONS.map((icon, i) => {
        const currentAngle = BASE_ANGLES[i] + orbitAngle;
        const orbitX = Math.cos(currentAngle) * CIRCLE_RADIUS;
        const orbitY = Math.sin(currentAngle) * CIRCLE_RADIUS;

        const x = phase === 'orbit' ? orbitX : 0;
        const y = phase === 'orbit' ? orbitY : 0;
        const scale = phase === 'logo' ? 0 : phase === 'pull' ? 0.5 : 1;
        const opacity = phase === 'logo' ? 0 : 1;

        return (
          <motion.div
            key={i}
            className="absolute flex flex-col items-center justify-center rounded-2xl border border-border/30"
            style={{
              width: 80,
              height: 80,
              backgroundColor: icon.bg,
              left: '50%',
              top: '50%',
              marginLeft: -40,
              marginTop: -40,
            }}
            animate={{ x, y, scale, opacity }}
            transition={{
              type: phase === 'orbit' ? 'tween' : 'spring',
              duration: phase === 'orbit' ? 0 : 0.8,
              stiffness: 80,
              damping: 15,
            }}
          >
            <span className="text-2xl">{icon.emoji}</span>
            <span className="text-[9px] font-medium text-foreground/70 mt-0.5">
              {icon.label}
            </span>
          </motion.div>
        );
      })}

      {/* Orbits logo - appears after merge */}
      <motion.div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: -60,
          marginTop: -45,
        }}
        initial={{ opacity: 0, scale: 0.5, rotateY: 0 }}
        animate={
          phase === 'logo'
            ? { opacity: 1, scale: 1, rotateY: 360 }
            : { opacity: 0, scale: 0.5, rotateY: 0 }
        }
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <svg
          width="120"
          height="90"
          viewBox="0 0 650 463.85"
          aria-label="Orbits"
        >
          <defs>
            <linearGradient
              id="orbit-logo-gradient"
              x1="205.67"
              y1="40.98"
              x2="427.87"
              y2="423.34"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#bde5d2" />
              <stop offset="0.34" stopColor="#c6dad6" />
              <stop offset="0.92" stopColor="#e0bfe2" />
              <stop offset="1" stopColor="#e5bbe4" />
            </linearGradient>
          </defs>
          <path
            fill="url(#orbit-logo-gradient)"
            d="M548.23,219.71c4.36,84.26-37.57,167.93-115.66,213.02-78.12,45.1-171.56,39.63-242.36-6.35,56.84-19.57,121.81-49.36,188.09-87.63,66.28-38.27,124.51-79.61,169.93-119.03ZM200.69,31.11C89.78,95.14,51.78,236.95,115.81,347.86c8.47,14.66,18.27,28.03,29.18,40.07,56.76-19.84,129.75-55.7,205.61-102.88,75.13-46.73,139.06-95.85,181.97-137.7-4.21-10.66-9.24-21.14-15.14-31.36C453.41,5.07,311.59-32.93,200.69,31.11Z"
          />
          <path
            fill="#95b6c6"
            d="M645.55,61.38c18.42,31.9-21.51,92.42-97.34,158.31l.02.03c-45.41,39.42-103.64,80.76-169.93,119.03-66.28,38.27-131.26,68.06-188.09,87.63-94.97,32.73-167.35,37.04-185.76,5.14-16.64-28.82,14.41-81.06,76.55-139.49,1.28,9.99,3.32,19.92,6.19,29.64-32.48,33.29-47.71,60.68-38.93,75.89,20.13,34.87,158.67-7.46,309.44-94.5,150.77-87.04,256.69-185.86,236.56-220.73-8.76-15.18-40.1-15.69-85.17-4.2-7.01-7.33-14.56-14.08-22.61-20.19,81.67-24.59,142.44-25.36,159.08,3.46Z"
          />
        </svg>
      </motion.div>

      {/* "Welcome to Orbits." text - fades up after logo lands */}
      <motion.p
        className="absolute inset-x-0 bottom-0 text-center font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground tracking-[-0.01em]"
        initial={{ opacity: 0, y: 16 }}
        animate={phase === 'logo' ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
      >
        Welcome to Orbits.
      </motion.p>
    </div>
  );
}

function OldWaysIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full max-w-md mx-auto">
      {/* Background */}
      <rect x="40" y="20" width="320" height="260" rx="20" fill="hsl(25 60% 90% / 0.3)" />

      {/* Whiteboard */}
      <rect x="70" y="40" width="120" height="90" rx="6" fill="white" stroke="hsl(35 25% 82%)" strokeWidth="2" />
      <line x1="85" y1="60" x2="170" y2="60" stroke="hsl(260 30% 78%)" strokeWidth="2" />
      <line x1="85" y1="75" x2="155" y2="75" stroke="hsl(200 40% 80%)" strokeWidth="2" />
      <line x1="85" y1="90" x2="163" y2="90" stroke="hsl(170 25% 70%)" strokeWidth="2" />
      <line x1="85" y1="105" x2="140" y2="105" stroke="hsl(25 60% 80%)" strokeWidth="2" />
      <text x="130" y="55" textAnchor="middle" fontSize="10" fill="hsl(220 15% 50%)" fontFamily="var(--font-sans)">TO DO</text>

      {/* Sticky notes */}
      <rect x="220" y="40" width="70" height="70" rx="2" fill="hsl(40 70% 60% / 0.35)" transform="rotate(3 255 75)" />
      <text x="255" y="72" textAnchor="middle" fontSize="10" fill="hsl(220 20% 35%)" fontFamily="var(--font-sans)">Call</text>
      <text x="255" y="85" textAnchor="middle" fontSize="10" fill="hsl(220 20% 35%)" fontFamily="var(--font-sans)">plumber!</text>

      <rect x="300" y="50" width="65" height="65" rx="2" fill="hsl(260 30% 88% / 0.5)" transform="rotate(-2 332 82)" />
      <text x="332" y="80" textAnchor="middle" fontSize="10" fill="hsl(220 20% 35%)" fontFamily="var(--font-sans)">Dentist</text>
      <text x="332" y="93" textAnchor="middle" fontSize="10" fill="hsl(220 20% 35%)" fontFamily="var(--font-sans)">3:30 PM</text>

      {/* Physical calendar */}
      <rect x="70" y="155" width="110" height="100" rx="6" fill="white" stroke="hsl(35 25% 82%)" strokeWidth="2" />
      <rect x="70" y="155" width="110" height="25" rx="6" fill="hsl(200 40% 85%)" />
      <text x="125" y="172" textAnchor="middle" fontSize="11" fill="white" fontWeight="600" fontFamily="var(--font-sans)">MARCH</text>
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={78 + col * 20}
            y={185 + row * 13}
            width="14"
            height="10"
            rx="2"
            fill={
              row === 1 && col === 2
                ? 'hsl(25 60% 90%)'
                : row === 2 && col === 4
                  ? 'hsl(260 30% 88%)'
                  : 'hsl(35 25% 95%)'
            }
          />
        ))
      )}

      {/* Fridge */}
      <rect x="220" y="145" width="90" height="120" rx="8" fill="hsl(200 40% 85% / 0.4)" stroke="hsl(200 40% 75%)" strokeWidth="2" />
      <rect x="260" y="155" width="3" height="20" rx="1.5" fill="hsl(200 40% 70%)" />
      <rect x="228" y="180" width="75" height="12" rx="3" fill="white" />
      <text x="265" y="189" textAnchor="middle" fontSize="8" fill="hsl(220 15% 50%)" fontFamily="var(--font-sans)">🥛 Milk, eggs...</text>
      <rect x="228" y="200" width="75" height="12" rx="3" fill="hsl(40 70% 60% / 0.25)" />
      <text x="265" y="209" textAnchor="middle" fontSize="8" fill="hsl(220 15% 50%)" fontFamily="var(--font-sans)">📞 Dr. Smith</text>

      {/* Connection arrows (chaotic) */}
      <path d="M190 85 Q 210 110, 220 75" stroke="hsl(25 60% 75%)" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
      <path d="M180 200 Q 210 190, 220 210" stroke="hsl(260 30% 75%)" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
    </svg>
  );
}

function FragmentedAppsIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full max-w-md mx-auto">
      {/* Background */}
      <circle cx="200" cy="150" r="130" fill="hsl(200 40% 85% / 0.2)" />

      {/* Phone outlines - scattered */}
      {[
        { x: 60, y: 50, rotate: -12, color: 'hsl(260 30% 88%)', emoji: '📅', label: 'Calendar' },
        { x: 240, y: 30, rotate: 8, color: 'hsl(25 60% 90%)', emoji: '🛒', label: 'Grocery' },
        { x: 40, y: 170, rotate: -5, color: 'hsl(170 25% 70% / 0.4)', emoji: '🔧', label: 'Repairs' },
        { x: 260, y: 160, rotate: 10, color: 'hsl(200 40% 85%)', emoji: '✅', label: 'Tasks' },
        { x: 150, y: 200, rotate: -3, color: 'hsl(40 70% 60% / 0.3)', emoji: '✉️', label: 'Email' },
      ].map((phone, i) => (
        <g key={i} transform={`translate(${phone.x}, ${phone.y}) rotate(${phone.rotate})`}>
          <rect width="80" height="120" rx="12" fill="white" stroke="hsl(35 25% 85%)" strokeWidth="2" />
          <rect x="8" y="20" width="64" height="80" rx="4" fill={phone.color} />
          <text x="40" y="68" textAnchor="middle" fontSize="24">{phone.emoji}</text>
          <text x="40" y="115" textAnchor="middle" fontSize="8" fill="hsl(220 15% 50%)" fontFamily="var(--font-sans)">
            {phone.label}
          </text>
        </g>
      ))}

      {/* Broken connection lines between phones */}
      <path d="M130 100 L160 80" stroke="hsl(0 60% 65%)" strokeWidth="1.5" strokeDasharray="3 4" />
      <path d="M250 130 L280 170" stroke="hsl(0 60% 65%)" strokeWidth="1.5" strokeDasharray="3 4" />
      <path d="M120 220 L200 250" stroke="hsl(0 60% 65%)" strokeWidth="1.5" strokeDasharray="3 4" />

      {/* X marks on connections */}
      <g transform="translate(145, 88)">
        <line x1="-4" y1="-4" x2="4" y2="4" stroke="hsl(0 60% 55%)" strokeWidth="2" />
        <line x1="4" y1="-4" x2="-4" y2="4" stroke="hsl(0 60% 55%)" strokeWidth="2" />
      </g>
      <g transform="translate(265, 148)">
        <line x1="-4" y1="-4" x2="4" y2="4" stroke="hsl(0 60% 55%)" strokeWidth="2" />
        <line x1="4" y1="-4" x2="-4" y2="4" stroke="hsl(0 60% 55%)" strokeWidth="2" />
      </g>
    </svg>
  );
}

const AI_NODES = [
  { angle: -90, emoji: '📅', label: 'Calendar', color: 'bg-lavender/40', border: 'border-lavender/50' },
  { angle: -30, emoji: '🛒', label: 'Grocery', color: 'bg-peach/40', border: 'border-peach/50' },
  { angle: 30, emoji: '🏠', label: 'Home', color: 'bg-sky/40', border: 'border-sky/50' },
  { angle: 90, emoji: '✉️', label: 'Email', color: 'bg-sage/40', border: 'border-sage/50' },
  { angle: 150, emoji: '✅', label: 'Tasks', color: 'bg-golden/20', border: 'border-golden/30' },
  { angle: 210, emoji: '👨‍👩‍👧‍👦', label: 'Family', color: 'bg-peach/30', border: 'border-peach/40' },
];

function AiMomentIllustration() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const radius = 130;

  return (
    <div ref={ref} className="relative w-full max-w-[340px] mx-auto" style={{ height: 340 }}>
      {/* Ambient glow rings */}
      <motion.div
        className="absolute rounded-full orb-lavender"
        style={{ width: 280, height: 280, left: '50%', top: '50%', marginLeft: -140, marginTop: -140 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 0.15, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200, height: 200, left: '50%', top: '50%', marginLeft: -100, marginTop: -100,
          background: 'radial-gradient(circle, hsl(245 25% 45% / 0.08) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
      />

      {/* Connection lines (drawn as absolute divs for crisp rendering) */}
      {AI_NODES.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const nx = Math.cos(rad) * radius;
        const ny = Math.sin(rad) * radius;
        const length = Math.sqrt(nx * nx + ny * ny);
        const angleDeg = Math.atan2(ny, nx) * (180 / Math.PI);

        return (
          <motion.div
            key={`line-${i}`}
            className="absolute"
            style={{
              width: length,
              height: 1,
              left: '50%',
              top: '50%',
              transformOrigin: '0 50%',
              transform: `rotate(${angleDeg}deg)`,
              background: 'linear-gradient(90deg, hsl(245 25% 45% / 0.2), hsl(245 25% 45% / 0.06))',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
          />
        );
      })}

      {/* Outer feature nodes */}
      {AI_NODES.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;

        return (
          <motion.div
            key={`node-${i}`}
            className={`absolute flex flex-col items-center justify-center rounded-2xl ${node.color} border ${node.border} backdrop-blur-sm`}
            style={{
              width: 64,
              height: 64,
              left: '50%',
              top: '50%',
              marginLeft: -32,
              marginTop: -32,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={isInView ? { x, y, opacity: 1, scale: 1 } : {}}
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 14,
              delay: 0.5 + i * 0.1,
            }}
          >
            <span className="text-xl leading-none">{node.emoji}</span>
            <span className="text-[8px] font-medium text-foreground/60 mt-0.5">{node.label}</span>
          </motion.div>
        );
      })}

      {/* Central AI hub */}
      <motion.div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: 72,
          height: 72,
          left: '50%',
          top: '50%',
          marginLeft: -36,
          marginTop: -36,
          background: 'linear-gradient(135deg, hsl(245 25% 42%), hsl(260 30% 52%))',
          boxShadow: '0 8px 32px -4px hsl(245 25% 45% / 0.35), 0 0 0 1px hsl(245 25% 55% / 0.2)',
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.3 }}
      >
        <motion.div
          animate={isInView ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 2, delay: 1.2, ease: 'easeInOut' }}
        >
          <Sparkles className="w-7 h-7 text-white/90" />
        </motion.div>
      </motion.div>

      {/* Pulse ring on hub */}
      <motion.div
        className="absolute rounded-full border-2 border-primary/20"
        style={{
          width: 72,
          height: 72,
          left: '50%',
          top: '50%',
          marginLeft: -36,
          marginTop: -36,
        }}
        initial={{ opacity: 0, scale: 1 }}
        animate={isInView ? { opacity: [0, 0.5, 0], scale: [1, 1.8, 2.2] } : {}}
        transition={{ duration: 2, delay: 1, ease: 'easeOut' }}
      />
    </div>
  );
}

function OrbitsPhoneIllustration() {
  return (
    <svg viewBox="0 0 400 380" fill="none" className="w-full max-w-md mx-auto">
      {/* Glow behind phone */}
      <ellipse cx="200" cy="200" rx="160" ry="160" fill="hsl(260 30% 88% / 0.15)" />
      <ellipse cx="200" cy="200" rx="120" ry="120" fill="hsl(245 25% 45% / 0.06)" />

      {/* Phone body */}
      <rect x="135" y="50" width="130" height="260" rx="20" fill="hsl(220 20% 25%)" />
      <rect x="141" y="58" width="118" height="244" rx="16" fill="white" />

      {/* Screen content */}
      {/* Header */}
      <rect x="151" y="68" width="98" height="24" rx="4" fill="hsl(245 25% 45%)" />
      <text x="200" y="84" textAnchor="middle" fontSize="10" fill="white" fontWeight="600" fontFamily="var(--font-sans)">Orbits</text>

      {/* Calendar card */}
      <rect x="151" y="100" width="98" height="50" rx="8" fill="hsl(260 30% 88% / 0.4)" />
      <text x="161" y="115" fontSize="8" fill="hsl(220 20% 35%)" fontWeight="600" fontFamily="var(--font-sans)">Today</text>
      <rect x="161" y="120" width="78" height="8" rx="3" fill="hsl(260 30% 82%)" />
      <rect x="161" y="132" width="55" height="8" rx="3" fill="hsl(200 40% 82%)" />

      {/* Tasks card */}
      <rect x="151" y="158" width="98" height="45" rx="8" fill="hsl(170 25% 70% / 0.25)" />
      <text x="161" y="173" fontSize="8" fill="hsl(220 20% 35%)" fontWeight="600" fontFamily="var(--font-sans)">Tasks</text>
      <circle cx="164" cy="184" r="4" fill="hsl(170 25% 60%)" />
      <rect x="174" y="181" width="60" height="6" rx="2" fill="hsl(170 25% 75%)" />
      <circle cx="164" cy="194" r="4" stroke="hsl(170 25% 70%)" strokeWidth="1.5" fill="none" />
      <rect x="174" y="191" width="45" height="6" rx="2" fill="hsl(35 25% 88%)" />

      {/* Grocery card */}
      <rect x="151" y="211" width="98" height="40" rx="8" fill="hsl(25 60% 90% / 0.4)" />
      <text x="161" y="226" fontSize="8" fill="hsl(220 20% 35%)" fontWeight="600" fontFamily="var(--font-sans)">Grocery List</text>
      <rect x="161" y="233" width="78" height="6" rx="2" fill="hsl(25 60% 85%)" />
      <rect x="161" y="242" width="50" height="6" rx="2" fill="hsl(25 60% 85%)" />

      {/* AI sparkle badge */}
      <rect x="151" y="259" width="98" height="30" rx="8" fill="hsl(245 25% 45% / 0.08)" />
      <text x="200" y="278" textAnchor="middle" fontSize="9" fill="hsl(245 25% 45%)" fontFamily="var(--font-sans)">✨ AI handling 3 items</text>

      {/* Floating feature badges around phone */}
      {[
        { x: 60, y: 110, text: '📅 Calendar', color: 'hsl(260 30% 88%)' },
        { x: 290, y: 130, text: '🛒 Grocery', color: 'hsl(25 60% 90%)' },
        { x: 55, y: 230, text: '🏠 Home', color: 'hsl(200 40% 85%)' },
        { x: 295, y: 250, text: '✅ Tasks', color: 'hsl(170 25% 70% / 0.5)' },
      ].map((badge, i) => (
        <g key={i}>
          <line
            x1={badge.x > 200 ? 265 : 135}
            y1={badge.y}
            x2={badge.x + (badge.x > 200 ? -10 : 50)}
            y2={badge.y}
            stroke="hsl(245 25% 45% / 0.12)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <rect x={badge.x - 10} y={badge.y - 12} width={badge.x > 200 ? 80 : 75} height="24" rx="12" fill={badge.color} stroke="hsl(35 25% 85%)" strokeWidth="1" />
          <text x={badge.x + (badge.x > 200 ? 30 : 27)} y={badge.y + 4} textAnchor="middle" fontSize="9" fill="hsl(220 20% 35%)" fontFamily="var(--font-sans)">{badge.text}</text>
        </g>
      ))}

      {/* Sparkles */}
      <circle cx="120" cy="70" r="3" fill="hsl(40 70% 60%)" opacity="0.6" />
      <circle cx="290" cy="80" r="2.5" fill="hsl(40 70% 60%)" opacity="0.5" />
      <circle cx="100" cy="310" r="2" fill="hsl(260 30% 78%)" opacity="0.5" />
      <circle cx="310" cy="320" r="3" fill="hsl(200 40% 75%)" opacity="0.4" />
    </svg>
  );
}

const VISION_ITEMS = [
  { emoji: '📅', label: 'Synced', sublabel: 'calendars', color: 'bg-lavender/30', border: 'border-lavender/40' },
  { emoji: '🏠', label: 'Auto', sublabel: 'maintenance', color: 'bg-sky/30', border: 'border-sky/40' },
  { emoji: '🛒', label: 'Smart', sublabel: 'grocery', color: 'bg-peach/30', border: 'border-peach/40' },
  { emoji: '✅', label: 'Shared', sublabel: 'tasks', color: 'bg-sage/30', border: 'border-sage/40' },
];

function VisionIllustration() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="w-full max-w-sm mx-auto">
      {/* Top row: time saved badge */}
      <motion.div
        className="flex justify-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="inline-flex items-center gap-3 px-5 py-3 glass rounded-full border border-primary/10">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">5+ hours saved</p>
            <p className="text-[11px] text-muted-foreground">every week, on autopilot</p>
          </div>
        </div>
      </motion.div>

      {/* 2x2 feature grid */}
      <div className="grid grid-cols-2 gap-3">
        {VISION_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            className={`${item.color} border ${item.border} rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-sm`}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 14,
              delay: 0.25 + i * 0.1,
            }}
          >
            <span className="text-2xl mb-2">{item.emoji}</span>
            <p className="text-xs font-semibold text-foreground leading-tight">{item.label}</p>
            <p className="text-[11px] text-muted-foreground">{item.sublabel}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom: heart + tagline */}
      <motion.div
        className="flex justify-center mt-6"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
          <Heart className="w-4 h-4 text-peach fill-peach" />
          <span>More time for what matters</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 60, damping: 18 }}
          className="text-center mb-20 lg:mb-28"
        >
          <motion.span
            className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            About Orbits
          </motion.span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-[-0.01em] mb-6 leading-tight">
            A story of{' '}
            <span className="text-gradient">home</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            And how we're building the future of household management.
          </p>
        </motion.div>

        {/* Story sections */}
        <div className="space-y-24 lg:space-y-32">

          {/* Section 1: The Problem */}
          <StorySection>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="flex justify-center">
                <OrbitingMergeAnimation />
              </div>
              <div className="text-center lg:text-left">
                <p className="text-lg lg:text-xl text-foreground/90 leading-relaxed">
                  If you're reading this, you probably manage a household. And if you do,
                  you know the feeling: juggling a calendar app, a grocery list, a to-do app,
                  home maintenance reminders, and a dozen group chats just to keep things running.
                </p>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mt-6">
                  But have you ever wondered why managing a home still feels so... fragmented?
                </p>
              </div>
            </div>
          </StorySection>

          {/* Section 2: The Old Ways */}
          <StorySection>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 text-center lg:text-left">
                <p className="text-lg lg:text-xl text-foreground/90 leading-relaxed">
                  For decades, households ran on whiteboards, sticky notes on the fridge,
                  and the family calendar hanging on the kitchen wall.
                </p>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mt-6">
                  These tools were simple. Imperfect, sure, but they were <em>shared</em> — everyone
                  in the house could see them, add to them, and stay in the loop. There was one
                  source of truth, and it lived right on the fridge door.
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <OldWaysIllustration />
              </div>
            </div>
          </StorySection>

          {/* Section 3: Digital Fragmentation */}
          <StorySection>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <FragmentedAppsIllustration />
              </div>
              <div className="text-center lg:text-left">
                <p className="text-lg lg:text-xl text-foreground/90 leading-relaxed">
                  Then we went digital. Google Calendar replaced the wall calendar.
                  Alexa took over the grocery list. A dozen apps for a dozen problems.
                </p>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mt-6">
                  But something was lost in the transition. Each app lives in its own silo.
                  Your calendar doesn't know about your grocery list. Your to-do app doesn't know
                  your HVAC filter needs changing. Nothing talks to anything else.
                </p>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mt-6">
                  We traded one shared fridge door for ten disconnected apps.
                </p>
              </div>
            </div>
          </StorySection>

          {/* Section 4: The AI Moment */}
          <StorySection>
            <div className="text-center mb-10">
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full border border-primary/10 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, damping: 12 }}
              >
                <span className="text-sm font-medium">Then something changed</span>
              </motion.div>
            </div>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 text-center lg:text-left">
                <p className="text-lg lg:text-xl text-foreground/90 leading-relaxed">
                  AI got good enough to actually <em>understand</em> context. Not just store data,
                  but connect the dots. "The dentist emailed about Tuesday's appointment? I'll update
                  your calendar and remind you to leave early because of school pickup."
                </p>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mt-6">
                  For the first time, technology could manage the invisible work of running a
                  household — the mental load that no single app ever solved.
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <AiMomentIllustration />
              </div>
            </div>
          </StorySection>

          {/* Section 5: That's Where Orbits Comes In */}
          <StorySection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-[-0.01em] leading-tight">
                That's where{' '}
                <span className="text-gradient">Orbits</span>
                {' '}comes in.
              </h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <OrbitsPhoneIllustration />
              </div>
              <div className="text-center lg:text-left">
                <p className="text-lg lg:text-xl text-foreground/90 leading-relaxed">
                  We built Orbits to be the one app your household actually needs. Calendar, tasks,
                  grocery lists, home maintenance, family coordination — all in one place, powered
                  by AI that understands how it all connects.
                </p>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mt-6">
                  Tell Orbits about your home, your family, and your routines.
                  It'll handle the scheduling, the reminders, the service quotes, and the
                  coordination — so you can focus on what actually matters.
                </p>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mt-6">
                  Think of it as the digital fridge door for the AI age.
                </p>
              </div>
            </div>
          </StorySection>

          {/* Section 6: Our Vision */}
          <StorySection>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 text-center lg:text-left">
                <p className="text-lg lg:text-xl text-foreground/90 leading-relaxed">
                  We believe every household deserves an assistant — not a luxury, but
                  a practical tool that gives families their time back.
                </p>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mt-6">
                  Our vision is a world where managing your home feels effortless. Where the
                  invisible work becomes truly invisible. Where you spend less time coordinating
                  and more time living.
                </p>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mt-6">
                  We're just getting started, and we'd love for you to be part of the journey.
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <VisionIllustration />
              </div>
            </div>
          </StorySection>
        </div>

        {/* Quote */}
        <StorySection className="mt-24 lg:mt-32">
          <motion.blockquote
            className="text-center py-12 lg:py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative inline-block">
              <div className="absolute -top-6 -left-6 w-12 h-12 orb-lavender opacity-40 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -right-6 w-12 h-12 orb-peach opacity-40 rounded-full blur-xl" />
              <p className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-foreground/80 leading-snug relative">
                "The best technology is the kind that{' '}
                <span className="text-gradient">disappears</span>
                {' '}into your life."
              </p>
            </div>
          </motion.blockquote>
        </StorySection>

        {/* CTA */}
        <StorySection className="mt-12 lg:mt-16">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-[-0.01em] mb-6 leading-tight">
              Ready to simplify your{' '}
              <span className="text-gradient">household</span>?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Download Orbits and join thousands of households running smoother every day.
            </p>
            <div className="flex justify-center">
              <AppStoreButtons location="about_page" />
            </div>
          </div>
        </StorySection>

        {/* Contact */}
        <StorySection className="mt-20 lg:mt-28">
          <div className="text-center">
            <p className="text-muted-foreground">
              Questions? We'd love to hear from you.{' '}
              <a
                href="mailto:contact@tryorbits.com"
                className="text-primary hover:underline transition-colors"
              >
                contact@tryorbits.com
              </a>
            </p>
          </div>
        </StorySection>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          © 2026 Orbits. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
