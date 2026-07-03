const express = require("express");
const auth = require("../middelwares/auth");
const { imageUpload, videoUpload, fileUpload } = require("../middelwares/multerUpload");
const uploadController = require("../controllers/upload.controller");

const router = express.Router();

function handleMulter(middleware) {
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "File upload error",
        });
      }
      next();
    });
  };
}

router.post(
  "/image",
  auth,
  handleMulter(imageUpload.single("file")),
  uploadController.uploadImage
);

router.post(
  "/video",
  auth,
  handleMulter(videoUpload.single("file")),
  uploadController.uploadVideo
);

router.post(
  "/file",
  auth,
  handleMulter(fileUpload.single("file")),
  uploadController.uploadFile
);

router.post(
  "/icon",
  auth,
  handleMulter(imageUpload.single("file")),
  uploadController.uploadIcon
);

module.exports = router;
