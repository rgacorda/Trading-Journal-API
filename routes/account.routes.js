const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.get('/', accountController.getAllAccount);
router.get('/:id', accountController.getAccount);
router.post('/', accountController.createAccount);
router.put('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);

module.exports = router;