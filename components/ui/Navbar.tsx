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
  dark: boolean;
  setDark: (d: boolean) => void;
  onLogoClick?: () => void;
}

export function Navbar({
  lang,
  setLang,
  viewMode,
  setViewMode,
  dark,
  setDark,
  onLogoClick,
}: NavbarProps) {
  const tr = t(lang);

  return (
    <nav className={clsx(
      "sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-200",
      dark
        ? "bg-slate-900/90 border-slate-700"
        : "bg-white/80 border-slate-200/80"
    )}>
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

        <button
          onClick={onLogoClick}
          className="text-lg font-black tracking-tight gradient-text hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          {tr.appName} ✈️
        </button>

        <div className="flex items-center gap-2 flex-wrap justify-end">

          <div className={clsx(
            "hidden sm:flex items-center rounded-lg p-0.5 gap-0.5",
            dark ? "bg-slate-800" : "bg-slate-100"
          )}>
            {(["mobile", "desktop"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={clsx(
                  "px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 whitespace-nowrap",
                  viewMode === mode
                    ? dark ? "bg-slate-700 text-white shadow-sm" : "bg-white text-slate-900 shadow-sm"
                    : dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {mode === "mobile" ? tr.mobile : tr.desktop}
              </button>
            ))}
          </div>

          <div className={clsx(
            "flex items-center rounded-lg p-0.5 gap-0.5",
            dark ? "bg-slate-800" : "bg-slate-100"
          )}>
            {(["pl", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={clsx(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-150",
                  lang === l
                    ? "bg-brand-500 text-white shadow-sm"
                    : dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setDark(!dark)}
            className={clsx(
              "w-8 h-8 rounded-lg border flex items-center justify-center text-base transition-all duration-200",
              dark
                ? "bg-slate-800 border-slate-600 hover:bg-slate-700"
                : "bg-white border-slate-200 hover:bg-slate-50"
            )}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}