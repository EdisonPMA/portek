import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaStar,
  FaSearch,
  FaTimes,
  FaProjectDiagram,
  FaPlay,
  FaFilter,
} from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { getAll } from "../services/api";
import { useAppSettings } from "../context/AppSettingsContext";

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: "Portfolio Website",
    slug: "portfolio-website",
    short_description: "A modern personal portfolio built with React and Node.js.",
    description: "Full-stack portfolio with admin dashboard, dynamic content, and Cloudinary media uploads.",
    github_url: "#",
    live_demo: "#",
    tech_stack: "React, Node.js, MySQL, Tailwind CSS",
    category: "Web App",
    status: "Completed",
    featured: true,
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    short_description: "Online store with cart, payments, and admin panel.",
    description: "Scalable e-commerce solution with product management, order tracking, and secure checkout.",
    github_url: "#",
    live_demo: "#",
    tech_stack: "React, Express, MongoDB, Stripe",
    category: "Web App",
    status: "Completed",
    featured: true,
  },
  {
    id: 3,
    title: "Task Management App",
    slug: "task-management",
    short_description: "Collaborative task board for teams.",
    description: "Real-time task management with drag-and-drop boards, assignments, and notifications.",
    github_url: "#",
    tech_stack: "React, Node.js, Socket.io, PostgreSQL",
    category: "SaaS",
    status: "In Progress",
    featured: false,
  },
];

const STATUS_STYLES = {
  Completed: "bg-portek-green/10 text-portek-green border-portek-green/30",
  "In Progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Archived: "bg-portek-muted/10 text-portek-muted border-portek-border",
};

function parseTechStack(stack) {
  if (!stack) return [];
  return stack.split(/[,|]/).map((t) => t.trim()).filter(Boolean);
}

function ProjectPlaceholder() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-portek-card to-portek-bg flex items-center justify-center">
      <FaProjectDiagram className="w-16 h-16 text-portek-green/30" />
    </div>
  );
}

function ProjectCard({ project, coverImage, onClick }) {
  const tags = parseTechStack(project.tech_stack).slice(0, 3);

  return (
    <article
      onClick={() => onClick(project)}
      className="group cursor-pointer bg-portek-card border border-portek-border rounded-2xl overflow-hidden hover:border-portek-green/40 hover:shadow-[0_0_40px_rgba(0,209,102,0.1)] transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden bg-portek-bg">
        {coverImage ? (
          <img
            src={coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ProjectPlaceholder />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-portek-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {project.featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-portek-green/90 text-portek-bg text-[10px] font-bold uppercase">
            <FaStar className="w-3 h-3" /> Featured
          </span>
        )}

        {project.status && (
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full border text-[10px] font-semibold ${STATUS_STYLES[project.status] || STATUS_STYLES.Archived}`}
          >
            {project.status}
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {project.category && (
          <p className="text-portek-green text-xs font-medium uppercase tracking-wide">
            {project.category}
          </p>
        )}
        <h3 className="mt-1 text-lg font-bold text-white group-hover:text-portek-green transition-colors">
          {project.title}
        </h3>
        <p className="mt-2 text-portek-muted text-sm line-clamp-2 leading-relaxed">
          {project.short_description || project.description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-portek-bg border border-portek-border text-portek-muted text-[10px]"
              >
                {tag}
              </span>
            ))}
            {parseTechStack(project.tech_stack).length > 3 && (
              <span className="px-2 py-0.5 text-portek-muted text-[10px]">
                +{parseTechStack(project.tech_stack).length - 3}
              </span>
            )}
          </div>
        )}

        <p className="mt-4 text-portek-green text-xs font-medium inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          View details <HiArrowUpRight className="w-3.5 h-3.5" />
        </p>
      </div>
    </article>
  );
}

function ProjectModal({ project, images, onClose }) {
  if (!project) return null;

  const tags = parseTechStack(project.tech_stack);
  const gallery = images.length > 0 ? images : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-portek-border bg-portek-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-portek-border bg-portek-card px-5 py-4">
          <div className="min-w-0 pr-4">
            <p className="text-portek-green text-xs font-medium uppercase">{project.category}</p>
            <h2 className="text-xl font-bold text-white truncate">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 rounded-lg text-portek-muted hover:text-white hover:bg-portek-bg transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {gallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gallery.map((img) => (
                <div key={img.id} className="rounded-xl overflow-hidden border border-portek-border">
                  <img
                    src={img.image_url}
                    alt={img.caption || project.title}
                    className="w-full aspect-video object-cover"
                  />
                  {img.caption && (
                    <p className="px-3 py-2 text-xs text-portek-muted bg-portek-bg">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-video rounded-xl overflow-hidden border border-portek-border">
              <ProjectPlaceholder />
            </div>
          )}

          {project.video_demo && (
            <div className="rounded-xl overflow-hidden border border-portek-border">
              <video
                src={project.video_demo}
                controls
                className="w-full aspect-video bg-black"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {project.status && (
              <span className={`px-3 py-1 rounded-full border text-xs font-medium ${STATUS_STYLES[project.status]}`}>
                {project.status}
              </span>
            )}
            {project.featured && (
              <span className="px-3 py-1 rounded-full bg-portek-green/10 text-portek-green border border-portek-green/30 text-xs font-medium">
                Featured Project
              </span>
            )}
          </div>

          <p className="text-portek-muted text-sm leading-relaxed whitespace-pre-wrap">
            {project.description || project.short_description}
          </p>

          {tags.length > 0 && (
            <div>
              <h4 className="text-white text-sm font-semibold mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-portek-green/10 text-portek-green border border-portek-green/20 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {project.live_demo && project.live_demo !== "#" && (
              <a
                href={project.live_demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-portek-green text-portek-bg px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-portek-green-dim transition-colors"
              >
                Live Demo <FaExternalLinkAlt className="w-3.5 h-3.5" />
              </a>
            )}
            {project.github_url && project.github_url !== "#" && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-portek-border text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:border-portek-green hover:text-portek-green transition-colors"
              >
                <FaGithub className="w-4 h-4" /> Source Code
              </a>
            )}
            {project.video_demo && (
              <a
                href={project.video_demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-portek-border text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:border-portek-green hover:text-portek-green transition-colors"
              >
                <FaPlay className="w-3.5 h-3.5" /> Watch Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { t } = useAppSettings();
  const [projects, setProjects] = useState([]);
  const [imageMap, setImageMap] = useState({});
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const [projectsData, imagesData, profiles] = await Promise.all([
          getAll("/projects"),
          getAll("/project-images"),
          getAll("/profiles"),
        ]);

        setProjects(projectsData?.length ? projectsData : FALLBACK_PROJECTS);
        if (profiles?.length > 0) setProfile(profiles[0]);

        const map = {};
        (imagesData || []).forEach((img) => {
          if (!map[img.project_id]) map[img.project_id] = [];
          map[img.project_id].push(img);
        });
        Object.values(map).forEach((arr) =>
          arr.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        );
        setImageMap(map);
      } catch {
        setProjects(FALLBACK_PROJECTS);
      }
      setLoading(false);
    }
    loadProjects();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(projects.map((p) => p.category).filter(Boolean))];
    return ["All", ...cats.sort()];
  }, [projects]);

  const statuses = useMemo(() => {
    const sts = [...new Set(projects.map((p) => p.status).filter(Boolean))];
    return ["All", ...sts];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !search ||
        [p.title, p.short_description, p.description, p.tech_stack, p.category]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchCat = categoryFilter === "All" || p.category === categoryFilter;
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [projects, search, categoryFilter, statusFilter]);

  const featured = useMemo(
    () => filtered.filter((p) => p.featured),
    [filtered]
  );
  const regular = useMemo(
    () => filtered.filter((p) => !p.featured),
    [filtered]
  );

  const getCover = (projectId) => imageMap[projectId]?.[0]?.image_url || null;

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
            {t("projects.title")}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t("projects.titleMain") && <>{t("projects.titleMain")} </>}
            <span className="text-portek-green">{t("projects.titleAccent")}</span>
          </h1>
          <p className="mt-4 text-portek-muted text-sm sm:text-base leading-relaxed">
            {profile?.bio || t("projects.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-portek-card border border-portek-border text-sm text-white">
            <FaProjectDiagram className="text-portek-green w-4 h-4" />
            {projects.length} Projects
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-portek-card border border-portek-border text-sm text-white">
            <FaStar className="text-portek-green w-4 h-4" />
            {projects.filter((p) => p.featured).length} {t("common.featured")}
          </span>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-portek-muted w-4 h-4" />
            <input
              type="text"
              placeholder={t("projects.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-portek-card border border-portek-border rounded-xl text-white text-sm placeholder:text-portek-muted outline-none focus:border-portek-green/50"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 text-portek-muted text-xs mr-1">
              <FaFilter className="w-3 h-3" /> Filter:
            </div>
            {categories.map((cat) => (
              <button
                key={`cat-${cat}`}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  categoryFilter === cat
                    ? "bg-portek-green text-portek-bg"
                    : "bg-portek-card border border-portek-border text-portek-muted hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {statuses.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {statuses.map((st) => (
              <button
                key={`st-${st}`}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === st
                    ? "border-2 border-portek-green text-portek-green"
                    : "border border-portek-border text-portek-muted hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <FaStar className="text-portek-green" />
            <h2 className="text-xl font-bold text-white">Featured Projects</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                coverImage={getCover(project.id)}
                onClick={setSelectedProject}
              />
            ))}
          </div>
        </section>
      )}

      {/* All projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        {regular.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-white mb-6">
              {featured.length > 0 ? "More Projects" : "All Projects"}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regular.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  coverImage={getCover(project.id)}
                  onClick={setSelectedProject}
                />
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 rounded-2xl border border-portek-border bg-portek-card">
            <FaProjectDiagram className="w-14 h-14 text-portek-muted mx-auto mb-4" />
            <p className="text-white font-medium">No projects found</p>
            <p className="text-portek-muted text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="rounded-3xl border border-portek-green/20 bg-portek-green/5 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Have a project in mind?
          </h2>
          <p className="text-portek-muted mt-3 max-w-lg mx-auto text-sm sm:text-base">
            I&apos;m available for freelance work and collaborations. Let&apos;s
            build something great together.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-6 bg-portek-green text-portek-bg px-8 py-3 rounded-full font-semibold text-sm hover:bg-portek-green-dim transition-colors"
          >
            Start a Project
            <HiArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        images={selectedProject ? imageMap[selectedProject.id] || [] : []}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
