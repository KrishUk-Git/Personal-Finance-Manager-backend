const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { exportTransactionsCSV } = require('../controllers/reportController');

router.get('/export/csv', auth, exportTransactionsCSV);

module.exports = router;

