const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.filename + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const typeImage = ["image/png", "image/jpg", "image/jpeg"];
  if (typeImage.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg and .png formats are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;