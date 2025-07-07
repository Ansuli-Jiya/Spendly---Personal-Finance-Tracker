const express = require('express');
const router = express.Router();
const Investment = require('../models/Investment');
const auth = require('../middleware/auth');

// Helper: Calculate interest based on type
function calculateInterest(inv) {
  const principal = inv.quantity * inv.purchasePrice;
  const now = new Date();
  const years = (now - new Date(inv.purchaseDate)) / (1000 * 60 * 60 * 24 * 365.25);
  if (inv.type === 'stock' || inv.type === 'etf') {
    return 0;
  } else if (inv.type === 'mutual_fund') {
    if (inv.rateOfInterest) {
      return (principal * inv.rateOfInterest * years / 100).toFixed(2);
    } else {
      return 0;
    }
  } else if (inv.type === 'bond') {
    if (inv.rateOfInterest) {
      return (principal * inv.rateOfInterest * years / 100).toFixed(2);
    } else {
      return 0;
    }
  }
  return 0;
}

// Get all investments
router.get('/', auth.protect, async (req, res) => {
  try {
    const investments = await Investment.find();
    const withInterest = investments.map(inv => ({
      ...inv.toObject(),
      interestAmount: calculateInterest(inv)
    }));
    res.json(withInterest);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add investment
router.post('/', auth.protect, async (req, res) => {
  try {
    const investment = new Investment(req.body);
    await investment.save();
    const withInterest = {
      ...investment.toObject(),
      interestAmount: calculateInterest(investment)
    };
    res.status(201).json(withInterest);
  } catch (err) {
    res.status(400).json({ message: 'Error adding investment', error: err.message });
  }
});

// Delete investment
router.delete('/:id', auth.protect, async (req, res) => {
  try {
    await Investment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Investment deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting investment', error: err.message });
  }
});

module.exports = router; 