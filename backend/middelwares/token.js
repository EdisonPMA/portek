const jwt = require("jsonwebtoken");
require("dotenv").config();

async function generateToken(admin) {
  try {
    const token = jwt.sign(
      {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return token;
  } catch (error) {
    throw error;
  }
}
async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};