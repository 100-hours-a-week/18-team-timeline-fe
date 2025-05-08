import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import NewsList from './NewsList';
import Modal from './Modal';
import { useAuthStore } from '../../stores/authStore';

interface SearchResultsProps {
  searchQuery: string;
}

export default function SearchResults({ searchQuery }: SearchResultsProps) {
  const { isLoggedIn } = useAuthStore();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleKeywordAdd = (keyword: string) => {
    if (keywords.length < 6 && !keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleTimelineCreate = () => {
    if (isLoggedIn) {
      setShowTimelineModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = () => {
    // TODO: Implement navigation to login page
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#FDFAF7]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <SearchBar 
            initialQuery={searchQuery}
            onKeywordAdd={handleKeywordAdd}
            keywords={keywords}
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handleTimelineCreate}
            className="bg-[#F2A359] text-white px-4 py-2 rounded-lg hover:bg-[#E29349] transition-colors"
          >
            타임라인 생성하기
          </button>
        </div>

        <div className="mt-8">
          <NewsList 
            searchQuery={searchQuery}
            keywords={keywords}
          />
        </div>
      </div>

      {/* Timeline Creation Modal */}
      <Modal 
        isOpen={showTimelineModal}
        onClose={() => setShowTimelineModal(false)}
        title="타임라인을 생성하시겠습니까?"
        content="검색창의 키워드와 관련된 타임라인이 생성됩니다."
        onConfirm={() => {
          // TODO: Implement timeline creation
          setShowTimelineModal(false);
          // Navigate to PN-003
          window.location.href = '/timeline';
        }}
        onCancel={() => setShowTimelineModal(false)}
      />

      {/* Login Warning Modal */}
      <Modal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="로그인 후 이용 가능합니다."
        content="확인을 누르면 로그인 페이지로 이동합니다."
        onConfirm={handleLogin}
        onCancel={() => setShowLoginModal(false)}
      />
    </div>
  );
}