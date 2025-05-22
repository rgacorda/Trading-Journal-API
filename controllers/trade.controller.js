const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const { Trade } = require('../models');

// 1. Multer storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `upload-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// 2. Parse Excel/CSV based on platform
const parseFile = (filePath, platform) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { range: 1 }); // start from row 2

  const today = new Date().toISOString().split('T')[0];

  if (platform === 'tz_pro') {
    return rows.map((row) => ({
      ticker: row['Symbol/Contract'],
      side: row['Action']?.toLowerCase(),
      quantity: parseInt(row['Shares In']),
      entry: parseFloat(row['Price In']),
      exit: parseFloat(row['Price Out']),
      account: row['Account'],
      realized: parseFloat(row['Day Realized']),
      time: row['Updated'],
      date: today,
    }));
  }

  if (platform === 'tz_main') {
    return rows.map((row) => ({
      ticker: row['Ticker'] || row['Symbol'],
      side: row['Side']?.toLowerCase(),
      quantity: parseInt(row['Qty']),
      entry: parseFloat(row['Entry']),
      exit: parseFloat(row['Exit']),
      account: row['Account Name'],
      realized: parseFloat(row['Net PnL']),
      time: row['Trade Time'],
      date: today,
    }));
  }

  throw new Error('Unsupported platform');
};

// 3. Upload controller
const uploadController = async (req, res) => {
  const file = req.file;
  const platform = req.body.platform;

  if (!platform) return res.status(400).json({ error: 'Platform is required' });
  if (!file) return res.status(400).json({ error: 'File is required' });

  try {
    const trades = parseFile(file.path, platform);

    await Trade.bulkCreate(trades);

    res.status(200).json({ message: `${trades.length} trades uploaded successfully` });
  } catch (err) {
    console.error('Error parsing or saving trades:', err.message);
    res.status(500).json({ error: 'Failed to process file' });
  } finally {
    // Delete file regardless of success or failure
    try {
      fs.unlinkSync(file.path);
    } catch (fsErr) {
      console.error('Error deleting uploaded file:', fsErr.message);
    }
  }
};

module.exports = {
  upload,
  uploadController,
};
