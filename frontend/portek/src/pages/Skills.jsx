import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaCode,
  FaLayerGroup,
  FaStar,
  FaFilter,
} from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { getAll } from "../services/api";
import { useAppSettings } from "../context/AppSettingsContext";

const FALLBACK_SKILLS = [
  { id: 1, name: "React", category: "Frontend", level: "Expert", percentage: 90, display_order: 1 },
  { id: 2, name: "Node.js", category: "Backend", level: "Advanced", percentage: 85, display_order: 2 },
  { id: 3, name: "Express", category: "Backend", level: "Advanced", percentage: 82, display_order: 3 },
  { id: 4, name: "MySQL", category: "Database", level: "Advanced", percentage: 80, display_order: 4 },
  { id: 5, name: "MongoDB", category: "Database", level: "Intermediate", percentage: 75, display_order: 5 },
  { id: 6, name: "JavaScript", category: "Language", level: "Expert", percentage: 92, display_order: 6 },
  { id: 7, name: "Tailwind CSS", category: "Frontend", level: "Advanced", percentage: 88, display_order: 7 },
  { id: 8, name: "Git & GitHub", category: "Tools", level: "Advanced", percentage: 85, display_order: 8 },
  { id: 9, name: "REST APIs", category: "Backend", level: "Expert", percentage: 88, display_order: 9 },
  { id: 10, name: "UI/UX Design", category: "Design", level: "Intermediate", percentage: 70, display_order: 10 },
];

const LEVEL_STYLES = {
  Beginner: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-portek-green/10 text-portek-green border-portek-green/30",
  Expert: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

function isUploadedIcon(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function SkillIcon({ skill, size = "md" }) {
  const dim = size === "lg" ? "w-12 h-12" : "w-10 h-10";
  if (isUploadedIcon(skill.icon)) {
    return (
      <img
        src={skill.icon}
        alt={skill.name}
        className={`${dim} object-contain`}
      />
    );
  }
  return <FaCode className={`${size === "lg" ? "w-10 h-10" : "w-8 h-8"} text-portek-green`} />;
}

function ProgressBar({ value, label }) {
  const { t } = useAppSettings();
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-portek-muted">{t("common.proficiency")}</span>
        <span className="text-portek-green font-medium">{pct}%</span>
      </div>
      <div className="h-2 bg-portek-bg rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-portek-green/80 to-portek-green rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const { t } = useAppSettings();
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function loadSkills() {
      try {
        const [skillsData, profiles] = await Promise.all([
          getAll("/skills"),
          getAll("/profiles"),
        ]);
        setSkills(skillsData?.length ? skillsData : FALLBACK_SKILLS);
        if (profiles?.length > 0) setProfile(profiles[0]);
      } catch {
        setSkills(FALLBACK_SKILLS);
      }
      setLoading(false);
    }
    loadSkills();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(skills.map((s) => s.category).filter(Boolean))];
    return ["All", ...cats.sort()];
  }, [skills]);

  const filtered = useMemo(() => {
    const list =
      activeCategory === "All"
        ? skills
        : skills.filter((s) => s.category === activeCategory);
    return [...list].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );
  }, [skills, activeCategory]);

  const grouped = useMemo(() => {
    if (activeCategory !== "All") return { [activeCategory]: filtered };
    return filtered.reduce((acc, skill) => {
      const cat = skill.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {});
  }, [filtered, activeCategory]);

  const levelCounts = useMemo(() => {
    return skills.reduce((acc, s) => {
      if (s.level) acc[s.level] = (acc[s.level] || 0) + 1;
      return acc;
    }, {});
  }, [skills]);

  if (loading) {
    return (
      <div className="bg-portek-bg min-h-[60vh] flex items-center justify-center">
        <span className="w-10 h-10 border-2 border-portek-green/30 border-t-portek-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-portek-bg">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 lg:pt-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-portek-green text-xs font-semibold tracking-[0.2em] uppercase">
            {t("nav.skills")}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t("skills.titleMain")} & <span className="text-portek-green">{t("skills.titleAccent")}</span>
          </h1>
          <p className="mt-4 text-portek-muted text-sm sm:text-base leading-relaxed">
            {profile?.bio || t("skills.subtitle")}
          </p>
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-portek-card border border-portek-border text-sm text-white">
            <FaLayerGroup className="text-portek-green w-4 h-4" />
            {skills.length} Skills
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-portek-card border border-portek-border text-sm text-white">
            <FaFilter className="text-portek-green w-4 h-4" />
            {categories.length - 1} Categories
          </span>
          {profile?.technologies_count != null && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-portek-card border border-portek-border text-sm text-white">
              <FaStar className="text-portek-green w-4 h-4" />
              {profile.technologies_count}+ Technologies Mastered
            </span>
          )}
        </div>
      </section>

      {/* Category filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-portek-green text-portek-bg"
                  : "bg-portek-card border border-portek-border text-portek-muted hover:text-white hover:border-portek-green/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Level legend */}
      {Object.keys(levelCounts).length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(levelCounts).map(([level, count]) => (
              <span
                key={level}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${LEVEL_STYLES[level] || "bg-portek-card text-portek-muted border-portek-border"}`}
              >
                {level} · {count}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Skills grid — grouped by category when "All" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        {Object.entries(grouped).map(([category, categorySkills]) => (
          <div key={category} className="mb-12 last:mb-0">
            {activeCategory === "All" && (
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-portek-border" />
                <h2 className="text-lg font-semibold text-white shrink-0">{category}</h2>
                <div className="h-px flex-1 bg-portek-border" />
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id || skill.name}
                  className="group bg-portek-card border border-portek-border rounded-2xl p-6 hover:border-portek-green/40 hover:shadow-[0_0_30px_rgba(0,209,102,0.08)] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-14 h-14 rounded-xl bg-portek-green/10 border border-portek-green/20 flex items-center justify-center group-hover:bg-portek-green/15 transition-colors">
                      <SkillIcon skill={skill} size="lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white text-base">{skill.name}</h3>
                      {skill.category && activeCategory !== "All" && (
                        <p className="text-portek-muted text-xs mt-0.5">{skill.category}</p>
                      )}
                      {skill.level && (
                        <span
                          className={`inline-block mt-2 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide ${LEVEL_STYLES[skill.level] || "bg-portek-bg text-portek-muted border-portek-border"}`}
                        >
                          {skill.level}
                        </span>
                      )}
                    </div>
                  </div>

                  {skill.percentage != null && (
                    <div className="mt-5">
                      <ProgressBar value={skill.percentage} label={skill.name} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-portek-border bg-portek-card">
            <FaCode className="w-12 h-12 text-portek-muted mx-auto mb-4" />
            <p className="text-portek-muted">No skills found in this category.</p>
          </div>
        )}
      </section>

      {/* Proficiency overview — bar chart style for top skills */}
      {skills.some((s) => s.percentage != null) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-3xl border border-portek-border bg-portek-card p-6 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">
              Proficiency Overview
            </h2>
            <div className="space-y-5 max-w-2xl mx-auto">
              {[...skills]
                .filter((s) => s.percentage != null)
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 8)
                .map((skill) => (
                  <div key={`bar-${skill.id || skill.name}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm font-medium">{skill.name}</span>
                      <span className="text-portek-green text-sm font-semibold">
                        {skill.percentage}%
                      </span>
                    </div>
                    <div className="h-3 bg-portek-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-portek-green/60 to-portek-green rounded-full"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="rounded-3xl border border-portek-green/20 bg-portek-green/5 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Want to see these skills in action?
          </h2>
          <p className="text-portek-muted mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Explore my projects to see how I apply these technologies to build
            real-world applications.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-portek-green text-portek-bg px-8 py-3 rounded-full font-semibold text-sm hover:bg-portek-green-dim transition-colors"
            >
              View Projects
              <HiArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-portek-border text-white px-8 py-3 rounded-full font-semibold text-sm hover:border-portek-green hover:text-portek-green transition-colors"
            >
              Hire Me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
