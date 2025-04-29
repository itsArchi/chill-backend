const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const saltRounds = 10;

// VALIDASI PASSWORD
const validateUserInput = ({ username, fullname, email, password, phone }) => {
  if (!validator.isStrongPassword(password)) {
    return "Password must be at least 8 characters long and include both lowercase and uppercase letters.";
  }
  if (!validator.isEmail(email)) return "Invalid email format.";
  if (username.length < 3)
    return "Username must be at least 3 characters long.";
  if (fullname.length < 3)
    return "Fullname must be at least 3 characters long.";
  if (!validator.isMobilePhone(phone)) return "Invalid phone number format.";
  return null;
};

// REGISTER
exports.userRegister = async (req, res) => {
  const { username, fullname, email, password, phone } = req.body;
  const validationError = validateUserInput({
    username,
    fullname,
    email,
    password,
    phone,
  });
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists)
      return res.status(400).json({ error: "Email already exists" });

    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists)
      return res.status(400).json({ error: "Username already exists" });

    const hash = await bcrypt.hash(password, saltRounds);
    await User.create({ username, fullname, email, password: hash, phone });

    // Generate activation token (berlaku 1 hari)
    const activationToken = jwt.sign(
      { id: email, purpose: "activation" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD, // Gunakan App Password jika Gmail
      },
    });

    // Link aktivasi
    const activationLink = `http://localhost:5000/api/v1/activate/${activationToken}`;

    // Kirim email
    await transporter.sendMail({
      from: `"My App 👻" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Activate your account",
      html: `<p>Hello ${fullname},</p>
    <p>Please click the link below to activate your account:</p>
    <a href="${activationLink}">${activationLink}</a>
    <p>This link will expire in 24 hours.</p>`,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User found", user });
  } catch (error) {
    res.status(500).json({ message: "Error finding user", error });
  }
};

// ADD USERS
exports.createUser = async (req, res) => {
  const { id, name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newUser = await User.create({
      id,
      username,
      fullname,
      email,
      password,
      phone,
    });
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// UPDATE USER BY ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone } = req.body;
  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ name, email, password, phone });
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// DELETE USER BY ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
