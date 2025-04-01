const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes")

router.use("/v1", userRoutes)

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is connected",
    data: null,
  });
});


module.exports = router;