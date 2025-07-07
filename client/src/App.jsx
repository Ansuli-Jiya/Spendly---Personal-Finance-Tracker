import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Recurring from './pages/Recurring'
import Funds from './pages/Funds'
import ProfilePage from './pages/ProfilePage'
import Documents from './pages/Documents'
import Layout from './components/Layout'
// import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated (has valid token)
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Login setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              !isAuthenticated ? (
                <Register setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Dashboard />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/analytics" 
            element={
              isAuthenticated ? (
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Analytics />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/recurring" 
            element={
              isAuthenticated ? (
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Recurring />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/funds" 
            element={
              isAuthenticated ? (
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Funds />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/documents" 
            element={
              isAuthenticated ? (
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <Documents />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/profile" 
            element={
              isAuthenticated ? (
                <Layout setIsAuthenticated={setIsAuthenticated}>
                  <ProfilePage />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  )
}

export default App
