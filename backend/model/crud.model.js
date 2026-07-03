const mysqlConnect = require("../config/conn");
const { assertTable } = require("../config/tables");

function cleanData(data) {
  const cleaned = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && key !== "id") {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

async function create(table, data) {
  const { orderBy } = assertTable(table);
  void orderBy;
  const conn = await mysqlConnect();
  const payload = cleanData(data);

  if (!Object.keys(payload).length) {
    return { success: false, message: "No data provided" };
  }

  const keys = Object.keys(payload);
  const placeholders = keys.map(() => "?").join(", ");
  const sql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`;
  const [result] = await conn.execute(sql, keys.map((key) => payload[key]));

  return { success: true, id: result.insertId };
}

async function getAll(table, filters = {}) {
  const { orderBy } = assertTable(table);
  const conn = await mysqlConnect();
  const conditions = [];
  const values = [];

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      conditions.push(`${key} = ?`);
      values.push(value);
    }
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const sql = `SELECT * FROM ${table} ${where} ORDER BY ${orderBy}`;
  const [rows] = await conn.execute(sql, values);
  return rows;
}

async function getById(table, id) {
  assertTable(table);
  const conn = await mysqlConnect();
  const [rows] = await conn.execute(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function getBySlug(table, slug) {
  assertTable(table);
  const conn = await mysqlConnect();
  const [rows] = await conn.execute(`SELECT * FROM ${table} WHERE slug = ?`, [slug]);
  return rows[0] || null;
}

async function update(table, id, data) {
  assertTable(table);
  const conn = await mysqlConnect();
  const payload = cleanData(data);

  if (!Object.keys(payload).length) {
    return { success: false, message: "No data provided" };
  }

  const keys = Object.keys(payload);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
  const [result] = await conn.execute(sql, [...keys.map((key) => payload[key]), id]);

  return { success: true, affectedRows: result.affectedRows };
}

async function remove(table, id) {
  assertTable(table);
  const conn = await mysqlConnect();
  const [result] = await conn.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
  return { success: true, affectedRows: result.affectedRows };
}

module.exports = {
  create,
  getAll,
  getById,
  getBySlug,
  update,
  remove,
};
