const uploadToCloudinary = require("../middelwares/upload");

async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const url = await uploadToCloudinary(req.file.path, {
      resourceType: "image",
      folder: "portek/images",
    });

    res.status(200).json({ success: true, url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
}

async function uploadVideo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No video file provided" });
    }

    const url = await uploadToCloudinary(req.file.path, {
      resourceType: "video",
      folder: "portek/videos",
    });

    res.status(200).json({ success: true, url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Video upload failed" });
  }
}

async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const url = await uploadToCloudinary(req.file.path, {
      resourceType: "file",
      folder: "portek/files",
    });

    res.status(200).json({ success: true, url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "File upload failed" });
  }
}

async function uploadIcon(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No icon file provided" });
    }

    const url = await uploadToCloudinary(req.file.path, {
      resourceType: "image",
      folder: "portek/icons",
    });

    res.status(200).json({ success: true, url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Icon upload failed" });
  }
}

module.exports = { uploadImage, uploadVideo, uploadFile, uploadIcon };
