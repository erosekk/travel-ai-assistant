// =============================================
// lib/i18n.ts — Polish / English Translations
// =============================================

import { Lang } from "@/types";

export const translations = {
  pl: {
    // Nav
    appName: "Travel AI",
    tagline: "Twój inteligentny asystent podróży",
    viewMode: "Widok",
    mobile: "📱 Mobile",
    desktop: "🖥️ Desktop",

    // Landing
    heroTitle: "Odkryj świat z AI",
    heroSub:
      "Generuj frazownik, checklistę, plan dnia i mapę dla jednego lub kilku miast w kilka sekund.",
    startBtn: "Zaplanuj podróż",
    aboutBtn: "O projekcie",

    // Form labels
    destination: "Miasto / miasta docelowe",
    destinationHint: "Wpisz jedno miasto albo kilka po przecinku lub w osobnych liniach.",
    country: "Kraj",
    tripStyle: "Styl podróży",
    tripStyleHint: "wybierz jeden lub więcej",
    budget: "Budżet",
    budgetAmount: "Budżet na osobę (opcjonalne)",
    budgetAmountPlaceholder: "np. 500 PLN, 200 EUR, 300 USD",
    budgetAmountHint: "AI uwzględni kwotę szacując koszty w planie dnia.",
    budgetPerPerson: "os.",
    days: "Liczba dni",
    daysUnit: "dni",
    dayLabel: "Dzień",
    season: "Sezon / Daty",
    preferences: "Dodatkowe preferencje (opcjonalne)",
    generateBtn: "Generuj plan podróży ✨",
    generating: "Generuję Twój plan...",
    required: "Wymagane",

    // Placeholders
    placeholders: {
      destination: "np. Barcelona albo Ateny, Naksos, Santorini",
      country: "np. Hiszpania",
      season: "np. Lato, Lipiec 2025",
      preferences: "np. wynajmujemy auto, 2 dzieci, spokojne tempo, wegetarianin...",
    },

    // Styles
    styles: {
      chill: "🌴 Relaks",
      adventure: "🧗 Przygoda",
      food: "🍜 Jedzenie",
      culture: "🏛️ Kultura",
      nightlife: "🌙 Nocne życie",
      budget: "💰 Budżet",
    },

    // Budgets
    budgets: {
      low: "Ekonomiczny",
      mid: "Średni",
      high: "Luksusowy",
    },

    // Tabs
    tabs: {
      phrasebook: "Frazownik",
      checklist: "Checklista",
      itinerary: "Plan dnia",
      map: "Mapa",
      tips: "Porady",
    },

    // Phrasebook columns
    local: "Lokalnie",
    translation: "Tłumaczenie",
    pronunciation: "Wymowa",

    // Map
    mapNote:
      "Mapa pokazuje sugerowane miejsca wygenerowane przez AI. Kliknij marker po szczegóły.",
    noResults: "Brak wyników. Wygeneruj plan podróży.",

    // API Key
    apiKeyLabel: "Klucz Anthropic API",
    apiKeyPlaceholder: "sk-ant-...",
    apiKeyHint: "Klucz zapisywany wyłącznie lokalnie w Twojej przeglądarce.",

    // Errors
    errors: {
      fillRequired: "Wypełnij wymagane pola: miasto lub miasta oraz kraj.",
      apiKeyMissing: "Wklej swój klucz Anthropic API, aby kontynuować.",
      apiError: "Błąd API. Sprawdź klucz i spróbuj ponownie.",
      parseError: "Błąd parsowania odpowiedzi AI. Spróbuj ponownie.",
    },

    // Navigation
    backBtn: "← Powrót",
    newPlan: "Nowy plan",

    // About page
    cvTitle: "O projekcie",
    cvDesc:
      "Travel AI Assistant to MVP portfolio zbudowane na Next.js 14, React, Tailwind CSS i Claude API (Anthropic). Demonstruje integrację AI, responsywny design mobile-first i nowoczesną architekturę frontendu.",
    tech: "Stack technologiczny",
    features: "Funkcjonalności",
    featureList: [
      "Generowanie frazownika z wymową",
      "Interaktywna checklista podróżna",
      "Plan dnia z godzinami i kosztami",
      "Mapa OpenStreetMap z markerami AI",
      "Porady lokalne (jedzenie, bezpieczeństwo, foto)",
      "Obsługa PL / EN",
      "Widok Mobile / Desktop preview",
    ],
  },

  en: {
    appName: "Travel AI",
    tagline: "Your intelligent travel assistant",
    viewMode: "View",
    mobile: "📱 Mobile",
    desktop: "🖥️ Desktop",

    heroTitle: "Discover the World with AI",
    heroSub:
      "Generate a phrasebook, checklist, itinerary and map for one or several cities in seconds.",
    startBtn: "Plan a Trip",
    aboutBtn: "About",

    destination: "Destination city / cities",
    destinationHint: "Enter one city, or several separated by commas or new lines.",
    country: "Country",
    tripStyle: "Trip Style",
    tripStyleHint: "pick one or more",
    budget: "Budget",
    budgetAmount: "Budget per person (optional)",
    budgetAmountPlaceholder: "e.g. 200 EUR, 300 USD, 500 PLN",
    budgetAmountHint: "AI will factor this in when estimating costs in the itinerary.",
    budgetPerPerson: "p.p.",
    days: "Number of days",
    daysUnit: "days",
    dayLabel: "Day",
    season: "Season / Dates",
    preferences: "Additional Preferences (optional)",
    generateBtn: "Generate Travel Plan ✨",
    generating: "Generating your plan...",
    required: "Required",

    placeholders: {
      destination: "e.g. Barcelona or Athens, Naxos, Santorini",
      country: "e.g. Spain",
      season: "e.g. Summer, July 2025",
      preferences: "e.g. rental car, 2 kids, slower pace, vegetarian...",
    },

    styles: {
      chill: "🌴 Chill",
      adventure: "🧗 Adventure",
      food: "🍜 Food",
      culture: "🏛️ Culture",
      nightlife: "🌙 Nightlife",
      budget: "💰 Budget",
    },

    budgets: {
      low: "Budget",
      mid: "Mid-range",
      high: "Luxury",
    },

    tabs: {
      phrasebook: "Phrasebook",
      checklist: "Checklist",
      itinerary: "Itinerary",
      map: "Map",
      tips: "Tips",
    },

    local: "Local",
    translation: "Translation",
    pronunciation: "Pronunciation",

    mapNote:
      "Map shows AI-generated suggested places. Click a marker for details.",
    noResults: "No results. Generate a travel plan first.",

    apiKeyLabel: "Anthropic API Key",
    apiKeyPlaceholder: "sk-ant-...",
    apiKeyHint: "Your key is stored only locally in your browser.",

    errors: {
      fillRequired: "Fill required fields: city or cities and country.",
      apiKeyMissing: "Paste your Anthropic API key to continue.",
      apiError: "API Error. Check your key and try again.",
      parseError: "Failed to parse AI response. Please try again.",
    },

    backBtn: "← Back",
    newPlan: "New Plan",

    cvTitle: "About the Project",
    cvDesc:
      "Travel AI Assistant is a portfolio MVP built with Next.js 14, React, Tailwind CSS and the Claude API (Anthropic). It demonstrates AI integration, mobile-first responsive design and modern frontend architecture.",
    tech: "Tech Stack",
    features: "Features",
    featureList: [
      "AI-generated phrasebook with pronunciation",
      "Interactive travel checklist",
      "One-day itinerary with times and costs",
      "OpenStreetMap with AI-placed markers",
      "Local tips (food, safety, photo spots)",
      "PL / EN language switcher",
      "Mobile / Desktop preview toggle",
    ],
  },
} as const;

export type Translations = (typeof translations)[Lang];

export function t(lang: Lang): Translations {
  return translations[lang];
}
