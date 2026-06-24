import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import type { ActionType } from "@/lib/start/schemas";

export function ShoppingListCard({
  title, items, onAction,
}: {
  title: string;
  items: { name: string; qty: string | null }[];
  onAction: (a: ActionType) => void;
}) {
  return (
    <Card className="border-border bg-[hsl(28_24%_96%)] shadow-md">
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ul className="flex flex-col gap-2">
          {items.map((it, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span>{it.name}</span>
              {it.qty && <span className="text-muted-foreground">{it.qty}</span>}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onAction("order_instacart")}
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-peach px-3 py-1.5 text-xs font-semibold text-peach-foreground transition-opacity hover:opacity-90"
        >
          <ShoppingCart className="h-3.5 w-3.5" /> Ask Bit to order via Instacart
        </button>
      </CardContent>
    </Card>
  );
}
