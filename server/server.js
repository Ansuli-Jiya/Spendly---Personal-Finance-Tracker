const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set JWT_SECRET if not in .env
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'supersecretkey1234567890!@#$%^&*()';
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// console.log('JWT_SECRET:', process.env.JWT_SECRET); // Removed for security
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/spendly', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/investments', require('./routes/investments'));
app.use('/api/documents', require('./routes/documents'));

// Test route to check if server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Spendly API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000
;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 