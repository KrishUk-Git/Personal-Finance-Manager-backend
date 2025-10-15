const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const moment = require('moment');

// Get all budgets for the user for a specific month
exports.getBudgets = async (req, res) => {
  try {
    const month = req.query.month || moment().format('YYYY-MM');
    const budgets = await Budget.find({ user: req.user.id, month });
    res.json(budgets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add or update a budget
exports.addBudget = async (req, res) => {
  const { category, amount, month } = req.body;

  try {
    // Upsert: find and update if exists, or create if it doesn't
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, category, month },
      { amount },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(budget);
  } catch (err)
  {
    console.error(err.message);
    if (err.code === 11000) {
        return res.status(400).json({ msg: 'Budget for this category and month already exists.' });
    }
    res.status(500).send('Server Error');
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ msg: 'Budget not found' });
    }

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

