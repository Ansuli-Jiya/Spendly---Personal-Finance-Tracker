const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['stocks', 'mutual_fund', 'etf', 'bond'], required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  purchaseDate: { type: Date, required: true },
  rateOfInterest: { type: Number, required: false },
  notes: { type: String }
});

module.exports = mongoose.model('Investment', InvestmentSchema); 