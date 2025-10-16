const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  category: { type: String, default: 'General' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('transaction', TransactionSchema);

