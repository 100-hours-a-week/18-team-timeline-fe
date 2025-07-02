import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import { AppContent } from './components/layout/AppContent'
import { useAuthStore } from './stores/useAuthStore'
import LoadingPage from './pages/PL'

const App: React.FC = () => {
  const { checkAuth, isAuthChecked } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  if (!isAuthChecked) {
    return <LoadingPage />
  }

  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
