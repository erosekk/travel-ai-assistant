// app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { Lang, TravelFormData, TravelPlan, TripStyle, BudgetLevel, ItineraryDay } from "@/types";
import { t } from "@/lib/i18n";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Navbar } from "@/components/ui/Navbar";
import { Phrasebook } from "@/components/results/Phrasebook";
import { Checklist } from "@/components/results/Checklist";
import { Itinerary } from "@/components/results/Itinerary";
import { Tips } from "@/components/results/Tips";
import clsx from "clsx";

// Dynamically import map to avoid SSR issues with Leaflet
const TravelMap = dynamic(
  () => import("@/components/map/TravelMap").then((m) => m.TravelMap),
  { ssr: false, loading: () => <div className="h-72 bg-slate-100 rounded-2xl animate-pulse" /> }
);

type Page = "landing" | "form" | "results" | "about";
type ViewMode = "mobile" | "desktop";
type Tab = "phrasebook" | "checklist" | "itinerary" | "map" | "tips";

const DEFAULT_FORM: TravelFormData = {
  destination: "",
  country: "",
  language: "",
  tripStyles: ["culture"],    // tablica — można wybrać wiele
  budgetLevel: "mid",
  budgetAmount: "",           // np. "500 PLN" lub "200 EUR"
  days: 3,                    // domyślnie 3 dni
  season: "",
  preferences: "",
};

export default function Home() {
  const [lang, setLang] = useLocalStorage<Lang>("travel_ai_lang", "pl");
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [page, setPage] = useState<Page>("landing");
  const [activeTab, setActiveTab] = useState<Tab>("phrasebook");
  const [formData, setFormData] = useState<TravelFormData>(DEFAULT_FORM);
  const [results, setResults] = useLocalStorage<TravelPlan | null>("travel_ai_results", null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tr = t(lang);

  const updateForm = <K extends keyof TravelFormData>(key: K, value: TravelFormData[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleGenerate = useCallback(async () => {
    if (!formData.destination || !formData.country || !formData.language) {
      setError(tr.errors.fillRequired);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, lang }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setResults(json.data);
      setActiveTab("phrasebook");
      setPage("results");
    } catch (e) {
      setError(tr.errors.apiError + (e instanceof Error ? ` (${e.message})` : ""));
    } finally {
      setLoading(false);
    }
  }, [formData, lang, tr, setResults]);

  // Responsive container based on viewMode
  const viewContainer = viewMode === "mobile"
    ? "max-w-[390px] mx-auto"
    : "w-full";

  // ---- LANDING ----
  const renderLanding = () => (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
                    flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                        bg-brand-500/15 border border-brand-500/30 text-brand-400
                        text-xs font-bold uppercase tracking-widest mb-8">
          ✨ AI Travel Assistant
        </div>

        <h1 className="text-5xl sm:text-7xl font-black text-white leading-[1.05] mb-6">
          {lang === "pl" ? (
            <>Odkryj świat<br /><span className="gradient-text">z AI</span></>
          ) : (
            <>Discover the World<br /><span className="gradient-text">with AI</span></>
          )}
        </h1>

        <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-10">
          {tr.heroSub}
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={() => setPage("form")} className="btn-primary text-base px-8 py-3.5">
            {tr.startBtn} →
          </button>
          <button
            onClick={() => setPage("about")}
            className="px-8 py-3.5 rounded-xl border border-white/20 text-white/80
                       hover:bg-white/10 transition-colors text-base font-semibold"
          >
            {tr.aboutBtn}
          </button>
        </div>

        {/* Feature chips */}
        <div className="mt-16 flex flex-wrap gap-3 justify-center">
          {(["phrasebook", "checklist", "itinerary", "map", "tips"] as Tab[]).map((tab) => {
            const icons: Record<Tab, string> = {
              phrasebook: "📖", checklist: "✅", itinerary: "🗓️", map: "🗺️", tips: "💡"
            };
            return (
              <div key={tab} className="flex items-center gap-2 px-4 py-2 rounded-full
                                        bg-white/5 border border-white/10 text-white/60 text-sm">
                <span>{icons[tab]}</span>
                <span>{tr.tabs[tab]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ---- FORM ----
  const renderForm = () => (
    <div className="py-8 px-4">
      <div className="max-w-xl mx-auto space-y-5">
        <button onClick={() => setPage("landing")} className="btn-ghost text-sm -ml-2">
          {tr.backBtn}
        </button>

        {/* Destination */}
        <div className="card p-6">
          <p className="section-label">🌍 Destination</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                {tr.destination} <span className="text-red-400">*</span>
              </label>
              <input className="input" placeholder={tr.placeholders.destination}
                value={formData.destination} onChange={e => updateForm("destination", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                {tr.country} <span className="text-red-400">*</span>
              </label>
              <input className="input" placeholder={tr.placeholders.country}
                value={formData.country} onChange={e => updateForm("country", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                {tr.language} <span className="text-red-400">*</span>
              </label>
              <input className="input" placeholder={tr.placeholders.language}
                value={formData.language} onChange={e => updateForm("language", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">{tr.season}</label>
              <input className="input" placeholder={tr.placeholders.season}
                value={formData.season} onChange={e => updateForm("season", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Trip Style — MULTI SELECT */}
        <div className="card p-6">
          <div className="flex items-baseline justify-between mb-4">
            <p className="section-label mb-0">🎯 {tr.tripStyle}</p>
            <span className="text-xs text-slate-400">{tr.tripStyleHint}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(tr.styles) as [TripStyle, string][]).map(([style, label]) => {
              const isActive = formData.tripStyles.includes(style);
              return (
                <button key={style}
                  onClick={() => {
                    const current = formData.tripStyles;
                    const next = isActive
                      ? current.filter((s) => s !== style)   // odznacz
                      : [...current, style];                  // zaznacz
                    // wymagany min. 1 styl
                    if (next.length > 0) updateForm("tripStyles", next);
                  }}
                  className={clsx(
                    "relative py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all duration-150 text-left",
                    isActive
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  )}>
                  {label}
                  {isActive && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
                  )}
                </button>
              );
            })}
          </div>
          {/* Wybrane style jako tagi */}
          {formData.tripStyles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {formData.tripStyles.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                          bg-brand-500 text-white text-xs font-semibold">
                  {tr.styles[s]}
                  <button
                    onClick={() => {
                      const next = formData.tripStyles.filter((x) => x !== s);
                      if (next.length > 0) updateForm("tripStyles", next);
                    }}
                    className="ml-0.5 hover:opacity-70 transition-opacity leading-none"
                  >×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Budget — poziom + kwota */}
        <div className="card p-6">
          <p className="section-label">💰 {tr.budget}</p>

          {/* Poziom budżetu */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {(Object.entries(tr.budgets) as [BudgetLevel, string][]).map(([level, label]) => (
              <button key={level}
                onClick={() => updateForm("budgetLevel", level)}
                className={clsx(
                  "py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all duration-150",
                  formData.budgetLevel === level
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                )}>
                {label}
              </button>
            ))}
          </div>

          {/* Kwota na osobę */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              {tr.budgetAmount}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold pointer-events-none">
                💵
              </span>
              <input
                className="input pl-9"
                placeholder={tr.budgetAmountPlaceholder}
                value={formData.budgetAmount}
                onChange={e => updateForm("budgetAmount", e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">{tr.budgetAmountHint}</p>
          </div>
        </div>

        {/* Days */}
        <div className="card p-6">
          <p className="section-label">📅 {tr.days}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateForm("days", Math.max(1, formData.days - 1))}
              className="w-10 h-10 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-lg
                         hover:border-brand-500 hover:text-brand-600 transition-all duration-150 flex-shrink-0"
            >−</button>
            <div className="flex-1 text-center">
              <span className="text-4xl font-black text-slate-900">{formData.days}</span>
              <span className="text-slate-400 text-sm ml-2">{tr.daysUnit}</span>
            </div>
            <button
              onClick={() => updateForm("days", Math.min(14, formData.days + 1))}
              className="w-10 h-10 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-lg
                         hover:border-brand-500 hover:text-brand-600 transition-all duration-150 flex-shrink-0"
            >+</button>
          </div>
          {/* Quick presets */}
          <div className="flex gap-2 mt-4 justify-center flex-wrap">
            {[1, 2, 3, 5, 7, 10, 14].map((d) => (
              <button key={d}
                onClick={() => updateForm("days", d)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-150",
                  formData.days === d
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                )}>{d}</button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="card p-6">
          <p className="section-label">📝 {tr.preferences}</p>
          <textarea className="input min-h-[80px] resize-y"
            placeholder={tr.placeholders.preferences}
            value={formData.preferences}
            onChange={e => updateForm("preferences", e.target.value)} />
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button onClick={handleGenerate} disabled={loading}
          className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3">
          {loading ? (
            <><div className="spinner" />{tr.generating}</>
          ) : tr.generateBtn}
        </button>
      </div>
    </div>
  );

  // ---- RESULTS ----
  const renderResults = () => {
    if (!results) return null;
    const tabs: { key: Tab; icon: string }[] = [
      { key: "phrasebook", icon: "📖" },
      { key: "checklist", icon: "✅" },
      { key: "itinerary", icon: "🗓️" },
      { key: "map", icon: "🗺️" },
      { key: "tips", icon: "💡" },
    ];
    return (
      <div className="py-6 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <button onClick={() => setPage("form")} className="btn-ghost text-sm -ml-2">
                {tr.backBtn}
              </button>
              <button
                onClick={() => { setResults(null); setFormData(DEFAULT_FORM); setPage("form"); }}
                className="text-xs text-brand-600 font-semibold hover:underline">
                + {tr.newPlan}
              </button>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              ✈️ {formData.destination}, {formData.country}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {formData.tripStyles.map(s => tr.styles[s]).join(" · ")}
              {" · "}
              {formData.days} {tr.daysUnit}
              {" · "}
              {formData.budgetAmount
                ? `${formData.budgetAmount} / ${tr.budgetPerPerson}`
                : tr.budgets[formData.budgetLevel]}
              {formData.season ? ` · ${formData.season}` : ""}
            </p>
          </div>

          {/* Tabs */}
          <div className="tab-bar mb-6">
            {tabs.map(({ key, icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={clsx("tab-item", activeTab === key && "active")}>
                {icon} {tr.tabs[key]}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="card p-6">
            {activeTab === "phrasebook" && results.phrasebook && (
              <Phrasebook data={results.phrasebook} lang={lang} />
            )}
            {activeTab === "checklist" && results.checklist && (
              <Checklist data={results.checklist} />
            )}
            {activeTab === "itinerary" && results.itinerary && (
              <Itinerary data={results.itinerary} />
            )}
            {activeTab === "map" && (
              <TravelMap points={results.map_points ?? []} lang={lang} />
            )}
            {activeTab === "tips" && results.tips && (
              <Tips data={results.tips} />
            )}
          </div>
        </div>
      </div>
    );
  };

  // ---- ABOUT ----
  const renderAbout = () => (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        <button onClick={() => setPage("landing")} className="btn-ghost text-sm -ml-2">
          {tr.backBtn}
        </button>

        <div className="card p-8">
          <h2 className="text-3xl font-black text-slate-900 mb-2">🧳 {tr.cvTitle}</h2>
          <p className="text-slate-600 leading-relaxed">{tr.cvDesc}</p>

          <h3 className="section-label mt-8">{tr.tech}</h3>
          <div className="flex flex-wrap gap-2">
            {["Next.js 14", "React 18", "TypeScript", "Tailwind CSS", "Claude API", "Leaflet.js", "OpenStreetMap", "Vercel"].map((tech) => (
              <span key={tech}
                className="px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-700
                           rounded-lg text-sm font-semibold">
                {tech}
              </span>
            ))}
          </div>

          <h3 className="section-label mt-8">{tr.features}</h3>
          <ul className="space-y-2">
            {tr.featureList.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-brand-500 mt-0.5">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-4">🏗️ Architecture</h3>
          <div className="space-y-2">
            {[
              ["app/", "Next.js App Router pages & API routes"],
              ["components/results/", "Phrasebook, Checklist, Itinerary, Tips"],
              ["components/map/", "Leaflet map component (dynamic import)"],
              ["components/ui/", "Navbar, shared UI elements"],
              ["lib/ai.ts", "Claude API integration"],
              ["lib/prompts.ts", "System & user prompt builders"],
              ["lib/i18n.ts", "PL/EN translation system"],
              ["types/index.ts", "TypeScript interfaces"],
              ["hooks/", "useLocalStorage, useLang"],
            ].map(([path, desc]) => (
              <div key={path} className="flex gap-3 items-start py-1.5 border-b border-slate-100 last:border-0">
                <code className="text-xs font-mono text-brand-600 whitespace-nowrap bg-brand-50 px-2 py-0.5 rounded">
                  {path}
                </code>
                <span className="text-sm text-slate-600">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar lang={lang} setLang={setLang} viewMode={viewMode} setViewMode={setViewMode}
        onLogoClick={() => setPage("landing")} />

      {/* Responsive preview wrapper */}
      <div className={viewContainer}>
        {page === "landing"  && renderLanding()}
        {page === "form"     && renderForm()}
        {page === "results"  && renderResults()}
        {page === "about"    && renderAbout()}
      </div>
    </div>
  );
}
