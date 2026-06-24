import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { QuestionsSchema, CardsSchema, type Questions, type Cards } from "./schemas";

// Astro/Vite exposes server env via import.meta.env (dev); Vercel sets process.env at runtime.
const env = import.meta.env as unknown as Record<string, string | undefined>;
const OPENAI_API_KEY = env.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
const MODEL = env.OPENAI_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export type ChatMessage = { role: "system" | "user"; content: string };

const QUESTIONS_SYSTEM =
  "You are Bit, a friendly household assistant. The user tells you a task they want help " +
  "planning. Respond with 3-4 short clarifying questions as form fields you need answered. " +
  "Use field types: text, number, date, or select. For select fields set `options` to an " +
  "array of choices; otherwise set `options` to null. Set `placeholder` to a brief example " +
  "or null. Keep each label under 6 words. Return a short `title` naming the task.";

const CARDS_SYSTEM =
  "You are Bit, a household assistant. Given a task and the user's answers, produce activity " +
  "cards showing how you'd help. You may ONLY use these card types: guest_list (people to " +
  "invite), location (a single venue/place), shopping_list (things to buy), schedule (timeline " +
  "of events for the day). Include only the cards that make sense, usually 3-4. Use realistic " +
  "but fictional names. For schedule give 3-6 events with short times like '2:00 PM'. For " +
  "shopping_list set qty to a short string (e.g. '2 dozen') or null. Keep every title under 4 words.";

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) client = new OpenAI({ apiKey: OPENAI_API_KEY });
  return client;
}

export function buildQuestionsMessages(prompt: string): ChatMessage[] {
  return [
    { role: "system", content: QUESTIONS_SYSTEM },
    { role: "user", content: `The user wants help with: "${prompt}". Generate the clarifying form fields.` },
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
  const completion = await getClient().beta.chat.completions.parse({
    model: MODEL,
    messages: buildQuestionsMessages(prompt),
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
