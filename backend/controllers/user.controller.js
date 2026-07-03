const userModel = require("../model/user.model");

async function create(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const result = await userModel.createUser(name, email, password);
    if (!result.success) {
      return res.status(400).json(result);
    }

    const data = await userModel.getUserById(result.id);
    res.status(201).json({ success: true, message: "User created successfully", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getAll(req, res) {
  try {
    const data = await userModel.getUsers();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getOne(req, res) {
  try {
    const data = await userModel.getUserById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function update(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    await userModel.updateUser(req.params.id, name, email);
    if (password) {
      await userModel.updateUserPassword(req.params.id, password);
    }

    const data = await userModel.getUserById(req.params.id);
    res.status(200).json({ success: true, message: "User updated successfully", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function remove(req, res) {
  try {
    const result = await userModel.deleteUser(req.params.id);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { create, getAll, getOne, update, remove };
