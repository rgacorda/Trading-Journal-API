const router = require('express').Router();
const auth = require('../controllers/auth.controller');
router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.post('/forgot-password', auth.forgotPassword);
module.exports = router;