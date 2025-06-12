import React, { useEffect } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import usePageStore from './stores/pageStore'
import { Container } from './components/layout/Container'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { ROUTES } from './constants/url'
import { LogoutRoute } from './routes/LogoutRoute'
import { LoginRoute } from './routes/LoginRoute'
import MainPage from './pages/PN/PN-001'
import NewsDetail from './pages/PN/PN-003'
import SignUp from './pages/PU/PU-001'
import Login from './pages/PU/PU-002'
import { KakaoCallback } from './pages/PU/auth/KakaoCallback'
import UserInfo from './pages/PU/PU-003'
import FindPassword from './pages/PU/PU-002-01'
import SearchResults from './pages/PN/PN-002'
import { useAuthStore } from './stores/authStore'
import ResetPassword from './pages/PU/PU-002-02'

const App: React.FC = () => {
  useEffect(() => {
    useAuthStore.getState().checkAuth()
  }, [])

  const currentPage = usePageStore((state) => state.currentPage)

  return (
    <Container>
      <Router>
        <Sidebar />
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to={currentPage} />} />

          {/* 로그인 여부와 상관없이 접근 가능 */}
          <Route path={ROUTES.MAIN} element={<MainPage />} />
          <Route path={ROUTES.SEARCH_RESULTS} element={<SearchResults searchQuery={''} />} />
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
          <Route
            path={ROUTES.LOGIN}
            element={
              <LogoutRoute>
                <Login />
              </LogoutRoute>
            }
          />
          <Route
            path={ROUTES.KAKAO_CALLBACK}
            element={
              <LogoutRoute>
                <KakaoCallback />
              </LogoutRoute>
            }
          />
          <Route
            path={ROUTES.FIND_PASSWORD}
            element={
              <LogoutRoute>
                <FindPassword />
              </LogoutRoute>
            }
          />
          <Route
            path={ROUTES.RESET_PASSWORD}
            element={
              <LogoutRoute>
                <ResetPassword />
              </LogoutRoute>
            }
          />

          {/* 로그인 상태에서만 접근 가능 */}
          <Route
            path={ROUTES.USER_INFO}
            element={
              <LoginRoute>
                <UserInfo />
              </LoginRoute>
            }
          />
        </Routes>
      </Router>
    </Container>
  )
}

export default App
