// components/results/Tips.tsx
"use client";

import { Tips as TipsType } from "@/types";

interface TipsProps {
  data: TipsType;
}

const TIP_CONFIG: Record<keyof TipsType, { icon: string; label: string; color: string }> = {
  food:        { icon: "🍽️", label: "Food & Drinks", color: "bg-orange-50 border-orange-200" },
  scams:       { icon: "⚠️", label: "Scams to Avoid", color: "bg-red-50 border-red-200" },
  transport:   { icon: "🚇", label: "Transport Tips", color: "bg-blue-50 border-blue-200" },
  safety:      { icon: "🔒", label: "Safety", color: "bg-yellow-50 border-yellow-200" },
  photo_spots: { icon: "📸", label: "Photo Spots", color: "bg-purple-50 border-purple-200" },
  etiquette:   { icon: "🤝", label: "Local Etiquette", color: "bg-green-50 border-green-200" },
};

export function Tips({ data }: TipsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {(Object.keys(TIP_CONFIG) as (keyof TipsType)[]).map((key) => {
        const items = data[key];
        if (!items?.length) return null;
        const { icon, label, color } = TIP_CONFIG[key];
        return (
          <div key={key} className={`p-4 rounded-xl border ${color}`}>
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-sm">
              <span className="text-lg">{icon}</span>
              {label}
            </h3>
            <ul className="space-y-2">
              {items.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-slate-400 flex-shrink-0 mt-0.5">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
