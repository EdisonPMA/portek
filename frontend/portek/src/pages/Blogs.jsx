import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaBlog,
  FaSearch,
  FaTimes,
  FaEye,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { getAll, getPublishedBlogs, getBlogBySlug } from "../services/api";
import { useAppSettings } from "../context/AppSettingsContext";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function BlogCover({ blog, large }) {
  if (blog.cover_image) {
    return (
      <img
        src={blog.cover_image}
        alt={blog.title}
        className={`w-full object-cover ${large ? "h-64 sm:h-80" : "h-48"} group-hover:scale-105 transition-transform duration-500`}
      />
    );
  }
  return (
    <div
      className={`w-full bg-gradient-to-br from-portek-card to-portek-bg flex items-center justify-center ${large ? "h-64 sm:h-80" : "h-48"}`}
    >
      <FaBlog className={`${large ? "w-16 h-16" : "w-12 h-12"} text-portek-green/30`} />
    </div>
  );
}

function BlogCard({ blog, onClick }) {
  return (
    <article
      onClick={() => onClick(blog)}
      className="group cursor-pointer bg-portek-card border border-portek-border rounded-2xl overflow-hidden hover:border-portek-green/40 hover:shadow-[0_0_30px_rgba(0,209,102,0.08)] transition-all duration-300"
    >
      <div className="overflow-hidden">
        <BlogCover blog={blog} />
      </div>
      <div className="p-5 sm:p-6">
        {blog.category_name && (
          <span className="inline-flex items-center gap-1 text-portek-green text-xs font-medium">
            <FaTag className="w-3 h-3" />
            {blog.category_name}
          </span>
        )}
        <h3 className="mt-2 text-lg font-bold text-white group-hover:text-portek-green transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="mt-2 text-portek-muted text-sm line-clamp-3 leading-relaxed">
          {blog.excerpt}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-portek-border text-portek-muted text-xs">
          <span className="inline-flex items-center gap-1">
            <FaCalendarAlt className="w-3 h-3" />
            {formatDate(blog.created_at)}
          </span>
          <span className="inline-flex items-center gap-1">
            <FaEye className="w-3 h-3" />
            {blog.views ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
}

function BlogModal({ blog, loading, onClose }) {
  if (!blog && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-portek-border bg-portek-card shadow-2xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="w-8 h-8 border-2 border-portek-green/30 border-t-portek-green rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-10 flex justify-end p-3 bg-portek-card/95 backdrop-blur border-b border-portek-border">
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-portek-muted hover:text-white hover:bg-portek-bg transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {blog.cover_image && (
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-56 sm:h-72 object-cover"
              />
            )}

            <div className="p-6 sm:p-8">
              {blog.category_name && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-portek-green/10 text-portek-green border border-portek-green/20 text-xs font-medium">
                  <FaTag className="w-3 h-3" />
                  {blog.category_name}
                </span>
              )}

              <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-white leading-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap gap-4 mt-4 text-portek-muted text-xs">
                <span className="inline-flex items-center gap-1">
                  <FaCalendarAlt />
                  {formatDate(blog.created_at)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaEye />
                  {blog.views ?? 0} views
                </span>
              </div>

              <div className="mt-6 text-portek-muted text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {blog.content || blog.excerpt}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Blogs() {
  const { t } = useAppSettings();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const [blogsData, cats, profiles] = await Promise.all([
          getPublishedBlogs(),
          getAll("/blog-categories"),
          getAll("/profiles"),
        ]);
        setBlogs(Array.isArray(blogsData) ? blogsData : []);
        setCategories(Array.isArray(cats) ? cats : []);
        if (profiles?.length > 0) setProfile(profiles[0]);
      } catch {
        setError("Failed to load blog posts. Please try again later.");
      }
      setLoading(false);
    }
    loadBlogs();
  }, []);

  const categoryNames = useMemo(() => {
    const fromBlogs = blogs.map((b) => b.category_name).filter(Boolean);
    const fromDb = categories.map((c) => c.name);
    return ["All", ...new Set([...fromDb, ...fromBlogs])].sort((a, b) =>
      a === "All" ? -1 : a.localeCompare(b)
    );
  }, [blogs, categories]);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchSearch =
        !search ||
        [b.title, b.excerpt, b.content, b.category_name]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchCat =
        categoryFilter === "All" || b.category_name === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [blogs, search, categoryFilter]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const openBlog = async (blog) => {
    setSelectedBlog(blog);
    if (blog.slug) {
      setModalLoading(true);
      try {
        const full = await getBlogBySlug(blog.slug);
        setSelectedBlog(full);
      } catch {
        /* keep list data */
      }
      setModalLoading(false);
    }
  };

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
            {t("nav.blogs")}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t("blogs.titleMain")}{" "}
            <span className="text-portek-green">{t("blogs.titleAccent")}</span>
          </h1>
          <p className="mt-4 text-portek-muted text-sm sm:text-base leading-relaxed">
            {profile?.bio || profile?.about}
          </p>
        </div>

        <div className="flex justify-center mt-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-portek-card border border-portek-border text-sm text-white">
            <FaBlog className="text-portek-green w-4 h-4" />
            {blogs.length} Published Posts
          </span>
        </div>
      </section>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center">
            {error}
          </div>
        </div>
      )}

      {!error && blogs.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="text-center py-20 rounded-2xl border border-portek-border bg-portek-card">
            <FaBlog className="w-14 h-14 text-portek-muted mx-auto mb-4" />
            <p className="text-white font-medium">{t("blogs.noArticles")}</p>
            <p className="text-portek-muted text-sm mt-1">
              Check back soon for new posts.
            </p>
          </div>
        </section>
      )}

      {blogs.length > 0 && (
        <>
      {/* Search & filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-portek-muted w-4 h-4" />
            <input
              type="text"
              placeholder={t("blogs.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-portek-card border border-portek-border rounded-xl text-white text-sm placeholder:text-portek-muted outline-none focus:border-portek-green/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((cat) => (
              <button
                key={cat}
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
      </section>

      {/* Featured post */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <article
            onClick={() => openBlog(featured)}
            className="group cursor-pointer grid lg:grid-cols-2 gap-0 bg-portek-card border border-portek-border rounded-2xl overflow-hidden hover:border-portek-green/40 transition-colors"
          >
            <div className="overflow-hidden">
              <BlogCover blog={featured} large />
            </div>
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <span className="text-portek-green text-xs font-semibold uppercase tracking-wide">
                Latest Post
              </span>
              {featured.category_name && (
                <span className="inline-flex items-center gap-1 mt-2 text-portek-muted text-xs">
                  <FaTag className="w-3 h-3 text-portek-green" />
                  {featured.category_name}
                </span>
              )}
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white group-hover:text-portek-green transition-colors">
                {featured.title}
              </h2>
              <p className="mt-3 text-portek-muted text-sm sm:text-base line-clamp-3 leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4 mt-6 text-portek-muted text-xs">
                <span className="inline-flex items-center gap-1">
                  <FaCalendarAlt />
                  {formatDate(featured.created_at)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaEye />
                  {featured.views ?? 0} views
                </span>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-portek-green text-sm font-medium">
                Read article <HiArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </article>
        </section>
      )}

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        {rest.length > 0 ? (
          <>
            <h2 className="text-xl font-bold text-white mb-6">More Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((blog) => (
                <BlogCard key={blog.id} blog={blog} onClick={openBlog} />
              ))}
            </div>
          </>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-portek-border bg-portek-card">
            <FaBlog className="w-14 h-14 text-portek-muted mx-auto mb-4" />
            <p className="text-white font-medium">No articles match your search</p>
            <p className="text-portek-muted text-sm mt-1">
              Try a different search or category filter.
            </p>
          </div>
        ) : null}
      </section>
        </>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="rounded-3xl border border-portek-green/20 bg-portek-green/5 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Want to collaborate or discuss an idea?
          </h2>
          <p className="text-portek-muted mt-3 max-w-lg mx-auto text-sm sm:text-base">
            I&apos;m always open to new projects and interesting conversations.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-6 bg-portek-green text-portek-bg px-8 py-3 rounded-full font-semibold text-sm hover:bg-portek-green-dim transition-colors"
          >
            Get In Touch
            <HiArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <BlogModal
        blog={selectedBlog}
        loading={modalLoading}
        onClose={() => setSelectedBlog(null)}
      />
    </div>
  );
}
