const express = require('express');
const router = express.Router();
const { upload, uploadController } = require('../controllers/trade.controller');

router.post('/upload', upload.single('file'), uploadController);

module.exports = router;
