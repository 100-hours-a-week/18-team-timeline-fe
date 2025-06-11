import React from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import usePageStore from './stores/pageStore'
import { Container } from './components/layout/Container'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { ROUTES } from './constants/url'
import MainPage from './pages/PN/PN-001'
import NewsDetail from './pages/PN/PN-003'
import SignUp from './pages/PU/PU-001'
import { LogoutRoute } from './routes/LogoutRoute'

const App: React.FC = () => {
  const currentPage = usePageStore((state) => state.currentPage)

  return (
    <Container>
      <Router>
        <Sidebar />
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to={currentPage} />} />
          <Route path={ROUTES.MAIN} element={<MainPage />} />
          <Route path={ROUTES.NEWS_DETAIL} element={<NewsDetail />} />

          {/* 로그아웃 상태에서만 접근 가능 */}
          <Route
            path={ROUTES.SIGNUP}
            element={
              <LogoutRoute>
                <SignUp />
              </LogoutRoute>
            }
          />
        </Routes>
      </Router>
    </Container>
  )
}

export default App
