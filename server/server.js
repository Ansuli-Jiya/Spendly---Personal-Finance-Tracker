require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const connectDB = require("./config/db")


const app = express();

app.use(
  cors({
     origin: process.env.FRONTEND_URL || "*",
     methods: ["GET","POST","PUT","DELETE"],
     allowedHeaders:["Content-Type" , "Authorization"],
  })
);
app.use(express.json());

app.use('/api/users', require('./routes/user'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

