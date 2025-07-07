# 📊 Spendly - Personal Finance Tracker

A full-stack personal finance tracker built with the MERN stack (MongoDB, Express, React, Node.js), featuring beautiful charts, user authentication, and comprehensive expense management.

## 🚀 Features

- **User Authentication** - Secure login and registration with JWT
- **Transaction Management** - Add, edit, delete income and expenses
- **Category-based Tracking** - Organize transactions by categories
- **Real-time Charts** - Visualize spending patterns with Chart.js
- **Budget Goals** - Set and track monthly budget limits
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Recurring Transactions** - Set up automatic recurring expenses
- **Data Visualization** - Pie charts and bar graphs for insights

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd expense_tracker
```

### 2. Install dependencies

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd ../server
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/spendly
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
JWT_EXPIRE=30d
```

### 4. Start the application

**Start the backend:**
```bash
cd server
npm run dev
```

**Start the frontend (in a new terminal):**
```bash
cd client
npm run dev
```

## 🌐 Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/category/:category` - Get by category
- `GET /api/transactions/type/:type` - Get by type

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `PUT /api/budgets/:id/update-spent` - Update spent amount

## 🎯 Usage

1. **Register/Login** - Create an account or sign in
2. **Add Transactions** - Log your income and expenses
3. **Set Budgets** - Define monthly spending limits
4. **View Analytics** - Check charts and insights
5. **Track Progress** - Monitor your financial goals

## 🔧 Development

### Project Structure
```
expense_tracker/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   └── ...
│   └── ...
├── server/                 # Backend Node.js app
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── ...
└── README.md
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the server folder
3. Update frontend API URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by modern expense tracking apps
- Built with the MERN stack
- Uses Chart.js for data visualization
- Styled with Tailwind CSS

---

**Happy coding! 💰📊** 