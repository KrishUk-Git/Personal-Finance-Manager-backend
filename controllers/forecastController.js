const Transaction = require('../models/Transaction');
const moment = require('moment');

exports.getForecast = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: 'asc' });
    if (transactions.length < 2) {
      return res.json({ forecast: [], message: 'Not enough data for a forecast.' });
    }
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    let currentBalance = totalIncome - totalExpense;
    const firstDate = moment(transactions[0].date);
    const lastDate = moment(transactions[transactions.length - 1].date);
    const monthsOfData = lastDate.diff(firstDate, 'months', true);
    if (monthsOfData < 1) {
        return res.json({ forecast: [], message: 'Transaction data must span at least one month.' });
    }
    const netChangePerMonth = (totalIncome - totalExpense) / monthsOfData;
    const forecast = [];
    let projectedBalance = currentBalance;
    for (let i = 1; i <= 6; i++) {
        const futureDate = moment().add(i, 'months');
        projectedBalance += netChangePerMonth;
        forecast.push({
            month: futureDate.format('MMMM YYYY'),
            projectedBalance: projectedBalance.toFixed(2),
        });
    }
    res.json({ forecast });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

