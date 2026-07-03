const crudModel = require("./crud.model");
const mysqlConnect = require("../config/conn");

async function createMessage(data) {
  return crudModel.create("messages", data);
}

async function getMessages(filters = {}) {
  return crudModel.getAll("messages", filters);
}

async function getMessageById(id) {
  return crudModel.getById("messages", id);
}

async function markMessageRead(id, isRead = true) {
  return crudModel.update("messages", id, { is_read: isRead });
}

async function deleteMessage(id) {
  return crudModel.remove("messages", id);
}

async function getPublishedBlogs() {
  const conn = await mysqlConnect();
  const [rows] = await conn.execute(
    `SELECT b.*, c.name AS category_name, c.slug AS category_slug
     FROM blogs b
     LEFT JOIN blog_categories c ON b.category_id = c.id
     WHERE b.published = TRUE
     ORDER BY b.created_at DESC`
  );
  return rows;
}

async function getBlogBySlug(slug) {
  const conn = await mysqlConnect();
  const [rows] = await conn.execute(
    `SELECT b.*, c.name AS category_name, c.slug AS category_slug
     FROM blogs b
     LEFT JOIN blog_categories c ON b.category_id = c.id
     WHERE b.slug = ? AND b.published = TRUE`,
    [slug]
  );
  return rows[0] || null;
}

async function incrementBlogViews(id) {
  const conn = await mysqlConnect();
  await conn.execute("UPDATE blogs SET views = views + 1 WHERE id = ?", [id]);
}

async function getProjectImages(projectId) {
  return crudModel.getAll("project_images", { project_id: projectId });
}

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  markMessageRead,
  deleteMessage,
  getPublishedBlogs,
  getBlogBySlug,
  incrementBlogViews,
  getProjectImages,
};
