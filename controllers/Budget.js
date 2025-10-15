const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const moment = require('moment');

// Get all budgets for the logged-in user for a specific month
exports.getBudgets = async (req, res) => {
  try {
    const month = req.query.month || moment().format('YYYY-MM');
    const budgets = await Budget.find({ user: req.user.id, month: month });
    res.json(budgets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add a new budget
exports.addBudget = async (req, res) => {
  const { category, amount, month } = req.body;

  try {
    // Check if a budget for this category and month already exists
    let budget = await Budget.findOne({ user: req.user.id, category, month });

    if (budget) {
      // If it exists, update it
      budget.amount = amount;
    } else {
      // Otherwise, create a new one
      budget = new Budget({
        user: req.user.id,
        category,
        amount,
        month,
      });
    }
    
    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ msg: 'Budget not found' });

    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Budget.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Budget removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
