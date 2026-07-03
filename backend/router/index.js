const express = require("express");
const auth = require("../middelwares/auth");
const userController = require("../controllers/user.controller");
const contentController = require("../controllers/content.controller");
const { createCrudRouter } = require("./crud.route");
const { createCrudController } = require("../controllers/crud.controller");

const router = express.Router();

const uploadRouter = require("./upload.route");
const chatRouter = require("./chat.route");
router.use("/upload", uploadRouter);
router.use("/chat", chatRouter);

router.use("/users", auth, createUserRouter());
router.use("/profiles", createCrudRouter("profiles", { requiredFields: ["full_name"] }));
router.use("/skills", createCrudRouter("skills", { requiredFields: ["name"] }));
router.use("/projects", createProjectRouter());
router.use("/project-images", createCrudRouter("project_images", {
  requiredFields: ["project_id", "image_url"],
}));
router.use("/experiences", createCrudRouter("experiences", {
  requiredFields: ["company", "position"],
}));
router.use("/education", createCrudRouter("education", {
  requiredFields: ["institution"],
}));
router.use("/certifications", createCrudRouter("certifications", {
  requiredFields: ["title"],
}));
router.use("/blog-categories", createCrudRouter("blog_categories", {
  requiredFields: ["name"],
}));
router.use("/blogs", createBlogRouter());
router.use("/messages", createMessageRouter());
router.use("/testimonials", createTestimonialRouter());
router.use("/social-links", createCrudRouter("social_links", {
  requiredFields: ["platform", "url"],
}));
router.use("/resume", createCrudRouter("resume", { requiredFields: ["file_url"] }));
router.use("/site-settings", createCrudRouter("site_settings"));

function createUserRouter() {
  const userRouter = express.Router();
  userRouter.get("/", userController.getAll);
  userRouter.get("/:id", userController.getOne);
  userRouter.post("/", userController.create);
  userRouter.put("/:id", userController.update);
  userRouter.delete("/:id", userController.remove);
  return userRouter;
}

function createProjectRouter() {
  const projectRouter = express.Router();
  const controller = createCrudController("projects", { requiredFields: ["title"] });

  projectRouter.get("/featured/list", contentController.getFeaturedProjects);
  projectRouter.get("/:projectId/images", contentController.getProjectImages);
  projectRouter.get("/", controller.getAll);
  projectRouter.get("/:id", controller.getOne);
  projectRouter.post("/", auth, controller.create);
  projectRouter.put("/:id", auth, controller.update);
  projectRouter.delete("/:id", auth, controller.remove);

  return projectRouter;
}

function createBlogRouter() {
  const blogRouter = express.Router();
  const controller = createCrudController("blogs", { requiredFields: ["title"] });

  blogRouter.get("/published/list", contentController.getPublished);
  blogRouter.get("/slug/:slug", contentController.getBySlug);
  blogRouter.get("/", controller.getAll);
  blogRouter.get("/:id", controller.getOne);
  blogRouter.post("/", auth, controller.create);
  blogRouter.put("/:id", auth, controller.update);
  blogRouter.delete("/:id", auth, controller.remove);

  return blogRouter;
}

function createMessageRouter() {
  const messageRouter = express.Router();

  messageRouter.post("/", contentController.create);
  messageRouter.get("/", auth, contentController.getAll);
  messageRouter.get("/:id", auth, contentController.getOne);
  messageRouter.patch("/:id/read", auth, contentController.markRead);
  messageRouter.delete("/:id", auth, contentController.remove);

  return messageRouter;
}

function createTestimonialRouter() {
  const testimonialRouter = express.Router();
  const controller = createCrudController("testimonials", {
    requiredFields: ["client_name"],
  });

  testimonialRouter.get("/featured/list", contentController.getFeaturedTestimonials);
  testimonialRouter.get("/", controller.getAll);
  testimonialRouter.get("/:id", controller.getOne);
  testimonialRouter.post("/", auth, controller.create);
  testimonialRouter.put("/:id", auth, controller.update);
  testimonialRouter.delete("/:id", auth, controller.remove);

  return testimonialRouter;
}

module.exports = router;
