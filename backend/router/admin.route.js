const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller.js");
const auth = require("../middelwares/auth.js");

// Public admin Routes
router.post("/register", adminController.create);
router.post("/login", adminController.login);

// Protected admin Routes
router.get("/", auth, adminController.getAll);
router.get("/:id", auth, adminController.getOne);
router.put("/:id", auth, adminController.update);
router.delete("/:id", auth, adminController.remove);

module.exports = router;