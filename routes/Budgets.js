const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getBudgets,
  addBudget,
  deleteBudget,
} = require('../controllers/budgetController');

// @route   GET /api/budgets
// @desc    Get all budgets for a user for a specific month
router.get('/', auth, getBudgets);

// @route   POST /api/budgets
// @desc    Add or update a budget
router.post('/', auth, addBudget);

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget
router.delete('/:id', auth, deleteBudget);

module.exports = router;
