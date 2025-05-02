const router = require('express').Router();
const user = require('../controllers/user.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
router.get('/data', isAuthenticated, authorize('read:data'), user.getData);
module.exports = router;