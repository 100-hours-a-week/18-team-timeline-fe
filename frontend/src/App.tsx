import React from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import usePageStore from './stores/pageStore'
import { Container } from './components/layout/Container'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { ROUTES } from './constants/url'
import NewsDetail from './pages/PN/PN-003'

const App: React.FC = () => {
  const currentPage = usePageStore((state) => state.currentPage)

  return (
    <Container>
      <Router>
        <Sidebar />
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to={currentPage} />} />
          <Route path={ROUTES.NEWS_DETAIL} element={<NewsDetail />} />
        </Routes>
      </Router>
    </Container>
  )
}

export default App
