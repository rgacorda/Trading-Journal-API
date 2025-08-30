const express = require('express');
const router = express.Router();
const planController = require('../controllers/plan.controller');
const verifyToken = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', verifyToken, planController.getAllPlans);
router.get('/:id', verifyToken, planController.getPlan);
router.post('/', verifyToken, roleMiddleware('create:plan'), planController.createPlan);
router.put('/:id', verifyToken, roleMiddleware('update:plan'), planController.updatePlan);
router.delete('/:id', verifyToken, roleMiddleware('delete:plan'),planController.deletePlan);

module.exports = router;