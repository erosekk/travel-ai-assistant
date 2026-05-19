// =============================================
// types/index.ts — Core TypeScript Interfaces
// =============================================

export type Lang = "pl" | "en";

export type TripStyle =
  | "chill"
  | "adventure"
  | "food"
  | "culture"
  | "nightlife"
  | "budget";

export type BudgetLevel = "low" | "mid" | "high";

// ---- Form Input ----
export interface TravelFormData {
  destination: string;
  country: string;
  language: string;
  tripStyles: TripStyle[];      // wielokrotny wybór
  budgetLevel: BudgetLevel;     // niski / średni / wysoki (kontekst dla AI)
  budgetAmount: string;         // kwota wpisana ręcznie np. "500 PLN"
  days: number;                 // liczba dni wyjazdu 1–14
  season: string;
  preferences: string;
}

// ---- AI Response ----
export interface Phrase {
  local: string;
  translation: string;
  pronunciation: string;
  category: string;
}

export interface Checklist {
  documents: string[];
  clothes: string[];
  electronics: string[];
  medicine: string[];
  transport: string[];
  money: string[];
  local_specific: string[];
}

export interface ItineraryItem {
  time: string;
  activity: string;
  location: string;
  cost: string;
  tip: string;
}

// Itinerary grouped by day
export interface ItineraryDay {
  day: number;          // 1, 2, 3…
  title: string;        // np. "Stare Miasto i plaże"
  items: ItineraryItem[];
}

export interface MapPoint {
  name: string;
  category: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  order: number;
}

export interface Tips {
  food: string[];
  scams: string[];
  transport: string[];
  safety: string[];
  photo_spots: string[];
  etiquette: string[];
}

export interface TravelPlan {
  phrasebook: Phrase[];
  checklist: Checklist;
  itinerary: ItineraryDay[];   // zawsze tablica dni (nawet dla 1 dnia)
  map_points: MapPoint[];
  tips: Tips;
}

// ---- API Route ----
export interface GenerateRequest {
  formData: TravelFormData;
  lang: Lang;
}

export interface GenerateResponse {
  success: boolean;
  data?: TravelPlan;
  error?: string;
}
