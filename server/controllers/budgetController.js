const Budget = require('../models/Budget');

exports.getAllBudgets = async (req, res, userId) => {
  try {
    const budgets = await Budget.find({ user: userId });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createBudget = async (req, res, userId) => {
  try {
    const { amount, category, startDate, endDate } = req.body;
    const budget = new Budget({ user: userId, amount, category, startDate, endDate });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 