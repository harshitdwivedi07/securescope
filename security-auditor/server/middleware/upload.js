const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [
    ".js", ".ts", ".jsx", ".tsx", ".py", ".php",
    ".java", ".go", ".rb", ".cs", ".cpp", ".c",
    ".sql", ".sh", ".bash", ".yaml", ".yml", ".env"
  ];
  const ext = "." + file.originalname.split(".").pop().toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
});

module.exports = upload;
