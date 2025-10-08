const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.get('/', verifyToken, userController.getUser);
router.put('/', verifyToken, userController.updateUser);
router.put('/change-password', verifyToken, userController.changePassword);
router.delete('/', verifyToken, userController.deleteAccount);

module.exports = router;