import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaCode,
  FaProjectDiagram,
  FaImages,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaBlog,
  FaTags,
  FaEnvelope,
  FaStar,
  FaShareAlt,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { useAppSettings } from "../../context/AppSettingsContext";

const menuItems = [
  { key: "admin.dashboard", icon: FaTachometerAlt, path: "/admin/dashboard" },
  { key: "admin.profile", icon: FaUser, path: "/admin/profile" },
  { key: "admin.skills", icon: FaCode, path: "/admin/skills" },
  { key: "admin.projects", icon: FaProjectDiagram, path: "/admin/projects" },
  { key: "admin.projectImages", icon: FaImages, path: "/admin/project-images" },
  { key: "admin.experience", icon: FaBriefcase, path: "/admin/experience" },
  { key: "admin.education", icon: FaGraduationCap, path: "/admin/education" },
  { key: "admin.certifications", icon: FaCertificate, path: "/admin/certifications" },
  { key: "admin.blogCategories", icon: FaTags, path: "/admin/blog-categories" },
  { key: "admin.blogs", icon: FaBlog, path: "/admin/blogs" },
  { key: "admin.messages", icon: FaEnvelope, path: "/admin/messages" },
  { key: "admin.testimonials", icon: FaStar, path: "/admin/testimonials" },
  { key: "admin.socialLinks", icon: FaShareAlt, path: "/admin/social-links" },
  { key: "admin.resume", icon: FaFileAlt, path: "/admin/resume" },
  { key: "admin.settings", icon: FaCog, path: "/admin/settings" },
];

export default function Sidebar({ open, onClose }) {
  const { t } = useAppSettings();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-portek-card border-r border-portek-border flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-portek-border shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-md bg-portek-green/15 border border-portek-green/40 flex items-center justify-center">
              <span className="w-2.5 h-2.5 bg-portek-green rotate-45 rounded-sm" />
            </span>
            <span className="text-xl font-bold text-white">
              Port<span className="text-portek-green">ek</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-portek-muted hover:text-white">
            <FaTimes />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="text-[10px] uppercase text-portek-muted mb-3 tracking-widest px-3">
            {t("admin.mainMenu")}
          </p>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin/dashboard"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isActive
                        ? "bg-portek-green/10 text-portek-green border border-portek-green/20"
                        : "text-portek-muted hover:text-white hover:bg-portek-bg/50"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{t(item.key)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-portek-border p-4 shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <FaSignOutAlt />
            {t("common.logout")}
          </button>
        </div>
      </aside>
    </>
  );
}
