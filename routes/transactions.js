const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

router.route('/')
    .get(auth, transactionController.getTransactions)
    .post(auth, transactionController.addTransaction);

router.route('/:id')
    .delete(auth, transactionController.deleteTransaction);

module.exports = router;