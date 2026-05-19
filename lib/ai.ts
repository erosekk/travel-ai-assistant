// =============================================
// lib/ai.ts — Claude API Integration
// =============================================

import { Lang, TravelFormData, TravelPlan } from "@/types";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 8000;

/**
 * Calls the Anthropic API via the Next.js server-side API route.
 * The API key is NEVER exposed to the browser.
 */
export async function generateTravelPlan(
  formData: TravelFormData,
  lang: Lang
): Promise<TravelPlan> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formData, lang }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data as TravelPlan;
}

/**
 * Direct Claude API call — used ONLY from the server-side API route.
 * Do NOT call this from the browser.
 */
export async function callClaude(
  formData: TravelFormData,
  lang: Lang,
  apiKey: string
): Promise<TravelPlan> {
  const systemPrompt = buildSystemPrompt(lang);
  const userPrompt = buildUserPrompt(formData, lang);

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error?.message || `Anthropic API error ${response.status}`);
  }

  const data = await response.json();
  const rawText: string = data.content?.[0]?.text ?? "";

  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("Failed to parse AI response as JSON. Try again.");
  }

  const jsonStr = rawText.slice(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(jsonStr) as TravelPlan;
  } catch {
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(cleaned) as TravelPlan;
    } catch {
      throw new Error("Failed to parse AI response as JSON. Try again.");
    }
  }
}
