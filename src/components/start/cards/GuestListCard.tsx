import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import type { ActionType } from "@/lib/start/schemas";

export function GuestListCard({
  title, guests, onAction,
}: {
  title: string;
  guests: { name: string }[];
  onAction: (a: ActionType) => void;
}) {
  return (
    <Card className="border-border bg-white shadow-md">
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-3">
        {guests.map((g, i) => (
          <div key={i} className="flex flex-col gap-1.5 border-b border-border pb-3 last:border-0 last:pb-0">
            <span className="font-medium">{g.name}</span>
            <button
              type="button"
              onClick={() => onAction("text_guest")}
              className="inline-flex w-fit items-center gap-1.5 rounded-full bg-lavender px-3 py-1.5 text-xs font-semibold text-lavender-foreground transition-opacity hover:opacity-90"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Ask Bit to text this person
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
