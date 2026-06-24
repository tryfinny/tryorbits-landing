import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { QuestionsSchema, CardsSchema, type Questions, type Cards } from "./schemas";

// Astro/Vite exposes server env via import.meta.env (dev); Vercel sets process.env at runtime.
const env = import.meta.env as unknown as Record<string, string | undefined>;
const OPENAI_API_KEY = env.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
const MODEL = "gpt-4o";

export type ChatMessage = { role: "system" | "user"; content: string };

const QUESTIONS_SYSTEM =
  "You are Bit, a friendly household assistant. Given a task the user wants to plan, return a " +
  "short `title` and 3-5 form fields (labels under 6 words). " +
  "Field types: text, number, date, time, select, location. Use `time` for a time-of-day and " +
  "`location` for any place/venue/destination. For select fields set `options`, else null; set " +
  "`placeholder` to a brief example or null. " +
  "Pick fields tailored to THIS occasion that show you get it (guest of honor, a creative " +
  "theme, a personal touch) — not bland date/time/place boilerplate. For any gathering or " +
  "party, always include a guest-count (`number`) field. Never ask about money or budget. " +
  "Every field MUST be pre-filled with your best specific guess (the user only tweaks); make " +
  "values delightful, e.g. an inventive themed name over a bland one. Formats: `date` = " +
  "YYYY-MM-DD (resolve 'next Saturday' etc. against the current date, else a sensible upcoming " +
  "date); `time` = 24-hour HH:MM; `number` = digits; `select` value must be one of `options`. " +
  "For `location`, prefill a SPECIFIC searchable place (venue, neighborhood, or address) — " +
  "given only a broad city, narrow to a notable spot in it (e.g. 'Fisherman's Wharf, San " +
  "Francisco'). EXCEPTION: if it's the user's own home or a personal place with no searchable " +
  "address, leave `value` empty and set `placeholder` to 'Enter your address'.";

const CARDS_SYSTEM =
  "You are Bit, a household assistant. Given a task and the user's answers, produce activity " +
  "cards showing how you'd help. You may ONLY use these card types: guest_list (people to " +
  "invite), location (a place to go or book), shopping_list (things to buy), packing_list " +
  "(things to pack, e.g. for a trip), schedule (timeline of events for the day). Include only " +
  "the cards that make sense, usually 3-4. Use realistic but fictional names for places and " +
  "products. For guest_list: do NOT invent guest names — set `count` to the number of people " +
  "and `inviteMessage` to a warm, personable invite written like a close friend texting: " +
  "casual and genuinely excited, a little playful, specific to the occasion, one emoji is " +
  "welcome. 2-3 short sentences, no recipient names (a friendly opener like 'Hey you! 🎉' is " +
  "fine). " +
  "For location: set `placeName` to the area or city, and set `suggestions` to 2-4 SPECIFIC " +
  "real-sounding spots that fit the plan (e.g. specific hotels for a getaway, specific " +
  "restaurants for a dinner, specific parks or venues for a party). If the user named one " +
  "exact place, still include it plus a couple of good nearby alternatives. " +
  "For schedule give 3-6 events with short times like '2:00 PM'. For shopping_list set qty to " +
  "a short string (e.g. '2 dozen') or null. NEVER mention money, budgets, prices, or costs. " +
  "Keep every title under 4 words.";

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) client = new OpenAI({ apiKey: OPENAI_API_KEY });
  return client;
}

export function buildQuestionsMessages(prompt: string, today: string): ChatMessage[] {
  return [
    { role: "system", content: QUESTIONS_SYSTEM },
    {
      role: "user",
      content: `Today's date is ${today}. The user wants help with: "${prompt}". Generate the form fields with EVERY value pre-filled — use the user's details where given, sensible specific defaults otherwise.`,
    },
  ];
}

export function buildCardsMessages(prompt: string, answers: Record<string, string>): ChatMessage[] {
  const answerLines = Object.entries(answers)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");
  return [
    { role: "system", content: CARDS_SYSTEM },
    { role: "user", content: `Task: "${prompt}"\nDetails the user gave:\n${answerLines || "(none)"}\nGenerate the activity cards.` },
  ];
}

export async function generateQuestions(prompt: string): Promise<Questions> {
  const today = new Date().toISOString().slice(0, 10);
  const completion = await getClient().beta.chat.completions.parse({
    model: MODEL,
    messages: buildQuestionsMessages(prompt, today),
    response_format: zodResponseFormat(QuestionsSchema, "questions"),
  });
  const parsed = completion.choices[0]?.message.parsed;
  if (!parsed) throw new Error("OpenAI returned no parsed questions");
  return parsed;
}

export async function generateCards(prompt: string, answers: Record<string, string>): Promise<Cards> {
  const completion = await getClient().beta.chat.completions.parse({
    model: MODEL,
    messages: buildCardsMessages(prompt, answers),
    response_format: zodResponseFormat(CardsSchema, "cards"),
  });
  const parsed = completion.choices[0]?.message.parsed;
  if (!parsed) throw new Error("OpenAI returned no parsed cards");
  return parsed;
}

// Generate a relevant hero banner for the plan. Returns a base64 data URL.
export async function generateHero(subject: string): Promise<string> {
  const res = await getClient().images.generate({
    model: "gpt-image-1",
    prompt:
      `A soft, warm, tasteful banner photograph representing "${subject}". ` +
      `Calm pastel palette, gentle natural light, lifestyle aesthetic, no text, ` +
      `no words, no logos, no recognizable faces. Wide cinematic composition.`,
    size: "1536x1024",
    quality: "low",
    n: 1,
  });
  const d = res.data?.[0];
  if (d?.b64_json) return `data:image/png;base64,${d.b64_json}`;
  if (d?.url) return d.url;
  throw new Error("OpenAI returned no image");
}
