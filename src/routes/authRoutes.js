const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.get("/activate/:token", authController.activateUser);

module.exports = router;
