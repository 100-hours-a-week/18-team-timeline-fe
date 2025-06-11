import React from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import usePageStore from './stores/pageStore'
import { Container } from './components/layout/Container'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { ROUTES } from './constants/url'
import FindPassword from './pages/PU/PU-002-01'

const App: React.FC = () => {
  const currentPage = usePageStore((state) => state.currentPage)

  return (
    <Container>
      <Router>
        <Sidebar />
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to={currentPage} />} />
          <Route path={ROUTES.FIND_PASSWORD} element={<FindPassword />} />
        </Routes>
      </Router>
    </Container>
  )
}

export default App
