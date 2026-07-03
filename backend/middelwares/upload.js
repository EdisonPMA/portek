const fs = require("fs");
const cloudinary = require("../config/cloudinary");

async function uploadToCloudinary(filePath, options = {}) {
  const { resourceType = "image", folder = "portek" } = options;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType === "file" ? "raw" : resourceType,
    });

    fs.unlink(filePath, () => {});
    return result.secure_url;
  } catch (err) {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, () => {});
    }
    throw err;
  }
}

module.exports = uploadToCloudinary;
