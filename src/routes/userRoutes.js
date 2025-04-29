const express = require("express");
const {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  userRegister,
  userLogin,
} = require("../controller/userController");

const {
  createUserValidation,
  updateUserValidation,
  idValidation,
} = require("../middleware/userValidation");

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);

router.get("/users", getAllUser);
router.get("/users/:id", idValidation, getUserById);
router.post("/users", createUserValidation, createUser);
router.patch("/users/:id", updateUserValidation, updateUser);
router.delete("/users/:id", idValidation, deleteUser);

module.exports = router;
