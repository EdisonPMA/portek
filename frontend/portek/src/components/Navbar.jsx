import { NavLink } from "react-router-dom";
import { useState } from "react";
import { HiArrowUpRight } from "react-icons/hi2";
import { navLinkKeys } from "../i18n/translations";
import { useAppSettings } from "../context/AppSettingsContext";
import SettingsControls from "./SettingsControls";

const linkClass = ({ isActive }) =>
  `relative pb-1 transition-colors duration-300 ${
    isActive
      ? "text-portek-green"
      : "text-white/90 hover:text-portek-green"
  }`;

const activeUnderline = ({ isActive }) =>
  isActive
    ? "after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-0.5 after:bg-portek-green after:rounded-full"
    : "";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useAppSettings();

  return (
    <header className="sticky top-0 z-50 bg-portek-bg/90 backdrop-blur-md border-b border-portek-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-center h-16 lg:h-[4.5rem]">
          <NavLink to="/" className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-md bg-portek-green/15 border border-portek-green/40 flex items-center justify-center">
              <span className="w-2.5 h-2.5 bg-portek-green rotate-45 rounded-sm" />
            </span>
            <span className="text-xl font-bold text-white tracking-tight">
              Portek
            </span>
          </NavLink>

          <ul className="flex items-center gap-6 lg:gap-8 text-sm font-medium">
            {navLinkKeys.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={(props) =>
                    `${linkClass(props)} ${activeUnderline(props)}`
                  }
                >
                  {t(link.key)}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex justify-end items-center gap-3">
            <SettingsControls compact />
            <NavLink
              to="/contact"
              className="inline-flex items-center gap-2 bg-portek-green text-portek-bg px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-portek-green-dim transition-colors"
            >
              {t("common.hireMe")}
              <HiArrowUpRight className="w-4 h-4" />
            </NavLink>
          </div>
        </div>

        <div className="flex md:hidden items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-portek-green/15 border border-portek-green/40 flex items-center justify-center">
              <span className="w-2 h-2 bg-portek-green rotate-45 rounded-sm" />
            </span>
            <span className="text-lg font-bold text-white">Portek</span>
          </NavLink>

          <div className="flex items-center gap-2">
            <SettingsControls compact />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
              aria-label={t("common.toggleMenu")}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-portek-border">
            <ul className="flex flex-col gap-1 pt-3 font-medium">
              {navLinkKeys.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "text-portek-green bg-portek-green/10"
                          : "text-white/90 hover:text-portek-green hover:bg-portek-green/5"
                      }`
                    }
                  >
                    {t(link.key)}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2">
                <NavLink
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-portek-green text-portek-bg px-5 py-2.5 rounded-full font-semibold"
                >
                  {t("common.hireMe")}
                  <HiArrowUpRight className="w-4 h-4" />
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
