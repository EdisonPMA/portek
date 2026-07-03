import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

const AppSettingsContext = createContext(null);

const STORAGE_THEME = "portek-theme";
const STORAGE_LANG = "portek-lang";

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function interpolate(text, params = {}) {
  if (!text || typeof text !== "string") return text;
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `{{${key}}}`
  );
}

export function AppSettingsProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(STORAGE_THEME) || "dark"
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem(STORAGE_LANG) || "en"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_THEME, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
    localStorage.setItem(STORAGE_LANG, language);
  }, [language]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "rw" : "en"));

  const t = (key, params) => {
    const value =
      getNested(translations[language], key) ??
      getNested(translations.en, key) ??
      key;
    return interpolate(value, params);
  };

  const value = useMemo(
    () => ({
      theme,
      language,
      setTheme,
      setLanguage,
      toggleTheme,
      toggleLanguage,
      t,
      isDark: theme === "dark",
      isEnglish: language === "en",
    }),
    [theme, language]
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return ctx;
}
