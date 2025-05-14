const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
// router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
