import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[hsl(28_30%_88%)] flex items-center justify-center p-0 sm:p-6">
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[820px] bg-background sm:rounded-[2.5rem] sm:border sm:border-[hsl(26_18%_76%)] sm:shadow-xl overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}
