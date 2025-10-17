const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { Parser } = require('json2csv');
const moment = require('moment');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');

exports.getBudgetReport = async (req, res) => {
    try {
        const month = req.query.month || moment().format('YYYY-MM');
        const budgets = await Budget.find({ user: req.user.id, month }).lean();
        const transactions = await Transaction.find({ user: req.user.id, type: 'expense' });
        const report = budgets.map(budget => {
            const actualSpending = transactions
                .filter(t => t.category === budget.category && moment(t.date).format('YYYY-MM') === month)
                .reduce((acc, t) => acc + t.amount, 0);
            return { ...budget, actualSpending, variance: budget.amount - actualSpending };
        });
        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getIncomeReport = async (req, res) => {
    try {
        const incomeByCategory = await Transaction.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id), type: 'income' } },
            { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
            { $sort: { totalAmount: -1 } }
        ]);
        res.json(incomeByCategory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.exportTransactionsPDF = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        if (transactions.length === 0) return res.status(404).json({ msg: 'No transactions found.' });
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');
        doc.pipe(res);
        doc.fontSize(20).text('Transaction Report', { align: 'center' });
        doc.moveDown();
        transactions.forEach(t => {
            const color = t.type === 'income' ? 'green' : 'red';
            const sign = t.type === 'income' ? '+' : '-';
            doc.fontSize(12).fillColor(color).text(`${sign}$${t.amount.toFixed(2)}`, { continued: true }).fillColor('black').text(` - ${t.description} (${t.category}) on ${moment(t.date).format('ll')}`);
            doc.moveDown(0.5);
        });
        doc.end();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.exportTransactionsCSV = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).lean();
    if (transactions.length === 0) return res.status(404).json({ msg: 'No transactions found.' });
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

