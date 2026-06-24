"use client";
import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionType } from "@/lib/start/schemas";
import { trackPaywallSubmitted, trackPayNowClicked, trackRegionBlockedShown } from "@/lib/analytics";
import { CtaButton } from "./CtaButton";

type Phase = "form" | "pay" | "blocked";

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
              <DialogTitle>Unlock Bit</DialogTitle>
              <DialogDescription>Create your account to let Bit take action for you.</DialogDescription>
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
          <>
            <DialogHeader className="items-center text-center">
              <img src="/bit-happy.gif" alt="Bit" width={112} height={112} className="mx-auto h-28 w-28 select-none object-contain" />
              <DialogTitle className="font-heading text-xl">Orbits Premium</DialogTitle>
              <DialogDescription>Let Bit text guests, call venues, and place orders for you.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <div className="rounded-2xl border border-border bg-secondary p-4 text-center">
                <p className="text-3xl font-semibold text-foreground">$9.99<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                <p className="mt-1 text-sm text-muted-foreground">Cancel anytime</p>
              </div>
              <CtaButton onClick={payNow}>Pay now</CtaButton>
            </div>
          </>
        )}

        {phase === "blocked" && (
          <>
            <DialogHeader>
              <DialogTitle>Almost there!</DialogTitle>
              <DialogDescription className="text-foreground">
                Whoops, this isn&apos;t available in your region yet — we&apos;ll keep you posted!
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
