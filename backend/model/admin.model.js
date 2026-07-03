const mysqlConnect = require("../config/conn");
const bcrypt = require("bcryptjs");

async function createAdmin(name, email, password) {
  try {
    const conn = await mysqlConnect();

    const hashedPassword = await bcrypt.hash(password, 10);

    const [exist] = await conn.execute(
      "SELECT id FROM admin WHERE email = ?",
      [email]
    );

    if (exist.length > 0) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    const [result] = await conn.execute(
      "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return {
      success: true,
      message: "Admin created successfully",
      id: result.insertId,
    };
  } catch (error) {
    throw error;
  }
}

async function getAdmins() {
  try {
    const conn = await mysqlConnect();

    const [rows] = await conn.execute(
      "SELECT id, name, email FROM admin"
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAdminByEmail(email) {
  try {
    const conn = await mysqlConnect();

    const [rows] = await conn.execute(
      "SELECT * FROM admin WHERE email = ?",
      [email]
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
}


async function updateAdmin(id, name, email) {
  try {
    const conn = await mysqlConnect();

    const [result] = await conn.execute(
      "UPDATE admin SET name=?, email=? WHERE id=?",
      [name, email, id]
    );

    return {
      success: true,
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    throw error;
  }
}

async function updatePassword(id, password) {
  try {
    const conn = await mysqlConnect();

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await conn.execute(
      "UPDATE admin SET password=? WHERE id=?",
      [hashedPassword, id]
    );

    return {
      success: true,
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    throw error;
  }
}
async function deleteAdmin(id) {
  try {
    const conn = await mysqlConnect();

    const [result] = await conn.execute(
      "DELETE FROM admin WHERE id=?",
      [id]
    );

    return {
      success: true,
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createAdmin,
  getAdmins,
  getAdminByEmail,
  updateAdmin,
  updatePassword,
  deleteAdmin,
};