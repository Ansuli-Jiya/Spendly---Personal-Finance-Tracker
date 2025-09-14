import { useState, useEffect } from 'react'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '';

const RecurringTransactions = () => {
  const [recurringTransactions, setRecurringTransactions] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    note: '',
    isRecurring: true,
    recurringInterval: 'monthly',
    nextDueDate: new Date().toISOString().split('T')[0]
  })

  const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  }

  const intervals = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ]

  useEffect(() => {
    fetchRecurringTransactions()
  }, [])

  const fetchRecurringTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const recurring = response.data.filter(t => t.isRecurring)
      setRecurringTransactions(recurring)
    } catch (error) {
      console.error('Error fetching recurring transactions:', error)
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
        note: '',
        isRecurring: true,
        recurringInterval: 'monthly',
        nextDueDate: new Date().toISOString().split('T')[0]
      })
      setShowAddForm(false)
      fetchRecurringTransactions()
    } catch (error) {
      console.error('Error adding recurring transaction:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${BASE_URL}/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchRecurringTransactions()
    } catch (error) {
      console.error('Error deleting recurring transaction:', error)
    }
  }

  const getNextDueDate = (transaction) => {
    const lastDate = new Date(transaction.date)
    const interval = transaction.recurringInterval
    
    let nextDate = new Date(lastDate)
    switch (interval) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1)
        break
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7)
        break
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1)
        break
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1)
        break
      default:
        nextDate.setMonth(nextDate.getMonth() + 1)
    }
    
    return nextDate.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white`}>Recurring Transactions</h1>
          <p className={`text-sm sm:text-base text-gray-700 dark:text-[#9CA3AF]`}>Recurring payments overview</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          Add Recurring Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recurringTransactions.map((transaction) => (
          <div key={transaction._id} className="card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{transaction.note}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.category}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                transaction.type === 'income' 
                  ? 'bg-success-100 text-success-800' 
                  : 'bg-danger-100 text-danger-800'
              }`}>
                {transaction.type}
              </span>
            </div>
            
            <div className="space-y-2">
              <p className={`text-lg font-bold ${
                transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
              }`}>
                ₹{transaction.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Repeats: {intervals.find(i => i.value === transaction.recurringInterval)?.label}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Next due: {getNextDueDate(transaction)}
              </p>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleDelete(transaction._id)}
                className="btn-danger text-sm flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Recurring Transaction</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
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
                  <label className="block text-sm font-medium text-gray-700">Category</label>
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
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
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
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="input-field"
                    placeholder="Enter description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Recurring Interval</label>
                  <select
                    name="recurringInterval"
                    value={formData.recurringInterval}
                    onChange={(e) => setFormData({...formData, recurringInterval: e.target.value})}
                    className="input-field"
                    required
                  >
                    {intervals.map(interval => (
                      <option key={interval.value} value={interval.value}>{interval.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="nextDueDate"
                    value={formData.nextDueDate}
                    onChange={(e) => setFormData({...formData, nextDueDate: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Add Recurring Transaction
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

export default RecurringTransactions 