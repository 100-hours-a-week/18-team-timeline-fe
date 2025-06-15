import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import { Container } from './components/layout/Container'
import { AppContent } from './components/layout/AppContent'

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
