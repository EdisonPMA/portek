const crudModel = require("./crud.model");

function createEntityModel(table) {
  return {
    create: (data) => crudModel.create(table, data),
    getAll: (filters) => crudModel.getAll(table, filters),
    getById: (id) => crudModel.getById(table, id),
    getBySlug: (slug) => crudModel.getBySlug(table, slug),
    update: (id, data) => crudModel.update(table, id, data),
    remove: (id) => crudModel.remove(table, id),
  };
}

module.exports = {
  profileModel: createEntityModel("profiles"),
  skillModel: createEntityModel("skills"),
  projectModel: createEntityModel("projects"),
  projectImageModel: createEntityModel("project_images"),
  experienceModel: createEntityModel("experiences"),
  educationModel: createEntityModel("education"),
  certificationModel: createEntityModel("certifications"),
  blogCategoryModel: createEntityModel("blog_categories"),
  blogModel: createEntityModel("blogs"),
  messageModel: createEntityModel("messages"),
  testimonialModel: createEntityModel("testimonials"),
  socialLinkModel: createEntityModel("social_links"),
  resumeModel: createEntityModel("resume"),
  siteSettingsModel: createEntityModel("site_settings"),
};
