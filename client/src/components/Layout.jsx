import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const Layout = ({ children, setIsAuthenticated }) => {
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 sidebar transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex items-center justify-between h-16 px-4 sm:px-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className={`text-lg sm:text-xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <svg className="text-xl sm:text-2xl mr-2 font-bold text-blue-600 w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2v-1" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            Spendly
          </h1>
        </div>
        
        <nav className="mt-4 sm:mt-6 px-3 sm:px-6">
          <div className="space-y-2 sm:space-y-3">
            <Link 
              to="/" 
              className={`sidebar-link ${
                location.pathname === '/' ? 'active' : ''
              } text-gray-900 dark:text-white`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
              <span className="text-gray-900 dark:text-white">Dashboard</span>
            </Link>
            <Link 
              to="/analytics" 
              className={`sidebar-link ${
                location.pathname === '/analytics' ? 'active' : ''
              } text-gray-900 dark:text-white`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-gray-900 dark:text-white">Analytics</span>
            </Link>
            <Link 
              to="/recurring" 
              className={`sidebar-link ${
                location.pathname === '/recurring' ? 'active' : ''
              } text-gray-900 dark:text-white`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-gray-900 dark:text-white">Recurring</span>
            </Link>
            <Link 
              to="/funds" 
              className={`sidebar-link ${
                location.pathname === '/funds' ? 'active' : ''
              } text-gray-900 dark:text-white`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-gray-900 dark:text-white">Funds & Stocks</span>
            </Link>
            <Link 
              to="/documents" 
              className={`sidebar-link ${
                location.pathname === '/documents' ? 'active' : ''
              } text-gray-900 dark:text-white`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4a2 2 0 012-2h7l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v6h6" />
              </svg>
              <span className="text-gray-900 dark:text-white">Documents</span>
            </Link>
            <Link 
              to="/profile" 
              className={`sidebar-link ${
                location.pathname === '/profile' ? 'active' : ''
              } text-gray-900 dark:text-white`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-gray-900 dark:text-white">Profile</span>
            </Link>
            {/* Dark Mode Toggle in Navbar */}
            <div className="flex items-center sidebar-link mt-2">
              {darkMode ? (
                <svg className="h-5 w-5 mr-2 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 mr-2 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              <span className="text-gray-900 dark:text-white">Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                className={`ml-auto relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  darkMode ? 'bg-primary-600' : 'bg-gray-200 border border-black'
                }`}
                aria-label="Toggle dark mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen && window.innerWidth < 1024 ? 'overflow-hidden' : ''}`}>
        {/* Top navigation */}
        <div className={`${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'nav-glass'}`}>
          <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
            <div className="flex items-center">
              <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Welcome, <span className={`font-semibold text-xs sm:text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name || 'User'}</span></div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLogout}
                className="btn-secondary text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        {/* Page content */}
        <main className="flex justify-center p-3 sm:p-4 lg:p-8">
          <div className="fade-in max-w-4xl sm:max-w-5xl lg:max-w-6xl w-full">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg pt-2 sm:pt-4 pb-4 sm:pb-8 px-4 sm:px-8 min-h-[60vh]">
              {children}
            </div>
          </div>
        </main>
        <button
          onClick={() => setSidebarOpen(true)}
          className={`lg:hidden p-1.5 sm:p-2 rounded-md ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'}`}
        >
          <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout