const multer = require("multer");
const path = require("path");
const fs = require("fs");

const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `public/uploads/${folder}`;
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

// Images only (jpeg, jpg, png, webp) — for products and profiles
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValid) cb(null, true);
  else cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"));
};

// Images + PDF — for verification documents
const docFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValid) cb(null, true);
  else cb(new Error("Only images and PDF files are allowed"));
};

const uploadProduct = multer({
  storage: makeStorage("products"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const uploadProfile = multer({
  storage: makeStorage("profiles"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

// NEW: for seller verification documents
const uploadVerification = multer({
  storage: makeStorage("verification"),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  fileFilter: docFilter,
});

// Keep default export so existing product routes don't break
module.exports = uploadProduct;
module.exports.uploadProduct = uploadProduct;
module.exports.uploadProfile = uploadProfile;
module.exports.uploadVerification = uploadVerification; // NEW