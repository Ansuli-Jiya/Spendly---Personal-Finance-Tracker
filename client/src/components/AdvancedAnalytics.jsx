import { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js'
import { Pie, Bar, Line } from 'react-chartjs-2'
import axios from 'axios'
import { useTheme } from '../context/ThemeContext'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement)

const BASE_URL = import.meta.env.VITE_API_URL || '';

const AdvancedAnalytics = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const { darkMode } = useTheme()

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTransactions(response.data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredTransactions = () => {
    const now = new Date()
    const filtered = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      switch (timeRange) {
        case 'week':
          return transactionDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        case 'month':
          return transactionDate >= new Date(now.getFullYear(), now.getMonth(), 1)
        case 'quarter':
          return transactionDate >= new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        case 'year':
          return transactionDate >= new Date(now.getFullYear(), 0, 1)
        default:
          return true
      }
    })
    return filtered
  }

  const getAnalytics = () => {
    const filtered = getFilteredTransactions()
    const expenses = filtered.filter(t => t.type === 'expense')
    const incomes = filtered.filter(t => t.type === 'income')

    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0)
    const balance = totalIncome - totalExpenses

    // Category breakdown
    const categoryData = {}
    expenses.forEach(t => {
      categoryData[t.category] = (categoryData[t.category] || 0) + t.amount
    })

    // Monthly trend
    const monthlyData = {}
    filtered.forEach(t => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short' })
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 }
      }
      if (t.type === 'income') {
        monthlyData[month].income += t.amount
      } else {
        monthlyData[month].expense += t.amount
      }
    })

    // Top spending categories
    const topCategories = Object.entries(categoryData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)

    return {
      totalExpenses,
      totalIncome,
      balance,
      categoryData,
      monthlyData,
      topCategories,
      transactionCount: filtered.length,
      avgTransaction: filtered.length > 0 ? (totalExpenses + totalIncome) / filtered.length : 0
    }
  }

  const analytics = getAnalytics()

  const pieData = {
    labels: Object.keys(analytics.categoryData),
    datasets: [{
      data: Object.values(analytics.categoryData),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
      ]
    }]
  }

  const lineData = {
    labels: Object.keys(analytics.monthlyData),
    datasets: [
      {
        label: 'Income',
        data: Object.values(analytics.monthlyData).map(d => d.income),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1
      },
      {
        label: 'Expenses',
        data: Object.values(analytics.monthlyData).map(d => d.expense),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1
      }
    ]
  }

  const barData = {
    labels: analytics.topCategories.map(([category]) => category),
    datasets: [{
      label: 'Amount Spent',
      data: analytics.topCategories.map(([, amount]) => amount),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  }

  const legendLabelColor = darkMode ? '#9CA3AF' : '#374151'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white`}>Advanced Analytics</h1>
          <p className={`text-sm sm:text-base text-gray-700 dark:text-[#9CA3AF]`}>Financial data insights</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-field w-auto"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-[#9CA3AF]">Total Income</p>
            <p className="text-2xl font-bold text-success-600">
              ₹{analytics.totalIncome.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-[#9CA3AF]">Total Expenses</p>
            <p className="text-2xl font-bold text-danger-600">
              ₹{analytics.totalExpenses.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-[#9CA3AF]">Net Balance</p>
            <p className={`text-2xl font-bold ${analytics.balance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              ₹{analytics.balance.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-[#9CA3AF]">Avg Transaction</p>
            <p className="text-2xl font-bold text-primary-600">
              ₹{analytics.avgTransaction.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
          <div className="h-64">
            <Pie data={pieData} options={{
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

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Spending Categories</h3>
          <div className="h-64">
            <Bar 
              data={barData} 
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
                    }
                  },
                  x: {
                    ticks: {
                      color: legendLabelColor
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Income vs Expenses Trend</h3>
        <div className="h-64">
          <Line 
            data={lineData} 
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
                  }
                },
                x: {
                  ticks: {
                    color: legendLabelColor
                  }
                }
              }
            }} 
          />
        </div>
      </div>

      {/* Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Insights</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#1F2937] rounded-lg">
            <span className="font-medium text-gray-900 dark:text-white">Savings Rate</span>
            <span className={`font-bold ${analytics.totalIncome > 0 ? 'text-success-600' : 'text-[#9CA3AF] dark:text-[#9CA3AF]'}`}>
              {analytics.totalIncome > 0 ? ((analytics.balance / analytics.totalIncome) * 100).toFixed(1) : 0}%
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#1F2937] rounded-lg">
            <span className="font-medium text-gray-900 dark:text-white">Total Transactions</span>
            <span className="font-bold text-primary-600">{analytics.transactionCount}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#1F2937] rounded-lg">
            <span className="font-medium text-gray-900 dark:text-white">Biggest Expense Category</span>
            <span className="font-bold text-danger-600">
              {analytics.topCategories.length > 0 ? analytics.topCategories[0][0] : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedAnalytics 