import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import orbitsWordmark from '@/assets/orbits-wordmark-color.svg';
import instacartLogo from '@/assets/instacart-logo.svg';
import instacartCarrot from '@/assets/instacart-carrot.png';
import amazonIcon from '@/assets/amazon-icon.png';
import orbitsIcon from '@/assets/orbits-icon-color.svg';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import { track } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ─── Types ──────────────────────────────────────────────────────────────────

type AdFormat = 'square' | 'reels';

type AdTemplate =
  | 'scenario'
  | 'not-a-tracker'
  | 'manifesto'
  | 'helping-hand'
  | 'upkeep-app'
  | 'family-app'
  | 'ask-orbits'
  | 'at-a-glance'
  | 'instacart'
  | 'amazon'
  | 'group-chat'
  | 'bills'
  | 'ai-lists'
  | 'app-features'
  | 'service-requests'
  | 'pets'
  | 'reel-hook'
  | 'reel-list'
  | 'reel-before-after'
  | 'reel-stat'
  | 'reel-cta'
  | 'reel-instacart'
  | 'reel-amazon'
  | 'reel-notification'
  | 'reel-workflow'
  | 'reel-morning'
  | 'reel-grocery-ai'
  | 'vs-clawdbot';

type AccentColor = 'lavender' | 'peach' | 'sky' | 'sage' | 'golden' | 'forest';

interface AdConfig {
  template: AdTemplate;
  headline: string;
  subheadline: string;
  accentColor: AccentColor;
  dark: boolean;
  showChrome: boolean;
}

// ─── Template presets ────────────────────────────────────────────────────────

const TEMPLATES: Record<AdTemplate, Omit<AdConfig, 'template' | 'dark' | 'showChrome'>> = {
  scenario: {
    headline: 'Orbits, in action.',
    subheadline: 'Proactive. Automatic. Done.',
    accentColor: 'sage',
  },
  'not-a-tracker': {
    headline: 'Not a tracker.',
    subheadline: 'An operator.',
    accentColor: 'lavender',
  },
  manifesto: {
    headline: 'Orbits intends to replace them.',
    subheadline: 'The AI-native OS for the household.',
    accentColor: 'peach',
  },
  'helping-hand': {
    headline: 'Everyone deserves a helping hand.',
    subheadline: 'Let Orbits request quotes and arrange home services for you.',
    accentColor: 'sky',
  },
  'upkeep-app': {
    headline: 'Upkeep',
    subheadline: 'Spend less time maintaining your home, and more time enjoying it.',
    accentColor: 'sage',
  },
  'family-app': {
    headline: 'Family',
    subheadline: 'Lists, appointments, or their favorite color — track it all in one place.',
    accentColor: 'peach',
  },
  'ask-orbits': {
    headline: 'When in doubt, just ask Orbits.',
    subheadline: '',
    accentColor: 'golden',
  },
  'at-a-glance': {
    headline: 'Your household, at a glance.',
    subheadline: '',
    accentColor: 'lavender',
  },
  instacart: {
    headline: 'Your groceries order themselves.',
    subheadline: 'Orbits reads your calendar and handles the shopping.',
    accentColor: 'sage',
  },
  amazon: {
    headline: 'Your home orders its own supplies.',
    subheadline: 'No more running out of things.',
    accentColor: 'sky',
  },
  'group-chat': {
    headline: 'You know that friend who just... handles things?',
    subheadline: "That's Orbits. For your home.",
    accentColor: 'lavender',
  },
  bills: {
    headline: 'That bill? Handled.',
    subheadline: 'Orbits tracks, disputes, and resolves — so you never have to call.',
    accentColor: 'peach',
  },
  'ai-lists': {
    headline: 'Not a list. A system that knows what to add.',
    subheadline: 'Your lists think ahead.',
    accentColor: 'golden',
  },
  'app-features': {
    headline: 'One app. Every corner of your home.',
    subheadline: 'Meet your new household assistant.',
    accentColor: 'sky',
  },
  'service-requests': {
    headline: 'Need it done? Orbits finds, vets, and books.',
    subheadline: 'No Google. No phone tag. No follow-ups.',
    accentColor: 'sage',
  },
  pets: {
    headline: 'Your whole family is in Orbits.',
    subheadline: 'Including the members with four legs.',
    accentColor: 'peach',
  },
  // ── Reels templates ──
  'reel-hook': {
    headline: 'Are you running a household,',
    subheadline: 'or is it running you?',
    accentColor: 'lavender',
  },
  'reel-list': {
    headline: 'What Orbits does for you.',
    subheadline: '',
    accentColor: 'sage',
  },
  'reel-before-after': {
    headline: 'Before Orbits.',
    subheadline: 'After Orbits.',
    accentColor: 'sky',
  },
  'reel-stat': {
    headline: '3+',
    subheadline: 'hours every week running your home.',
    accentColor: 'peach',
  },
  'reel-cta': {
    headline: 'Your home deserves better than a notes app.',
    subheadline: 'Free on iOS & Android.',
    accentColor: 'golden',
  },
  'reel-instacart': {
    headline: 'Your groceries order themselves.',
    subheadline: 'Orbits notices. Instacart delivers.',
    accentColor: 'sage',
  },
  'reel-amazon': {
    headline: 'Your home restocks itself.',
    subheadline: 'Orbits notices. Amazon delivers.',
    accentColor: 'golden',
  },
  'reel-notification': {
    headline: 'What Orbits did while you slept.',
    subheadline: 'Proactive. Silent. Done.',
    accentColor: 'sky',
  },
  'reel-workflow': {
    headline: 'How Orbits handles it.',
    subheadline: 'One tap. Done.',
    accentColor: 'sage',
  },
  'reel-morning': {
    headline: 'Your morning, simplified.',
    subheadline: 'Everything handled. Nothing missed.',
    accentColor: 'peach',
  },
  'reel-grocery-ai': {
    headline: "You didn't write a single thing.",
    subheadline: 'Orbits read your week and built the list.',
    accentColor: 'sage',
  },
  'vs-clawdbot': {
    headline: 'ClawdBot is for engineers.',
    subheadline: 'Orbits is for your home.',
    accentColor: 'lavender',
  },
};

const TEMPLATE_ORDER: AdTemplate[] = [
  'scenario',
  'not-a-tracker',
  'manifesto',
  'helping-hand',
  'upkeep-app',
  'family-app',
  'ask-orbits',
  'at-a-glance',
  'instacart',
  'amazon',
  'group-chat',
  'bills',
  'ai-lists',
  'app-features',
  'service-requests',
  'pets',
  'vs-clawdbot',
];

const REELS_TEMPLATE_ORDER: AdTemplate[] = [
  'reel-grocery-ai',
  'reel-instacart',
  'reel-amazon',
  'reel-notification',
  'reel-workflow',
  'reel-morning',
  'reel-hook',
  'reel-list',
  'reel-before-after',
  'reel-stat',
  'reel-cta',
];

const TEMPLATE_LABELS: Record<AdTemplate, string> = {
  scenario: 'In Action',
  'not-a-tracker': 'Operator',
  manifesto: 'Manifesto',
  'helping-hand': 'Helping Hand',
  'upkeep-app': 'Upkeep',
  'family-app': 'Family',
  'ask-orbits': 'Ask Orbits',
  'at-a-glance': 'At a Glance',
  instacart: 'Instacart',
  amazon: 'Amazon',
  'group-chat': 'The Friend',
  bills: 'Bills',
  'ai-lists': 'AI Lists',
  'app-features': 'App Features',
  'service-requests': 'Services',
  pets: 'Pets',
  'vs-clawdbot': 'vs. ClawdBot',
  'reel-hook': 'Hook',
  'reel-list': 'Feature List',
  'reel-before-after': 'Before / After',
  'reel-stat': 'Stat',
  'reel-cta': 'Download CTA',
  'reel-instacart': 'Instacart',
  'reel-amazon': 'Amazon',
  'reel-notification': 'While You Slept',
  'reel-workflow': 'Workflow',
  'reel-morning': 'Morning Dashboard',
  'reel-grocery-ai': 'AI Grocery List',
};

const ACCENT_COLORS: AccentColor[] = ['lavender', 'peach', 'sky', 'sage', 'golden', 'forest'];

// Templates that have been approved / are ready to post on Instagram
const IG_APPROVED: Set<AdTemplate> = new Set([
  'at-a-glance',
  'family-app',
  'upkeep-app',
  'helping-hand',
  'ask-orbits',
  'not-a-tracker',
  'scenario',
]);

// Small Instagram-gradient checkmark badge
function IgBadge() {
  return (
    <span
      title="Ready to post on Instagram"
      className="inline-flex items-center justify-center w-4 h-4 rounded-full shrink-0"
      style={{
        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      }}
    >
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// ─── Instagram captions ──────────────────────────────────────────────────────

const CAPTIONS: Record<AdTemplate, string> = {
  scenario: `It's snowing this weekend. Cool. Orbits already got you three plow quotes.

Bake sale Thursday? Groceries are scheduled for Wednesday evening.

That's not a feature. That's the whole point. Download free. Link in bio.

#AIAssistant #SmartHome #ProactiveAI #Orbits`,

  'not-a-tracker': `Your to-do list is not the problem.

Tracking tasks is easy. Knowing which tasks exist, handling them, and actually getting them done? Different job.

Orbits doesn't remind you. It handles it. Link in bio.

#Productivity #HomeOrganization #GetThingsDone #Orbits`,

  manifesto: `The Industrial Revolution invented the office worker to manage modern complexity. We've been waiting a long time for someone to do the same for home.

Orbits. The AI-native operating system for your household. Link in bio.

#FutureOfHome #AIHome #Innovation #Orbits`,

  'helping-hand': `Snow removal. Babysitting. Appliance repair. None of it should require six Google searches and three phone calls.

Tell Orbits what you need. It reaches out, gets quotes, and coordinates. You just pick one.

Everyone deserves a helping hand. Download free. Link in bio.

#HomeServices #HomeOwner #FamilyLife #Orbits`,

  'upkeep-app': `Your home is probably hiding maintenance issues you don't know about yet.

Appliance warranties. Filter changes. Seasonal upkeep. All the things that "can wait" — until they can't.

Orbits tracks it. Orbits handles it. Link in bio.

#HomeMaintenance #HomeOwner #Upkeep #Orbits`,

  'family-app': `Doctor appointments. Dance recitals. Their pediatrician's name. Their actual favorite color.

Being a great parent means holding a lot. Orbits holds it with you — so nothing slips through the cracks.

Family, organized. Download free. Link in bio.

#ParentingLife #FamilyOrganization #KidsActivities #Orbits`,

  'ask-orbits': `Not sure where to start? That's exactly the point.

You don't need to know the right question. Just ask. Orbits figures out the rest.

Download free. Link in bio.

#AIAssistant #SmartHome #FamilyLife #Orbits`,

  instacart: `Bake sale Thursday. Dog food running low. Jake's vitamins almost out.

You didn't notice any of that. Orbits did — and already scheduled the Instacart delivery.

No list. No reminders. No "I forgot." Just done.

Download free. Link in bio.

#GroceryShopping #Instacart #FamilyLife #Orbits`,

  amazon: `Your HVAC filter was overdue. Your dishwasher pods were on their last pack. Your outdoor lightbulb burned out three weeks ago.

Orbits noticed all of it. Ordered all of it. It's arriving Friday.

Your home runs itself now.

Download free. Link in bio.

#Amazon #HomeOwner #SmartHome #Orbits`,

  'group-chat': `You know that friend? The one who always knows the best plumber. Reminds you when your car registration is due. Notices your insurance went up and calls to dispute it.

Most people don't have that friend. Every household should.

Download Orbits free. Link in bio.

#HomeLife #WorkingParents #AIHome #Orbits`,

  bills: `"I should really deal with that bill."

We know. You've said it 12 times. Orbits just... handled it. Reviewed the charge. Caught the error. Made the call.

$43 back in your account. You're welcome.

Download free. Link in bio.

#Bills #HomeOwner #MoneyManagement #Orbits`,

  'ai-lists': `A grocery list is only as smart as what you remember to add.

Orbits' lists aren't like that. They notice the bake sale on Thursday and add the ingredients. They track what's running low and reorder it. They think ahead so you don't have to.

Not a list. A living system.

Download free. Link in bio.

#Organization #SmartHome #FamilyLife #Orbits`,

  'app-features': `One home. Four things that used to live in ten different apps.

📅 Family calendar — unified, no conflicts
🏠 Home upkeep — tracked, scheduled, done
🛠️ Service requests — found, vetted, booked
✨ Today view — your whole household at a glance

Orbits. The OS for your home. Download free. Link in bio.

#SmartHome #HomeOrganization #FamilyLife #Orbits`,

  'service-requests': `Snow removal. Plumbing. Babysitting. HVAC. Cleaning. Pest control. Handyman.

You used to Google all of these separately, play phone tag, and still end up unsure who to trust.

Orbits finds, vets, and books — for every job, every time.

Download free. Link in bio.

#HomeServices #HomeOwner #HomeRepair #Orbits`,

  pets: `Jake. Ellie. Lily. And Milo. 🐕

Orbits tracks all of them — schedules, health, appointments, subscriptions. Milo's vet is January 15th. His heartworm prescription was auto-refilled. His food is set to deliver every 3 weeks.

Your whole family. One place.

Download free. Link in bio.

#PetOwner #FamilyLife #SmartHome #Orbits`,

  'at-a-glance': `Weather. Dentist at noon. Soccer at 7. Garage repair Friday.

Your whole household — people, schedule, upkeep — one place. No tabs open. No context switching. No things slipping.

Your household, at a glance. Download free. Link in bio.

#OrganizedLife #FamilyCalendar #SmartHome #Orbits`,

  'reel-hook': `Are you running your household, or is it running you? 👀

(If you hesitated, we made this for you.)

Orbits is the AI assistant that actually manages your home — groceries, calendars, maintenance, services. All of it.

Download free. Link in bio.

#HomeLife #MentalLoad #WorkingParents #Orbits`,

  'reel-list': `What if your home just... handled itself? 🏠✨

This is what Orbits does every single day:
✅ Grocery lists, auto-updated
✅ Family calendar, synced
✅ Home maintenance, tracked
✅ Services, booked
✅ Everything, in one place

Free on iOS & Android. Link in bio.

#SmartHome #AIAssistant #HomeOrganization #Orbits`,

  'reel-before-after': `The before and after nobody talks about. 🤫

BEFORE: 4 apps, 3 group chats, 12 notifications, and somehow you still forgot the dentist.

AFTER: One place. One AI. Nothing slips.

That's Orbits. Download free. Link in bio.

#BeforeAndAfter #HomeLife #OrganizedLife #Orbits`,

  'reel-stat': `3+ hours. Every single week. Just managing your home. 😮

Not living in it. Not enjoying it. Managing it.

Orbits gives those hours back. Download free. Link in bio.

#MentalLoad #WorkingParents #TimeManagement #Orbits`,

  'reel-instacart': `Bake sale Thursday. Dog food running low. Jake's vitamins almost out. 🛒

You didn't notice any of that. Orbits did — and already scheduled the Instacart delivery.

Your groceries order themselves now. Download free. Link in bio.

#Instacart #GroceryShopping #FamilyLife #AIHome #Orbits`,

  'reel-amazon': `HVAC filter overdue. Dishwasher pods running low. Garage bulb burned out. 📦

You didn't make a list. Orbits did — and already ordered everything on Amazon Prime.

Your home restocks itself. Download free. Link in bio.

#Amazon #HomeManagement #SmartHome #AIHome #Orbits`,

  'reel-notification': `POV: you wake up and Orbits already handled your Saturday. ❄️🔧🛒

Your AI household assistant works while you sleep — booking services, scheduling deliveries, catching things you'd never even think to check.

Download free. Link in bio.

#AIHome #SmartHome #MentalLoad #Orbits`,

  'reel-workflow': `Orbits doesn't wait for you to ask. It notices, acts, and handles it — in a clean workflow built for your home. 🏠

Proactive. Structured. The right options, at the right time, handled the right way.

Download free. Link in bio.

#SmartHome #HomeManagement #AIHome #Orbits`,

  'reel-morning': `Your household, handled before you even finish your coffee. ☀️

Orbits shows you everything — the weather, today's schedule, what it did overnight, what's coming up. One place. Nothing slips.

Download free. Link in bio.

#MorningRoutine #FamilyLife #OrganizedHome #Orbits`,

  'reel-cta': `Hot take: a sticky note is not a home management system. 📝

Orbits is. Groceries, family calendar, maintenance, services — one AI that handles your whole household.

Free on iOS & Android. Link in bio.

#SmartHome #AIHome #FamilyLife #Orbits`,

  'vs-clawdbot': `ClawdBot and OpenClaw are impressive — if you have a computer science degree and a few hours to spare.

Most people just want their home to run itself.

Orbits doesn't need you to write prompts, set up integrations, or understand how AI works. It just handles your groceries, calendar, maintenance, and services — automatically.

The AI for your home. Not your terminal.

Download free. Link in bio.

#AIHome #SmartHome #FamilyLife #HomeManagement #Orbits`,

  'reel-grocery-ai': `You didn't write a single thing. Orbits did. 🛒✨

Bake sale Thursday. Dog food running low. Jake's vitamins almost out. Orbits read your week — and built the whole grocery list automatically.

No reminders. No mental load. Just done.

Download free. Link in bio.

#GroceryShopping #AIHome #FamilyLife #SmartHome #Orbits`,
};

// ─── Animation helpers ───────────────────────────────────────────────────────

function fadeUp(delay: number, duration = 0.65) {
  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration, ease: [0.25, 0.46, 0.45, 0.94] },
  } as const;
}

function slideIn(delay: number) {
  return {
    initial: { opacity: 0, x: -28 },
    animate: { opacity: 1, x: 0 },
    transition: { delay, type: 'spring' as const, stiffness: 72, damping: 16 },
  } as const;
}

// ─── Shared canvas background ────────────────────────────────────────────────

// Brand palette from style guide
const BRAND = {
  bg: '#fefcf6',       // warm cream — the canvas background
  dark: '#071b24',     // deep navy — text / grid
  mint: '#b4e0cb',     // soft mint
  lilac: '#e0b2df',    // soft lavender
  sky: '#89acbe',      // soft sky blue
} as const;


function CanvasBackground({ dark }: { dark: boolean }) {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: dark ? BRAND.dark : BRAND.bg }} />
  );
}

// Bottom-center wordmark — uses wide color SVG on light, icon mark on dark
// (the wordmark text is #031d28 which is invisible on the dark canvas)
function CanvasLogo({ delay = 1.4, dark }: { delay?: number; dark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="absolute bottom-[68px] left-0 right-0 flex items-center justify-center"
    >
      {dark ? (
        <img src={orbitsIcon} alt="Orbits" style={{ height: 44, width: 'auto' }} />
      ) : (
        <img src={orbitsWordmark} alt="Orbits" style={{ height: 34, width: 'auto' }} />
      )}
    </motion.div>
  );
}

// Small icon mark for corner / header treatments
function CanvasLogoMark({
  delay = 0.1,
  size = 52,
  style,
}: {
  delay?: number;
  dark?: boolean;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.img
      src={orbitsIcon}
      alt="Orbits"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      style={{ height: size, width: size, ...style }}
    />
  );
}

function Eyebrow({ text, delay = 0.1, dark }: { text: string; delay?: number; dark: boolean }) {
  return (
    <motion.p
      {...fadeUp(delay)}
      className="text-[21px] font-medium tracking-[0.16em] uppercase mb-[52px]"
      style={{ color: dark ? `${BRAND.bg}88` : `${BRAND.dark}66` }}
    >
      {text}
    </motion.p>
  );
}

// ─── Dark-aware color helpers ────────────────────────────────────────────────

const c = {
  fg:     (d: boolean) => d ? BRAND.bg   : BRAND.dark,
  fgMid:  (d: boolean) => d ? `${BRAND.bg}bb` : `${BRAND.dark}99`,
  fgSoft: (d: boolean) => d ? `${BRAND.bg}77` : `${BRAND.dark}66`,
  rule:   (d: boolean) => d ? `${BRAND.bg}22` : `${BRAND.dark}14`,
  cardBg: (d: boolean) => d ? 'rgba(254,252,246,0.07)' : 'rgba(7,27,36,0.04)',
  cardBorder: (d: boolean) => `1px solid ${d ? 'rgba(254,252,246,0.13)' : 'rgba(7,27,36,0.08)'}`,
} as const;

// Map AccentColor → brand hex so it reads on both bg colours
const ACCENT_HEX: Record<AccentColor, string> = {
  lavender: BRAND.lilac,
  peach:    BRAND.lilac,
  sky:      BRAND.sky,
  sage:     BRAND.mint,
  golden:   BRAND.mint,
  forest:   '#071b24',
};

// Richer CTA button colors — one per accent, with enough saturation to read as a real button
const ACCENT_CTA_BG: Record<AccentColor, string> = {
  lavender: '#7c6fcd',
  peach:    '#c97c4a',
  sky:      '#4a8fad',
  sage:     '#3a7d55',
  golden:   '#b8860b',
  forest:   '#071b24',
};
const ACCENT_CTA_FG: Record<AccentColor, string> = {
  lavender: '#ffffff',
  peach:    '#ffffff',
  sky:      '#ffffff',
  sage:     '#ffffff',
  golden:   '#ffffff',
  forest:   '#fefcf6',
};

// ─── Ad templates ─────────────────────────────────────────────────────────────

// 4. Orbits in action — the scenarios
function ScenarioAd({ config }: { config: AdConfig }) {
  const { accentColor, dark } = config;
  const accentHex = ACCENT_HEX[accentColor];
  const pairs = [
    {
      trigger: '"It\'s snowing this weekend."',
      result: 'Orbits reached out to 3 plow companies for quotes. Waiting on your approval.',
    },
    {
      trigger: '"Bake sale Thursday."',
      result: 'Groceries scheduled for delivery Wednesday evening. You\'re all set.',
    },
  ];
  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden">
      <CanvasBackground dark={dark} />
      <div className="relative z-10 flex flex-col justify-center h-full px-[96px]">
        <Eyebrow text="Orbits, in action" dark={dark} />
        <div className="space-y-[38px] mb-[64px]">
          {pairs.map(({ trigger, result }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.45 }}
              className="space-y-[16px]"
            >
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28 + i * 0.45, type: 'spring', stiffness: 68, damping: 16 }}
                className="flex items-start gap-4"
              >
                <span style={{ color: c.fgSoft(dark) }} className="text-[22px] mt-[8px] shrink-0">→</span>
                <div
                  style={{ backgroundColor: c.cardBg(dark), border: c.cardBorder(dark) }}
                  className="rounded-2xl rounded-tl-sm px-[30px] py-[20px]"
                >
                  <p style={{ color: c.fgMid(dark) }} className="text-[25px] italic">{trigger}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.52 + i * 0.45, type: 'spring', stiffness: 68, damping: 16 }}
                className="flex items-start gap-4 justify-end"
              >
                <div
                  className="rounded-2xl rounded-tr-sm px-[30px] py-[20px] max-w-[740px]"
                  style={{
                    backgroundColor: `${accentHex}22`,
                    border: `1px solid ${accentHex}44`,
                  }}
                >
                  <p style={{ color: c.fg(dark) }} className="text-[25px] font-medium">{result}</p>
                </div>
                <span style={{ color: accentHex }} className="text-[22px] mt-[8px] shrink-0">✓</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
        <motion.div {...fadeUp(1.15)}>
          <p style={{ color: c.fg(dark) }} className="text-[46px] font-serif font-medium leading-[1.12] tracking-[-0.01em]">
            Proactive. Automatic.{' '}
            <span style={{ color: accentHex }}>Done.</span>
          </p>
        </motion.div>
      </div>
      <CanvasLogo delay={1.42} dark={dark} />
    </div>
  );
}

// 6. Not a tracker. An operator.
function NotATrackerAd({ config }: { config: AdConfig }) {
  const { headline, subheadline, accentColor, dark } = config;
  const accentHex = ACCENT_HEX[accentColor];
  const rows = [
    { other: 'Track tasks', orbits: 'Identifies them' },
    { other: 'Send reminders', orbits: 'Handles them' },
    { other: 'List things', orbits: 'Executes them' },
  ];
  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden">
      <CanvasBackground dark={dark} />
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-[100px] text-center">
        <Eyebrow text="There's a difference" dark={dark} />
        <motion.div {...fadeUp(0.26)} className="grid grid-cols-[1fr_64px_1fr] w-full max-w-[860px] mb-[24px]">
          <span style={{ color: c.fgSoft(dark) }} className="text-[30px] font-medium text-right pr-8">Most apps</span>
          <div />
          <span style={{ color: c.fgMid(dark) }} className="text-[30px] font-medium text-left pl-8">Orbits</span>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.42, duration: 0.5 }}
          style={{ originX: 0.5, backgroundColor: c.rule(dark) }}
          className="h-[1px] w-full max-w-[860px] mb-[24px]"
        />
        <div className="w-full max-w-[860px] mb-[64px]">
          {rows.map(({ other, orbits }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.52 + i * 0.16 }}
              style={{ borderBottom: `1px solid ${c.rule(dark)}` }}
              className="grid grid-cols-[1fr_64px_1fr] py-[26px] last:border-0"
            >
              <span style={{ color: c.fgSoft(dark) }} className="text-[40px] text-right pr-8">{other}</span>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6" style={{ color: c.fgSoft(dark) }} />
              </div>
              <span style={{ color: accentHex }} className="text-[40px] font-medium text-left pl-8">{orbits}</span>
            </motion.div>
          ))}
        </div>
        <motion.h1
          {...fadeUp(1.02)}
          style={{ color: c.fg(dark) }}
          className="text-[82px] font-serif font-medium leading-[1.1] tracking-[-0.02em]"
        >
          {headline}
        </motion.h1>
        <motion.p
          {...fadeUp(1.16)}
          style={{ color: accentHex }}
          className="text-[82px] font-serif font-medium leading-[1.1] tracking-[-0.02em]"
        >
          {subheadline}
        </motion.p>
      </div>
      <CanvasLogo delay={1.42} dark={dark} />
    </div>
  );
}

// 7. Manifesto — cinematic line-by-line reveal
function ManifestoAd({ config }: { config: AdConfig }) {
  const { accentColor, dark } = config;
  const accentHex = ACCENT_HEX[accentColor];
  type LineType = 'body' | 'rule' | 'accent';
  const lines: Array<{ text: string; delay: number; type: LineType }> = [
    { text: 'The Industrial Revolution', delay: 0.15, type: 'body' },
    { text: 'created the office worker.', delay: 0.35, type: 'body' },
    { text: '──', delay: 0.62, type: 'rule' },
    { text: 'The digital age created', delay: 0.82, type: 'body' },
    { text: 'the household manager.', delay: 1.02, type: 'body' },
    { text: '──', delay: 1.28, type: 'rule' },
    { text: 'Orbits intends to', delay: 1.46, type: 'accent' },
    { text: 'replace them.', delay: 1.65, type: 'accent' },
  ];

  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden">
      <CanvasBackground dark={dark} />
      {/* Top-left icon mark */}
      <div className="absolute top-[72px] left-[116px]">
        <CanvasLogoMark delay={0.05} dark={dark} size={56} />
      </div>
      <div className="relative z-10 flex flex-col justify-center h-full px-[116px]">
        {lines.map(({ text, delay, type }, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, type: 'spring', stiffness: 68, damping: 16 }}
            style={{
              color: type === 'accent' ? accentHex : type === 'rule' ? c.rule(dark) : c.fgMid(dark),
            }}
            className={`leading-[1.18] tracking-[-0.01em] font-serif font-normal ${
              type === 'accent'
                ? 'text-[66px]'
                : type === 'rule'
                ? 'text-[32px] my-[6px]'
                : 'text-[52px]'
            }`}
          >
            {text}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

// ─── Phone mockup shared primitives ──────────────────────────────────────────

// Interior palette mirrors the app screenshots
const PH = {
  bg:     '#fafaf7',
  text:   '#071b24',
  muted:  'rgba(7,27,36,0.48)',
  border: 'rgba(7,27,36,0.09)',
  card:   'rgba(7,27,36,0.03)',
  pill:   '#edebe4',
  accent: '#4c7a58',   // olive green — calendar highlight
} as const;

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 500,
      borderRadius: 56,
      border: '3px solid rgba(0,0,0,0.1)',
      backgroundColor: PH.bg,
      overflow: 'hidden',
      boxShadow: '0 48px 120px rgba(0,0,0,0.2), 0 12px 36px rgba(0,0,0,0.1)',
      flexShrink: 0,
    }}>
      <div style={{ height: 44, backgroundColor: PH.bg }} />
      {children}
    </div>
  );
}

function PhoneTopBar({ title, accent }: { title: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 28px 20px' }}>
      <span style={{ position: 'absolute', left: 28, fontSize: 28, color: accent || PH.accent, fontWeight: 500 }}>‹</span>
      <span style={{ fontSize: 32, fontWeight: 700, color: PH.text }}>{title}</span>
    </div>
  );
}

function WeekCalendar({ activeDays = [26] }: { activeDays?: number[] }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [23, 24, 25, 26, 27, 28, 29];
  return (
    <div style={{ margin: '0 24px 20px', padding: '18px 14px', backgroundColor: PH.bg, border: `1px solid ${PH.border}`, borderRadius: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <p style={{ fontSize: 22, fontWeight: 600, color: PH.text, margin: 0 }}>Nov 23 – Nov 29</p>
        <p style={{ fontSize: 17, color: PH.muted, margin: '3px 0 0' }}>This week</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {days.map((day, i) => {
          const active = activeDays.includes(dates[i]);
          const hasEvent = dates[i] === 24;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 17, color: PH.muted }}>{day}</span>
              <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: active ? PH.accent : 'transparent' }}>
                <span style={{ fontSize: 19, fontWeight: active ? 700 : 400, color: active ? '#fff' : PH.text }}>{dates[i]}</span>
              </div>
              {hasEvent && <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: PH.muted }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryPill({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 100, backgroundColor: PH.pill, fontSize: 19, color: PH.text, flexShrink: 0 }}>
      <span style={{ fontSize: 17 }}>{emoji}</span>
      <span>{label}</span>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return <p style={{ fontSize: 16, fontWeight: 700, color: PH.muted, letterSpacing: '0.08em', margin: '0 0 12px' }}>{text}</p>;
}

function ListRow({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${PH.border}` }}>
      <span style={{ fontSize: 17 }}>{emoji}</span>
      <span style={{ fontSize: 20, color: PH.text }}>{text}</span>
    </div>
  );
}

// ─── App screenshot templates ─────────────────────────────────────────────────

// "Everyone deserves a helping hand."
function HelpingHandAd({ config }: { config: AdConfig }) {
  const { dark } = config;
  const bg = dark ? BRAND.dark : '#bfd4e5';
  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden" style={{ backgroundColor: bg }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.05 }}
        style={{ display: 'flex', justifyContent: 'center', paddingTop: 52 }}>
        <img src={dark ? orbitsIcon : orbitsWordmark} alt="Orbits" style={{ height: dark ? 38 : 30, width: 'auto' }} />
      </motion.div>
      <div style={{ padding: '24px 110px 52px', textAlign: 'center' }}>
        <motion.h1 {...fadeUp(0.15)} style={{ color: c.fg(dark) }} className="text-[72px] font-serif font-medium leading-[1.1] tracking-[-0.01em] mb-[22px]">
          Everyone deserves<br />a helping hand.
        </motion.h1>
        <motion.p {...fadeUp(0.3)} style={{ color: c.fgMid(dark) }} className="text-[26px] leading-relaxed">
          Let Orbits request quotes and arrange<br />home services for you.
        </motion.p>
      </div>
      <motion.div initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, type: 'spring', stiffness: 55, damping: 18 }}
        style={{ display: 'flex', justifyContent: 'center' }}>
        <PhoneFrame>
          <PhoneTopBar title="Request help" />
          <div style={{ padding: '0 24px 28px' }}>
            <p style={{ fontSize: 19, color: PH.muted, marginBottom: 18, lineHeight: 1.45 }}>Tell us what you need. We'll follow up and help coordinate.</p>
            <SectionLabel text="CATEGORY" />
            <p style={{ fontSize: 23, fontWeight: 600, color: PH.text, margin: '0 0 12px' }}>Home & Repairs</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginBottom: 20 }}>
              {[['🔧','Appliance'],['⚡','Electrical'],['🔩','Plumbing'],['❄️','HVAC'],['🏠','Roof'],['❄️','Snow removal'],['🌿','Yard/landscape'],['🔨','Handyman']].map(([e,l]) => <CategoryPill key={l} emoji={e} label={l} />)}
            </div>
            <p style={{ fontSize: 23, fontWeight: 600, color: PH.text, margin: '0 0 12px' }}>Upkeep & Family</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
              {[['🧹','Cleaning'],['🐛','Pest control'],['🖌️','Painting'],['📦','Moving'],['👶','Babysitting'],['🐾','Pet care']].map(([e,l]) => <CategoryPill key={l} emoji={e} label={l} />)}
            </div>
          </div>
        </PhoneFrame>
      </motion.div>
    </div>
  );
}

// "Upkeep — spend less time maintaining your home"
function UpkeepAppAd({ config }: { config: AdConfig }) {
  const { dark } = config;
  const bg = dark ? BRAND.dark : '#c5c9b5';
  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden" style={{ backgroundColor: bg }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.05 }}
        style={{ display: 'flex', justifyContent: 'center', paddingTop: 52 }}>
        <img src={dark ? orbitsIcon : orbitsWordmark} alt="Orbits" style={{ height: dark ? 38 : 30, width: 'auto' }} />
      </motion.div>
      <div style={{ padding: '20px 110px 48px', textAlign: 'center' }}>
        <motion.h1 {...fadeUp(0.15)} style={{ color: c.fg(dark) }} className="text-[90px] font-serif font-medium leading-[1.05] tracking-[-0.02em] mb-[18px]">
          Upkeep
        </motion.h1>
        <motion.p {...fadeUp(0.28)} style={{ color: c.fgMid(dark) }} className="text-[26px] leading-relaxed">
          Spend less time maintaining your home,<br />and more time enjoying it.
        </motion.p>
      </div>
      <motion.div initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, type: 'spring', stiffness: 55, damping: 18 }}
        style={{ display: 'flex', justifyContent: 'center' }}>
        <PhoneFrame>
          <PhoneTopBar title="Upkeep" accent="#4c7a58" />
          <div style={{ padding: '0 24px 0', fontSize: 19, color: PH.muted, fontStyle: 'italic', marginBottom: 16 }}>
            From task lists to appliance warranties, keep track of it all in one place.
          </div>
          <WeekCalendar activeDays={[26]} />
          <div style={{ padding: '0 24px 24px' }}>
            <SectionLabel text="LISTS" />
            <div style={{ backgroundColor: PH.bg, border: `1px solid ${PH.border}`, borderRadius: 16, padding: '16px 18px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 22, fontWeight: 600, color: PH.text, margin: 0 }}>Kitchen Renovation</p>
                  <p style={{ fontSize: 17, color: PH.muted, margin: '3px 0 0' }}>0 of 4 completed</p>
                </div>
                <span style={{ color: PH.muted, fontSize: 22 }}>›</span>
              </div>
              <ListRow emoji="⏳" text="Replace sink" />
              <ListRow emoji="⏳" text="Sand countertop" />
              <ListRow emoji="⏳" text="Install new flooring" />
              <p style={{ fontSize: 17, color: PH.muted, margin: '8px 0 0' }}>+1 more items</p>
            </div>
            <div style={{ backgroundColor: PH.bg, border: `1px solid ${PH.border}`, borderRadius: 16, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 22, fontWeight: 600, color: PH.text, margin: 0 }}>Appliance Library</p>
                <p style={{ fontSize: 17, color: PH.muted, margin: '3px 0 0' }}>12 items</p>
              </div>
              <span style={{ color: PH.muted, fontSize: 22 }}>∨</span>
            </div>
          </div>
        </PhoneFrame>
      </motion.div>
    </div>
  );
}

// "Family — track it all in one place"
function FamilyAppAd({ config }: { config: AdConfig }) {
  const { dark } = config;
  const bg = dark ? BRAND.dark : '#f0bfa6';
  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden" style={{ backgroundColor: bg }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.05 }}
        style={{ display: 'flex', justifyContent: 'center', paddingTop: 52 }}>
        <img src={dark ? orbitsIcon : orbitsWordmark} alt="Orbits" style={{ height: dark ? 38 : 30, width: 'auto' }} />
      </motion.div>
      <div style={{ padding: '20px 110px 48px', textAlign: 'center' }}>
        <motion.h1 {...fadeUp(0.15)} style={{ color: c.fg(dark) }} className="text-[90px] font-serif font-medium leading-[1.05] tracking-[-0.02em] mb-[18px]">
          Family
        </motion.h1>
        <motion.p {...fadeUp(0.28)} style={{ color: c.fgMid(dark) }} className="text-[26px] leading-relaxed">
          Lists, appointments, or their favorite color —<br />track it all in one place.
        </motion.p>
      </div>
      <motion.div initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, type: 'spring', stiffness: 55, damping: 18 }}
        style={{ display: 'flex', justifyContent: 'center' }}>
        <PhoneFrame>
          <PhoneTopBar title="Family" accent="#4c7a58" />
          <div style={{ padding: '0 24px 0', fontSize: 19, color: PH.muted, fontStyle: 'italic', marginBottom: 16 }}>
            From grocery lists to their favorite colors, keep track of it all in one place.
          </div>
          <WeekCalendar activeDays={[27, 28]} />
          <div style={{ padding: '0 24px 24px' }}>
            <p style={{ fontSize: 21, fontWeight: 700, color: PH.text, margin: '0 0 12px' }}>Events for Tomorrow</p>
            <div style={{ backgroundColor: PH.bg, border: `1px solid ${PH.border}`, borderRadius: 16, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 21, fontWeight: 600, color: PH.text, margin: 0 }}>Lily's Dance Class</p>
                <p style={{ fontSize: 17, color: PH.muted, margin: '3px 0 0' }}>Fri, Nov 28 · 1:30 PM</p>
              </div>
              <span style={{ color: PH.muted, fontSize: 22 }}>›</span>
            </div>
            <SectionLabel text="FAMILY MEMBERS" />
            <div style={{ backgroundColor: PH.bg, border: `1px solid ${PH.border}`, borderRadius: 16, padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: PH.pill, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                  <span style={{ fontSize: 22, fontWeight: 600, color: PH.text }}>Lily</span>
                </div>
                <span style={{ color: PH.muted, fontSize: 22 }}>›</span>
              </div>
              {[['School','Birchdale College'],['Relationship','Child'],['Family Doctor','Dr. Rogers']].map(([k,v]) => (
                <p key={k} style={{ fontSize: 18, color: PH.text, margin: '4px 0' }}>
                  <span style={{ color: PH.muted }}>• </span><strong>{k}:</strong> {v}
                </p>
              ))}
            </div>
          </div>
        </PhoneFrame>
      </motion.div>
    </div>
  );
}

// "When in doubt, just ask Orbits." — headline at bottom
function AskOrbitsAd({ config }: { config: AdConfig }) {
  const { dark } = config;
  const bg = dark ? BRAND.dark : '#f5f0e6';
  return (
    <div style={{ position: 'relative', width: 1080, height: 1080, overflow: 'hidden', backgroundColor: bg, display: 'flex', flexDirection: 'column' }}>

      {/* ── Phone zone: clipped at 680px so phone content naturally cuts off ── */}
      <div style={{ height: 680, overflow: 'hidden', position: 'relative' }}>
        {/* Logo icon mark top-right */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.05 }}
          style={{ position: 'absolute', top: 44, right: 66 }}>
          <img src={orbitsIcon} alt="Orbits" style={{ height: 46, width: 46 }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 55, damping: 18 }}
          style={{ display: 'flex', justifyContent: 'center', paddingTop: 52 }}
        >
          <PhoneFrame>
            <div style={{ padding: '0 24px 16px' }}>
              <WeekCalendar activeDays={[27]} />
              <div style={{ padding: '0 0 8px' }}>
                <p style={{ fontSize: 21, fontWeight: 700, color: PH.text, margin: '0 0 10px' }}>Events for Today</p>
                <div style={{ backgroundColor: PH.bg, border: `1px solid ${PH.border}`, borderRadius: 14, padding: '14px 16px', textAlign: 'center' }}>
                  <p style={{ fontSize: 19, color: PH.muted, margin: 0 }}>No events scheduled</p>
                </div>
              </div>
              {/* Ask Orbits dialog overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 80, damping: 14 }}
                style={{ backgroundColor: '#fff', border: `1px solid ${PH.border}`, borderRadius: 20, padding: '18px 18px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', marginTop: 12 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: PH.text }}>Ask Orbits...</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 22, color: PH.muted }}>⚙</span>
                    <span style={{ fontSize: 22, color: PH.muted }}>✕</span>
                  </div>
                </div>
                <p style={{ fontSize: 18, color: PH.muted, margin: '0 0 12px' }}>Create...</p>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1, backgroundColor: PH.pill, borderRadius: 12, padding: '11px 14px', textAlign: 'center', fontSize: 20, fontWeight: 600, color: PH.text }}>📅 Event</div>
                  <div style={{ flex: 1, backgroundColor: PH.pill, borderRadius: 12, padding: '11px 14px', textAlign: 'center', fontSize: 20, fontWeight: 600, color: PH.text }}>⏰ Reminder</div>
                </div>
                <div style={{ backgroundColor: PH.pill, borderRadius: 12, padding: '11px 14px', textAlign: 'center', fontSize: 20, fontWeight: 600, color: PH.text, marginBottom: 14 }}>🔧🌿🏠 Find help →</div>
                <p style={{ fontSize: 16, color: '#b4a040', margin: '0 0 8px' }}>✦ Suggested for you</p>
                {['👤  Add family member', '🐾  Add pet', '＋  Add... ›'].map((item) => (
                  <div key={item} style={{ backgroundColor: PH.pill, borderRadius: 12, padding: '11px 14px', fontSize: 19, color: PH.text, marginBottom: 8 }}>{item}</div>
                ))}
              </motion.div>
            </div>
          </PhoneFrame>
        </motion.div>
      </div>

      {/* ── Headline zone: 400px of clean space ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 100px' }}>
        <motion.h1
          {...fadeUp(0.72)}
          style={{ color: c.fg(dark), margin: 0, textAlign: 'center' }}
          className="text-[74px] font-serif font-normal leading-[1.1] tracking-[-0.01em]"
        >
          When in doubt,<br />just ask Orbits.
        </motion.h1>
      </div>

    </div>
  );
}

// "Your household, at a glance."
function AtAGlanceAd({ config }: { config: AdConfig }) {
  const { dark } = config;
  const bg = dark ? BRAND.dark : '#f0ebe0';
  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden" style={{ backgroundColor: bg }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.05 }}
        style={{ display: 'flex', justifyContent: 'center', paddingTop: 52 }}>
        <img src={dark ? orbitsIcon : orbitsWordmark} alt="Orbits" style={{ height: dark ? 38 : 30, width: 'auto' }} />
      </motion.div>
      <div style={{ padding: '20px 110px 48px', textAlign: 'center' }}>
        <motion.h1 {...fadeUp(0.15)} style={{ color: c.fg(dark) }} className="text-[76px] font-serif font-medium leading-[1.1] tracking-[-0.01em]">
          Your household,<br />at a glance.
        </motion.h1>
      </div>
      <motion.div initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, type: 'spring', stiffness: 55, damping: 18 }}
        style={{ display: 'flex', justifyContent: 'center' }}>
        <PhoneFrame>
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 26, fontWeight: 700, color: PH.text, margin: '0 0 4px' }}>🌅 Good morning, Ellie.</p>
              <p style={{ fontSize: 18, color: PH.muted }}>Wednesday, November 26</p>
            </div>
            <div style={{ backgroundColor: PH.bg, border: `1px solid ${PH.border}`, borderRadius: 16, padding: '14px 18px', marginBottom: 20 }}>
              <p style={{ fontSize: 17, color: PH.muted, margin: '0 0 8px' }}>Current Weather</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 32 }}>☀️</span>
                  <div>
                    <p style={{ fontSize: 26, fontWeight: 700, color: PH.text, margin: 0 }}>72°F</p>
                    <p style={{ fontSize: 17, color: PH.muted, margin: 0 }}>Clear Sky</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 17, color: PH.muted }}>
                  <p style={{ margin: 0 }}>💨 8 mph</p>
                  <p style={{ margin: 0 }}>💧 65%</p>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 19, fontWeight: 700, color: '#b4a040', margin: '0 0 12px' }}>✦ Orbits Overview</p>
            <div style={{ backgroundColor: PH.bg, border: `1px solid ${PH.border}`, borderRadius: 16, padding: '14px 18px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>👥</span>
                  <div>
                    <p style={{ fontSize: 21, fontWeight: 700, color: PH.text, margin: 0 }}>Family</p>
                    <p style={{ fontSize: 16, color: PH.muted, margin: 0 }}>Family events and activities</p>
                  </div>
                </div>
                <span style={{ color: PH.muted, fontSize: 22 }}>›</span>
              </div>
              {[['⚽','Soccer Game','Nov 26, 7:00 PM'],['🦷','Dentist Appointment','Nov 27, 12:00 PM'],['🍽️','Family Dinner','Nov 29, 8:00 PM']].map(([e,t,d]) => (
                <div key={t} style={{ display: 'flex', gap: 10, padding: '5px 0', borderTop: `1px solid ${PH.border}` }}>
                  <span style={{ fontSize: 17, marginTop: 2 }}>{e}</span>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 500, color: PH.text, margin: 0 }}>{t}</p>
                    <p style={{ fontSize: 15, color: PH.muted, margin: 0 }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ backgroundColor: PH.bg, border: `1px solid ${PH.border}`, borderRadius: 16, padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>🏠</span>
                  <div>
                    <p style={{ fontSize: 21, fontWeight: 700, color: PH.text, margin: 0 }}>Upkeep</p>
                    <p style={{ fontSize: 16, color: PH.muted, margin: 0 }}>Home maintenance and repairs</p>
                  </div>
                </div>
                <span style={{ color: PH.muted, fontSize: 22 }}>›</span>
              </div>
              {[['🔧','Garage Repair','Nov 27, 12:00 PM'],['✂️','Grass Cutting','Nov 28, 8:00 AM']].map(([e,t,d]) => (
                <div key={t} style={{ display: 'flex', gap: 10, padding: '5px 0', borderTop: `1px solid ${PH.border}` }}>
                  <span style={{ fontSize: 17, marginTop: 2 }}>{e}</span>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 500, color: PH.text, margin: 0 }}>{t}</p>
                    <p style={{ fontSize: 15, color: PH.muted, margin: 0 }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PhoneFrame>
      </motion.div>
    </div>
  );
}

// ─── Reels canvas components (1080 × 1920) ──────────────────────────────────

// Shared reels background
function ReelsBackground({ dark }: { dark: boolean }) {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: dark ? BRAND.dark : BRAND.bg }} />
  );
}

// Reels logo watermark — centered near bottom
function ReelsLogo({ delay = 2.0, dark }: { delay?: number; dark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      style={{ position: 'absolute', bottom: 100, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}
    >
      {dark ? (
        <img src={orbitsIcon} alt="Orbits" style={{ height: 64, width: 'auto' }} />
      ) : (
        <img src={orbitsWordmark} alt="Orbits" style={{ height: 46, width: 'auto' }} />
      )}
    </motion.div>
  );
}

// Instagram Reels UI chrome overlay
function ReelsChrome({ showChrome }: { showChrome: boolean }) {
  if (!showChrome) return null;

  const shadow = 'drop-shadow(0 1px 6px rgba(0,0,0,0.8))';
  const textShadow = '0 1px 6px rgba(0,0,0,0.8)';

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, pointerEvents: 'none', fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {/* ── Top gradient + bar ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '72px 44px 0' }}>
          <span style={{ fontSize: 44, color: '#fff', filter: shadow }}>←</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: '#fff', letterSpacing: 0.5, filter: shadow }}>Reels</span>
          <span style={{ fontSize: 44, color: '#fff', filter: shadow }}>📷</span>
        </div>
      </div>

      {/* ── Right action bar ── */}
      <div style={{
        position: 'absolute', right: 28, top: '50%', transform: 'translateY(-40%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 52,
      }}>
        {/* Profile avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            backgroundColor: '#fefcf6', border: '3px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
          }}>
            <img src={orbitsIcon} alt="" style={{ width: 66, height: 66 }} />
          </div>
          {/* Follow + button */}
          <div style={{
            width: 34, height: 34, borderRadius: '50%', backgroundColor: '#0095f6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: -18, border: '2.5px solid #fff',
          }}>
            <span style={{ color: '#fff', fontSize: 24, fontWeight: 700, lineHeight: 1 }}>+</span>
          </div>
        </div>

        {/* Like */}
        {[
          { icon: '🤍', label: '2,847' },
          { icon: '💬', label: '234' },
          { icon: '➤', label: '1.2K' },
          { icon: '🔖', label: '' },
          { icon: '⋯', label: '' },
        ].map(({ icon, label }) => (
          <div key={icon} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 68, lineHeight: 1, filter: icon === '➤' || icon === '⋯' ? shadow : undefined }}>
              {icon}
            </span>
            {label && <span style={{ fontSize: 28, color: '#fff', fontWeight: 600, textShadow }}>{label}</span>}
          </div>
        ))}
      </div>

      {/* ── Bottom gradient + info ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)',
        padding: '120px 44px 0',
      }}>
        {/* Username + caption */}
        <div style={{ marginRight: 160, marginBottom: 18 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: '#fff', textShadow }}>@tryorbits</span>
          <span style={{ fontSize: 32, color: 'rgba(255,255,255,0.9)', marginLeft: 14, textShadow }}>
            Your AI household assistant ✨ <span style={{ opacity: 0.75 }}>...more</span>
          </span>
        </div>

        {/* Music bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36, marginRight: 160 }}>
          <span style={{ fontSize: 28, filter: shadow }}>🎵</span>
          <span style={{ fontSize: 28, color: '#fff', textShadow }}>Original audio · Orbits</span>
        </div>

        {/* Bottom nav */}
        <div style={{
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          paddingBottom: 52, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 18,
        }}>
          {[
            { icon: '⌂', active: false },
            { icon: '⊕', active: false },
            { icon: '＋', active: false, box: true },
            { icon: '▶', active: true },
            { icon: '◯', active: false },
          ].map(({ icon, active, box }, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {box ? (
                <div style={{ width: 64, height: 52, borderRadius: 12, border: '2.5px solid rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 36, color: '#fff', textShadow }}>{icon}</span>
                </div>
              ) : (
                <span style={{ fontSize: 52, color: active ? '#fff' : 'rgba(255,255,255,0.7)', textShadow, filter: active ? shadow : undefined }}>{icon}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 1. Hook — "Are you running a household or is it running you?"
function ReelHookAd({ config }: { config: AdConfig }) {
  const { dark, accentColor, showChrome } = config;
  const accentHex = ACCENT_HEX[accentColor];
  const words = ['Are you', 'running a', 'household,', 'or is it', 'running', 'you?'];
  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden' }}>
      <ReelsBackground dark={dark} />
      <div style={{ position: 'absolute', top: 148, left: 64, right: 180, bottom: 400, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 80, damping: 14 }}
          style={{ marginBottom: 100 }}>
          <img src={orbitsIcon} alt="Orbits" style={{ height: 100, width: 100 }} />
        </motion.div>

        <div style={{ marginBottom: 90 }}>
          {words.map((word, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.18, type: 'spring', stiffness: 70, damping: 14 }}>
              <span style={{
                display: 'block',
                fontSize: i === words.length - 1 ? 180 : 148,
                fontFamily: 'Lora, serif',
                fontWeight: 400,
                lineHeight: 1.04,
                letterSpacing: '-0.02em',
                color: i === words.length - 1 ? accentHex : c.fg(dark),
              }}>{word}</span>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(1.5)} style={{ fontSize: 52, color: c.fgSoft(dark), lineHeight: 1.4, maxWidth: 750 }}>
          Orbits changes the answer.
        </motion.p>
      </div>
      <ReelsLogo delay={1.9} dark={dark} />
      <ReelsChrome showChrome={showChrome} />
    </div>
  );
}

// 2. Feature list — items reveal one by one
function ReelListAd({ config }: { config: AdConfig }) {
  const { dark, accentColor, showChrome } = config;
  const accentHex = ACCENT_HEX[accentColor];
  const features = [
    'Manages your grocery lists',
    'Syncs your family calendar',
    'Books home services',
    'Tracks appliances & warranties',
    'Coordinates everything',
  ];
  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden' }}>
      <ReelsBackground dark={dark} />
      <div style={{ position: 'absolute', top: 148, left: 64, right: 180, bottom: 400, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 0.05 }}
          style={{ marginBottom: 80 }}>
          {dark
            ? <img src={orbitsIcon} alt="Orbits" style={{ height: 90, width: 90 }} />
            : <img src={orbitsWordmark} alt="Orbits" style={{ height: 60, width: 'auto' }} />}
        </motion.div>

        <motion.h1 {...slideIn(0.2)} style={{ fontSize: 116, fontFamily: 'Lora, serif', fontWeight: 400, color: c.fg(dark), lineHeight: 1.1, marginBottom: 72 }}>
          What Orbits<br />does for you.
        </motion.h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, marginBottom: 90 }}>
          {features.map((feat, i) => (
            <motion.div key={feat} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.2, type: 'spring', stiffness: 72, damping: 16 }}
              style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <div style={{ width: 58, height: 58, borderRadius: '50%', backgroundColor: accentHex, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 30, color: BRAND.dark }}>✓</span>
              </div>
              <span style={{ fontSize: 52, color: c.fgMid(dark), lineHeight: 1.25 }}>{feat}</span>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(1.8)} style={{ display: 'inline-flex', alignItems: 'center', padding: '26px 52px', borderRadius: 100, backgroundColor: ACCENT_CTA_BG[accentColor] }}>
          <span style={{ fontSize: 44, fontWeight: 700, color: ACCENT_CTA_FG[accentColor] }}>Get it today →</span>
        </motion.div>
      </div>
      <ReelsChrome showChrome={showChrome} />
    </div>
  );
}

// 3. Before / After — two-panel split
function ReelBeforeAfterAd({ config }: { config: AdConfig }) {
  const { dark, accentColor, showChrome } = config;
  const accentHex = ACCENT_HEX[accentColor];
  const before = ['4 apps, 3 group chats', '12 notifications', 'Still forgot the dentist', 'Mental load: maximum'];
  const after = ['One place', 'One AI', 'Nothing slips', 'Mental load: gone'];
  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden' }}>
      <ReelsBackground dark={dark} />
      <div style={{ position: 'absolute', top: 148, left: 64, right: 180, bottom: 400, zIndex: 10, display: 'flex', flexDirection: 'column' }}>

        {/* BEFORE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 32px 24px 0' }}>
          <motion.p {...fadeUp(0.1)} style={{ fontSize: 44, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: c.fgSoft(dark), marginBottom: 44 }}>Before Orbits</motion.p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {before.map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 72, damping: 16 }}
                style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                <span style={{ fontSize: 52, color: c.fgSoft(dark), flexShrink: 0 }}>✕</span>
                <span style={{ fontSize: 72, color: c.fgMid(dark), lineHeight: 1.15 }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.5 }}
          style={{ height: 2, backgroundColor: c.rule(dark), margin: '0 32px 0 0', originX: 0 }} />

        {/* AFTER */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 32px 24px 0' }}>
          <motion.p {...fadeUp(1.0)} style={{ fontSize: 44, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accentHex, marginBottom: 44 }}>After Orbits</motion.p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {after.map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.15, type: 'spring', stiffness: 72, damping: 16 }}
                style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                <span style={{ fontSize: 52, color: accentHex, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 72, color: c.fg(dark), fontWeight: 500, lineHeight: 1.15 }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Logo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 1.8 }}
          style={{ display: 'flex', justifyContent: 'center', paddingBottom: 16 }}>
          {dark
            ? <img src={orbitsIcon} alt="Orbits" style={{ height: 70, width: 70 }} />
            : <img src={orbitsWordmark} alt="Orbits" style={{ height: 48, width: 'auto' }} />}
        </motion.div>
      </div>
      <ReelsChrome showChrome={showChrome} />
    </div>
  );
}

// 4. Stat — giant number impact
function ReelStatAd({ config }: { config: AdConfig }) {
  const { dark, accentColor, showChrome } = config;
  const accentHex = ACCENT_HEX[accentColor];
  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden' }}>
      <ReelsBackground dark={dark} />
      <div style={{ position: 'absolute', top: 148, left: 64, right: 180, bottom: 400, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 55, damping: 12 }}>
          <span style={{ fontSize: 420, fontFamily: 'Lora, serif', fontWeight: 400, color: accentHex, lineHeight: 0.88, display: 'block' }}>3+</span>
        </motion.div>

        <motion.p {...fadeUp(0.55)} style={{ fontSize: 80, color: c.fg(dark), lineHeight: 1.2, marginBottom: 24, fontFamily: 'Lora, serif', fontWeight: 400 }}>
          hours every week
        </motion.p>
        <motion.p {...fadeUp(0.72)} style={{ fontSize: 58, color: c.fgMid(dark), lineHeight: 1.3, marginBottom: 90 }}>
          just running your household.
        </motion.p>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.95, duration: 0.5 }}
          style={{ height: 4, width: 140, backgroundColor: accentHex, borderRadius: 2, marginBottom: 72, originX: 0.5 }} />

        <motion.p {...fadeUp(1.1)} style={{ fontSize: 110, fontFamily: 'Lora, serif', fontWeight: 400, color: c.fg(dark), lineHeight: 1.08, marginBottom: 90 }}>
          Give them back.
        </motion.p>

        <motion.p {...fadeUp(1.3)} style={{ fontSize: 46, color: c.fgSoft(dark) }}>
          Download Orbits free · tryorbits.com
        </motion.p>
      </div>
      <ReelsLogo delay={1.6} dark={dark} />
      <ReelsChrome showChrome={showChrome} />
    </div>
  );
}

// 5. CTA — strong download prompt
function ReelCtaAd({ config }: { config: AdConfig }) {
  const { dark, accentColor, showChrome } = config;
  const accentHex = ACCENT_HEX[accentColor];
  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden' }}>
      <ReelsBackground dark={dark} />
      <div style={{ position: 'absolute', top: 148, left: 64, right: 180, bottom: 400, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: 'spring', stiffness: 80, damping: 14 }}
          style={{ marginBottom: 110 }}>
          <img src={orbitsIcon} alt="Orbits" style={{ height: 140, width: 140 }} />
        </motion.div>

        <motion.h1 {...fadeUp(0.3)} style={{ fontSize: 120, fontFamily: 'Lora, serif', fontWeight: 400, color: c.fg(dark), lineHeight: 1.08, marginBottom: 64 }}>
          Your home deserves better than a notes app.
        </motion.h1>

        <motion.p {...fadeUp(0.65)} style={{ fontSize: 56, color: c.fgMid(dark), lineHeight: 1.45, marginBottom: 100, maxWidth: 840 }}>
          Orbits is the AI that manages your household — groceries, calendar, maintenance, services.
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, type: 'spring', stiffness: 90, damping: 14 }}
          style={{ backgroundColor: ACCENT_CTA_BG[accentColor], borderRadius: 100, padding: '36px 80px', marginBottom: 52 }}>
          <span style={{ fontSize: 52, fontWeight: 700, color: ACCENT_CTA_FG[accentColor] }}>Get it today →</span>
        </motion.div>

        <motion.p {...fadeUp(1.3)} style={{ fontSize: 44, color: c.fgSoft(dark) }}>
          tryorbits.com
        </motion.p>
      </div>
      <ReelsChrome showChrome={showChrome} />
    </div>
  );
}

// ─── New intent-based square posts (phone mockup style) ─────────────────────

// Shared phone-layout wrapper for the 8 new posts
function PhonePost({
  bg, dark, headline, subheadline, logoDelay = 0.05, headDelay = 0.15, phoneDelay = 0.42, children,
}: {
  bg: string; dark: boolean; headline: string; subheadline?: string;
  logoDelay?: number; headDelay?: number; phoneDelay?: number; children: React.ReactNode;
}) {
  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden" style={{ backgroundColor: bg }}>
      {/* Compact header — keeps phone high so it bleeds off the bottom */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: logoDelay }}
        style={{ display: 'flex', justifyContent: 'center', paddingTop: 44 }}>
        <img src={dark ? orbitsIcon : orbitsWordmark} alt="Orbits"
          style={{ height: dark ? 34 : 27, width: 'auto', filter: dark ? 'brightness(0) invert(1)' : 'brightness(0)' }} />
      </motion.div>
      <div style={{ padding: '14px 90px 32px', textAlign: 'center' }}>
        <motion.h1 {...fadeUp(headDelay)} style={{ color: dark ? BRAND.bg : BRAND.dark }}
          className="text-[62px] font-serif font-medium leading-[1.08] tracking-[-0.01em] mb-[10px]">
          {headline}
        </motion.h1>
        {subheadline && (
          <motion.p {...fadeUp(headDelay + 0.12)} style={{ color: dark ? `${BRAND.bg}99` : `${BRAND.dark}88` }}
            className="text-[24px] leading-relaxed">
            {subheadline}
          </motion.p>
        )}
      </div>
      {/* Phone scales up 1.12× so content always bleeds off the bottom edge */}
      <motion.div initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: phoneDelay, type: 'spring', stiffness: 55, damping: 18 }}
        style={{ display: 'flex', justifyContent: 'center', transform: 'scale(1.12)', transformOrigin: 'top center' }}>
        {children}
      </motion.div>
    </div>
  );
}

// 1. Instacart — smart grocery list
function InstacartAd({ config }: { config: AdConfig }) {
  const { dark, accentColor } = config;
  const accentHex = ACCENT_HEX[accentColor];
  const items = [
    { emoji: '🧁', text: 'Brown sugar + butter', tag: "Bake sale Thu" },
    { emoji: '🥚', text: 'Eggs (2 dozen)', tag: "Bake sale Thu" },
    { emoji: '🐾', text: 'Dog food (large)', tag: 'Milo running low' },
    { emoji: '💊', text: "Jake's vitamins", tag: 'Subscription due' },
    { emoji: '🧼', text: 'Dishwasher pods', tag: 'Last pack' },
  ];
  return (
    <PhonePost bg={dark ? BRAND.dark : '#d0e8d4'} dark={dark}
      headline="Your groceries order themselves."
      subheadline="Orbits tracks what you need and handles the shopping.">
      <PhoneFrame>
        <PhoneTopBar title="Grocery List" accent={PH.accent} />
        <div style={{ padding: '0 24px' }}>
          <p style={{ fontSize: 19, color: PH.muted, fontStyle: 'italic', marginBottom: 14 }}>
            Added automatically by Orbits:
          </p>
          {items.map(({ emoji, text, tag }, i) => (
            <motion.div key={text} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.12, type: 'spring', stiffness: 75, damping: 16 }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < items.length - 1 ? `1px solid ${PH.border}` : 'none' }}>
              <span style={{ fontSize: 28 }}>{emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 24, fontWeight: 600, color: PH.text, margin: 0 }}>{text}</p>
                <p style={{ fontSize: 19, color: PH.muted, margin: '3px 0 0' }}>{tag}</p>
              </div>
              <div style={{ width: 26, height: 26, borderRadius: '50%', border: `2px solid ${PH.border}` }} />
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, backgroundColor: '#d0e8d4', borderRadius: 14, padding: '14px 18px', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <img src={instacartLogo} alt="Instacart" style={{ height: 20, width: 'auto', flexShrink: 0 }} />
              <span style={{ fontSize: 20, fontWeight: 600, color: PH.text, whiteSpace: 'nowrap' }}>delivery scheduled</span>
            </div>
            <span style={{ fontSize: 20, color: PH.accent, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>Wed 6pm ✓</span>
          </motion.div>
        </div>
      </PhoneFrame>
    </PhonePost>
  );
}

// 2. Amazon — home auto-orders supplies
function AmazonAd({ config }: { config: AdConfig }) {
  const { dark } = config;
  const orders = [
    { emoji: '🌀', item: 'HVAC filter (MERV 13)', reason: 'Overdue — 3 months', arrives: 'Fri' },
    { emoji: '🧼', item: 'Dishwasher pods (90ct)', reason: 'Running low', arrives: 'Fri' },
    { emoji: '💡', item: 'LED bulbs (6-pack)', reason: 'Burned out — garage', arrives: 'Fri' },
    { emoji: '🐾', item: 'Dog flea treatment', reason: 'Monthly auto-refill', arrives: 'Fri' },
  ];
  return (
    <PhonePost bg={dark ? BRAND.dark : '#c2d8e9'} dark={dark}
      headline="Your home orders its own supplies."
      subheadline="No more running out of things.">
      <PhoneFrame>
        <div style={{ padding: '0 24px 24px' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, backgroundColor: '#e8f4ff', borderRadius: 14, padding: '14px 18px', marginBottom: 18 }}>
            <span style={{ fontSize: 30 }}>📦</span>
            <div>
              <p style={{ fontSize: 22, fontWeight: 700, color: PH.text, margin: 0 }}>Orbits ordered overnight</p>
              <p style={{ fontSize: 18, color: PH.accent, margin: '3px 0 0' }}>Amazon Prime · All arrive Friday</p>
            </div>
          </motion.div>
          {orders.map(({ emoji, item, reason }, i) => (
            <motion.div key={item} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.62 + i * 0.13, type: 'spring', stiffness: 75, damping: 16 }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < orders.length - 1 ? `1px solid ${PH.border}` : 'none' }}>
              <span style={{ fontSize: 30, flexShrink: 0 }}>{emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 23, fontWeight: 600, color: PH.text, margin: 0 }}>{item}</p>
                <p style={{ fontSize: 18, color: PH.muted, margin: '3px 0 0' }}>{reason}</p>
              </div>
              <span style={{ fontSize: 20, color: PH.accent, fontWeight: 700 }}>✓</span>
            </motion.div>
          ))}
        </div>
      </PhoneFrame>
    </PhonePost>
  );
}

// 3. Group chat friend analogy
function GroupChatAd({ config }: { config: AdConfig }) {
  const { dark } = config;
  const suggestions = [
    { emoji: '🔧', text: 'Best plumber in your area', sub: '⭐ 4.9 · Dave\'s Plumbing' },
    { emoji: '🔔', text: 'Furnace filter due in 5 days', sub: 'Ordered replacement — arrives Tue' },
    { emoji: '📋', text: 'Insurance claim #4821', sub: 'Found error · Called & disputed' },
    { emoji: '🚗', text: 'Car registration expires Jan 31', sub: 'Added reminder + DMV link' },
  ];
  return (
    <PhonePost bg={dark ? BRAND.dark : '#f0e8ff'} dark={dark}
      headline="You know that friend who handles everything?"
      subheadline="That's Orbits. For your home.">
      <PhoneFrame>
        <PhoneTopBar title="Orbits Suggestions" />
        <div style={{ padding: '0 24px 20px' }}>
          <p style={{ fontSize: 19, color: PH.muted, fontStyle: 'italic', marginBottom: 14 }}>
            ✦ Proactively identified for you
          </p>
          {suggestions.map(({ emoji, text, sub }, i) => (
            <motion.div key={text} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.16, type: 'spring', stiffness: 75, damping: 16 }}
              style={{ backgroundColor: PH.bg, border: `1px solid ${PH.border}`, borderRadius: 14, padding: '14px 18px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 26 }}>{emoji}</span>
                <div>
                  <p style={{ fontSize: 23, fontWeight: 600, color: PH.text, margin: 0 }}>{text}</p>
                  <p style={{ fontSize: 18, color: PH.accent, margin: '3px 0 0' }}>{sub}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </PhoneFrame>
    </PhonePost>
  );
}

// 4. Bills — tracked, disputed, handled
function BillsAd({ config }: { config: AdConfig }) {
  const { dark } = config;
  const bills = [
    { emoji: '⚡', name: 'Electricity · Con Ed', amount: '$184', status: '✓ Reviewed', statusColor: PH.muted },
    { emoji: '📡', name: 'Internet · Optimum', amount: '$89→$54', status: '↓ Negotiated down', statusColor: PH.accent },
    { emoji: '🏥', name: 'Medical · NYP', amount: '$340', status: '⚠ Error found · Disputed', statusColor: '#c0622a' },
    { emoji: '🏠', name: 'Home Insurance', amount: '$210', status: '✓ Renewed on time', statusColor: PH.muted },
  ];
  return (
    <PhonePost bg={dark ? BRAND.dark : '#f0d8c8'} dark={dark}
      headline="That bill? Handled."
      subheadline="Orbits tracks, disputes, and resolves for you.">
      <PhoneFrame>
        <PhoneTopBar title="Bills & Payments" />
        <div style={{ padding: '0 24px 24px' }}>
          {bills.map(({ emoji, name, amount, status, statusColor }, i) => (
            <motion.div key={name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.14, type: 'spring', stiffness: 75, damping: 16 }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: i < bills.length - 1 ? `1px solid ${PH.border}` : 'none' }}>
              <span style={{ fontSize: 30, flexShrink: 0 }}>{emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 22, fontWeight: 600, color: PH.text, margin: 0 }}>{name}</p>
                <p style={{ fontSize: 19, color: statusColor, margin: '4px 0 0', fontWeight: 500 }}>{status}</p>
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: PH.text, margin: 0 }}>{amount}</p>
            </motion.div>
          ))}
        </div>
      </PhoneFrame>
    </PhonePost>
  );
}

// 5. AI Lists — context-aware, self-populating
function AiListsAd({ config }: { config: AdConfig }) {
  const { dark } = config;
  const listItems = [
    { emoji: '🧁', text: 'Brown sugar (2 cups)', ctx: "Lily's bake sale Thu" },
    { emoji: '💊', text: "Jake's prescription", ctx: 'Last one ends Friday' },
    { emoji: '🐾', text: 'Dog food (large bag)', ctx: 'Milo running low' },
    { emoji: '💡', text: 'LED bulbs (6-pack)', ctx: 'Garage bulb burned out' },
    { emoji: '🌀', text: 'HVAC filter (MERV 13)', ctx: '90-day reminder hit' },
  ];
  return (
    <PhonePost bg={dark ? BRAND.dark : '#e8d8f8'} dark={dark}
      headline="Lists that know what to add."
      subheadline="Orbits reads your home and fills in the blanks.">
      <PhoneFrame>
        <PhoneTopBar title="My Lists" />
        <div style={{ padding: '0 24px' }}>
          <p style={{ fontSize: 19, fontWeight: 700, color: PH.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>GROCERY</p>
          {listItems.map(({ emoji, text, ctx }, i) => (
            <motion.div key={text} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.48 + i * 0.14 }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: i < listItems.length - 1 ? `1px solid ${PH.border}` : 'none' }}>
              <span style={{ fontSize: 26 }}>{emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 23, fontWeight: 600, color: PH.text, margin: 0 }}>{text}</p>
                <p style={{ fontSize: 18, color: PH.accent, margin: '3px 0 0' }}>← {ctx}</p>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${PH.border}` }} />
            </motion.div>
          ))}
        </div>
      </PhoneFrame>
    </PhonePost>
  );
}

// 6. App features — feature showcase with phone
function AppFeaturesAd({ config }: { config: AdConfig }) {
  const { dark } = config;
  const sections = [
    { emoji: '☀️', title: 'Today', items: ['Soccer Game · 7pm', 'Dentist · Nov 27', 'Grocery delivery · 6pm'] },
    { emoji: '🔧', title: 'Upkeep', items: ['HVAC filter due', 'Kitchen renovation · 0/4', 'Appliance library'] },
    { emoji: '👥', title: 'Family', items: ["Lily · Dance class Fri", 'Jake · Dr. Rogers ref.', 'Milo · Vet Jan 15'] },
  ];
  return (
    <PhonePost bg={dark ? BRAND.dark : '#f0ebe0'} dark={dark}
      headline="One app. Every corner of your home."
      subheadline="Meet your new household assistant.">
      <PhoneFrame>
        <div style={{ padding: '0 24px 20px' }}>
          <p style={{ fontSize: 22, fontWeight: 700, color: PH.text, marginBottom: 14 }}>✦ Orbits Overview</p>
          {sections.map(({ emoji, title, items }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.18, type: 'spring', stiffness: 75, damping: 16 }}
              style={{ backgroundColor: PH.bg, border: `1px solid ${PH.border}`, borderRadius: 16, padding: '14px 18px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{emoji}</span>
                  <p style={{ fontSize: 22, fontWeight: 700, color: PH.text, margin: 0 }}>{title}</p>
                </div>
                <span style={{ fontSize: 20, color: PH.muted }}>›</span>
              </div>
              {items.map((item) => (
                <p key={item} style={{ fontSize: 19, color: PH.muted, margin: '5px 0 0', paddingLeft: 6 }}>· {item}</p>
              ))}
            </motion.div>
          ))}
        </div>
      </PhoneFrame>
    </PhonePost>
  );
}

// 7. Service requests — find, vet, book
function ServiceRequestsAd({ config }: { config: AdConfig }) {
  const { dark } = config;
  const categories1 = [['🔧','Plumbing'],['❄️','HVAC'],['🏠','Roofing'],['⚡','Electrical'],['🔩','Appliance']];
  const categories2 = [['🧹','Cleaning'],['🐛','Pest control'],['👶','Babysitting'],['🌿','Landscaping'],['📦','Moving']];
  return (
    <PhonePost bg={dark ? BRAND.dark : '#bfd4e5'} dark={dark}
      headline="Everyone deserves a helping hand."
      subheadline="Orbits finds, vets, and books every service you need.">
      <PhoneFrame>
        <PhoneTopBar title="Request Help" />
        <div style={{ padding: '0 24px 24px' }}>
          <p style={{ fontSize: 19, color: PH.muted, marginBottom: 16 }}>Tell us what you need. We'll follow up and coordinate.</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: PH.text, marginBottom: 10, letterSpacing: '0.06em' }}>HOME & REPAIRS</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
            {categories1.map(([e, l], i) => (
              <motion.div key={l} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 110, damping: 14 }}
                style={{ backgroundColor: PH.pill, borderRadius: 100, padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 18 }}>{e}</span>
                <span style={{ fontSize: 20, color: PH.text }}>{l}</span>
              </motion.div>
            ))}
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: PH.text, marginBottom: 10, letterSpacing: '0.06em' }}>UPKEEP & FAMILY</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {categories2.map(([e, l], i) => (
              <motion.div key={l} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.08, type: 'spring', stiffness: 110, damping: 14 }}
                style={{ backgroundColor: PH.pill, borderRadius: 100, padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 18 }}>{e}</span>
                <span style={{ fontSize: 20, color: PH.text }}>{l}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </PhoneFrame>
    </PhonePost>
  );
}

// 8. Pets — your whole family, including the ones with paws
function PetsAd({ config }: { config: AdConfig }) {
  const { dark } = config;
  const family = [
    { initials: 'JM', bg: '#b4e0cb', name: 'Jake' },
    { initials: 'EK', bg: '#e0b2df', name: 'Ellie' },
    { initials: 'LM', bg: '#89acbe', name: 'Lily' },
  ];
  const petItems = [
    { emoji: '🏥', label: 'Vet appointment', value: 'Jan 15 · Booked' },
    { emoji: '💊', label: 'Heartworm prescription', value: 'Auto-refilled' },
    { emoji: '🛒', label: 'Dog food delivery', value: 'Every 3 weeks' },
    { emoji: '✂️', label: 'Grooming', value: 'Jan 22 · Scheduled' },
  ];
  return (
    <PhonePost bg={dark ? BRAND.dark : '#f5d0c0'} dark={dark}
      headline="Your whole family is in Orbits."
      subheadline="Including the members with four legs. 🐾">
      <PhoneFrame>
        <PhoneTopBar title="Family" accent={PH.accent} />
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
            {family.map(({ initials, bg, name }) => (
              <div key={name} style={{ flex: 1, textAlign: 'center', backgroundColor: PH.bg, border: `1px solid ${PH.border}`, borderRadius: 14, padding: '12px 8px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: bg, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: BRAND.dark }}>{initials}</span>
                </div>
                <p style={{ fontSize: 20, fontWeight: 600, color: PH.text, margin: 0 }}>{name}</p>
              </div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, type: 'spring', stiffness: 70, damping: 16 }}
            style={{ backgroundColor: '#fff8f0', border: '1px solid #f0c8a0', borderRadius: 16, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>🐕</span>
              <div>
                <p style={{ fontSize: 22, fontWeight: 700, color: PH.text, margin: 0 }}>Milo</p>
                <p style={{ fontSize: 17, color: PH.muted, margin: 0 }}>Golden Retriever · 3 yrs</p>
              </div>
            </div>
            {petItems.map(({ emoji, label, value }, i) => (
              <motion.div key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.78 + i * 0.12 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderTop: `1px solid ${PH.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{emoji}</span>
                  <p style={{ fontSize: 20, color: PH.text, margin: 0 }}>{label}</p>
                </div>
                <p style={{ fontSize: 18, color: PH.accent, fontWeight: 600, margin: 0 }}>{value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </PhoneFrame>
    </PhonePost>
  );
}

// "ClawdBot is for engineers. Orbits is for your home."
function VsClawdbotAd({ config }: { config: AdConfig }) {
  const { accentColor, dark } = config;
  const accentHex = ACCENT_HEX[accentColor];

  const rows: Array<{ clawdbot: string; orbits: string }> = [
    { clawdbot: 'Write your own prompts', orbits: 'Just works automatically' },
    { clawdbot: 'Set up integrations', orbits: 'Connected out of the box' },
    { clawdbot: 'Built for developers', orbits: 'Built for families' },
    { clawdbot: 'You manage the AI', orbits: 'AI manages your home' },
  ];

  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden">
      <CanvasBackground dark={dark} />
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-[88px]">
        <Eyebrow text="There's an easier way" dark={dark} />

        {/* Column headers */}
        <motion.div {...fadeUp(0.22)} className="grid grid-cols-[1fr_2px_1fr] w-full max-w-[900px] mb-[20px]">
          <div className="text-right pr-8">
            <span style={{ color: c.fgSoft(dark) }} className="text-[26px] font-medium">ClawdBot / OpenClaw</span>
          </div>
          <div />
          <div className="text-left pl-8">
            <span style={{ color: accentHex }} className="text-[26px] font-medium">Orbits</span>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.38, duration: 0.45 }}
          style={{ originX: 0.5, backgroundColor: c.rule(dark) }}
          className="h-[1px] w-full max-w-[900px] mb-[20px]"
        />

        {/* Comparison rows */}
        <div className="w-full max-w-[900px] mb-[52px]">
          {rows.map(({ clawdbot, orbits }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.46 + i * 0.14 }}
              style={{ borderBottom: `1px solid ${c.rule(dark)}` }}
              className="grid grid-cols-[1fr_48px_1fr] py-[22px] last:border-0"
            >
              <div className="flex items-center justify-end pr-8 gap-3">
                <span style={{ color: c.fgSoft(dark) }} className="text-[28px] text-right leading-snug">{clawdbot}</span>
                <span style={{ color: c.fgSoft(dark) }} className="text-[24px] shrink-0">✕</span>
              </div>
              <div className="flex items-center justify-center">
                <div style={{ width: 2, height: '100%', backgroundColor: c.rule(dark) }} />
              </div>
              <div className="flex items-center pl-8 gap-3">
                <span style={{ color: accentHex }} className="text-[24px] shrink-0">✓</span>
                <span style={{ color: c.fg(dark) }} className="text-[28px] font-medium leading-snug">{orbits}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing statement */}
        <motion.div {...fadeUp(1.06)} className="text-center">
          <p style={{ color: c.fg(dark) }} className="text-[52px] font-serif font-medium leading-[1.12] tracking-[-0.01em]">
            The AI for your home.
          </p>
          <p style={{ color: accentHex }} className="text-[52px] font-serif font-medium leading-[1.12] tracking-[-0.01em]">
            Not your terminal.
          </p>
        </motion.div>
      </div>
      <CanvasLogo delay={1.42} dark={dark} />
    </div>
  );
}

// ─── Demo Reels — app in action ──────────────────────────────────────────────

// Shared styles for phone interior panels
const DP = {
  bg: '#f8f6f1',
  card: '#ffffff',
  border: 'rgba(7,27,36,0.09)',
  text: '#071b24',
  muted: 'rgba(7,27,36,0.5)',
  green: '#3a7d55',
  userBubble: '#071b24',
  orbitsBubble: '#f0ede6',
} as const;

// Notification card sub-component
function NotifCard({ emoji, title, body, delay }: { emoji: string; title: string; body: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 65, damping: 16 }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 28,
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 22,
      }}
    >
      <div style={{ width: 72, height: 72, borderRadius: 18, backgroundColor: BRAND.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <img src={orbitsIcon} alt="" style={{ width: 48, height: 48 }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: '#fff' }}>Orbits</span>
          <span style={{ fontSize: 30, color: 'rgba(255,255,255,0.6)' }}>now</span>
        </div>
        <p style={{ fontSize: 38, color: 'rgba(255,255,255,0.95)', lineHeight: 1.35, margin: 0 }}>
          <span style={{ marginRight: 10 }}>{emoji}</span>{body}
        </p>
      </div>
    </motion.div>
  );
}

// Instacart reel — detect needs → build cart → schedule delivery
function ReelInstacartAd({ config }: { config: AdConfig }) {
  const { dark, showChrome, accentColor } = config;
  const accentHex = ACCENT_HEX[accentColor];

  const triggers = [
    { emoji: '🎂', label: 'School bake sale', detail: 'Thursday' },
    { emoji: '🐾', label: 'Dog food running low', detail: 'Milo — 2 days left' },
  ];

  const cartItems = [
    { emoji: '🧁', text: 'Brown sugar + butter', qty: '1 pack each' },
    { emoji: '🐾', text: 'Dog food (large bag)', qty: '×1' },
  ];

  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden', backgroundColor: dark ? BRAND.dark : BRAND.bg }}>
      {/* Subtle bg tint */}
      <div style={{ position: 'absolute', inset: 0, background: dark ? 'radial-gradient(ellipse at 20% 30%, rgba(58,125,85,0.18) 0%, transparent 60%)' : 'radial-gradient(ellipse at 20% 30%, rgba(189,229,210,0.45) 0%, transparent 65%)' }} />

      {/* Safe-area content: top 148px, right 180px (clears action bar), bottom 400px (clears caption+nav) */}
      <div style={{ position: 'absolute', top: 148, left: 60, right: 180, bottom: 400, display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Header */}
        <motion.div {...fadeUp(0.05)}>
          <p style={{ fontSize: 84, fontFamily: 'Lora, serif', fontWeight: 400, color: c.fg(dark), margin: '0 0 14px', lineHeight: 1.08 }}>
            Your groceries<br />order themselves.
          </p>
          <p style={{ fontSize: 44, color: c.fgSoft(dark), margin: 0 }}>Orbits notices. Instacart delivers.</p>
        </motion.div>

        {/* Step 1 — Orbits detects */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 65, damping: 16 }}
          style={{ backgroundColor: dark ? 'rgba(254,252,246,0.07)' : DP.card, border: `1px solid ${dark ? 'rgba(254,252,246,0.13)' : DP.border}`, borderRadius: 28, padding: '26px 32px', flexShrink: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <img src={orbitsIcon} alt="" style={{ width: 44, height: 44 }} />
            <p style={{ fontSize: 30, fontWeight: 700, color: ACCENT_CTA_BG[accentColor], margin: 0, letterSpacing: '0.06em' }}>ORBITS NOTICED</p>
          </div>
          {triggers.map(({ emoji, label, detail }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.18, type: 'spring', stiffness: 72, damping: 16 }}
              style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 0', borderBottom: i < triggers.length - 1 ? `1px solid ${dark ? 'rgba(254,252,246,0.08)' : DP.border}` : 'none' }}
            >
              <span style={{ fontSize: 48, flexShrink: 0 }}>{emoji}</span>
              <div>
                <p style={{ fontSize: 40, fontWeight: 600, color: c.fg(dark), margin: 0 }}>{label}</p>
                <p style={{ fontSize: 32, color: c.fgSoft(dark), margin: '4px 0 0' }}>{detail}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Step 2 — Cart built */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, type: 'spring', stiffness: 65, damping: 16 }}
          style={{ backgroundColor: dark ? 'rgba(254,252,246,0.07)' : DP.card, border: `1px solid ${dark ? 'rgba(254,252,246,0.13)' : DP.border}`, borderRadius: 28, flexShrink: 0 }}
        >
          <div style={{ padding: '20px 32px', borderBottom: `1px solid ${dark ? 'rgba(254,252,246,0.08)' : DP.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 34 }}>🛒</span>
            <p style={{ fontSize: 30, fontWeight: 700, color: c.fgSoft(dark), letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' as const }}>Cart built automatically</p>
          </div>
          {cartItems.map(({ emoji, text, qty }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.15 + i * 0.15, type: 'spring', stiffness: 72, damping: 16 }}
              style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px 32px', borderBottom: i < cartItems.length - 1 ? `1px solid ${dark ? 'rgba(254,252,246,0.07)' : DP.border}` : 'none', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <span style={{ fontSize: 44 }}>{emoji}</span>
                <div>
                  <p style={{ fontSize: 38, fontWeight: 600, color: c.fg(dark), margin: 0 }}>{text}</p>
                  <p style={{ fontSize: 30, color: c.fgSoft(dark), margin: '3px 0 0' }}>{qty}</p>
                </div>
              </div>
              <span style={{ fontSize: 36, color: DP.green, fontWeight: 700 }}>✓</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Step 3 — Instacart delivery confirmed (hero card) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.8, type: 'spring', stiffness: 60, damping: 14 }}
          style={{ backgroundColor: dark ? 'rgba(58,125,85,0.22)' : '#e8f5ee', border: `2.5px solid ${DP.green}66`, borderRadius: 32, padding: '36px 36px', flexShrink: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
            <div style={{ width: 100, height: 100, borderRadius: 24, overflow: 'hidden', flexShrink: 0 }}>
              <img src={instacartCarrot} alt="Instacart" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <p style={{ fontSize: 48, fontWeight: 800, color: DP.green, margin: '0 0 6px', lineHeight: 1 }}>Delivery scheduled</p>
              <p style={{ fontSize: 34, color: c.fgMid(dark), margin: 0, fontWeight: 500 }}>via Instacart</p>
            </div>
          </div>
          <div style={{ backgroundColor: dark ? 'rgba(58,125,85,0.2)' : 'rgba(58,125,85,0.1)', borderRadius: 20, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 44 }}>📅</span>
            <p style={{ fontSize: 40, fontWeight: 700, color: dark ? '#fff' : DP.text, margin: 0 }}>Wednesday at 6pm</p>
          </div>
          <p style={{ fontSize: 32, color: c.fgSoft(dark), margin: '16px 0 0', textAlign: 'center' }}>You didn't lift a finger. ✓</p>
        </motion.div>

      </div>
      <ReelsChrome showChrome={showChrome} />
    </div>
  );
}

// Amazon reel — detect low supplies → order overnight → arrives tomorrow
function ReelAmazonAd({ config }: { config: AdConfig }) {
  const { dark, showChrome, accentColor } = config;

  const noticed = [
    { emoji: '🌀', label: 'HVAC filter overdue', detail: '3 months past due' },
    { emoji: '💡', label: 'Garage bulb burned out', detail: 'Flagged from your last note' },
    { emoji: '🧼', label: 'Dishwasher pods low', detail: 'Running out this week' },
  ];

  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden', backgroundColor: dark ? BRAND.dark : BRAND.bg }}>
      <div style={{ position: 'absolute', inset: 0, background: dark ? 'radial-gradient(ellipse at 25% 30%, rgba(184,134,11,0.15) 0%, transparent 60%)' : 'radial-gradient(ellipse at 25% 30%, rgba(255,220,100,0.3) 0%, transparent 65%)' }} />

      <div style={{ position: 'absolute', top: 148, left: 60, right: 180, bottom: 400, display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Header */}
        <motion.div {...fadeUp(0.05)}>
          <p style={{ fontSize: 68, fontFamily: 'Lora, serif', fontWeight: 400, color: c.fg(dark), margin: '0 0 12px', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
            Your home restocks itself.
          </p>
          <p style={{ fontSize: 40, color: c.fgSoft(dark), margin: 0 }}>Orbits notices. Amazon delivers.</p>
        </motion.div>

        {/* Step 1 — Orbits noticed 3 things */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 65, damping: 16 }}
          style={{ backgroundColor: dark ? 'rgba(254,252,246,0.07)' : DP.card, border: `1px solid ${dark ? 'rgba(254,252,246,0.13)' : DP.border}`, borderRadius: 28, padding: '26px 32px', flexShrink: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <img src={orbitsIcon} alt="" style={{ width: 44, height: 44 }} />
            <p style={{ fontSize: 30, fontWeight: 700, color: ACCENT_CTA_BG[accentColor], margin: 0, letterSpacing: '0.06em' }}>ORBITS NOTICED</p>
          </div>
          {noticed.map(({ emoji, label, detail }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.16, type: 'spring', stiffness: 72, damping: 16 }}
              style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '13px 0', borderBottom: i < noticed.length - 1 ? `1px solid ${dark ? 'rgba(254,252,246,0.08)' : DP.border}` : 'none' }}
            >
              <span style={{ fontSize: 42, flexShrink: 0 }}>{emoji}</span>
              <div>
                <p style={{ fontSize: 36, fontWeight: 600, color: c.fg(dark), margin: 0 }}>{label}</p>
                <p style={{ fontSize: 28, color: c.fgSoft(dark), margin: '3px 0 0' }}>{detail}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Step 2 — What Orbits did about it */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, type: 'spring', stiffness: 65, damping: 16 }}
          style={{ backgroundColor: dark ? 'rgba(254,252,246,0.07)' : DP.card, border: `1px solid ${dark ? 'rgba(254,252,246,0.13)' : DP.border}`, borderRadius: 28, padding: '30px 32px', flexShrink: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <span style={{ fontSize: 38 }}>📦</span>
            <p style={{ fontSize: 30, fontWeight: 700, color: c.fgSoft(dark), letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' as const }}>Orbits ordered all 3</p>
          </div>
          <p style={{ fontSize: 38, color: c.fg(dark), margin: '0 0 12px', lineHeight: 1.35 }}>
            Found the right products, compared options, and placed the order — while you were asleep.
          </p>
          <p style={{ fontSize: 32, color: c.fgSoft(dark), margin: 0 }}>No list. No tabs. No thinking required.</p>
        </motion.div>

        {/* Step 3 — Amazon delivery confirmed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.9, type: 'spring', stiffness: 60, damping: 14 }}
          style={{ backgroundColor: dark ? 'rgba(184,134,11,0.18)' : '#fff8e6', border: `2.5px solid ${ACCENT_CTA_BG[accentColor]}55`, borderRadius: 32, padding: '32px 36px', flexShrink: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
            <div style={{ width: 100, height: 100, borderRadius: 24, overflow: 'hidden', flexShrink: 0 }}>
              <img src={amazonIcon} alt="Amazon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <p style={{ fontSize: 48, fontWeight: 800, color: ACCENT_CTA_BG[accentColor], margin: '0 0 6px', lineHeight: 1 }}>On its way</p>
              <p style={{ fontSize: 34, color: c.fgMid(dark), margin: 0, fontWeight: 500 }}>Amazon Prime · arrives Friday</p>
            </div>
          </div>
          <p style={{ fontSize: 34, color: c.fgSoft(dark), margin: 0, textAlign: 'center' }}>Your home handled it. You didn't have to. ✓</p>
        </motion.div>

      </div>
      <ReelsChrome showChrome={showChrome} />
    </div>
  );
}

// 6. Notification — "What Orbits did while you slept"
function ReelNotificationAd({ config }: { config: AdConfig }) {
  const { dark, showChrome } = config;
  const notifications = [
    { emoji: '❄️', title: 'Orbits', body: 'Snow this Saturday. I contacted 3 plow services — quotes are ready for your review.' },
    { emoji: '🎂', title: 'Orbits', body: 'School bake sale Thursday. Grocery delivery scheduled for Wednesday at 6pm.' },
    { emoji: '🔧', title: 'Orbits', body: 'HVAC filter overdue. Ordered a replacement on Amazon — arrives Friday.' },
  ];
  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden', backgroundColor: '#07152a' }}>
      {/* Background gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 20%, rgba(137,172,190,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(189,229,210,0.2) 0%, transparent 60%)' }} />

      <div style={{ position: 'absolute', top: 148, left: 64, right: 180, bottom: 400, zIndex: 10, display: 'flex', flexDirection: 'column' }}>
        {/* Time + lock screen */}
        <motion.div {...fadeUp(0.1)} style={{ textAlign: 'center', marginBottom: 80 }}>
          <p style={{ fontSize: 46, color: 'rgba(255,255,255,0.55)', margin: '0 0 8px', letterSpacing: '0.08em' }}>MONDAY 7:43 AM</p>
          <p style={{ fontSize: 160, fontFamily: 'Lora, serif', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1 }}>7:43</p>
        </motion.div>

        {/* Notification cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
          {notifications.map((n, i) => (
            <NotifCard key={i} {...n} delay={0.4 + i * 0.35} />
          ))}
        </div>

        {/* Headline */}
        <motion.div {...fadeUp(1.6)} style={{ textAlign: 'center', paddingTop: 60 }}>
          <p style={{ fontSize: 76, fontFamily: 'Lora, serif', fontWeight: 400, color: '#fff', lineHeight: 1.15, margin: '0 0 20px' }}>
            What Orbits did<br />while you slept.
          </p>
          <p style={{ fontSize: 44, color: 'rgba(255,255,255,0.6)', margin: 0 }}>tryorbits.com</p>
        </motion.div>
      </div>
      <ReelsChrome showChrome={showChrome} />
    </div>
  );
}

// 7. Workflow demo — proactive detect → structured options → booked
function ReelWorkflowAd({ config }: { config: AdConfig }) {
  const { dark, showChrome, accentColor } = config;
  const accentHex = ACCENT_HEX[accentColor];
  const tapDelay = 1.05; // seconds after mount when the tap fires

  const providers = [
    { name: "Fast Snow Services", stars: '⭐ 4.9', avail: 'Sat 8am', price: '$95', tag: 'Recommended', accent: true },
    { name: "Mike's Plowing", stars: '⭐ 4.7', avail: 'Sat 10am', price: '$120', tag: '', accent: false },
    { name: "Winter Pro", stars: '⭐ 4.6', avail: 'Sat 12pm', price: '$85', tag: '', accent: false },
  ];

  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden', backgroundColor: dark ? BRAND.dark : BRAND.bg }}>
      <div style={{ position: 'absolute', top: 148, left: 56, right: 180, bottom: 400, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Header */}
        <motion.div {...fadeUp(0.05)} style={{ textAlign: 'center', marginBottom: 8 }}>
          <p style={{ fontSize: 72, fontFamily: 'Lora, serif', fontWeight: 400, color: c.fg(dark), margin: '0 0 14px', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
            How Orbits handles it.
          </p>
          <p style={{ fontSize: 42, color: c.fgSoft(dark), margin: 0 }}>Proactive. Structured. Done.</p>
        </motion.div>

        {/* Step 1 — Orbits detects */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 65, damping: 16 }}
          style={{ backgroundColor: dark ? 'rgba(254,252,246,0.07)' : DP.card, border: `1px solid ${dark ? 'rgba(254,252,246,0.13)' : DP.border}`, borderRadius: 28, padding: '32px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <img src={orbitsIcon} alt="" style={{ width: 52, height: 52 }} />
            <p style={{ fontSize: 30, fontWeight: 700, color: ACCENT_CTA_BG[accentColor], margin: 0, letterSpacing: '0.06em' }}>ORBITS NOTICED</p>
          </div>
          <p style={{ fontSize: 42, color: c.fg(dark), margin: '0 0 24px', lineHeight: 1.3 }}>
            ❄️ Snow expected this Saturday. Your driveway isn't scheduled for service yet.
          </p>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 80, damping: 14 }}
            style={{ display: 'flex', gap: 16 }}>
            {/* Button with tap press animation */}
            <motion.div
              animate={{ scale: [1, 0.93, 1] }}
              transition={{ delay: tapDelay, duration: 0.28, ease: 'easeInOut', times: [0, 0.45, 1] }}
              style={{ flex: 1, position: 'relative', borderRadius: 16, overflow: 'hidden' }}
            >
              <div style={{ backgroundColor: ACCENT_CTA_BG[accentColor], borderRadius: 16, padding: '18px 24px', textAlign: 'center' }}>
                <span style={{ fontSize: 34, fontWeight: 700, color: ACCENT_CTA_FG[accentColor] }}>Find services →</span>
              </div>
              {/* Ripple */}
              <motion.div
                initial={{ opacity: 0.55, scale: 0 }}
                animate={{ opacity: 0, scale: 3.5 }}
                transition={{ delay: tapDelay + 0.05, duration: 0.55, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: '50%', left: '38%',
                  width: 80, height: 80,
                  borderRadius: '50%',
                  backgroundColor: ACCENT_CTA_FG[accentColor],
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              />
            </motion.div>
            <div style={{ backgroundColor: dark ? 'rgba(254,252,246,0.1)' : DP.bg, border: `1px solid ${dark ? 'rgba(254,252,246,0.15)' : DP.border}`, borderRadius: 16, padding: '18px 24px', textAlign: 'center' }}>
              <span style={{ fontSize: 34, color: c.fgMid(dark) }}>Later</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Step 2 — Structured options */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 65, damping: 16 }}
          style={{ backgroundColor: dark ? 'rgba(254,252,246,0.07)' : DP.card, border: `1px solid ${dark ? 'rgba(254,252,246,0.13)' : DP.border}`, borderRadius: 28, overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: `1px solid ${dark ? 'rgba(254,252,246,0.08)' : DP.border}` }}>
            <p style={{ fontSize: 30, fontWeight: 700, color: c.fgSoft(dark), letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' }}>3 services near you</p>
          </div>
          {providers.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + i * 0.15, type: 'spring', stiffness: 72, damping: 16 }}
              style={{ padding: '22px 32px', borderBottom: i < providers.length - 1 ? `1px solid ${dark ? 'rgba(254,252,246,0.07)' : DP.border}` : 'none', backgroundColor: p.accent ? (dark ? 'rgba(58,125,85,0.12)' : 'rgba(58,125,85,0.06)') : 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <p style={{ fontSize: 34, fontWeight: 700, color: c.fg(dark), margin: 0 }}>{p.name}</p>
                  {p.tag && <span style={{ fontSize: 22, fontWeight: 600, color: DP.green, backgroundColor: 'rgba(58,125,85,0.12)', padding: '3px 12px', borderRadius: 20 }}>{p.tag}</span>}
                </div>
                <p style={{ fontSize: 28, color: c.fgSoft(dark), margin: 0 }}>{p.stars} · {p.avail}</p>
              </div>
              <p style={{ fontSize: 38, fontWeight: 700, color: p.accent ? DP.green : c.fg(dark), margin: 0 }}>{p.price}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Step 3 — Confirmed */}
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.1, type: 'spring', stiffness: 70, damping: 14 }}
          style={{ backgroundColor: dark ? 'rgba(58,125,85,0.18)' : 'rgba(58,125,85,0.08)', border: `2px solid ${DP.green}44`, borderRadius: 28, padding: '32px 36px', display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: DP.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 40, color: '#fff' }}>✓</span>
          </div>
          <div>
            <p style={{ fontSize: 38, fontWeight: 700, color: DP.green, margin: '0 0 6px' }}>Booked — Fast Snow Services</p>
            <p style={{ fontSize: 32, color: c.fgMid(dark), margin: 0 }}>📅 Saturday at 8am · Added to calendar</p>
          </div>
        </motion.div>

      </div>
      <ReelsChrome showChrome={showChrome} />
    </div>
  );
}

// 8. Morning dashboard — animated card reveal
function ReelMorningAd({ config }: { config: AdConfig }) {
  const { dark, showChrome, accentColor } = config;
  const accentHex = ACCENT_HEX[accentColor];
  const handled = [
    { icon: '❄️', text: 'Plow service booked for Saturday' },
    { icon: '🛒', text: 'Weekly groceries ordered' },
    { icon: '💊', text: 'Prescription refill requested' },
  ];
  const today = [
    { time: '8:30 AM', event: 'Drop Lily at school', who: 'Ellie' },
    { time: '11:00 AM', event: 'Dentist appointment', who: 'Jake' },
    { time: '6:00 PM', event: 'Grocery delivery', who: 'Orbits ✓' },
  ];
  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden', backgroundColor: dark ? BRAND.dark : BRAND.bg }}>
      <div style={{ position: 'absolute', top: 148, left: 56, right: 180, bottom: 400, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 36 }}>

        {/* Logo + greeting */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={orbitsIcon} alt="" style={{ width: 88, height: 88 }} />
          <div>
            <p style={{ fontSize: 54, fontWeight: 700, color: c.fg(dark), margin: 0 }}>Good morning, Ellie.</p>
            <p style={{ fontSize: 38, color: c.fgSoft(dark), margin: 0 }}>Wednesday, November 26</p>
          </div>
        </motion.div>

        {/* Weather card */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: 'spring', stiffness: 70, damping: 16 }}
          style={{ backgroundColor: dark ? 'rgba(254,252,246,0.06)' : DP.card, border: `1px solid ${dark ? 'rgba(254,252,246,0.12)' : DP.border}`, borderRadius: 28, padding: '28px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontSize: 88 }}>☀️</span>
            <div>
              <p style={{ fontSize: 76, fontWeight: 700, color: c.fg(dark), margin: 0, lineHeight: 1 }}>68°F</p>
              <p style={{ fontSize: 34, color: c.fgSoft(dark), margin: 0 }}>Clear Sky · New York</p>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 34, color: c.fgMid(dark) }}>
            <p style={{ margin: '0 0 6px' }}>💨 12 mph</p>
            <p style={{ margin: 0 }}>💧 55%</p>
          </div>
        </motion.div>

        {/* Today's events */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, type: 'spring', stiffness: 70, damping: 16 }}
          style={{ backgroundColor: dark ? 'rgba(254,252,246,0.06)' : DP.card, border: `1px solid ${dark ? 'rgba(254,252,246,0.12)' : DP.border}`, borderRadius: 28, padding: '28px 36px' }}>
          <p style={{ fontSize: 32, fontWeight: 700, color: c.fgSoft(dark), letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 20px' }}>Today</p>
          {today.map(({ time, event, who }, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.15, type: 'spring', stiffness: 72, damping: 16 }}
              style={{ display: 'flex', gap: 24, padding: '16px 0', borderBottom: i < today.length - 1 ? `1px solid ${dark ? 'rgba(254,252,246,0.08)' : DP.border}` : 'none', alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: accentHex, marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 38, fontWeight: 600, color: c.fg(dark), margin: '0 0 6px' }}>{event}</p>
                <p style={{ fontSize: 30, color: c.fgSoft(dark), margin: 0 }}>{time} · {who}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Orbits handled */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, type: 'spring', stiffness: 70, damping: 16 }}
          style={{ backgroundColor: dark ? 'rgba(137,172,190,0.12)' : `${accentHex}18`, border: `1px solid ${accentHex}40`, borderRadius: 28, padding: '28px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
            <img src={orbitsIcon} alt="" style={{ width: 50, height: 50 }} />
            <p style={{ fontSize: 34, fontWeight: 700, color: accentHex, margin: 0, letterSpacing: '0.05em' }}>ORBITS HANDLED OVERNIGHT</p>
          </div>
          {handled.map(({ icon, text }, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.3 + i * 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '12px 0' }}>
              <span style={{ fontSize: 40 }}>{icon}</span>
              <p style={{ fontSize: 38, color: c.fg(dark), margin: 0 }}>{text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(1.9)} style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', backgroundColor: ACCENT_CTA_BG[accentColor], borderRadius: 100, padding: '28px 72px', marginBottom: 18 }}>
            <span style={{ fontSize: 46, fontWeight: 700, color: ACCENT_CTA_FG[accentColor] }}>Get it today →</span>
          </div>
          <p style={{ fontSize: 34, color: c.fgSoft(dark), margin: 0 }}>Free · tryorbits.com</p>
        </motion.div>
      </div>
      <ReelsChrome showChrome={showChrome} />
    </div>
  );
}

// ─── Ad Canvas router ────────────────────────────────────────────────────────

// AI Grocery List — items stream in one by one as if generated by AI
function ReelGroceryAiAd({ config }: { config: AdConfig }) {
  const { dark, showChrome, accentColor } = config;
  const accentHex = ACCENT_HEX[accentColor];

  const context = [
    { emoji: '📅', label: "Lily's bake sale", detail: 'Thursday' },
    { emoji: '🐾', label: 'Dog food running low', detail: 'Milo — 2 days left' },
  ];

  const groceryItems = [
    { emoji: '🧁', text: 'Brown sugar (2 cups)', reason: "Lily's bake sale" },
    { emoji: '🧈', text: 'Unsalted butter', reason: "Lily's bake sale" },
    { emoji: '🥚', text: 'Eggs (1 dozen)', reason: "Lily's bake sale" },
    { emoji: '🐾', text: 'Dog food — large bag', reason: 'Milo running low' },
  ];

  // Each item streams in with a staggered delay
  const itemBaseDelay = 1.1;
  const itemStagger = 0.22;

  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden', backgroundColor: dark ? BRAND.dark : BRAND.bg }}>
      <div style={{ position: 'absolute', top: 148, left: 56, right: 180, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Headline */}
        <motion.div {...fadeUp(0.05)}>
          <p style={{ fontSize: 72, fontFamily: 'Lora, serif', fontWeight: 400, color: c.fg(dark), margin: '0 0 12px', lineHeight: 1.1 }}>
            You didn't write<br />a single thing.
          </p>
          <p style={{ fontSize: 40, color: c.fgSoft(dark), margin: 0 }}>
            Orbits read your week and built the list.
          </p>
        </motion.div>

        {/* Context card — what Orbits detected */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 65, damping: 16 }}
          style={{
            backgroundColor: dark ? 'rgba(254,252,246,0.07)' : DP.card,
            border: `1px solid ${dark ? 'rgba(254,252,246,0.13)' : DP.border}`,
            borderRadius: 28, padding: '24px 32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <img src={orbitsIcon} alt="" style={{ width: 44, height: 44 }} />
            <p style={{ fontSize: 28, fontWeight: 700, color: ACCENT_CTA_BG[accentColor], margin: 0, letterSpacing: '0.06em' }}>
              ORBITS NOTICED
            </p>
          </div>
          {context.map(({ emoji, label, detail }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.18, type: 'spring', stiffness: 72, damping: 16 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 18,
                padding: '13px 0',
                borderBottom: i < context.length - 1 ? `1px solid ${dark ? 'rgba(254,252,246,0.08)' : DP.border}` : 'none',
              }}
            >
              <span style={{ fontSize: 42, flexShrink: 0 }}>{emoji}</span>
              <div>
                <p style={{ fontSize: 36, fontWeight: 600, color: c.fg(dark), margin: 0 }}>{label}</p>
                <p style={{ fontSize: 28, color: c.fgSoft(dark), margin: '3px 0 0' }}>{detail}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* AI generating label */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: itemBaseDelay - 0.2 }}
          style={{ display: 'flex', alignItems: 'center', gap: 14 }}
        >
          <Sparkles style={{ width: 32, height: 32, color: accentHex, flexShrink: 0 }} />
          <p style={{ fontSize: 28, fontWeight: 700, color: ACCENT_CTA_BG[accentColor], margin: 0, letterSpacing: '0.06em' }}>
            GENERATING GROCERY LIST
          </p>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.1, delay: i * 0.22, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: ACCENT_CTA_BG[accentColor] }}
              />
            ))}
          </div>
        </motion.div>

        {/* Grocery list card — items stream in */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: itemBaseDelay - 0.05, type: 'spring', stiffness: 65, damping: 16 }}
          style={{
            backgroundColor: dark ? 'rgba(254,252,246,0.07)' : DP.card,
            border: `1px solid ${dark ? 'rgba(254,252,246,0.13)' : DP.border}`,
            borderRadius: 28, overflow: 'hidden',
          }}
        >
          <div style={{
            padding: '18px 28px',
            borderBottom: `1px solid ${dark ? 'rgba(254,252,246,0.08)' : DP.border}`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <span style={{ fontSize: 30 }}>🛒</span>
            <p style={{ fontSize: 28, fontWeight: 700, color: c.fgSoft(dark), letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' as const }}>
              Cart built automatically
            </p>
          </div>
          {groceryItems.map(({ emoji, text, reason }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: itemBaseDelay + i * itemStagger, type: 'spring', stiffness: 72, damping: 16 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '13px 28px',
                borderBottom: i < groceryItems.length - 1 ? `1px solid ${dark ? 'rgba(254,252,246,0.07)' : DP.border}` : 'none',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 38, flexShrink: 0 }}>{emoji}</span>
                <div>
                  <p style={{ fontSize: 34, fontWeight: 600, color: c.fg(dark), margin: 0 }}>{text}</p>
                  <p style={{ fontSize: 26, color: c.fgSoft(dark), margin: '2px 0 0' }}>{reason}</p>
                </div>
              </div>
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: itemBaseDelay + i * itemStagger + 0.18, type: 'spring', stiffness: 90, damping: 12 }}
                style={{ fontSize: 32, color: DP.green, fontWeight: 700, flexShrink: 0 }}
              >
                ✓
              </motion.span>
            </motion.div>
          ))}
        </motion.div>

        {/* Completion badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: itemBaseDelay + groceryItems.length * itemStagger + 0.2, type: 'spring', stiffness: 60, damping: 14 }}
          style={{
            backgroundColor: dark ? 'rgba(58,125,85,0.18)' : 'rgba(58,125,85,0.08)',
            border: `2px solid ${DP.green}44`,
            borderRadius: 28, padding: '24px 32px',
            display: 'flex', alignItems: 'center', gap: 22,
          }}
        >
          <div style={{ width: 72, height: 72, borderRadius: 18, overflow: 'hidden', flexShrink: 0 }}>
            <img src={instacartCarrot} alt="Instacart" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <p style={{ fontSize: 36, fontWeight: 700, color: DP.green, margin: '0 0 5px', lineHeight: 1 }}>
              Ready to order
            </p>
            <p style={{ fontSize: 28, color: c.fgMid(dark), margin: 0, fontWeight: 500 }}>
              4 items · via Instacart
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: itemBaseDelay + groceryItems.length * itemStagger + 0.5 }}
            style={{ marginLeft: 'auto', fontSize: 52 }}
          >
            ✅
          </motion.div>
        </motion.div>

      </div>
      <ReelsChrome showChrome={showChrome} />
    </div>
  );
}

function AdCanvas({ config }: { config: AdConfig }) {
  switch (config.template) {
    case 'scenario':       return <ScenarioAd config={config} />;
    case 'not-a-tracker':  return <NotATrackerAd config={config} />;
    case 'manifesto':      return <ManifestoAd config={config} />;
    case 'helping-hand':   return <HelpingHandAd config={config} />;
    case 'upkeep-app':     return <UpkeepAppAd config={config} />;
    case 'family-app':     return <FamilyAppAd config={config} />;
    case 'ask-orbits':     return <AskOrbitsAd config={config} />;
    case 'at-a-glance':        return <AtAGlanceAd config={config} />;
    case 'instacart':          return <InstacartAd config={config} />;
    case 'amazon':             return <AmazonAd config={config} />;
    case 'group-chat':         return <GroupChatAd config={config} />;
    case 'bills':              return <BillsAd config={config} />;
    case 'ai-lists':           return <AiListsAd config={config} />;
    case 'app-features':       return <AppFeaturesAd config={config} />;
    case 'service-requests':   return <ServiceRequestsAd config={config} />;
    case 'pets':               return <PetsAd config={config} />;
    case 'vs-clawdbot':        return <VsClawdbotAd config={config} />;
    case 'reel-hook':          return <ReelHookAd config={config} />;
    case 'reel-list':          return <ReelListAd config={config} />;
    case 'reel-before-after':  return <ReelBeforeAfterAd config={config} />;
    case 'reel-stat':          return <ReelStatAd config={config} />;
    case 'reel-cta':           return <ReelCtaAd config={config} />;
    case 'reel-instacart':     return <ReelInstacartAd config={config} />;
    case 'reel-amazon':        return <ReelAmazonAd config={config} />;
    case 'reel-notification':  return <ReelNotificationAd config={config} />;
    case 'reel-workflow':          return <ReelWorkflowAd config={config} />;
    case 'reel-morning':       return <ReelMorningAd config={config} />;
    case 'reel-grocery-ai':    return <ReelGroceryAiAd config={config} />;
  }
}

// ─── Caption panel ───────────────────────────────────────────────────────────

function CaptionPanel({ template }: { template: AdTemplate }) {
  const [copied, setCopied] = useState(false);
  const caption = CAPTIONS[template];

  function handleCopy() {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    track('instagram_ad_caption_copied', { template });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass border border-primary/10 rounded-2xl p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Caption</h4>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            copied
              ? 'bg-sage/40 text-foreground/80'
              : 'glass border border-primary/10 hover:border-primary/25 text-muted-foreground hover:text-foreground'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans select-all">
        {caption}
      </pre>
    </div>
  );
}

// ─── Controls panel ──────────────────────────────────────────────────────────

function ControlsPanel({
  config,
  onChange,
  onReplay,
  isPlaying,
  onToggleAutoplay,
  isReels,
  showChrome,
  onToggleChrome,
}: {
  config: AdConfig;
  onChange: (updates: Partial<AdConfig>) => void;
  onReplay: () => void;
  isPlaying: boolean;
  onToggleAutoplay: () => void;
  isReels: boolean;
  showChrome: boolean;
  onToggleChrome: () => void;
}) {
  return (
    <div className="glass border border-primary/10 rounded-2xl p-6 space-y-6">
      <h3 className="text-lg font-serif font-medium">Ad Controls</h3>

      {/* Headline */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Headline</label>
        <input
          type="text"
          value={config.headline}
          onChange={(e) => onChange({ headline: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl glass border border-primary/10 text-sm focus:outline-none focus:border-primary/30 bg-transparent"
        />
      </div>

      {/* Subheadline */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subheadline</label>
        <input
          type="text"
          value={config.subheadline}
          onChange={(e) => onChange({ subheadline: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl glass border border-primary/10 text-sm focus:outline-none focus:border-primary/30 bg-transparent"
        />
      </div>

      {/* Accent color */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Accent</label>
        <div className="flex gap-3">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => {
                onChange({ accentColor: color });
                track('instagram_ad_color_changed', { color });
              }}
              style={{ backgroundColor: `hsl(var(--${color}))` }}
              className={`w-9 h-9 rounded-full border-2 transition-all ${
                config.accentColor === color
                  ? 'border-primary scale-110 shadow-lg'
                  : 'border-transparent hover:scale-105'
              }`}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* IG Chrome overlay — Reels only */}
      {isReels && (
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-0.5">
              IG Chrome
            </label>
            <p className="text-xs text-muted-foreground">Safe-zone preview — turn off to record</p>
          </div>
          <button
            onClick={onToggleChrome}
            className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${
              showChrome ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
              showChrome ? 'left-[26px]' : 'left-0.5'
            }`} />
          </button>
        </div>
      )}

      {/* Playback */}
      <div className="flex gap-2 pt-1">
        <Button variant="outline" size="sm" onClick={onReplay} className="flex-1 gap-2">
          <RotateCcw className="w-4 h-4" />
          Replay
        </Button>
        <Button variant="outline" size="sm" onClick={onToggleAutoplay} className="flex-1 gap-2">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Stop' : 'Auto-cycle'}
        </Button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const InstagramAds = () => {
  const [format, setFormat] = useState<AdFormat>('square');
  const [dark, setDark] = useState(false);
  const [showChrome, setShowChrome] = useState(false);
  const [config, setConfig] = useState<AdConfig>({
    template: 'scenario',
    ...TEMPLATES['scenario'],
    dark: false,
    showChrome: false,
  });
  const [replayKey, setReplayKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [adScale, setAdScale] = useState(0.4);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const isReels = format === 'reels';
  const activeOrder = isReels ? REELS_TEMPLATE_ORDER : TEMPLATE_ORDER;
  const canvasW = 1080;
  const canvasH = isReels ? 1920 : 1080;

  useEffect(() => {
    track('instagram_ads_page_visited');
  }, []);

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setAdScale(Math.min(width / canvasW, height / canvasH, isReels ? 0.38 : 0.62));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [canvasH, canvasW, isReels]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  function handleSetFormat(next: AdFormat) {
    if (next === format) return;
    clearInterval(intervalRef.current);
    setIsPlaying(false);
    setFormat(next);
    const firstTemplate = next === 'reels' ? REELS_TEMPLATE_ORDER[0] : TEMPLATE_ORDER[0];
    setConfig({ template: firstTemplate, ...TEMPLATES[firstTemplate], dark, showChrome });
    setReplayKey((k) => k + 1);
    track('instagram_ad_format_toggled', { format: next });
  }

  function handleToggleDark(next?: boolean) {
    const value = next ?? !dark;
    setDark(value);
    setConfig((prev) => ({ ...prev, dark: value }));
    setReplayKey((k) => k + 1);
    track('instagram_ad_bg_toggled', { dark: value });
  }

  function handleToggleChrome() {
    const next = !showChrome;
    setShowChrome(next);
    setConfig((prev) => ({ ...prev, showChrome: next }));
    setReplayKey((k) => k + 1);
    track('instagram_ad_chrome_toggled', { showChrome: next });
  }

  function handleChange(updates: Partial<AdConfig>) {
    setConfig((prev) => ({ ...prev, ...updates, dark, showChrome }));
    setReplayKey((k) => k + 1);
  }

  function handleReplay() {
    setReplayKey((k) => k + 1);
    track('instagram_ad_replayed', { template: config.template });
  }

  function handleToggleAutoplay() {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
      track('instagram_ad_autocycle_stopped');
    } else {
      setIsPlaying(true);
      track('instagram_ad_autocycle_started');
      intervalRef.current = setInterval(() => {
        setConfig((prev) => {
          const idx = activeOrder.indexOf(prev.template);
          const next = activeOrder[(idx + 1) % activeOrder.length];
          return { template: next, ...TEMPLATES[next], dark: prev.dark, showChrome: prev.showChrome };
        });
        setReplayKey((k) => k + 1);
      }, 4500);
    }
  }

  function handleNav(dir: 1 | -1) {
    const idx = activeOrder.indexOf(config.template);
    const next = activeOrder[(idx + dir + activeOrder.length) % activeOrder.length];
    handleChange({ template: next, ...TEMPLATES[next], dark, showChrome });
    track('instagram_ad_navigated', { direction: dir === 1 ? 'next' : 'prev', template: next });
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-primary/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </a>
            <h1 className="text-xl font-serif font-medium">Instagram Ad Studio</h1>
            <span className="px-2 py-0.5 rounded-full bg-lavender/50 text-xs font-medium text-primary">
              Internal
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Format dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-primary/10 hover:border-primary/25 text-xs font-medium transition-all text-foreground/80">
                  {isReels ? '▮ Reels 9:16' : '▪ Posts 1:1'}
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 bg-background border-border/60 shadow-lg"
                style={{ backgroundColor: 'hsl(var(--background))' }}
              >
                <DropdownMenuItem
                  onSelect={() => handleSetFormat('square')}
                  className="flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs">▪</span>
                    <span>Posts</span>
                  </span>
                  <span className="text-xs text-muted-foreground">1:1 · {TEMPLATE_ORDER.length} posts</span>
                  {!isReels && <Check className="w-3.5 h-3.5 text-primary ml-1" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleSetFormat('reels')}
                  className="flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs">▮</span>
                    <span>Reels</span>
                  </span>
                  <span className="text-xs text-muted-foreground">9:16 · {REELS_TEMPLATE_ORDER.length} reels</span>
                  {isReels && <Check className="w-3.5 h-3.5 text-primary ml-1" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Background dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-primary/10 hover:border-primary/25 text-xs font-medium transition-all text-foreground/80">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-primary/20 shrink-0"
                    style={{ backgroundColor: dark ? BRAND.dark : BRAND.bg }}
                  />
                  {dark ? 'Dark' : 'Light'}
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 bg-background border-border/60 shadow-lg"
                style={{ backgroundColor: 'hsl(var(--background))' }}
              >
                <DropdownMenuItem
                  onSelect={() => !dark || handleToggleDark(false)}
                  className="flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-primary/20 shrink-0" style={{ backgroundColor: BRAND.bg }} />
                    <span>Light</span>
                  </span>
                  {!dark && <Check className="w-3.5 h-3.5 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => dark || handleToggleDark(true)}
                  className="flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-primary/20 shrink-0" style={{ backgroundColor: BRAND.dark }} />
                    <span>Dark</span>
                  </span>
                  {dark && <Check className="w-3.5 h-3.5 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{isReels ? '1080 × 1920' : '1080 × 1080'}</span>
              <span className="text-primary/30">·</span>
              <span className="font-medium text-foreground/70">{TEMPLATE_LABELS[config.template]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_340px] gap-6 items-start">

          {/* Left — set list */}
          <div className="lg:sticky lg:top-[76px] glass border border-primary/10 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 pb-1">
              {isReels ? 'Reels in this set' : 'Posts in this set'}
            </h4>
            {activeOrder.map((t) => (
              <button
                key={t}
                onClick={() => handleChange({ template: t, ...TEMPLATES[t] })}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                  config.template === t
                    ? 'bg-primary/8 border border-primary/15'
                    : 'hover:bg-secondary/60'
                }`}
              >
                <p className={`text-sm font-medium flex items-center gap-1.5 ${config.template === t ? 'text-foreground' : 'text-foreground/70'}`}>
                  {TEMPLATE_LABELS[t]}
                  {IG_APPROVED.has(t) && <IgBadge />}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {TEMPLATES[t].headline}
                </p>
              </button>
            ))}
          </div>

          {/* Center — Ad preview + nav */}
          <div className="space-y-4 flex flex-col items-center">
            <div
              ref={containerRef}
              className="relative glass border border-primary/10 rounded-2xl overflow-hidden flex items-center justify-center w-full"
              style={{ aspectRatio: isReels ? '9/16' : '1', maxHeight: '680px' }}
            >
              <div
                style={{
                  width: canvasW,
                  height: canvasH,
                  transform: `scale(${adScale})`,
                  transformOrigin: 'center center',
                  flexShrink: 0,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={replayKey}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AdCanvas config={config} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" onClick={() => handleNav(-1)} className="rounded-full">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex gap-2">
                {activeOrder.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleChange({ template: t, ...TEMPLATES[t] })}
                    className={`rounded-full transition-all ${
                      config.template === t
                        ? 'w-6 h-2.5 bg-primary'
                        : 'w-2.5 h-2.5 bg-muted-foreground/25 hover:bg-muted-foreground/45'
                    }`}
                    title={TEMPLATE_LABELS[t]}
                  />
                ))}
              </div>
              <Button variant="outline" size="icon" onClick={() => handleNav(1)} className="rounded-full">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right sidebar — controls + caption + tips */}
          <div className="space-y-4 lg:sticky lg:top-[76px]">
            <ControlsPanel
              config={config}
              onChange={handleChange}
              onReplay={handleReplay}
              isPlaying={isPlaying}
              onToggleAutoplay={handleToggleAutoplay}
              isReels={isReels}
              showChrome={showChrome}
              onToggleChrome={handleToggleChrome}
            />

            {/* Caption */}
            <CaptionPanel template={config.template} />

            {/* Tips */}
            <div className="glass border border-primary/10 rounded-2xl p-6 space-y-3">
              <h4 className="text-sm font-medium">Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                {[
                  { color: 'bg-lavender', tip: 'Hit Replay to retrigger animations before recording' },
                  { color: 'bg-peach', tip: 'Auto-cycle records a full set without stopping' },
                  { color: 'bg-sky', tip: 'Tweak copy in the inputs for A/B messaging variants' },
                  { color: 'bg-sage', tip: 'Download PNG exports the full 1080px canvas' },
                ].map(({ color, tip }) => (
                  <li key={tip} className="flex gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${color} mt-1.5 shrink-0`} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default InstagramAds;
