const crudModel = require("../model/crud.model");

function createCrudController(table, options = {}) {
  const { requiredFields = [], publicFilter } = options;

  async function create(req, res) {
    try {
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`,
          });
        }
      }

      const result = await crudModel.create(table, req.body);
      if (!result.success) {
        return res.status(400).json(result);
      }

      const data = await crudModel.getById(table, result.id);
      res.status(201).json({ success: true, message: "Created successfully", data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  async function getAll(req, res) {
    try {
      const filters = publicFilter ? publicFilter(req.query) : req.query;
      const data = await crudModel.getAll(table, filters);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  async function getOne(req, res) {
    try {
      const data = await crudModel.getById(table, req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: "Record not found" });
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  async function update(req, res) {
    try {
      const result = await crudModel.update(table, req.params.id, req.body);
      if (!result.affectedRows) {
        return res.status(404).json({ success: false, message: "Record not found" });
      }
      const data = await crudModel.getById(table, req.params.id);
      res.status(200).json({ success: true, message: "Updated successfully", data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  async function remove(req, res) {
    try {
      const result = await crudModel.remove(table, req.params.id);
      if (!result.affectedRows) {
        return res.status(404).json({ success: false, message: "Record not found" });
      }
      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  return { create, getAll, getOne, update, remove };
}

module.exports = { createCrudController };
