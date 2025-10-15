const Transaction = require('../models/Transaction');
const { Parser } = require('json2csv');

// @desc    Export transactions to CSV
exports.exportTransactionsCSV = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).lean();
    
    if (transactions.length === 0) {
      return res.status(404).json({ msg: 'No transactions found to export.' });
    }

    const fields = ['type', 'category', 'amount', 'description', 'date'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(transactions);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
