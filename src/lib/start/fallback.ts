import type { Questions, Cards } from "./schemas";

export function fallbackQuestions(): Questions {
  const date = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  return {
    title: "Your Plan",
    fields: [
      { id: "headcount", label: "How many people?", type: "number", placeholder: "e.g. 12", options: null, value: "12" },
      { id: "date", label: "What date?", type: "date", placeholder: null, options: null, value: date },
      { id: "location", label: "Where?", type: "location", placeholder: "Search a place…", options: null, value: "Downtown" },
      { id: "budget", label: "Budget?", type: "select", placeholder: null, options: ["$", "$$", "$$$"], value: "$$" },
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
      {
        type: "location",
        title: "Venue",
        placeName: "Downtown",
        suggestions: ["Bella's Trattoria", "The Garden Room", "Lakeside Pavilion"],
      },
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
