const express = require("express");
const { getAllUser, getUserById, createUser, updateUser, deleteUser } = require("../controller/userController");

const router = express.Router();

router.get("/users", getAllUser);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;