import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import { Container } from './components/layout/Container'
import { AppContent } from './components/layout/AppContent'

const App: React.FC = () => {
  return (
    <Container>
      <Router>
        <AppContent />
      </Router>
    </Container>
  )
}

export default App
