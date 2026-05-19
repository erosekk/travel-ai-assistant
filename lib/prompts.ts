// =============================================
// lib/prompts.ts — System & User Prompt Builder
// =============================================

import { Lang, TravelFormData } from "@/types";

export function buildSystemPrompt(lang: Lang): string {
  const langInstruction =
    lang === "pl"
      ? "Odpowiadaj TYLKO po polsku."
      : "Respond ONLY in English.";

  return `You are an expert AI travel assistant. ${langInstruction}

Return ONLY a raw JSON object. No markdown. No text before or after. No code blocks. Start your response with { and end with }.

JSON structure:
{
  "phrasebook": [{"local":"string","translation":"string","pronunciation":"string","category":"string"}],
  "checklist": {"documents":["string"],"clothes":["string"],"electronics":["string"],"medicine":["string"],"transport":["string"],"money":["string"],"local_specific":["string"]},
  "itinerary": [{"day":1,"title":"string","items":[{"time":"HH:MM","activity":"string","location":"string","cost":"string","tip":"string"}]}],
  "map_points": [{"name":"string","category":"string","description":"string","address":"string","lat":0.0,"lng":0.0,"order":1}],
  "tips": {"food":["string"],"scams":["string"],"transport":["string"],"safety":["string"],"photo_spots":["string"],"etiquette":["string"]},
  "facts": [{"category":"string","title":"string","content":"string","important":true}]
}

Rules:
- phrasebook: exactly 15 phrases, 6 categories (greetings, restaurant, transport, directions, emergency, expressions)
- checklist: 3-4 items per category, destination-specific
- itinerary: exactly one object per day, 6 items per day from 09:00 to 22:00
- map_points: exactly 6 real places with accurate lat/lng coordinates
- tips: exactly 3 items per category
- facts: 5-8 non-obvious practical facts about this specific destination
- Keep all text SHORT and concise to fit within token limits`;
}

export function buildUserPrompt(data: TravelFormData, lang: Lang): string {
  const stylesStr = data.tripStyles.join(", ");
  const budgetStr = data.budgetAmount
    ? `${data.budgetAmount} (${data.budgetLevel})`
    : data.budgetLevel;

  if (lang === "pl") {
    return `Plan podróży:
Miasto: ${data.destination}, ${data.country}
Język lokalny: ${data.language}
Style: ${stylesStr}
Dni: ${data.days}
Budżet/os: ${budgetStr}
Sezon: ${data.season || "nie podano"}
Preferencje: ${data.preferences || "brak"}

Zwróć TYLKO JSON, zacznij od {`;
  }

  return `Travel plan:
City: ${data.destination}, ${data.country}
Local language: ${data.language}
Styles: ${stylesStr}
Days: ${data.days}
Budget/person: ${budgetStr}
Season: ${data.season || "not specified"}
Preferences: ${data.preferences || "none"}

Return ONLY JSON, start with {`;
}