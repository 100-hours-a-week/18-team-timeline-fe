import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import usePageStore from './stores/pageStore';
import { ROUTES } from '@/constants/url';
import Main from '@/pages/PN-001';
import NewsDetail from '@/pages/PN-002';
import SignUp from '@/pages/PU-001';
import Login from '@/pages/PU-002';
import UserInfo from '@/pages/PU-003';

const App: React.FC = () => {
  const currentPage = usePageStore((state) => state.currentPage);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={currentPage} />} />
          <Route path={ROUTES.MAIN} element={<Main />} />
          <Route path={ROUTES.NEWS_DETAIL} element={<NewsDetail />} />
          <Route path={ROUTES.SIGNUP} element={<SignUp />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.USER_INFO} element={<UserInfo />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;