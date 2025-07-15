import { useState, useEffect } from 'react'
import axios from 'axios'
import { useTheme } from '../context/ThemeContext'

const BASE_URL = import.meta.env.VITE_API_URL || '';

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [passwordMode, setPasswordMode] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { darkMode, toggleDarkMode } = useTheme()
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [aboutOpen, setAboutOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data.user)
      setProfileData({
        name: response.data.user.name,
        email: response.data.user.email
      })
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${BASE_URL}/api/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setUser(response.data.user)
      setMessage('Profile updated successfully!')
      setEditMode(false)
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.put(`${BASE_URL}/api/auth/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage('Password changed successfully!')
      setPasswordMode(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white`}>Profile Settings</h1>
          <p className={`text-sm sm:text-base text-gray-700 dark:text-[#9CA3AF]`}>Manage your profile</p>
        </div>
      </div>

      {message && (
        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Profile Information */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-black dark:text-white">Personal Information</h3>
          <button
            onClick={() => setEditMode(!editMode)}
            className="btn-secondary"
          >
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-base font-bold text-black dark:text-white">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-base font-bold text-black dark:text-white">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="input-field"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-base font-bold text-black dark:text-white">Full Name</p>
              <p className="text-gray-900 dark:text-white">{user?.name}</p>
            </div>
            <div>
              <p className="text-base font-bold text-black dark:text-white">Email</p>
              <p className="text-gray-900 dark:text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-base font-bold text-black dark:text-white">Member Since</p>
              <p className="text-gray-900 dark:text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-black dark:text-white">Change Password</h3>
          <button
            onClick={() => setPasswordMode(!passwordMode)}
            className="btn-secondary"
          >
            {passwordMode ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {passwordMode && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-base font-bold text-black dark:text-white">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-base font-bold text-black dark:text-white">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-base font-bold text-black dark:text-white">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="input-field"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Change Password
              </button>
              <button
                type="button"
                onClick={() => setPasswordMode(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Dark Mode Toggle */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Appearance</h3>
        </div>
        
        <div className={`flex items-center justify-between p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
              {darkMode ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
            <div>
              <p className={`font-medium text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</p>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-400'}`}>
                {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              darkMode ? 'bg-primary-600' : 'bg-gray-200 border border-black'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Privacy, Notification, Help, About, Logout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <button className="card flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition" onClick={() => setPrivacyOpen(true)}>
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm0 0V7m0 4v4m0 0h4m-4 0H8" />
          </svg>
          <span className="font-medium text-gray-900 dark:text-white">Privacy</span>
        </button>
        <button className="card flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition" onClick={() => setNotificationOpen(true)}>
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="font-medium text-gray-900 dark:text-white">Notification</span>
        </button>
        <button className="card flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition" onClick={() => setHelpOpen(true)}>
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 16v-2a4 4 0 00-3-3.87M3 16v-2a4 4 0 013-3.87m0 0A4 4 0 0112 4a4 4 0 016 6.13m-12 0A4 4 0 006 16v2a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          <span className="font-medium text-gray-900 dark:text-white">Help</span>
        </button>
        <button className="card flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition" onClick={() => setAboutOpen(true)}>
          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <span className="font-medium text-gray-900 dark:text-white">About</span>
        </button>
        <button className="card flex items-center space-x-3 hover:bg-red-50 dark:hover:bg-red-900 transition" onClick={handleLogout}>
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
          <span className="font-medium text-red-600 dark:text-white">Logout</span>
        </button>
      </div>

      {/* About Modal (Instagram style) */}
      {aboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white" onClick={() => setAboutOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2v-1" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Spendly</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">Version 1.0.0</span>
              <p className="text-center text-sm text-gray-500 dark:text-gray-300 mb-4">
                Spendly helps you track your expenses, manage budgets, and analyze your finances with ease.
              </p>
              <div className="flex flex-col items-center space-y-1 w-full">
                <a href="#" className="text-blue-500 hover:underline text-sm">Privacy Policy</a>
                <a href="#" className="text-blue-500 hover:underline text-sm">Terms of Service</a>
                <a href="#" className="text-blue-500 hover:underline text-sm">Contact Support</a>
              </div>
              <div className="mt-4 text-xs text-gray-400">© {new Date().getFullYear()} Spendly. All rights reserved.</div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {privacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white" onClick={() => setPrivacyOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center space-y-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Privacy</h2>
              <p className="text-center text-sm text-gray-500 dark:text-gray-300 mb-4">Your privacy is important to us. Here you can manage your privacy settings and learn how your data is handled.</p>
            </div>
          </div>
        </div>
      )}
      {/* Notification Modal */}
      {notificationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white" onClick={() => setNotificationOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center space-y-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Notification</h2>
              <p className="text-center text-sm text-gray-500 dark:text-gray-300 mb-4">Manage your notification preferences. Choose what updates you want to receive from Spendly.</p>
            </div>
          </div>
        </div>
      )}
      {/* Help Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white" onClick={() => setHelpOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center space-y-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Help</h2>
              <p className="text-center text-sm text-gray-500 dark:text-gray-300 mb-4">Need assistance? Find answers to common questions or contact our support team for help.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile 