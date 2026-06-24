import type { Card, ActionType } from "@/lib/start/schemas";
import { GuestListCard } from "./cards/GuestListCard";
import { LocationCard } from "./cards/LocationCard";
import { ShoppingListCard } from "./cards/ShoppingListCard";
import { ScheduleCard } from "./cards/ScheduleCard";

export function CardsView({
  cards, onAction,
}: {
  cards: Card[];
  onAction: (a: ActionType) => void;
}) {
  return (
    <div className="flex flex-col gap-4 px-5 pb-8 pt-6">
      {cards.map((card, i) => {
        switch (card.type) {
          case "guest_list":
            return <GuestListCard key={i} title={card.title} guests={card.guests} onAction={onAction} />;
          case "location":
            return <LocationCard key={i} title={card.title} placeName={card.placeName} onAction={onAction} />;
          case "shopping_list":
            return <ShoppingListCard key={i} title={card.title} items={card.items} onAction={onAction} />;
          case "schedule":
            return <ScheduleCard key={i} title={card.title} events={card.events} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
