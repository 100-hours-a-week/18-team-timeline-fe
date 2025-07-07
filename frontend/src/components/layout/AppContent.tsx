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
import Login from '../../pages/PU/PU-002'
import { KakaoCallback } from '../../pages/PU/auth/KakaoCallback'
import UserInfo from '../../pages/PU/PU-003'
import SearchResults from '../../pages/PN/PN-002'
import { useAuthStore } from '../../stores/useAuthStore'
import { SearchBar } from './SearchBar/SearchBar'
import { useSearchBarStore } from '../../stores/useSearchBarStore'
import { useSearchStore } from '../../stores/useSearchStore'
import { SidebarAlarm } from './SidebarAlarm/SidebarAlarm'
import PollPage from '@/pages/PV/PV-001'
import BookmarkPage from '@/pages/PN/PN-004'
import { useSidebarMenuStore } from '@/stores/useSidebarMenuStore'
import { useSidebarAlarmStore } from '@/stores/useSidebarAlarmStore'
import LoadingPage from '@/pages/PL'

export const AppContent = () => {
  const location = useLocation()
  const currentPage = usePageStore((state) => state.currentPage)
  const isSearchOpen = useSearchBarStore((state) => state.isOpen)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked)

  const isMenuOpen = useSidebarMenuStore((state) => state.isOpen)
  const closeMenu = useSidebarMenuStore((state) => state.close)

  const isAlarmOpen = useSidebarAlarmStore((state) => state.isOpen)
  const closeAlarm = useSidebarAlarmStore((state) => state.close)

  const overlayClass = 'absolute top-0 left-0 z-40 w-full h-full bg-black opacity-50'

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

  const handleOverlayClick = () => {
    if (isMenuOpen) closeMenu()
    if (isAlarmOpen) closeAlarm()
  }

  return (
    <Container>
      {(isMenuOpen || isAlarmOpen) && <div className={overlayClass} onClick={handleOverlayClick} />}
      <SidebarMenu />
      {isLoggedIn && <SidebarAlarm />}
      {isSearchOpen ? <SearchBar /> : <Header />}

      {!isAuthChecked ? (
        <LoadingPage />
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to={currentPage} />} />
          <Route path={ROUTES.MAIN} element={<MainPage />} />
          <Route path={ROUTES.SEARCH_RESULTS} element={<SearchResults />} />
          <Route path={ROUTES.NEWS_DETAIL} element={<NewsDetail />} />

          <Route element={<LogoutRoute />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.KAKAO_CALLBACK} element={<KakaoCallback />} />
          </Route>

          <Route element={<LoginRoute />}>
            <Route path={ROUTES.USER_INFO} element={<UserInfo />} />
            <Route path={ROUTES.POLL} element={<PollPage />} />
            <Route path={ROUTES.BOOKMARK} element={<BookmarkPage />} />
          </Route>
        </Routes>
      )}
    </Container>
  )
}
