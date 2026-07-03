const contentModel = require("../model/content.model");
const crudModel = require("../model/crud.model");
const { sendContactEmail } = require("../services/email.service");

async function create(req, res) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const result = await contentModel.createMessage(req.body);
    const data = await contentModel.getMessageById(result.id);

    try {
      await sendContactEmail(req.body);
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr.message);
    }

    res.status(201).json({ success: true, message: "Message sent successfully", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getAll(req, res) {
  try {
    const filters = {};
    if (req.query.is_read !== undefined) {
      filters.is_read = req.query.is_read === "true";
    }
    const data = await contentModel.getMessages(filters);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getOne(req, res) {
  try {
    const data = await contentModel.getMessageById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function markRead(req, res) {
  try {
    const isRead = req.body.is_read !== undefined ? req.body.is_read : true;
    const result = await contentModel.markMessageRead(req.params.id, isRead);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    const data = await contentModel.getMessageById(req.params.id);
    res.status(200).json({ success: true, message: "Message updated", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function remove(req, res) {
  try {
    const result = await contentModel.deleteMessage(req.params.id);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getPublished(req, res) {
  try {
    const data = await contentModel.getPublishedBlogs();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getBySlug(req, res) {
  try {
    const data = await contentModel.getBlogBySlug(req.params.slug);
    if (!data) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    await contentModel.incrementBlogViews(data.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getProjectImages(req, res) {
  try {
    const data = await contentModel.getProjectImages(req.params.projectId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getFeaturedTestimonials(req, res) {
  try {
    const data = await crudModel.getAll("testimonials", { featured: true });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getFeaturedProjects(req, res) {
  try {
    const data = await crudModel.getAll("projects", { featured: true });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  markRead,
  remove,
  getPublished,
  getBySlug,
  getProjectImages,
  getFeaturedTestimonials,
  getFeaturedProjects,
};
