const express = require('express');
const router = express.Router();
const planController = require('../controllers/plan.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.get('/', verifyToken, planController.getAllPlans);
router.get('/:id', verifyToken, planController.getPlan);
router.post('/', verifyToken, planController.createPlan);
router.put('/:id', verifyToken, planController.updatePlan);
router.delete('/:id', verifyToken, planController.deletePlan);

module.exports = router;