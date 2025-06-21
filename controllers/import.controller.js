const multer = require("multer");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const { Trade } = require("../models");

// 1. Multer storage engine with file filtering
const storage = multer.diskStorage({
  destination: "./uploads/trades",
  filename: (req, file, cb) => {
    cb(null, `upload-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isCsv =
      file.mimetype === "text/csv" || file.originalname.endsWith(".csv");
    const isExcel = file.originalname.endsWith(".xls"); // Changed to .xls only

    if (isCsv || isExcel) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV or Excel (.xls) files are allowed"), false);
    }
  },
});

// 2. Parse Excel/CSV based on platform
const parseFile = (filePath, platform, id) => {
  const workbook = xlsx.readFile(filePath);

  // Get the first sheet (index 0)
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert to JSON with header row
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Find header row (first non-empty row)
  const headerRow = rows.find((row) => row.length > 0);

  // Get data rows (skip header)
  const dataRows = rows.slice(rows.findIndex((row) => row.length > 0) + 1);

  const today = new Date().toISOString().split("T")[0];

  if (platform === "tz_pro") {
    return dataRows
      .map((row) => {
        // Create an object by mapping header names to row values
        const rowObj = {};
        headerRow.forEach((header, index) => {
          rowObj[header] = row[index];
        });

        return {
          ticker: rowObj["Symbol/Contract"] || rowObj["Symbol"] || "",
          side: (rowObj["Action"] || "").toLowerCase(),
          quantity: parseInt(rowObj["Shares In"] || "0"),
          entry: parseFloat(rowObj["Price In"] || "0"),
          exit: parseFloat(rowObj["Price Out"] || "0"),
          account: rowObj["Account"] || "",
          realized: parseFloat(rowObj["Day Realized"] || "0"),
          time: rowObj["Updated"] || "",
          date: new Date(`${today}T${rowObj["Updated"] || ""}`),
          userId: id,
        };
      })
      .filter((trade) => trade.ticker); // Filter out empty rows
  }

  if (platform === "tz_main") {
    return rows.map((row) => ({
      ticker: row["Ticker"] || row["Symbol"],
      side: row["Side"]?.toLowerCase(),
      quantity: parseInt(row["Qty"]),
      entry: parseFloat(row["Entry"]),
      exit: parseFloat(row["Exit"]),
      account: row["Account Name"],
      realized: parseFloat(row["Net PnL"]),
      time: row["Trade Time"],
      date: today,
    }));
  }

  throw new Error("Unsupported platform");
};

// 3. Upload controller
const uploadController = async (req, res) => {
  const file = req.file;
  const platform = req.body.platform;
  const user = req.user.id;

  if (!platform) return res.status(400).json({ error: "Platform is required" });
  if (!file) return res.status(400).json({ error: "File is required" });

  try {
    const trades = parseFile(file.path, platform, user);

    await Trade.bulkCreate(trades);

    res
      .status(200)
      .json({ message: `${trades.length} trades uploaded successfully` });
  } catch (err) {
    console.error("Error parsing or saving trades:", err.message);
    res.status(500).json({ error: "Failed to process file" });
  } finally {
    // Delete file regardless of success or failure
    try {
      fs.unlinkSync(file.path);
    } catch (fsErr) {
      console.error("Error deleting uploaded file:", fsErr.message);
    }
  }
};

module.exports = {
  upload,
  uploadController,
};
