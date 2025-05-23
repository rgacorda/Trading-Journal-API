const express = require('express');
const router = express.Router();
const mistakeController = require('../controllers/mistake.controller');

router.get('/', mistakeController.getAllMistakes);
router.get('/:id', mistakeController.getMistake);
router.post('/', mistakeController.createMistake);
router.put('/:id', mistakeController.updateMistake);
router.delete('/:id', mistakeController.deleteMistake);

module.exports = router;