// =============================================
// lib/ai.ts — Claude API Integration
// =============================================

import { Lang, TravelFormData, TravelPlan } from "@/types";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 8000;

type ClaudeResponse = {
  content?: Array<{ type?: string; text?: string }>;
  stop_reason?: string;
};

function extractJson(rawText: string): string {
  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("AI returned a non-JSON response. Try again.");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function parseTravelPlan(rawText: string): TravelPlan {
  const jsonStr = extractJson(rawText);

  try {
    return JSON.parse(jsonStr) as TravelPlan;
  } catch {
    throw new Error("AI returned invalid JSON. Try again.");
  }
}

function readClaudeText(data: ClaudeResponse, assistantPrefill: string) {
  const text = data.content?.find((part) => part.type === "text" || part.text)?.text ?? "";
  const trimmed = text.trimStart();
  return trimmed.startsWith("{") ? text : `${assistantPrefill}${text}`;
}

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

  const request = async (prompt: string) => {
    const assistantPrefill = "{";
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
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: assistantPrefill },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error?.message || `Anthropic API error ${response.status}`);
    }

    const data = (await response.json()) as ClaudeResponse;
    if (data.stop_reason === "max_tokens") {
      throw new Error("AI response was too long. Try fewer days or fewer cities.");
    }

    return readClaudeText(data, assistantPrefill);
  };

  const rawText = await request(userPrompt);

  try {
    return parseTravelPlan(rawText);
  } catch {
    const retryPrompt = `${userPrompt}

Your previous response was not valid JSON. Return a shorter response as strict JSON only. Do not include markdown, explanations, facts, or fields outside the schema.`;
    return parseTravelPlan(await request(retryPrompt));
  }
}
