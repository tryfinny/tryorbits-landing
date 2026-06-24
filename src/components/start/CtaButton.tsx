import type { ReactNode } from "react";

// Dedicated CTA for the /start demo. Uses arbitrary brand colors rather than the
// shadcn Button's theme tokens, which (in this Tailwind config) render transparent
// on disabled buttons. Full-width rounded pill with clear enabled/disabled/outline states.
export function CtaButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "outline";
}) {
  const base =
    "inline-flex h-12 w-full items-center justify-center rounded-full text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(82_25%_55%)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed";

  const styles = disabled
    ? "bg-[hsl(26_15%_86%)] text-[hsl(0_0%_52%)]"
    : variant === "outline"
      ? "border border-[hsl(26_18%_76%)] bg-transparent text-[hsl(0_0%_25%)] hover:bg-[hsl(30_28%_93%)]"
      : "bg-[hsl(97_17%_42%)] text-white hover:bg-[hsl(97_20%_37%)]";

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}
