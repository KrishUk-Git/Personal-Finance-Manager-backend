const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getBudgets, addBudget, deleteBudget } = require('../controllers/budgetController');

router.route('/').get(auth, getBudgets).post(auth, addBudget);
router.route('/:id').delete(auth, deleteBudget);

module.exports = router;

