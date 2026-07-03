import { FaBars, FaBell, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppSettings } from "../../context/AppSettingsContext";
import SettingsControls from "../../components/SettingsControls";

export default function Topbar({ onMenuClick, title = "Admin Dashboard" }) {
  const { t } = useAppSettings();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="h-16 bg-portek-card border-b border-portek-border px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-portek-muted hover:text-white hover:bg-portek-bg transition-colors"
        >
          <FaBars className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white">{title}</h1>
          <p className="text-xs text-portek-muted hidden sm:block">
            {t("admin.manageContent")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <SettingsControls compact />

        <Link
          to="/"
          className="hidden md:block text-xs text-portek-muted hover:text-portek-green transition-colors"
        >
          {t("admin.viewSite")}
        </Link>

        <button className="relative p-2 rounded-lg text-portek-muted hover:text-white hover:bg-portek-bg transition-colors">
          <FaBell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-portek-green rounded-full" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <FaUserCircle className="text-2xl text-portek-green" />
          <div className="text-right">
            <p className="text-sm font-medium text-white leading-none">{t("admin.admin")}</p>
            <p className="text-[10px] text-portek-muted">{t("admin.administrator")}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-sm transition-colors"
        >
          <FaSignOutAlt className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t("common.logout")}</span>
        </button>
      </div>
    </header>
  );
}
