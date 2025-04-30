const express = require("express");
const routes = require("./routes");
const userRoutes = require("./routes/userRoutes")
const seriesRoutes = require("./routes/seriesRoutes")
const cors = require("cors")
const sequelize = require("./config/database");
const User = require("./models/User");
const Series = require("./models/Series")(sequelize);

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true,limit: '50mb'}));
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET","POST","PUT","DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use("/api", routes)
app.use(express.json());

sequelize
  .sync(force = true)
  .then(() => console.log('Database Connected'))
  .catch((err) => console.error('Error connecting to database:', err));

module.exports = app;
