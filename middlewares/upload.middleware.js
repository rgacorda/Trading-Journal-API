const multer = require("multer");

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const isCsv = file.mimetype === "text/csv" || file.originalname.endsWith(".csv");
    const isExcel = file.originalname.endsWith(".xlsx");

    if (isCsv || isExcel) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV or Excel (.xlsx) files are allowed"));
    }
  },
});

module.exports = upload;
