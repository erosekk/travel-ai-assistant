// =============================================
// lib/prompts.ts — System & User Prompt Builder
// =============================================

import { Lang, TravelFormData } from "@/types";

export function buildSystemPrompt(lang: Lang): string {
  const langInstruction =
    lang === "pl"
      ? "Odpowiadaj TYLKO po polsku. Wszystkie opisy, porady, aktywności i tłumaczenia generuj w języku polskim."
      : "Respond ONLY in English. Generate all descriptions, tips, activities and translations in English.";

  return `You are an expert AI travel assistant with deep knowledge of global destinations. ${langInstruction}

You MUST return a valid JSON object with EXACTLY this structure.
Return RAW JSON only — no markdown, no code blocks, no explanations before or after.

{
  "phrasebook": [
    {
      "local": "phrase in the destination local language",
      "translation": "translation in the UI language",
      "pronunciation": "simple phonetic pronunciation guide",
      "category": "one of: Powitania/Greetings | Restauracja/Restaurant | Transport | Kierunki/Directions | Nagłe przypadki/Emergency | Wyrażenia/Expressions"
    }
  ],
  "checklist": {
    "documents": ["string"],
    "clothes": ["string"],
    "electronics": ["string"],
    "medicine": ["string"],
    "transport": ["string"],
    "money": ["string"],
    "local_specific": ["string"]
  },
  "itinerary": [
    {
      "day": 1,
      "title": "short evocative title for the day",
      "items": [
        {
          "time": "HH:MM",
          "activity": "activity name",
          "location": "specific place name",
          "cost": "approximate cost or 'free'",
          "tip": "insider tip for this stop"
        }
      ]
    }
  ],
  "map_points": [
    {
      "name": "place name",
      "category": "restaurant | museum | park | landmark | transport | bar | hotel | attraction",
      "description": "1-2 sentence description",
      "address": "street address or neighborhood",
      "lat": 0.0,
      "lng": 0.0,
      "order": 1
    }
  ],
  "tips": {
    "food": ["string"],
    "scams": ["string"],
    "transport": ["string"],
    "safety": ["string"],
    "photo_spots": ["string"],
    "etiquette": ["string"]
  }
}

STRICT RULES:
- phrasebook: generate 20–30 phrases covering all 6 categories evenly
- checklist: practical, destination-specific items (scale to trip length)
- itinerary: generate EXACTLY one object per day of the trip. Each day has 6–10 items from ~08:00 to ~23:00. Do NOT combine days. Days should be thematically distinct (different areas, different focus).
- map_points: 6–15 real places with ACCURATE lat/lng. Scale count to number of days.
- tips: 3–5 items per category, actionable and destination-specific
- All text content must be in the response language specified above`;
}

export function buildUserPrompt(data: TravelFormData, lang: Lang): string {
  const stylesStr = data.tripStyles.join(", ");
  const budgetStr = data.budgetAmount
    ? `${data.budgetAmount} (poziom: ${data.budgetLevel})`
    : data.budgetLevel;
  const budgetStrEn = data.budgetAmount
    ? `${data.budgetAmount} (level: ${data.budgetLevel})`
    : data.budgetLevel;

  if (lang === "pl") {
    return `Wygeneruj kompletny plan podróży dla:

Miasto: ${data.destination}
Kraj: ${data.country}
Język lokalny: ${data.language}
Style podróży: ${stylesStr}
Liczba dni: ${data.days}
Budżet na osobę: ${budgetStr}
Sezon / Daty: ${data.season || "nie podano"}
Dodatkowe preferencje: ${data.preferences || "brak"}

WAŻNE: Wygeneruj plan na DOKŁADNIE ${data.days} ${data.days === 1 ? "dzień" : data.days < 5 ? "dni" : "dni"}. Każdy dzień powinien mieć inny motyw lub dzielnicę. Dostosuj plan do WSZYSTKICH wybranych stylów.

Pamiętaj: odpowiadaj po polsku, zwróć wyłącznie JSON.`;
  }

  return `Generate a complete travel plan for:

City: ${data.destination}
Country: ${data.country}
Local language: ${data.language}
Trip styles: ${stylesStr}
Number of days: ${data.days}
Budget per person: ${budgetStrEn}
Season / Dates: ${data.season || "not specified"}
Additional preferences: ${data.preferences || "none"}

IMPORTANT: Generate a plan for EXACTLY ${data.days} ${data.days === 1 ? "day" : "days"}. Each day should have a distinct theme or area of the city. Combine ALL selected trip styles throughout the plan.

Remember: respond in English, return JSON only.`;
}
