// components/map/TravelMap.tsx
// Uses dynamic import in parent — this file is client-only
"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import { MapPoint, Lang } from "@/types";
import { t } from "@/lib/i18n";

// Fix Leaflet default icon issue in Next.js
import L from "leaflet";

function createNumberedIcon(index: number, category: string): L.DivIcon {
  const colorMap: Record<string, string> = {
    restaurant: "#f97316",
    food: "#f97316",
    museum: "#8b5cf6",
    culture: "#8b5cf6",
    park: "#22c55e",
    nature: "#22c55e",
    hotel: "#3b82f6",
    accommodation: "#3b82f6",
    landmark: "#ec4899",
    attraction: "#ec4899",
    transport: "#64748b",
    nightlife: "#a855f7",
    bar: "#a855f7",
  };
  const color = colorMap[category.toLowerCase()] ?? "#14b8a6";

  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        font-family: Sora, sans-serif;
      ">${index}</div>
    `,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

// Auto-fit map to all markers
function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const bounds = points.map((p) => [p.lat, p.lng] as LatLngTuple);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);
  return null;
}

interface TravelMapProps {
  points: MapPoint[];
  lang: Lang;
}

export function TravelMap({ points, lang }: TravelMapProps) {
  const tr = t(lang);
  const [selected, setSelected] = useState<MapPoint | null>(null);

  if (!points || points.length === 0) {
    return (
      <div className="flex items-center justify-center h-72 rounded-2xl bg-slate-50
                      border-2 border-dashed border-slate-200">
        <p className="text-slate-400 text-sm">{tr.noResults}</p>
      </div>
    );
  }

  const center: LatLngTuple = [points[0].lat, points[0].lng];

  return (
    <div className="space-y-3">
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: 400 }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds points={points} />

          {points.map((pt, i) => (
            <Marker
              key={i}
              position={[pt.lat, pt.lng]}
              icon={createNumberedIcon(pt.order ?? i + 1, pt.category)}
              eventHandlers={{ click: () => setSelected(pt) }}
            >
              <Popup>
                <strong>{pt.name}</strong>
                <br />
                <span className="text-xs text-gray-500">{pt.category}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Selected place detail */}
      {selected && (
        <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-slate-900">{selected.name}</h4>
              <span className="text-xs uppercase tracking-wider text-brand-600 font-semibold">
                {selected.category}
              </span>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-slate-700 mt-2">{selected.description}</p>
          <p className="text-xs text-slate-500 mt-1">📍 {selected.address}</p>
        </div>
      )}

      {/* Legend / list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {points.map((pt, i) => (
          <button
            key={i}
            onClick={() => setSelected(pt)}
            className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-white
                       hover:border-brand-300 hover:bg-brand-50/40 transition-all duration-150 text-left"
          >
            <span className="text-xs font-bold text-brand-600 bg-brand-100 rounded-full
                             w-6 h-6 flex items-center justify-center flex-shrink-0">
              {pt.order ?? i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{pt.name}</p>
              <p className="text-xs text-slate-400 truncate">{pt.address}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400">{tr.mapNote}</p>
    </div>
  );
}
