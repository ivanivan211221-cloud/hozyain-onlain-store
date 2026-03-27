const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");

const storagePath = process.env.DB_STORAGE || path.join(process.cwd(), "data", "hozyan.sqlite");
fs.mkdirSync(path.dirname(storagePath), { recursive: true });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: storagePath,
  logging: false,
});

module.exports = sequelize;
