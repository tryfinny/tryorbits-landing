"use client";
import { useState, type ReactNode } from "react";
import type { Card, ActionType } from "@/lib/start/schemas";
import { Share2, ChevronLeft, MessageSquare, Phone, ShoppingCart, ArrowRight, MapPin, Check, type LucideIcon } from "lucide-react";

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
        <img src={heroUrl} alt="" className="h-36 w-full object-cover" />
      ) : (
        <div className="h-36 w-full animate-pulse bg-gradient-to-br from-sky via-peach to-lavender" />
      )}

      <div className="px-5">
        {/* Bit avatar — image sits in a circular container (its source has padding) */}
        <div className="-mt-9 h-[76px] w-[76px] overflow-hidden rounded-full border-4 border-white bg-[hsl(150_36%_82%)] shadow-sm">
          <img src="/bit-face.png" alt="Bit" className="h-full w-full scale-[1.5] object-cover" />
        </div>

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
          <div className="bg-sky px-3 py-1.5 text-sm font-bold text-sky-foreground">{count}</div>
          {children}
        </div>
      </div>

      {a && action ? (
        <div className="mt-4 border-t border-border bg-secondary px-4 py-4">
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

const MAPS = ["/map.svg", "/map-2.svg", "/map-3.svg", "/map-4.svg"];
function pickMap(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return MAPS[h % MAPS.length];
}

function LocationTile({
  card,
  onAction,
}: {
  card: Extract<Card, { type: "location" }>;
  onAction: (a: ActionType) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const map = pickMap(card.placeName + card.title);
  const desc =
    selected !== null
      ? `I'll call ${card.suggestions[selected]} and lock in your reservation.`
      : "Pick a spot above and I'll call to book it.";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="px-4 pt-4">
        <h3 className="text-xl font-bold leading-tight text-foreground">{card.title}</h3>
      </div>

      <div className="px-4 pt-3">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="bg-sky px-3 py-1.5 text-sm font-bold text-sky-foreground">Pick a spot</div>
          <div className="relative border-b border-border">
            <img src={map} alt="Map" className="h-24 w-full object-cover" />
            <MapPin
              className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-full text-rose-600 drop-shadow"
              fill="#e11d48"
            />
          </div>
          <div className="divide-y divide-border">
            {card.suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-base transition-colors ${
                  selected === i ? "bg-[hsl(150_38%_93%)] font-bold text-foreground" : "text-foreground hover:bg-secondary"
                }`}
              >
                <span>{s}</span>
                {selected === i && <Check className="h-5 w-5 shrink-0 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-border bg-secondary px-4 py-4">
        <p className="flex items-start gap-2 text-base font-semibold text-foreground">
          <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <span>{desc}</span>
        </p>
        <button
          type="button"
          disabled={selected === null}
          onClick={() => onAction("call_reserve")}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-base font-bold transition-colors ${
            selected === null
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-[hsl(97_17%_42%)] text-white hover:bg-[hsl(97_20%_37%)]"
          }`}
        >
          Call &amp; reserve
          <ArrowRight className="h-[18px] w-[18px]" />
        </button>
        <p className="mt-2 text-center text-sm leading-snug text-muted-foreground">
          Bit will call in the background and let you know when finished.
          <br />
          A transcript will be provided.
        </p>
      </div>
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
      return <LocationTile card={card} onAction={onAction} />;
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
    case "packing_list": {
      const shown = card.items.slice(0, 6).map((it) => it.name);
      const extra = card.items.length - shown.length;
      return (
        <Tile cardTitle={card.title} count={`${card.items.length} to pack`} onAction={onAction}>
          <Rows items={extra > 0 ? [...shown, `+${extra} more`] : shown} />
        </Tile>
      );
    }
    default:
      return null;
  }
}
