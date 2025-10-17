const RecurringTransaction = require('../models/RecurringTransaction');

exports.getRecurringTransactions = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.find({ user: req.user.id });
    res.json(recurring);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
//
exports.addRecurringTransaction = async (req, res) => {
  const { description, amount, type, category, startDate } = req.body;
  try {
    const newRecurring = new RecurringTransaction({ user: req.user.id, description, amount, type, category, startDate });
    const recurring = await newRecurring.save();
    res.json(recurring);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteRecurringTransaction = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.findById(req.params.id);
    if (!recurring || recurring.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await RecurringTransaction.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Recurring transaction removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

