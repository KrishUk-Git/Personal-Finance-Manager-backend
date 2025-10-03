const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    period: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    startDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Budget', BudgetSchema);