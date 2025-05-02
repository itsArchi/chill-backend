exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  return res.status(200).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    path: `/src/uploads/${req.file.filename}`,
  });
};
