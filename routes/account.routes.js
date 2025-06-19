const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.get('/', verifyToken, accountController.getAllAccount);
router.get('/:id', verifyToken, accountController.getAccount);
router.post('/', verifyToken, accountController.createAccount);
router.put('/:id', verifyToken, accountController.updateAccount);
router.delete('/:id', verifyToken, accountController.deleteAccount);

module.exports = router;