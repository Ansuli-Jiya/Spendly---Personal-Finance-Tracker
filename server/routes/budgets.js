const express = require('express');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id })
      .sort({ month: -1 });

    res.json(budgets);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Make sure user owns budget
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(budget);
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category,
      month
    });

    if (existingBudget) {
      return res.status(400).json({ message: 'Budget already exists for this category and month' });
    }

    const budget = await Budget.create({
      user: req.user.id,
      category,
      amount,
      month
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Make sure user owns budget
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(budget);
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Make sure user owns budget
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await budget.deleteOne();

    res.json({ message: 'Budget removed' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update budget spent amount based on transactions
// @route   PUT /api/budgets/:id/update-spent
// @access  Private
router.put('/:id/update-spent', protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Make sure user owns budget
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Calculate total spent for this category in this month
    const startDate = new Date(budget.month + '-01');
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const totalSpent = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          category: budget.category,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    budget.spent = totalSpent.length > 0 ? totalSpent[0].total : 0;
    await budget.save();

    res.json(budget);
  } catch (error) {
    console.error('Update budget spent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 