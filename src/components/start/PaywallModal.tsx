"use client";
import { useEffect, useState } from "react";
import { Sparkles, Inbox, Users, type LucideIcon } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionType } from "@/lib/start/schemas";
import { trackPaywallSubmitted, trackPayNowClicked, trackRegionBlockedShown } from "@/lib/analytics";
import { CtaButton } from "./CtaButton";

type Phase = "form" | "pay" | "blocked";

// Value props in Bit's voice — Bit is the subject, first person.
const VALUE_PROPS: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Sparkles,
    title: "I actually get things done",
    body: "Calls, texts, orders, reservations — I handle them start to finish, not just tell you how.",
  },
  {
    Icon: Inbox,
    title: "I meet you where you already are",
    body: "Email, calendar, the family group chat — I pull what matters into one place.",
  },
  {
    Icon: Users,
    title: "One plan for the whole household",
    body: "Add your whole family. One membership covers everyone.",
  },
];

export function PaywallModal({
  open, action, onClose,
}: {
  open: boolean;
  action: ActionType | null;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Reset to a clean form each time the modal opens.
  useEffect(() => {
    if (open) {
      setPhase("form");
      setEmail("");
      setPassword("");
    }
  }, [open]);

  const canContinue = email.trim().length > 0 && password.length > 0;

  const submitForm = () => {
    if (!action) return;
    trackPaywallSubmitted(email.trim(), action); // password intentionally not sent
    setPhase("pay");
  };

  const payNow = () => {
    if (action) trackPayNowClicked(action);
    trackRegionBlockedShown();
    setPhase("blocked");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[360px] border-border bg-white">
        {phase === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Sign up to get started</DialogTitle>
              <DialogDescription className="text-base">Create your free account and Bit gets to work — texting guests, calling venues, and placing orders, all handled for you.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pw-email">Email</Label>
                <Input id="pw-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pw-password">Password</Label>
                <Input id="pw-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <CtaButton disabled={!canContinue} onClick={submitForm}>
                Continue
              </CtaButton>
            </div>
          </>
        )}

        {phase === "pay" && (
          <div className="max-h-[85vh] overflow-y-auto px-0.5">
            <DialogHeader className="items-center text-center">
              <img src="/bit-idle.gif" alt="Bit" width={88} height={88} className="mx-auto h-[88px] w-[88px] select-none object-contain" />
              <DialogTitle className="text-2xl font-bold">Activate Orbits</DialogTitle>
              <DialogDescription className="text-base">Unlock everything I can do for you and your household.</DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-col gap-3.5">
              {VALUE_PROPS.map((p) => (
                <div key={p.title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(96_32%_91%)]">
                    <p.Icon className="h-[18px] w-[18px] text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold leading-snug text-foreground">{p.title}</p>
                    <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border-2 border-primary bg-[hsl(96_32%_97%)] p-4 text-center">
              <p className="text-[2.5rem] font-bold leading-none text-foreground">
                $9.99<span className="text-lg font-semibold text-muted-foreground">/mo</span>
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">Cancel anytime</p>
            </div>

            <CtaButton className="mt-4" onClick={payNow}>
              Get started
            </CtaButton>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Cancel anytime · Secure checkout via Stripe
            </p>
          </div>
        )}

        {phase === "blocked" && (
          <>
            <DialogHeader>
              <DialogTitle>Almost there!</DialogTitle>
              <DialogDescription className="text-foreground">
                I&apos;m rolling out across your region over the next week — I&apos;ll let you know the moment I&apos;m ready to get to work for you!
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <CtaButton variant="outline" onClick={onClose}>Close</CtaButton>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
