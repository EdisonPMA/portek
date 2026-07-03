import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCode,
  FaProjectDiagram,
  FaBlog,
  FaEnvelope,
  FaStar,
  FaUser,
  FaBriefcase,
} from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { getAll } from "../../services/api";
import { useAppSettings } from "../../context/AppSettingsContext";

const quickLinks = [
  { labelKey: "admin.addProject", path: "/admin/projects", icon: FaProjectDiagram },
  { labelKey: "admin.addSkill", path: "/admin/skills", icon: FaCode },
  { labelKey: "admin.writeBlog", path: "/admin/blogs", icon: FaBlog },
  { labelKey: "admin.viewMessages", path: "/admin/messages", icon: FaEnvelope },
];

export default function DashboardHome() {
  const { t } = useAppSettings();
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    blogs: 0,
    messages: 0,
    testimonials: 0,
    experiences: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [projects, skills, blogs, messages, testimonials, experiences] =
          await Promise.all([
            getAll("/projects"),
            getAll("/skills"),
            getAll("/blogs"),
            getAll("/messages"),
            getAll("/testimonials"),
            getAll("/experiences"),
          ]);

        setStats({
          projects: projects?.length || 0,
          skills: skills?.length || 0,
          blogs: blogs?.length || 0,
          messages: messages?.length || 0,
          testimonials: testimonials?.length || 0,
          experiences: experiences?.length || 0,
        });

        setRecentMessages((messages || []).slice(0, 5));
      } catch {
        /* keep defaults */
      }
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { labelKey: "admin.projects", value: stats.projects, icon: FaProjectDiagram, color: "text-portek-green" },
    { labelKey: "admin.skills", value: stats.skills, icon: FaCode, color: "text-blue-400" },
    { labelKey: "admin.blogs", value: stats.blogs, icon: FaBlog, color: "text-purple-400" },
    { labelKey: "admin.messages", value: stats.messages, icon: FaEnvelope, color: "text-yellow-400" },
    { labelKey: "admin.testimonials", value: stats.testimonials, icon: FaStar, color: "text-orange-400" },
    { labelKey: "admin.experience", value: stats.experiences, icon: FaBriefcase, color: "text-cyan-400" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="w-10 h-10 border-2 border-portek-green/30 border-t-portek-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{t("admin.dashboard")}</h1>
        <p className="text-portek-muted mt-1 text-sm">
          {t("admin.dashboardDesc")}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ labelKey, value, icon: Icon, color }) => (
          <div
            key={labelKey}
            className="rounded-2xl border border-portek-border bg-portek-card p-4 sm:p-5"
          >
            <Icon className={`w-5 h-5 ${color} mb-3`} />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-portek-muted text-xs mt-1">{t(labelKey)}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-portek-border bg-portek-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t("admin.recentMessages")}</h2>
          {recentMessages.length === 0 ? (
            <p className="text-portek-muted text-sm">{t("admin.noMessages")}</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-portek-bg/50 border border-portek-border"
                >
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{msg.name}</p>
                    <p className="text-portek-muted text-xs truncate">
                      {msg.subject || msg.message?.slice(0, 40)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-xs px-2 py-1 rounded-full ${
                      msg.is_read
                        ? "bg-portek-border text-portek-muted"
                        : "bg-portek-green/10 text-portek-green"
                    }`}
                  >
                    {msg.is_read ? t("common.read") : t("common.new")}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link
            to="/admin/messages"
            className="inline-flex items-center gap-1 mt-4 text-portek-green text-sm font-medium hover:underline"
          >
            {t("admin.viewAllMessages")} <HiArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-portek-border bg-portek-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t("admin.quickActions")}</h2>
          <div className="space-y-2">
            {quickLinks.map(({ labelKey, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-3 p-3 rounded-xl border border-portek-border hover:border-portek-green/40 hover:bg-portek-green/5 transition-colors"
              >
                <Icon className="text-portek-green" />
                <span className="text-white text-sm font-medium">{t(labelKey)}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-portek-green/5 border border-portek-green/20">
            <FaUser className="text-portek-green mb-2" />
            <p className="text-white text-sm font-medium">{t("admin.keepProfileUpdated")}</p>
            <p className="text-portek-muted text-xs mt-1">
              {t("admin.keepProfileDesc")}
            </p>
            <Link
              to="/admin/profile"
              className="inline-flex items-center gap-1 mt-3 text-portek-green text-xs font-medium hover:underline"
            >
              {t("admin.editProfile")} <HiArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
