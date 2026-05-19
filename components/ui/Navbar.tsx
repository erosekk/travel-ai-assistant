// components/ui/Navbar.tsx
"use client";

import { Lang } from "@/types";
import { t } from "@/lib/i18n";
import clsx from "clsx";

type ViewMode = "mobile" | "desktop";

interface NavbarProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  onLogoClick?: () => void;
}

export function Navbar({
  lang,
  setLang,
  viewMode,
  setViewMode,
  onLogoClick,
}: NavbarProps) {
  const tr = t(lang);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <button
          onClick={onLogoClick}
          className="text-lg font-black tracking-tight gradient-text hover:opacity-80 transition-opacity"
        >
          {tr.appName} ✈️
        </button>

        {/* Right controls */}
        <div className="flex items-center gap-2">

          {/* View mode toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
            {(["mobile", "desktop"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={clsx(
                  "px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 whitespace-nowrap",
                  viewMode === mode
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {mode === "mobile" ? tr.mobile : tr.desktop}
              </button>
            ))}
          </div>

          {/* Language switcher */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
            {(["pl", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={clsx(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-150",
                  lang === l
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
