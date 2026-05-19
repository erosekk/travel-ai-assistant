// components/results/Phrasebook.tsx
"use client";

import { Phrase, Lang } from "@/types";
import { t } from "@/lib/i18n";

interface PhrasebookProps {
  data: Phrase[];
  lang: Lang;
}

export function Phrasebook({ data, lang }: PhrasebookProps) {
  const tr = t(lang);

  // Group phrases by category
  const grouped = data.reduce<Record<string, Phrase[]>>((acc, phrase) => {
    const cat = phrase.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(phrase);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, phrases]) => (
        <div key={category}>
          <h3 className="section-label">{category}</h3>
          <div className="space-y-2">
            {phrases.map((phrase, i) => (
              <div
                key={i}
                className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100
                           hover:border-brand-200 hover:bg-brand-50/30 transition-colors duration-150"
              >
                {/* Local phrase */}
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
                    {tr.local}
                  </p>
                  <p className="font-bold text-slate-900 text-[15px] leading-tight">
                    {phrase.local}
                  </p>
                </div>

                {/* Translation */}
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
                    {tr.translation}
                  </p>
                  <p className="text-slate-700 text-sm">{phrase.translation}</p>
                </div>

                {/* Pronunciation */}
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
                    {tr.pronunciation}
                  </p>
                  <p className="text-brand-600 italic text-sm font-mono">
                    "{phrase.pronunciation}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
