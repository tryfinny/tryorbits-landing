import type { APIRoute } from "astro";
import { generateQuestions, generateCards, generateHero } from "@/lib/start/openai";
import { fallbackQuestions, fallbackCards } from "@/lib/start/fallback";

// On-demand (serverless) — keeps the OpenAI key server-side. Everything else
// on the site stays statically prerendered.
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: { mode?: string; prompt?: string; answers?: Record<string, string>; title?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { mode, prompt, answers, title } = body ?? {};

  if (mode === "hero") {
    const subject = (typeof title === "string" && title) || (typeof prompt === "string" && prompt) || "";
    try {
      return Response.json({ image: await generateHero(subject) });
    } catch (err) {
      console.error("[/api/plan] hero failed:", err);
      return Response.json({ image: null });
    }
  }

  if (mode === "questions") {
    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "prompt is required" }, { status: 400 });
    }
    try {
      return Response.json(await generateQuestions(prompt));
    } catch (err) {
      console.error("[/api/plan] questions fell back:", err);
      return Response.json(fallbackQuestions());
    }
  }

  if (mode === "cards") {
    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "prompt is required" }, { status: 400 });
    }
    try {
      return Response.json(await generateCards(prompt, answers ?? {}));
    } catch (err) {
      console.error("[/api/plan] cards fell back:", err);
      return Response.json(fallbackCards());
    }
  }

  return Response.json({ error: "invalid mode" }, { status: 400 });
};
