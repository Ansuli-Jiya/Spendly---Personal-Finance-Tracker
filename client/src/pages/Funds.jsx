import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const Funds = () => {
  const { darkMode } = useTheme();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'stock',
    symbol: '',
    quantity: '',
    purchasePrice: '',
    purchaseDate: '',
    rateOfInterest: '',
    notes: ''
  });

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/investments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvestments(response.data);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/investments`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        name: '',
        type: 'stock',
        symbol: '',
        quantity: '',
        purchasePrice: '',
        purchaseDate: '',
        rateOfInterest: '',
        notes: ''
      });
      setShowAddForm(false);
      fetchInvestments();
    } catch (error) {
      console.error('Error adding investment:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this investment?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/investments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInvestments();
    } catch (error) {
      console.error('Error deleting investment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center slide-up">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Funds & Stocks</h1>
          <p className="text-gray-700 dark:text-gray-300">Track your investment portfolio</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Investment
        </button>
      </div>

      {/* Add Investment Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-8 border border-gray-200 w-96 shadow-2xl rounded-2xl bg-white">
            <div className="mt-3">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">➕</span>
                Add Investment
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="stock">Stock</option>
                    <option value="mutual_fund">Mutual Fund</option>
                    <option value="etf">ETF</option>
                    <option value="bond">Bond</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                  <input
                    type="text"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate of Interest (%)</label>
                  <input
                    type="number"
                    value={formData.rateOfInterest}
                    onChange={(e) => setFormData({ ...formData, rateOfInterest: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Add Investment
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

      {/* Portfolio Table */}
      <div className="card-glass slide-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <span className="mr-2">📈</span>
          Your Portfolio
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (%)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {investments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">No investments yet.</td>
                </tr>
              ) : (
                investments.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{inv.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{inv.type}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{inv.symbol}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{inv.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">₹{inv.purchasePrice}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{inv.purchaseDate ? new Date(inv.purchaseDate).toLocaleDateString() : ''}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{inv.rateOfInterest || '-'}</td>
                    <td className="px-4 py-2 text-sm text-green-700 font-bold">{inv.interestAmount || '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{inv.notes}</td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        onClick={() => handleDelete(inv._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Funds; 