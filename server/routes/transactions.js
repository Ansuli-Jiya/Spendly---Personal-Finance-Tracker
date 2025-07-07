const express = require('express');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    console.log('Getting transactions for user:', req.user ? req.user._id : 'null');
    console.log('req.user.id:', req.user ? req.user.id : 'null');
    
    if (!req.user || !req.user.id) {
      console.log('req.user is null or missing id');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { type, category, amount, description, date, isRecurring, recurringInterval } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      category,
      amount,
      description,
      date: date || new Date(),
      isRecurring,
      recurringInterval
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(transaction);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();

    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get transactions by category
// @route   GET /api/transactions/category/:category
// @access  Private
router.get('/category/:category', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
      category: req.params.category
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get transactions by type
// @route   GET /api/transactions/type/:type
// @access  Private
router.get('/type/:type', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
      type: req.params.type
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions by type error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 