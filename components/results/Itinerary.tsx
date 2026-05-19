// components/results/Itinerary.tsx
"use client";

import { ItineraryDay, ItineraryItem } from "@/types";
import { useState } from "react";

interface ItineraryProps {
  data: ItineraryDay[];
}

function ItineraryItemRow({ item, index }: { item: ItineraryItem; index: number }) {
  return (
    <div className="flex gap-4 relative">
      {/* Number bubble */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500
                      flex items-center justify-center text-white text-xs font-bold shadow-sm
                      shadow-brand-500/20 z-10 mt-0.5">
        {index + 1}
      </div>
      {/* Content */}
      <div className="flex-1 pb-1">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-brand-200
                        hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <span className="font-mono text-[11px] font-bold text-brand-600 bg-brand-50
                             px-2 py-0.5 rounded-md">
              {item.time}
            </span>
            {item.cost && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50
                               px-2 py-0.5 rounded-full border border-emerald-200">
                {item.cost}
              </span>
            )}
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1 leading-tight">{item.activity}</h4>
          <p className="text-xs text-slate-500 mb-1.5">📍 {item.location}</p>
          {item.tip && (
            <p className="text-xs text-slate-600 italic bg-amber-50 border border-amber-100
                          rounded-lg px-2.5 py-1.5">
              💡 {item.tip}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Itinerary({ data }: ItineraryProps) {
  const [activeDay, setActiveDay] = useState(0);

  if (!data || data.length === 0) return null;

  const isSingleDay = data.length === 1;

  return (
    <div>
      {/* Day tabs — only shown for multi-day trips */}
      {!isSingleDay && (
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {data.map((day, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl border-2 font-semibold
                          text-sm transition-all duration-150 ${
                            activeDay === i
                              ? "border-brand-500 bg-brand-50 text-brand-700"
                              : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                          }`}
            >
              <span className="text-xs opacity-70">Dzień / Day</span>
              <span className="text-lg font-black leading-tight">{day.day}</span>
            </button>
          ))}
        </div>
      )}

      {/* Active day title */}
      {!isSingleDay && (
        <div className="mb-4 px-1">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Dzień {data[activeDay].day} / Day {data[activeDay].day}
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-0.5">
            {data[activeDay].title}
          </h3>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-4 bottom-4 w-0.5
                        bg-gradient-to-b from-brand-400 via-cyan-300 to-transparent" />
        <div className="space-y-4 pl-1">
          {data[activeDay].items.map((item, i) => (
            <ItineraryItemRow key={i} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Day navigation arrows for multi-day */}
      {!isSingleDay && (
        <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveDay(Math.max(0, activeDay - 1))}
            disabled={activeDay === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm
                       font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-600
                       transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← {activeDay > 0 ? `Dzień ${data[activeDay - 1].day}` : ""}
          </button>
          <span className="text-sm text-slate-400 self-center">
            {activeDay + 1} / {data.length}
          </span>
          <button
            onClick={() => setActiveDay(Math.min(data.length - 1, activeDay + 1))}
            disabled={activeDay === data.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm
                       font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-600
                       transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {activeDay < data.length - 1 ? `Dzień ${data[activeDay + 1].day}` : ""} →
          </button>
        </div>
      )}
    </div>
  );
}
