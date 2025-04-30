exports.activateUser = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.id;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = true;
    await user.save();

    res.json({ message: "Account activated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token", error });
  }
};
