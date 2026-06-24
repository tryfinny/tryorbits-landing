import type { ReactNode } from "react";
import type { Card, ActionType } from "@/lib/start/schemas";
import { Share2, ChevronLeft, MessageSquare, Phone, ShoppingCart, ArrowRight, type LucideIcon } from "lucide-react";

type CardAction = "text_guest" | "call_reserve" | "order_instacart";

const ACTIONS: Record<CardAction, { label: string; Icon: LucideIcon }> = {
  text_guest: { label: "Text the guests", Icon: MessageSquare },
  call_reserve: { label: "Call & reserve", Icon: Phone },
  order_instacart: { label: "Order on Instacart", Icon: ShoppingCart },
};

export function CardsView({
  cards,
  title,
  heroUrl,
  onAction,
  onBack,
}: {
  cards: Card[];
  title: string;
  heroUrl: string | null;
  onAction: (a: ActionType) => void;
  onBack: () => void;
}) {
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

      {/* hero cover — AI-generated, with a gradient placeholder while it loads */}
      {heroUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroUrl} alt="" className="h-36 w-full object-cover" />
      ) : (
        <div className="h-36 w-full animate-pulse bg-gradient-to-br from-[hsl(202_70%_84%)] via-[hsl(24_78%_88%)] to-[hsl(282_45%_88%)]" />
      )}

      <div className="px-5">
        {/* Bit avatar */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bit-face.png"
          alt="Bit"
          className="-mt-9 h-[72px] w-[72px] rounded-full border-4 border-white bg-white object-cover shadow-sm"
        />

        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Here&apos;s your plan. Tap a card and I&apos;ll text, call, or order it for you.
        </p>
      </div>

      {/* full-width plan cards */}
      <div className="mt-5 flex flex-col gap-4 px-5">
        {cards.map((card, i) => (
          <PlanTile key={i} card={card} onAction={onAction} />
        ))}
      </div>
    </div>
  );
}

function Tile({
  cardTitle,
  count,
  action,
  description,
  onAction,
  children,
}: {
  cardTitle: string;
  count: string;
  action?: CardAction;
  description?: string;
  onAction: (a: ActionType) => void;
  children: ReactNode;
}) {
  const a = action ? ACTIONS[action] : null;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="px-4 pt-4">
        <h3 className="text-xl font-bold leading-tight text-foreground">{cardTitle}</h3>
      </div>

      <div className="px-4 pt-3">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="bg-[hsl(200_58%_87%)] px-3 py-1.5 text-sm font-bold text-foreground">{count}</div>
          {children}
        </div>
      </div>

      {a && action ? (
        <div className="mt-4 border-t border-border bg-[hsl(96_34%_97%)] px-4 py-4">
          <p className="flex items-start gap-2 text-base font-semibold text-foreground">
            <a.Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <span>{description}</span>
          </p>
          <button
            type="button"
            onClick={() => onAction(action)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(97_17%_42%)] px-4 py-3 text-base font-bold text-white transition-colors hover:bg-[hsl(97_20%_37%)]"
          >
            {a.label}
            <ArrowRight className="h-[18px] w-[18px]" />
          </button>
        </div>
      ) : (
        <div className="pb-4" />
      )}
    </div>
  );
}

function Rows({ items }: { items: string[] }) {
  return (
    <div className="divide-y divide-border">
      {items.map((t, i) => (
        <p key={i} className="px-3 py-2.5 text-base text-foreground">{t}</p>
      ))}
    </div>
  );
}

function PlanTile({
  card,
  onAction,
}: {
  card: Card;
  onAction: (a: ActionType) => void;
}) {
  switch (card.type) {
    case "guest_list": {
      const shown = card.guests.slice(0, 4).map((g) => g.name);
      const extra = card.guests.length - shown.length;
      return (
        <Tile
          cardTitle={card.title}
          count={`${card.guests.length} guests`}
          action="text_guest"
          description={`I'll text all ${card.guests.length} guests their invites and keep track of who's coming.`}
          onAction={onAction}
        >
          <Rows items={extra > 0 ? [...shown, `+${extra} more`] : shown} />
        </Tile>
      );
    }
    case "location":
      return (
        <Tile
          cardTitle={card.title}
          count="Venue"
          action="call_reserve"
          description={`I'll call ${card.placeName} and lock in your reservation.`}
          onAction={onAction}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/map.svg" alt="Map" className="h-28 w-full object-cover" />
          <p className="px-3 py-2.5 text-base font-semibold text-foreground">{card.placeName}</p>
        </Tile>
      );
    case "shopping_list": {
      const shown = card.items.slice(0, 4).map((it) => it.name);
      const extra = card.items.length - shown.length;
      return (
        <Tile
          cardTitle={card.title}
          count={`${card.items.length} items`}
          action="order_instacart"
          description={`I'll add all ${card.items.length} items to Instacart and place the order.`}
          onAction={onAction}
        >
          <Rows items={extra > 0 ? [...shown, `+${extra} more`] : shown} />
        </Tile>
      );
    }
    case "schedule": {
      const shown = card.events.slice(0, 6).map((e) => `${e.time} · ${e.label}`);
      return (
        <Tile cardTitle={card.title} count={`${card.events.length} events`} onAction={onAction}>
          <Rows items={shown} />
        </Tile>
      );
    }
    default:
      return null;
  }
}
