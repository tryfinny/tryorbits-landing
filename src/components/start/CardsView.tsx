import type { ReactNode } from "react";
import type { Card, ActionType } from "@/lib/start/schemas";
import { Star, ChevronLeft, MessageSquare, Phone, ShoppingCart } from "lucide-react";

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
}: {
  cards: Card[];
  title: string;
  onAction: (a: ActionType) => void;
}) {
  const emoji = pickEmoji(title);
  return (
    <div className="pb-28">
      {/* nav header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <ChevronLeft className="h-6 w-6 text-foreground" />
        <span className="text-base font-bold text-foreground">Plan</span>
        <span className="text-base font-semibold text-muted-foreground">Options</span>
      </div>

      {/* hero cover */}
      <div className="h-32 w-full bg-gradient-to-br from-[hsl(202_70%_84%)] via-[hsl(24_78%_88%)] to-[hsl(282_45%_88%)]" />

      <div className="px-5">
        {/* folder avatar */}
        <div className="-mt-9 flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white bg-[hsl(200_55%_88%)] text-3xl shadow-sm">
          {emoji}
        </div>

        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-base text-muted-foreground">Everything Bit pulled together for you.</p>

        {/* members row */}
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(330_32%_84%)] text-sm font-bold text-foreground">
            N
          </span>
          <span className="text-base text-muted-foreground">Shared just with you</span>
        </div>
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

const ACTION_ICON = {
  text_guest: MessageSquare,
  call_reserve: Phone,
  order_instacart: ShoppingCart,
} as const;

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
  action?: ActionType;
  emoji: string;
  onAction: (a: ActionType) => void;
  children: ReactNode;
}) {
  const ActionIcon = action ? ACTION_ICON[action] : null;
  return (
    <div
      role={action ? "button" : undefined}
      tabIndex={action ? 0 : undefined}
      onClick={action ? () => onAction(action) : undefined}
      className={`break-inside-avoid overflow-hidden rounded-2xl border border-border bg-white shadow-sm ${
        action ? "cursor-pointer transition-shadow hover:shadow-md" : ""
      }`}
    >
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

      <div className="flex items-center justify-between px-4 py-3">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-[hsl(200_55%_60%)]" />
          {emoji}
        </span>
        {ActionIcon ? (
          <ActionIcon className="h-[18px] w-[18px] text-primary" />
        ) : (
          <Star className="h-[18px] w-[18px] text-muted-foreground/40" />
        )}
      </div>
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
