const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { exportTransactionsCSV, exportTransactionsPDF, getBudgetReport, getIncomeReport } = require('../controllers/reportController');

router.get('/export/csv', auth, exportTransactionsCSV);
router.get('/export/pdf', auth, exportTransactionsPDF);
router.get('/budget-variance', auth, getBudgetReport);
router.get('/income-summary', auth, getIncomeReport);

module.exports = router;

