import type { Questions, Cards } from "./schemas";

export function fallbackQuestions(): Questions {
  return {
    title: "Your Plan",
    fields: [
      { id: "headcount", label: "How many people?", type: "number", placeholder: "e.g. 12", options: null },
      { id: "date", label: "What date?", type: "date", placeholder: null, options: null },
      { id: "location", label: "Where?", type: "text", placeholder: "e.g. downtown", options: null },
      { id: "budget", label: "Budget?", type: "select", placeholder: null, options: ["$", "$$", "$$$"] },
    ],
  };
}

export function fallbackCards(): Cards {
  return {
    cards: [
      {
        type: "guest_list",
        title: "Guest List",
        guests: [{ name: "Emma Carter" }, { name: "Liam Patel" }, { name: "Sophia Nguyen" }, { name: "Noah Kim" }],
      },
      { type: "location", title: "Venue", placeName: "Bella's Trattoria" },
      {
        type: "shopping_list",
        title: "Shopping",
        items: [
          { name: "Balloons", qty: "2 packs" },
          { name: "Birthday cake", qty: "1" },
          { name: "Paper plates", qty: "24" },
          { name: "Candles", qty: "1 box" },
        ],
      },
      {
        type: "schedule",
        title: "Day Plan",
        events: [
          { time: "10:00 AM", label: "Pick up decorations" },
          { time: "1:00 PM", label: "Pick up daughter" },
          { time: "3:00 PM", label: "Decorate venue" },
          { time: "5:00 PM", label: "Arrive at restaurant" },
        ],
      },
    ],
  };
}
