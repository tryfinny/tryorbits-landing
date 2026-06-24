import type { ReactNode } from "react";
import type { Card, ActionType } from "@/lib/start/schemas";
import { Share2, ChevronLeft, MessageSquare, Phone, ShoppingCart, type LucideIcon } from "lucide-react";

type CardAction = "text_guest" | "call_reserve" | "order_instacart";

const ACTIONS: Record<CardAction, { label: string; Icon: LucideIcon }> = {
  text_guest: { label: "Ask Bit to text", Icon: MessageSquare },
  call_reserve: { label: "Ask Bit to call & reserve", Icon: Phone },
  order_instacart: { label: "Ask Bit to order", Icon: ShoppingCart },
};

function pickEmoji(title: string): string {
  const t = title.toLowerCase();
  if (/birthday|bday/.test(t)) return "🎉";
  if (/trip|travel|getaway|vacation|flight|holiday/.test(t)) return "✈️";
  if (/wedding/.test(t)) return "💍";
  if (/dinner|meal|restaurant|brunch|lunch/.test(t)) return "🍽️";
  if (/party/.test(t)) return "🎉";
  if (/move|moving|home/.test(t)) return "📦";
  return "✨";
}

export function CardsView({
  cards,
  title,
  onAction,
  onBack,
}: {
  cards: Card[];
  title: string;
  onAction: (a: ActionType) => void;
  onBack: () => void;
}) {
  const emoji = pickEmoji(title);
  return (
    <div className="pb-10">
      {/* nav header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="-ml-1.5 flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="text-base font-bold text-foreground">Plan</span>
        <button
          type="button"
          onClick={() => onAction("share")}
          aria-label="Share"
          className="-mr-1.5 flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
        >
          <Share2 className="h-[20px] w-[20px]" />
        </button>
      </div>

      {/* hero cover */}
      <div className="h-32 w-full bg-gradient-to-br from-[hsl(202_70%_84%)] via-[hsl(24_78%_88%)] to-[hsl(282_45%_88%)]" />

      <div className="px-5">
        {/* folder avatar */}
        <div className="-mt-9 flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white bg-[hsl(200_55%_88%)] text-3xl shadow-sm">
          {emoji}
        </div>

        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Tap any card — Bit can text, call, and order it for you.
        </p>
      </div>

      {/* masonry of plan cards */}
      <div className="mt-5 columns-2 gap-3 px-5 [&>*]:mb-3">
        {cards.map((card, i) => (
          <PlanTile key={i} card={card} emoji={emoji} onAction={onAction} />
        ))}
      </div>
    </div>
  );
}

function Tile({
  cardTitle,
  count,
  action,
  emoji,
  onAction,
  children,
}: {
  cardTitle: string;
  count: string;
  action?: CardAction;
  emoji: string;
  onAction: (a: ActionType) => void;
  children: ReactNode;
}) {
  const a = action ? ACTIONS[action] : null;
  return (
    <div className="break-inside-avoid overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="px-4 pt-4">
        <h3 className="text-lg font-bold leading-tight text-foreground">{cardTitle}</h3>
        <p className="text-sm text-muted-foreground">just now</p>
      </div>

      <div className="px-3 pt-3">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="bg-[hsl(200_58%_87%)] px-3 py-1.5 text-sm font-bold text-foreground">{count}</div>
          {children}
        </div>
      </div>

      {a && action ? (
        <div className="p-3">
          <button
            type="button"
            onClick={() => onAction(action)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[hsl(96_20%_82%)] bg-[hsl(96_26%_91%)] px-2 py-2.5 text-sm font-bold text-[hsl(96_32%_28%)] transition-colors hover:bg-[hsl(96_26%_86%)]"
          >
            <a.Icon className="h-4 w-4 shrink-0" />
            <span>{a.label}</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-[hsl(200_55%_60%)]" /> {emoji} Itinerary
        </div>
      )}
    </div>
  );
}

function Rows({ items }: { items: string[] }) {
  return (
    <div className="divide-y divide-border">
      {items.map((t, i) => (
        <p key={i} className="px-3 py-2 text-base text-foreground">{t}</p>
      ))}
    </div>
  );
}

function PlanTile({
  card,
  emoji,
  onAction,
}: {
  card: Card;
  emoji: string;
  onAction: (a: ActionType) => void;
}) {
  switch (card.type) {
    case "guest_list": {
      const shown = card.guests.slice(0, 3).map((g) => g.name);
      const extra = card.guests.length - shown.length;
      return (
        <Tile cardTitle={card.title} count={`${card.guests.length} guests`} action="text_guest" emoji={emoji} onAction={onAction}>
          <Rows items={extra > 0 ? [...shown, `+${extra} more`] : shown} />
        </Tile>
      );
    }
    case "location":
      return (
        <Tile cardTitle={card.title} count="Venue" action="call_reserve" emoji={emoji} onAction={onAction}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/map.svg" alt="Map" className="h-24 w-full object-cover" />
          <p className="px-3 py-2 text-base font-semibold text-foreground">{card.placeName}</p>
        </Tile>
      );
    case "shopping_list": {
      const shown = card.items.slice(0, 3).map((it) => it.name);
      const extra = card.items.length - shown.length;
      return (
        <Tile cardTitle={card.title} count={`${card.items.length} items`} action="order_instacart" emoji={emoji} onAction={onAction}>
          <Rows items={extra > 0 ? [...shown, `+${extra} more`] : shown} />
        </Tile>
      );
    }
    case "schedule": {
      const shown = card.events.slice(0, 4).map((e) => `${e.time} · ${e.label}`);
      const extra = card.events.length - shown.length;
      return (
        <Tile cardTitle={card.title} count={`${card.events.length} events`} emoji={emoji} onAction={onAction}>
          <Rows items={extra > 0 ? [...shown, `+${extra} more`] : shown} />
        </Tile>
      );
    }
    default:
      return null;
  }
}
