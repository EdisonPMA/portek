const mysqlConnect = require("../config/conn");
const bcrypt = require("bcryptjs");

async function createUser(name, email, password) {
  const conn = await mysqlConnect();
  const hashedPassword = await bcrypt.hash(password, 10);

  const [existing] = await conn.execute("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    return { success: false, message: "Email already exists" };
  }

  const [result] = await conn.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  return { success: true, id: result.insertId };
}

async function getUsers() {
  const conn = await mysqlConnect();
  const [rows] = await conn.execute(
    "SELECT id, name, email, created_at, updated_at FROM users ORDER BY id DESC"
  );
  return rows;
}

async function getUserById(id) {
  const conn = await mysqlConnect();
  const [rows] = await conn.execute(
    "SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function getUserByEmail(email) {
  const conn = await mysqlConnect();
  const [rows] = await conn.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}

async function updateUser(id, name, email) {
  const conn = await mysqlConnect();
  const [result] = await conn.execute(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id]
  );
  return { success: true, affectedRows: result.affectedRows };
}

async function updateUserPassword(id, password) {
  const conn = await mysqlConnect();
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await conn.execute("UPDATE users SET password = ? WHERE id = ?", [
    hashedPassword,
    id,
  ]);
  return { success: true, affectedRows: result.affectedRows };
}

async function deleteUser(id) {
  const conn = await mysqlConnect();
  const [result] = await conn.execute("DELETE FROM users WHERE id = ?", [id]);
  return { success: true, affectedRows: result.affectedRows };
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  updateUserPassword,
  deleteUser,
};
