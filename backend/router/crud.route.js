const express = require("express");
const auth = require("../middelwares/auth");
const { createCrudController } = require("../controllers/crud.controller");

function createCrudRouter(table, options = {}) {
  const router = express.Router();
  const controller = createCrudController(table, options);

  router.get("/", controller.getAll);
  router.get("/:id", controller.getOne);

  router.post("/", auth, controller.create);
  router.put("/:id", auth, controller.update);
  router.delete("/:id", auth, controller.remove);

  return router;
}

module.exports = { createCrudRouter };
