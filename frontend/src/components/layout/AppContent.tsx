import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import usePageStore from '../../stores/usePageStore'
import { Container } from './Container'
import { Header } from './Header'
import { SidebarMenu } from './SidebarMenu/SidebarMenu'
import { ROUTES } from '../../constants/url'
import { LogoutRoute } from '../../routes/LogoutRoute'
import { LoginRoute } from '../../routes/LoginRoute'
import MainPage from '../../pages/PN/PN-001'
import NewsDetail from '../../pages/PN/PN-003'
import SignUp from '../../pages/PU/PU-001'
import Login from '../../pages/PU/PU-002'
import { KakaoCallback } from '../../pages/PU/auth/KakaoCallback'
import UserInfo from '../../pages/PU/PU-003'
import FindPassword from '../../pages/PU/PU-002-01'
import SearchResults from '../../pages/PN/PN-002'
import { useAuthStore } from '../../stores/useAuthStore'
import ResetPassword from '../../pages/PU/PU-002-02'
import { ResetPasswordRoute } from '../../routes/ResetPasswordRoute'
import { SearchBar } from './SearchBar/SearchBar'
import { useSearchBarStore } from '../../stores/useSearchBarStore'
import { useSearchStore } from '../../stores/useSearchStore'

export const AppContent = () => {
  const location = useLocation()
  const currentPage = usePageStore((state) => state.currentPage)
  const isSearchOpen = useSearchBarStore((state) => state.isOpen)

  useEffect(() => {
    useAuthStore.getState().checkAuth()
  }, [])

  useEffect(() => {
    const isSearchPage = location.pathname === ROUTES.SEARCH_RESULTS

    if (isSearchPage) {
      useSearchBarStore.getState().open()
    } else {
      useSearchBarStore.getState().close()
      useSearchStore.getState().clearKeywords()
      useSearchStore.getState().setInitialized(false)
    }
  }, [location.pathname])

  return (
    <Container>
      <SidebarMenu />
      {isSearchOpen ? <SearchBar /> : <Header />}

      <Routes>
        <Route path="/" element={<Navigate to={currentPage} />} />

        {/* 로그인 여부와 상관없이 접근 가능 */}
        <Route path={ROUTES.MAIN} element={<MainPage />} />
        <Route path={ROUTES.SEARCH_RESULTS} element={<SearchResults />} />
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
        <Route element={<ResetPasswordRoute />}>
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>

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
    </Container>
  )
}
