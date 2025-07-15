const express = require('express');
const { getAllTransactions, createTransaction } = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, (req, res) => getAllTransactions(req, res, req.user));
router.post('/', auth, (req, res) => createTransaction(req, res, req.user));

module.exports = router; 