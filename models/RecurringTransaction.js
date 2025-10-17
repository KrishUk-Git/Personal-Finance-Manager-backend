const mongoose = require('mongoose');

const RecurringTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    default: 'monthly',
  },
  startDate: {
    type: Date,
    required: true,
  },
  lastCreatedDate: {
      type: Date,
  }
});

module.exports = mongoose.model('recurringTransaction', RecurringTransactionSchema);

