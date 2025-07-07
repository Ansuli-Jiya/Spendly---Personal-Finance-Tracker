const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount cannot be negative']
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
    format: 'YYYY-MM'
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
budgetSchema.index({ user: 1, month: 1 });
budgetSchema.index({ user: 1, category: 1 });

// Virtual for remaining budget
budgetSchema.virtual('remaining').get(function() {
  return this.amount - this.spent;
});

// Virtual for percentage used
budgetSchema.virtual('percentageUsed').get(function() {
  return this.amount > 0 ? (this.spent / this.amount) * 100 : 0;
});

module.exports = mongoose.model('Budget', budgetSchema); 