import { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import axios from 'axios'
import { useTheme } from '../context/ThemeContext'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const BASE_URL = import.meta.env.VITE_API_URL || '';

const Dashboard = () => {
  const { darkMode } = useTheme()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTransactions(response.data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${BASE_URL}/api/transactions`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
      setShowAddForm(false)
      fetchTransactions()
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${BASE_URL}/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTransactions()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const expenses = transactions.filter(t => t.type === 'expense')
  const incomes = transactions.filter(t => t.type === 'income')
  
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  // Chart data for expenses by category
  const expenseData = {
    labels: categories.expense,
    datasets: [{
      data: categories.expense.map(cat => 
        expenses.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
      ),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'
      ]
    }]
  }

  // Chart data for monthly overview
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [1200, 1900, 3000, 5000, 2000, 3000],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      },
      {
        label: 'Expenses',
        data: [800, 1600, 2800, 4200, 1800, 2500],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }
    ]
  }

  const legendLabelColor = darkMode ? '#9CA3AF' : '#374151';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 slide-up">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white`}>Dashboard</h1>
          <p className={`text-sm sm:text-base text-gray-700 dark:text-[#9CA3AF]`}>Track your finances with ease</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center justify-center sm:justify-start w-full sm:w-auto text-sm sm:text-base px-4 py-2 sm:py-2"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div className="stat-card bounce-in p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-green-100">
              <span className="text-2xl sm:text-3xl font-bold text-green-600">₹</span>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className={`text-xs sm:text-sm font-medium text-gray-700 dark:text-[#9CA3AF]`}>Total Income</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white`}>₹{totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="stat-card bounce-in p-4 sm:p-6" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-100">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14l3-3 3 3 4-4" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className={`text-xs sm:text-sm font-medium text-gray-700 dark:text-[#9CA3AF]`}>Total Expenses</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white`}>₹{totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="stat-card bounce-in p-4 sm:p-6" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-100">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className={`text-xs sm:text-sm font-medium text-gray-700 dark:text-[#9CA3AF]`}>Balance</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white`}>
                ₹{balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="chart-container slide-up p-4 sm:p-6">
          <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center text-gray-900 dark:text-white`}>
            <span className="mr-2">��</span>
            Expenses by Category
          </h3>
          <div className="h-48 sm:h-64">
            <Pie data={expenseData} options={{ 
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: legendLabelColor,
                    font: { size: 12 }
                  }
                }
              }
            }} />
          </div>
        </div>

        <div className="chart-container slide-up p-4 sm:p-6" style={{animationDelay: '0.1s'}}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-2">📈</span>
            Monthly Overview
          </h3>
          <div className="h-64">
            <Bar 
              data={monthlyData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: legendLabelColor,
                      font: { size: 12 }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: legendLabelColor
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)'
                    }
                  },
                  x: {
                    ticks: {
                      color: legendLabelColor
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card-glass slide-up" style={{animationDelay: '0.2s'}}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <span className="mr-2">📋</span>
          {showAllTransactions ? `All Transactions (${transactions.length})` : 'Recent Transactions'}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, showAllTransactions ? undefined : 10)
                .map((transaction) => (
                <tr key={transaction._id} className="transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-success-100 text-success-600 border border-success-200' 
                        : 'bg-danger-100 text-danger-600 border border-danger-200'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                    transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    ₹{transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-danger-600 hover:text-danger-700 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* More/Less Button */}
        {transactions.length > 10 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className="btn-secondary flex items-center justify-center mx-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showAllTransactions ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
              {showAllTransactions ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-8 border border-gray-200 w-96 shadow-2xl rounded-2xl bg-white">
            <div className="mt-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-2">➕</span>
                Add Transaction
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="input-field"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select category</option>
                    {categories[formData.type].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="input-field"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="input-field"
                    placeholder="Enter description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Add Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 