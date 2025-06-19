const express = require('express');
const router = express.Router();
const { upload, uploadController } = require('../controllers/import.controller');
const tradeController = require('../controllers/trade.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/upload', verifyToken, upload.single('file'), uploadController);
router.post('/', tradeController.createTrade);
router.get('/', tradeController.getAllTrades);
router.get('/:id', tradeController.getTrade);
router.put('/:id', tradeController.updateTrade);
router.delete('/:id', tradeController.deleteTrade);

module.exports = router;