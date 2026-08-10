const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
    "application/rtf",
  ];

  if (
    allowedTypes.includes(file.mimetype) ||
    /\.(pdf|doc|docx|txt|md|rtf)$/i.test(file.originalname)
  ) {
    cb(null, true);
    return;
  }

  cb(
    new Error("Only PDF, DOC, DOCX, TXT, MD, or RTF files are allowed"),
    false,
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
