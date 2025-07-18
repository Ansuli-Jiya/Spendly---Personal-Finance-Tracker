# 💸 Spendly – Personal Finance Tracker

A full-stack personal finance tracking web app to manage income, expenses, and gain insights into your spending habits.

🔗 **Live Demo**: [Spendly](https://polite-paletas-d937ce.netlify.app/)  
📦 **GitHub**: [Repository](https://github.com/Ansuli-Jiya/Spendly---Personal-Finance-Tracker)

---

## 🚀 Features
- 🔐 JWT-based secure login
- 📊 Track income & expenses
- 📂 Categorize transactions
- 📅 Filter by date range
- 📈 Clean dashboard visualizations

---

## 🛠 Tech Stack

**Frontend**: React.js, Redux, Tailwind CSS  
**Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT

---

## ⚙️ Quick Setup

```bash
git clone https://github.com/Ansuli-Jiya/Spendly---Personal-Finance-Tracker.git
cd Spendly---Personal-Finance-Tracker

# Setup client
cd client && npm install

# Setup server
cd ../server && npm install

# Add .env file in /server with:
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret
PORT=5000

# Run app
npm start (in both /client and /server)
