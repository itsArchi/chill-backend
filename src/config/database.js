const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
});

async function connect() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

connect ();

module.exports = sequelize;