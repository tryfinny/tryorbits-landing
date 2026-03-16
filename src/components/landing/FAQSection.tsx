import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How is Orbits different from Google Calendar + Reminders?",
    answer:
      "Google Calendar is great for scheduling, but it doesn't know about your grocery list, your HVAC filter, or your kid's soccer schedule. Orbits connects your calendar, tasks, lists, home maintenance, and family coordination in one place — and uses AI to handle the busy work between them.",
  },
  {
    question: "Is Orbits free?",
    answer:
      "Orbits is free to download with a 7-day trial so you can experience the full product. After that, a subscription keeps everything running — including AI features, email intelligence, and service request coordination.",
  },
  {
    question: "Does it work with Google Calendar and Outlook?",
    answer:
      "Yes. Orbits syncs with both Google Calendar and Microsoft Outlook so your existing events appear automatically. You can manage everything from Orbits without switching between apps.",
  },
  {
    question: "Can my whole family use it?",
    answer:
      "Absolutely. Orbits is built around your household. Invite family members, share calendars and lists, and coordinate schedules — everyone sees the same information, no group chat required.",
  },
  {
    question: "How does the AI actually work?",
    answer:
      "There's no chatbot — AI is built directly into the flows you're already using. When you add an appliance, it pre-fills the details. When you open a grocery list, it suggests items based on context. It proactively surfaces recommendations and actions for you to approve, so you spend less time telling it what to do.",
  },
  {
    question: "What are service requests?",
    answer:
      "Need a plumber, electrician, or handyman? Tap \"Find Help\" in Orbits, describe what you need, and we'll coordinate with service providers, gather quotes, and track the whole process from start to finish — so you don't have to make a dozen phone calls.",
  },
  {
    question: "Can I track my appliances, vehicles, and home details?",
    answer:
      "Yes — head to Upkeep and add your appliances, vehicles, and home details. Orbits will remind you about maintenance schedules, help you track warranties, and log repairs so you have a complete history.",
  },
  {
    question: "How does email intelligence work?",
    answer:
      "Connect your Gmail or Outlook and Orbits automatically scans for household-relevant emails — dentist appointments, shipping updates, school schedule changes, bills. It extracts the key details and adds them to your calendar or creates reminders, so nothing slips through the cracks.",
  },
  {
    question: "Is there a web app?",
    answer:
      "Orbits is currently available on iOS and Android. A web experience is on our roadmap — join us now and you'll be the first to know when it launches.",
  },
  {
    question: "Can I add pets to Orbits?",
    answer:
      "Of course! Add pet profiles with breed, age, vet info, vaccine records, and more. Orbits can remind you about vet appointments, medications, and other pet care tasks.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Your data is encrypted and stored securely. We use industry-standard security practices and never sell your personal information. You can read our full privacy policy for details.",
  },
];

function FAQItem({ faq, index }: { faq: (typeof faqs)[number]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 18,
        delay: index * 0.06,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 lg:px-8 lg:py-6 rounded-2xl border border-border/40 glass transition-colors hover:border-primary/20 group"
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base lg:text-lg font-medium text-foreground group-hover:text-primary transition-colors">
            {faq.question}
          </h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className="overflow-hidden"
            >
              <p className="text-muted-foreground leading-relaxed pt-3 text-sm lg:text-base">
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

export function FAQSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="relative pt-8 pb-12 lg:pt-12 lg:pb-16 px-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] orb-lavender opacity-15 blur-3xl rounded-full" />

      <div className="max-w-3xl mx-auto relative z-10">
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
            FAQ
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.15 }}
          >
            Common questions
          </motion.h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
