const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes")
const seriesRoutes = require("./seriesRoutes")

router.use("/v1", userRoutes)
router.use("/v1", seriesRoutes)

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is connected",
    data: null,
  });
});


module.exports = router;