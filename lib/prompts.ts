// =============================================
// lib/prompts.ts — System & User Prompt Builder
// =============================================

import { Lang, TravelFormData } from "@/types";

export function buildSystemPrompt(lang: Lang): string {
  const langInstruction =
    lang === "pl"
      ? "Odpowiadaj TYLKO po polsku."
      : "Respond ONLY in English.";

  return `You are an expert AI travel assistant with up-to-date knowledge. ${langInstruction}

Return ONLY a raw JSON object. No markdown. No text before or after. No code blocks. Start your response with { and end with }.
CRITICAL LANGUAGE RULES:
There are TWO completely separate language systems:
1. UI LANGUAGE controls: checklist, itinerary, tips, map descriptions, facts, all explanations. UI language is ONLY Polish or English as specified.
2. LOCAL PHRASEBOOK LANGUAGE applies ONLY to the "local" field in phrasebook phrases.
Example for Croatia with Polish UI: checklist=Polish, itinerary=Polish, tips=Polish, ONLY phrasebook "local" field=Croatian.
NEVER generate checklist, itinerary, tips or map descriptions in the local destination language.
CRITICAL RULES FOR ACCURACY:
- Always use the CURRENT currency of the destination (e.g. Croatia uses EURO since Jan 2023, NOT kuna)
- map_points lat/lng must be PRECISE street-level coordinates WITHIN the destination city center
- Never place markers in water, outside the city, or in wrong regions
- Double-check: if destination is Zadar, all markers must be in Zadar city (lat ~44.119, lng ~15.231)
- If destination is Split, all markers in Split (lat ~43.508, lng ~16.440)
- Verify each coordinate is on land and within 3km of city center
- Use current 2024-2026 information only — no outdated facts

JSON structure:
{
  phrasebook: exactly 15 phrases, 6 categories (greetings, restaurant, transport, directions, emergency, expressions). Pronunciation MUST use Polish phonetics (jak Polak by to czytał), e.g. "bon-żur" not "bon-ZHOOR", "mersi" not "mehr-SEE", "silwuple" not "see voo PLEH"
  "checklist": {"documents":["string"],"clothes":["string"],"electronics":["string"],"medicine":["string"],"transport":["string"],"money":["string"],"local_specific":["string"]},
  "itinerary": [{"day":1,"title":"string","items":[{"time":"HH:MM","activity":"string","location":"string","cost":"string","tip":"string"}]}],
  "map_points": [{"name":"string","category":"string","description":"string","address":"string","lat":0.0,"lng":0.0,"order":1}],
  "tips": {"food":["string"],"scams":["string"],"transport":["string"],"safety":["string"],"photo_spots":["string"],"etiquette":["string"]},
  "facts": [{"category":"string","title":"string","content":"string","important":true}]
}

Rules:
- phrasebook: exactly 15 phrases, 6 categories (greetings, restaurant, transport, directions, emergency, expressions). Pronunciation MUST use Polish phonetics (jak Polak by to czytał), e.g. "bon-żur" not "bon-ZHOOR", "mersi" not "mehr-SEE", "silwuple" not "see voo PLEH"
- checklist: 3-4 items per category, destination-specific, use current local currency
- itinerary: exactly one object per day, 6 items per day from 09:00 to 22:00, use current prices in correct currency
- map_points: exactly 6 real places, ALL coordinates must be precise and within the city boundaries
- tips: exactly 3 items per category, current and accurate
- facts: 5-8 non-obvious practical facts, must be current (post-2026)
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

WAŻNE: Użyj aktualnej waluty ${data.country}. Wszystkie punkty na mapie muszą być dokładnie w centrum miasta ${data.destination} — sprawdź każdą współrzędną.

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

IMPORTANT: Use current currency of ${data.country}. All map points must be precisely within ${data.destination} city center — verify each coordinate is correct and on land.

Return ONLY JSON, start with {`;
}