import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import usePageStore from './stores/pageStore';
import { ROUTES } from '@/constants/url';
import Main from '@/pages/PN/PN-001';
import NewsDetail from '@/pages/PN/PN-002';
import SignUp from '@/pages/PU/PU-001';
import Login from '@/pages/PU/PU-002';
import UserInfo from '@/pages/PU/PU-003';
import { Container } from './components/layout/Container';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { KakaoCallback } from './pages/auth/KakaoCallback';

const App: React.FC = () => {
  const currentPage = usePageStore((state) => state.currentPage);

  return (
    <Container>
      <Router>
        <Sidebar />
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to={currentPage} />} />
          <Route path={ROUTES.MAIN} element={<Main />} />
          <Route path={ROUTES.NEWS_DETAIL} element={<NewsDetail />} />
          <Route path={ROUTES.KAKAO_CALLBACK} element={<KakaoCallback />} />
          <Route path={ROUTES.SIGNUP} element={<SignUp />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.USER_INFO} element={<UserInfo />} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;