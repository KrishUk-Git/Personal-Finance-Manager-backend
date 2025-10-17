const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getRecurringTransactions, addRecurringTransaction, deleteRecurringTransaction } = require('../controllers/recurringTransactionController');

router.route('/').get(auth, getRecurringTransactions).post(auth, addRecurringTransaction);
router.route('/:id').delete(auth, deleteRecurringTransaction);

module.exports = router;

