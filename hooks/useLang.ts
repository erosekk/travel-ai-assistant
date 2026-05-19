// =============================================
// hooks/useLang.ts — Language state hook
// =============================================

import { useState } from "react";
import { Lang } from "@/types";
import { useLocalStorage } from "./useLocalStorage";

export function useLang() {
  const [lang, setLang] = useLocalStorage<Lang>("travel_ai_lang", "pl");
  return { lang, setLang };
}
