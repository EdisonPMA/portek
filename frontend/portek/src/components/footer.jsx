import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { getAll } from "../services/api";
import { getDisplayName } from "../utils/profile";
import { footerLinkKeys } from "../i18n/translations";
import { useAppSettings } from "../context/AppSettingsContext";

const SOCIAL_ICONS = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  x: FaTwitter,
  email: FaEnvelope,
};

function resolveSocialIcon(platform) {
  const key = (platform || "").toLowerCase();
  return SOCIAL_ICONS[key] || FaEnvelope;
}

export default function Footer() {
  const { t } = useAppSettings();
  const [profile, setProfile] = useState(null);
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    async function loadFooterData() {
      try {
        const [profiles, links] = await Promise.all([
          getAll("/profiles"),
          getAll("/social-links"),
        ]);
        if (profiles?.length > 0) setProfile(profiles[0]);
        if (links?.length > 0) setSocials(links);
      } catch {
        /* show minimal footer */
      }
    }
    loadFooterData();
  }, []);

  const ownerName = getDisplayName(profile);
  const footerSocials =
    socials.length > 0
      ? socials
      : profile?.email
        ? [{ platform: "Email", url: `mailto:${profile.email}`, icon: "email" }]
        : [];

  const availabilityLabel =
    profile?.availability_status === "Available"
      ? t("common.availableForFreelance")
      : profile?.availability_status === "Busy"
        ? t("common.currentlyBusyShort")
        : null;

  return (
    <footer className="bg-portek-bg border-t border-portek-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-md bg-portek-green/15 border border-portek-green/40 flex items-center justify-center">
                <span className="w-2.5 h-2.5 bg-portek-green rotate-45 rounded-sm" />
              </span>
              <h2 className="text-2xl font-bold text-white">Portek</h2>
            </div>

            <p className="mt-4 text-portek-muted leading-7 text-sm sm:text-base">
              {profile?.bio ||
                (profile?.profession
                  ? t("footer.defaultBio", { profession: profile.profession })
                  : null)}
            </p>

            {footerSocials.length > 0 && (
              <div className="flex gap-3 mt-6">
                {footerSocials.map((link) => {
                  const Icon = resolveSocialIcon(link.platform);
                  const isUrlIcon =
                    typeof link.icon === "string" && /^https?:\/\//i.test(link.icon);

                  return (
                    <a
                      key={link.id || link.platform}
                      href={link.url}
                      target={link.url?.startsWith("http") ? "_blank" : undefined}
                      rel={link.url?.startsWith("http") ? "noreferrer" : undefined}
                      aria-label={link.platform}
                      className="w-10 h-10 rounded-full border border-portek-border flex items-center justify-center text-portek-muted hover:text-portek-green hover:border-portek-green/50 transition-colors overflow-hidden"
                    >
                      {isUrlIcon ? (
                        <img
                          src={link.icon}
                          alt={link.platform}
                          className="w-4 h-4 object-contain"
                        />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5">{t("footer.quickLinks")}</h3>
            <ul className="space-y-3">
              {footerLinkKeys.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className="text-portek-muted hover:text-portek-green transition-colors text-sm"
                  >
                    {t(link.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5">{t("footer.contact")}</h3>
            <div className="space-y-3 text-portek-muted text-sm">
              {profile?.email && <p>{profile.email}</p>}
              {profile?.location && <p>{profile.location}</p>}
              {availabilityLabel && (
                <p className="text-portek-green font-medium">{availabilityLabel}</p>
              )}
            </div>

            <NavLink
              to="/contact"
              className="inline-flex items-center gap-2 mt-6 bg-portek-green text-portek-bg px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-portek-green-dim transition-colors"
            >
              {t("common.hireMe")}
              <HiArrowUpRight className="w-4 h-4" />
            </NavLink>
          </div>
        </div>

        <div className="border-t border-portek-border mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-portek-muted text-sm">
            © {new Date().getFullYear()} Portek. {t("common.allRightsReserved")}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <NavLink
              to="/login"
              className="text-portek-muted hover:text-portek-green transition-colors"
            >
              {t("common.adminLogin")}
            </NavLink>
            {ownerName && (
              <>
                <span className="text-portek-border hidden sm:inline">|</span>
                <p className="text-portek-muted">
                  {t("common.designedBy", { name: ownerName })}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
