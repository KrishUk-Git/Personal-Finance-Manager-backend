const Transaction = require('../models/Transaction');
const RecurringTransaction = require('../models/RecurringTransaction');
const moment = require('moment');

const generateRecurringTransactions = async (userId) => {
    const today = moment();
    const recurringItems = await RecurringTransaction.find({ user: userId });
    for (const item of recurringItems) {
        let lastCreated = moment(item.lastCreatedDate || item.startDate);
        while (lastCreated.add(1, 'months').isSameOrBefore(today)) {
            const newTransaction = new Transaction({
                user: userId,
                description: item.description + ' (Recurring)',
                amount: item.amount,
                type: item.type,
                category: item.category,
                date: lastCreated.toDate(),
            });
            await newTransaction.save();
            item.lastCreatedDate = lastCreated.toDate();
            await item.save();
        }
    }
};

exports.getTransactions = async (req, res) => {
  try {
    await generateRecurringTransactions(req.user.id);
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addTransaction = async (req, res) => {
  const { description, amount, type, category, date } = req.body;
  try {
    const newTransaction = new Transaction({ user: req.user.id, description, amount, type, category, date });
    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });
    if (transaction.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Transaction removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

