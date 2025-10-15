const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  // We'll focus on monthly budgets for now as they are most common
  month: {
    type: String, // Format: "YYYY-MM"
    required: true,
  },
});

// Ensure a user can only have one budget per category per month
BudgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('budget', BudgetSchema);
