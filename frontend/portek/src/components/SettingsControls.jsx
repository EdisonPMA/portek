import { FaMoon, FaSun, FaGlobe } from "react-icons/fa";
import { useAppSettings } from "../context/AppSettingsContext";

const btnClass =
  "inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border border-portek-border text-portek-muted hover:text-white hover:border-portek-green/40 hover:bg-portek-green/5 transition-colors text-xs font-medium";

export default function SettingsControls({ compact = false }) {
  const { theme, language, toggleTheme, toggleLanguage, t } = useAppSettings();

  return (
    <div className={`flex items-center ${compact ? "gap-1.5" : "gap-2"}`}>
      <button
        type="button"
        onClick={toggleLanguage}
        className={btnClass}
        aria-label={t("settings.language")}
        title={t("settings.language")}
      >
        <FaGlobe className="w-3.5 h-3.5 shrink-0" />
        {!compact && (
          <span>{language === "en" ? "EN" : "RW"}</span>
        )}
        {compact && (
          <span className="font-semibold">{language === "en" ? "EN" : "RW"}</span>
        )}
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className={btnClass}
        aria-label={t("settings.theme")}
        title={t("settings.theme")}
      >
        {theme === "dark" ? (
          <FaSun className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <FaMoon className="w-3.5 h-3.5 shrink-0" />
        )}
        {!compact && (
          <span>{theme === "dark" ? t("settings.light") : t("settings.dark")}</span>
        )}
      </button>
    </div>
  );
}
