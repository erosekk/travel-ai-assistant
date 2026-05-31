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
Use valid JSON syntax only: double-quoted keys, double-quoted strings, no comments, no trailing commas.
Do not add fields outside the JSON structure below.
CRITICAL LANGUAGE RULES:
There are TWO completely separate language systems:
1. UI LANGUAGE controls: checklist, itinerary, tips, map descriptions, all explanations. UI language is ONLY Polish or English as specified.
2. LOCAL PHRASEBOOK LANGUAGE applies ONLY to the "local" field in phrasebook phrases and must be inferred from the destination country/cities.
Example for Croatia with Polish UI: checklist=Polish, itinerary=Polish, tips=Polish, ONLY phrasebook "local" field=Croatian.
NEVER generate checklist, itinerary, tips or map descriptions in the local destination language.
If a country has multiple official or regional languages, choose the practical tourist language for the specific city/region and mention regional variants only when useful.
CRITICAL RULES FOR ACCURACY:
- Always use the CURRENT currency of the destination (e.g. Croatia uses EURO since Jan 2023, NOT kuna)
- map_points lat/lng must be PRECISE street-level coordinates within the relevant destination city or trip area
- Never place markers in water, outside the city, or in wrong regions
- Double-check: if destination is Zadar, all markers must be in Zadar city (lat ~44.119, lng ~15.231)
- If destination is Split, all markers in Split (lat ~43.508, lng ~16.440)
- For multiple destinations, distribute the itinerary and map points across the listed cities in a realistic route order
- Verify each coordinate is on land and within the correct city/area
- Use current 2024-2026 information only — no outdated facts
CRITICAL PERSONALIZATION RULES:
- Treat user preferences as hard context, not decoration.
- If preferences mention a rental car, car hire, road trip, island, or moving around, plan logical drives/day trips and parking-friendly stops.
- If preferences mention children/kids/family or a number of children, slow the pace, reduce late nights, add breaks, short transfers, family-friendly food, and avoid overpacked days.
- If budgetLevel is "high", include exactly one acclaimed restaurant per destination city when possible: Michelin-starred, Michelin-selected, Bib Gourmand, Gault&Millau, or locally awarded fine dining. Do not invent Michelin stars. Put it in itinerary or tips and include it in map_points when it fits.

JSON structure:
{
  phrasebook: exactly 15 phrases, 6 categories (greetings, restaurant, transport, directions, emergency, expressions). Pronunciation MUST use Polish phonetics (jak Polak by to czytał), e.g. "bon-żur" not "bon-ZHOOR", "mersi" not "mehr-SEE", "silwuple" not "see voo PLEH"
  "checklist": {"documents":["string"],"clothes":["string"],"electronics":["string"],"medicine":["string"],"transport":["string"],"money":["string"],"local_specific":["string"]},
  "itinerary": [{"day":1,"title":"string","items":[{"time":"HH:MM","activity":"string","location":"string","cost":"string","tip":"string"}]}],
  "map_points": [{"name":"string","category":"string","description":"string","address":"string","lat":0.0,"lng":0.0,"order":1}],
  "tips": {"food":["string"],"scams":["string"],"transport":["string"],"safety":["string"],"photo_spots":["string"],"etiquette":["string"]}
}

Rules:
- phrasebook: exactly 15 phrases, 6 categories (greetings, restaurant, transport, directions, emergency, expressions). Pronunciation MUST use Polish phonetics (jak Polak by to czytał), e.g. "bon-żur" not "bon-ZHOOR", "mersi" not "mehr-SEE", "silwuple" not "see voo PLEH"
- checklist: 2-3 items per category, destination-specific, use current local currency
- itinerary: exactly one object per day, 4-5 realistic items per day from 09:00 to 22:00, use current prices in correct currency. For families or slower pace, use fewer items and more breaks.
- map_points: 6-8 real places, distributed across destination cities when there are multiple destinations. ALL coordinates must be precise and within the relevant city/area boundaries
- tips: exactly 3 items per category, current and accurate
- Keep all text SHORT and concise. Each string should be under 120 characters where possible`;
}

const parseDestinations = (value: string) =>
  value
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const getDestinations = (data: TravelFormData) =>
  data.destinations?.length ? data.destinations : parseDestinations(data.destination);

export function buildUserPrompt(data: TravelFormData, lang: Lang): string {
  const destinations = getDestinations(data);
  const destinationText = destinations.join(", ");
  const multiCityNote =
    destinations.length > 1
      ? lang === "pl"
        ? `To jest wyjazd wielomiejscowy. Ułóż logiczną kolejność trasy między miastami: ${destinationText}. Nie traktuj tego jak jednego miasta.`
        : `This is a multi-city trip. Build a logical route order across: ${destinationText}. Do not treat it as a single city.`
      : "";
  const luxuryNote =
    data.budgetLevel === "high"
      ? lang === "pl"
        ? "Budżet jest luksusowy: w każdym mieście dodaj jedną realnie wyróżnioną restaurację (Michelin-starred/Michelin-selected/Bib Gourmand/Gault&Millau/lokalne wyróżnienie). Nie wymyślaj gwiazdek Michelin."
        : "Budget is luxury: in each city include one genuinely acclaimed restaurant (Michelin-starred/Michelin-selected/Bib Gourmand/Gault&Millau/local award). Do not invent Michelin stars."
      : "";
  const stylesStr = data.tripStyles.join(", ");
  const budgetStr = data.budgetAmount
    ? `${data.budgetAmount} (${data.budgetLevel})`
    : data.budgetLevel;

  if (lang === "pl") {
    return `Plan podróży:
Miasto/miasta: ${destinationText}, ${data.country}
Język lokalny: wywnioskuj automatycznie na podstawie kraju i regionu; nie pytamy użytkownika o język.
Style: ${stylesStr}
Dni: ${data.days}
Budżet/os: ${budgetStr}
Sezon: ${data.season || "nie podano"}
Preferencje: ${data.preferences || "brak"}
${multiCityNote}
${luxuryNote}

WAŻNE: Użyj aktualnej waluty ${data.country}. Punkty na mapie muszą być dokładnie w odpowiednim mieście lub obszarze trasy: ${destinationText}. Sprawdź każdą współrzędną.
Preferencje użytkownika mają wpływać na realny plan: jeśli jest auto, planuj przejazdy i zwiedzanie poza bazą; jeśli są dzieci, tempo ma być spokojniejsze i rodzinne.

Zwróć TYLKO poprawny JSON zgodny z dokładnym schematem. Zacznij od { i zakończ na }.`;
  }

  return `Travel plan:
City/cities: ${destinationText}, ${data.country}
Local language: infer automatically from the country and region; the user does not enter it.
Styles: ${stylesStr}
Days: ${data.days}
Budget/person: ${budgetStr}
Season: ${data.season || "not specified"}
Preferences: ${data.preferences || "none"}
${multiCityNote}
${luxuryNote}

IMPORTANT: Use current currency of ${data.country}. Map points must be precisely in the correct city or trip area: ${destinationText}. Verify every coordinate.
User preferences must shape the real plan: if there is a rental car, plan drives and exploration beyond the base; if there are kids, use a calmer family-friendly pace.

Return ONLY valid JSON matching the exact schema. Start with { and end with }.`;
}
