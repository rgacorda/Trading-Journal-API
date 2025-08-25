const express = require('express');
const router = express.Router();
const { upload, uploadController } = require('../controllers/import.controller');
const tradeController = require('../controllers/trade.controller');
const verifyToken = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.post('/upload',verifyToken, roleMiddleware('create:import'), upload.single('file'), uploadController);
router.post('/', verifyToken, tradeController.createTrade);
router.get('/', verifyToken, tradeController.getAllTrades);
router.get('/:id',verifyToken, tradeController.getTrade);
router.put('/:id',verifyToken, tradeController.updateTrade);
router.delete('/delete',verifyToken, tradeController.deleteTrade);

module.exports = router;