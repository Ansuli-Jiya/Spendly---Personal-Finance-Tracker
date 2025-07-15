const Transaction = require('../models/Transaction');

exports.getAllTransactions = async (req, res, userId) => {
  try {
    const transactions = await Transaction.find({ user: userId });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTransaction = async (req, res, userId) => {
  try {
    const { amount, type, category, date, note } = req.body;
    const transaction = new Transaction({ user: userId, amount, type, category, date, note });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 