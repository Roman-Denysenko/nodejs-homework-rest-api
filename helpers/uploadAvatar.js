const multer = require("multer");
const path = require("path");
require("dotenv").config();
const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limit: { fieldSize: 2000000 }, //limit downloads files
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("image")) {
      cb(null, true);
      return;
    }
    cb(null, false);
    cb(new Error("I don't have a clue!"));
  },
});

module.exports = upload;
