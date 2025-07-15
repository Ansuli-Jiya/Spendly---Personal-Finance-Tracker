const express = require('express');
const { register, login, getProfile, updateProfile } = require('../controllers/userController');
const router = express.Router();
const auth = require('../middleware/auth'); // or your auth middleware

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router; 