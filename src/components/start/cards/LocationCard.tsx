import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";
import type { ActionType } from "@/lib/start/schemas";

export function LocationCard({
  title, placeName, onAction,
}: {
  title: string;
  placeName: string;
  onAction: (a: ActionType) => void;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="relative h-36 w-full overflow-hidden rounded-xl">
          <img src="/map.svg" alt="Map" className="h-full w-full object-cover" />
          <MapPin className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-full text-rose-600 drop-shadow" fill="#e11d48" />
        </div>
        <span className="font-medium">{placeName}</span>
        <button
          type="button"
          onClick={() => onAction("call_reserve")}
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sage px-3 py-1.5 text-xs font-semibold text-sage-foreground transition-opacity hover:opacity-90"
        >
          <Phone className="h-3.5 w-3.5" /> Ask Bit to call and reserve
        </button>
      </CardContent>
    </Card>
  );
}
