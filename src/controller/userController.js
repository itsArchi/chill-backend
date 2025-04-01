const User = require("../models/User");

// GET ALL USERS
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
    
    const getSpesificUser = await User.findOne({ where: { id } });

    if (!getSpesificUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User found", getSpesificUser });
  } catch (error) {
    res.status(500).json({ message: "Error find user", error });
  }
};

// ADD USERS
exports.createUser = async (req, res) => {
  try {
    const { id, name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = await User.create({
      id,
      name,
      email,
      password,
      phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// UPDATE USER BY ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const user = await User.findOne({ where: { id }});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ name, email, password, phone });

    res.status(201).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
}

// DELETE USER BY ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.destroy({ where: { id } });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
