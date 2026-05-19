// components/results/Checklist.tsx
"use client";

import { useState } from "react";
import { Checklist as ChecklistType } from "@/types";

interface ChecklistProps {
  data: ChecklistType;
}

const CATEGORY_CONFIG: Record<
  keyof ChecklistType,
  { icon: string; label: string }
> = {
  documents: { icon: "📄", label: "Dokumenty / Documents" },
  clothes:   { icon: "👕", label: "Ubrania / Clothes" },
  electronics: { icon: "🔌", label: "Elektronika / Electronics" },
  medicine:  { icon: "💊", label: "Apteczka / Medicine" },
  transport: { icon: "🚗", label: "Transport" },
  money:     { icon: "💳", label: "Finanse / Money" },
  local_specific: { icon: "📍", label: "Lokalnie / Local Specific" },
};

export function Checklist({ data }: ChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalItems = Object.values(data).flat().length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-600">
            {checkedCount} / {totalItems}
          </span>
          <span className="text-sm font-bold text-brand-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      {(Object.keys(CATEGORY_CONFIG) as (keyof ChecklistType)[]).map((cat) => {
        const items = data[cat];
        if (!items?.length) return null;
        const { icon, label } = CATEGORY_CONFIG[cat];
        return (
          <div key={cat}>
            <h3 className="flex items-center gap-2 section-label">
              <span>{icon}</span>
              <span>{label}</span>
            </h3>
            <div className="space-y-1.5">
              {items.map((item, i) => {
                const key = `${cat}-${i}`;
                const isChecked = !!checked[key];
                return (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer
                               hover:bg-slate-50 transition-colors duration-100 group"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(key)}
                      className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
                    />
                    <span
                      className={`text-sm transition-colors duration-150 ${
                        isChecked
                          ? "line-through text-slate-400"
                          : "text-slate-700"
                      }`}
                    >
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
