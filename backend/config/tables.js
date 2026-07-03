const ALLOWED_TABLES = {
  profiles: { orderBy: "id ASC" },
  skills: { orderBy: "display_order ASC, id ASC" },
  projects: { orderBy: "created_at DESC" },
  project_images: { orderBy: "display_order ASC, id ASC" },
  experiences: { orderBy: "start_date DESC, id DESC" },
  education: { orderBy: "end_year DESC, id DESC" },
  certifications: { orderBy: "issue_date DESC, id DESC" },
  blog_categories: { orderBy: "name ASC" },
  blogs: { orderBy: "created_at DESC" },
  messages: { orderBy: "created_at DESC" },
  testimonials: { orderBy: "featured DESC, created_at DESC" },
  social_links: { orderBy: "display_order ASC, id ASC" },
  resume: { orderBy: "last_updated DESC, id DESC" },
  site_settings: { orderBy: "id ASC" },
};

function assertTable(table) {
  if (!ALLOWED_TABLES[table]) {
    throw new Error(`Invalid table: ${table}`);
  }
  return ALLOWED_TABLES[table];
}

module.exports = { ALLOWED_TABLES, assertTable };
