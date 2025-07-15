const express = require('express');
const { getAllBudgets, createBudget } = require('../controllers/budgetController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, (req, res) => getAllBudgets(req, res, req.user));
router.post('/', auth, (req, res) => createBudget(req, res, req.user));

module.exports = router; 