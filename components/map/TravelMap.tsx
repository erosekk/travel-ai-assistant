"use client";

import { useState } from "react";
import { MapPoint, Lang } from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  restaurant: "🍽️", food: "🍽️", museum: "🏛️", culture: "🏛️",
  park: "🌿", nature: "🌿", beach: "🏖️", hotel: "🏨",
  accommodation: "🏨", landmark: "📍", attraction: "⭐",
  transport: "🚌", nightlife: "🎵", bar: "🍷", shop: "🛍️",
};

const CATEGORY_COLORS: Record<string, string> = {
  restaurant: "bg-orange-100 text-orange-700 border-orange-200",
  food: "bg-orange-100 text-orange-700 border-orange-200",
  museum: "bg-purple-100 text-purple-700 border-purple-200",
  culture: "bg-purple-100 text-purple-700 border-purple-200",
  park: "bg-green-100 text-green-700 border-green-200",
  nature: "bg-green-100 text-green-700 border-green-200",
  beach: "bg-cyan-100 text-cyan-700 border-cyan-200",
  landmark: "bg-pink-100 text-pink-700 border-pink-200",
  attraction: "bg-pink-100 text-pink-700 border-pink-200",
  transport: "bg-slate-100 text-slate-700 border-slate-200",
  nightlife: "bg-violet-100 text-violet-700 border-violet-200",
  bar: "bg-violet-100 text-violet-700 border-violet-200",
};

interface TravelMapProps {
  points: MapPoint[];
  lang: Lang;
  destination?: string;
  country?: string;
}

export function TravelMap({ points, lang, destination, country }: TravelMapProps) {
  const [selected, setSelected] = useState<MapPoint | null>(null);
  const isPL = lang === "pl";

  const googleMapsUrl = (pt: MapPoint) => {
    const query = encodeURIComponent(`${pt.name} ${pt.address || ""} ${destination || ""}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const googleMapsAllUrl = () => {
    const query = encodeURIComponent(`${destination || ""} ${country || ""}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  // Embedded Google Maps iframe URL
  const embedUrl = destination
    ? `https://maps.google.com/maps?q=${encodeURIComponent(`${destination} ${country || ""}`)}&output=embed&z=14`
    : null;

  if (!points || points.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
        <p className="text-slate-400 text-sm">{isPL ? "Brak wyników." : "No results."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Google Maps iframe */}
      {embedUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: 340 }}>
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            {isPL ? "Polecane miejsca" : "Recommended places"}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isPL ? "Kliknij → otwiera Google Maps z dokładną lokalizacją" : "Click → opens Google Maps with exact location"}
          </p>
        </div>
        <a href={googleMapsAllUrl()} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-600 transition-all shadow-sm">
          🗺️ {isPL ? "Otwórz Google Maps" : "Open Google Maps"}
        </a>
      </div>

      {/* Places list */}
      <div className="grid grid-cols-1 gap-3">
        {points.map((pt, i) => {
          const icon = CATEGORY_ICONS[pt.category?.toLowerCase()] ?? "📍";
          const colorClass = CATEGORY_COLORS[pt.category?.toLowerCase()] ?? "bg-brand-50 text-brand-700 border-brand-200";
          const isSelected = selected?.name === pt.name;
          return (
            <div key={i} className={`rounded-xl border-2 transition-all duration-150 overflow-hidden ${isSelected ? "border-brand-400 shadow-md" : "border-slate-200 hover:border-brand-300"}`}>
              <button onClick={() => setSelected(isSelected ? null : pt)}
                className="w-full flex items-center gap-3 p-3.5 text-left bg-white hover:bg-slate-50 transition-colors">
                <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {pt.order ?? i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{pt.name}</p>
                  <p className="text-xs text-slate-400 truncate">{pt.address}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${colorClass}`}>{icon}</span>
                <span className={`text-slate-400 text-sm transition-transform duration-150 ${isSelected ? "rotate-180" : ""}`}>▾</span>
              </button>
              {isSelected && (
                <div className="px-4 pb-4 pt-1 bg-white border-t border-slate-100">
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">{pt.description}</p>
                  <a href={googleMapsUrl(pt)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition-colors">
                    🗺️ {isPL ? "Znajdź w Google Maps" : "Find in Google Maps"}
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 text-center">
        {isPL ? "Miejsca wygenerowane przez AI • Google Maps zapewnia dokładną lokalizację" : "AI-generated places • Google Maps provides accurate location"}
      </p>
    </div>
  );
}