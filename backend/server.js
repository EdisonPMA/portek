require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysqlConnect = require("./config/conn");
const adminRouter = require("./router/admin.route.js");
const apiRouter = require("./router/index.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api", adminRouter);

mysqlConnect()
  .then(() => console.log("Database pool ready"))
  .catch((err) => console.error("Database connection error", err));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Portek API is running" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
