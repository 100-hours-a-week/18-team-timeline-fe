import React, { useState } from 'react'
import SearchBar from './SearchBar'
import NewsList from './NewsList'
import { Modal } from '@/components/ui/Modal'
import { useAuthStore } from '@/stores/useAuthStore'

interface SearchResultsProps {
  searchQuery: string
}

export default function SearchResults({ searchQuery }: SearchResultsProps) {
  const { isLoggedIn } = useAuthStore()
  const [keywords, setKeywords] = useState<string[]>([])
  const [showTimelineModal, setShowTimelineModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // 키워드 추가 함수 - 수정됨
  const handleKeywordAdd = (keyword: string) => {
    // 키워드가 비어있지 않고, 6개 미만이며, 중복되지 않을 때만 추가
    if (keyword.trim() && keywords.length < 6 && !keywords.includes(keyword)) {
      setKeywords((prevKeywords) => [...prevKeywords, keyword])
    }
  }

  const handleKeywordRemove = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword))
  }

  const handleTimelineCreate = () => {
    if (isLoggedIn) {
      setShowTimelineModal(true)
    } else {
      setShowLoginModal(true)
    }
  }

  const handleLogin = () => {
    // TODO: Implement navigation to login page
    window.location.href = '/login'
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <p>업데이트 예정입니다 (๑• ₃•๑)</p>
    </div>
  )

  // return (
  //   <div className="h-screen bg-[#FDFAF7] flex flex-col">
  //     {/* 상단 고정 영역 */}
  //     <div className="container mx-auto px-4 py-4 flex-shrink-0">
  //       <div className="w-full">
  //         <SearchBar
  //           initialQuery={searchQuery}
  //           onKeywordAdd={handleKeywordAdd}
  //           onKeywordRemove={handleKeywordRemove}
  //           keywords={keywords}
  //         />
  //       </div>

  //       {/* 타임라인 생성 버튼 - 중앙 정렬, 상단 고정 영역의 일부 */}
  //       <div className="flex justify-center mt-8 mb-2">
  //         <button
  //           onClick={handleTimelineCreate}
  //           className={`bg-white text-[#54577C] px-4 py-2 rounded-3xl transition-colors border border-[#54577C] ${
  //             keywords.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#bec0d1]'
  //           }`}
  //           disabled={keywords.length === 0}
  //         >
  //           타임라인 생성하기
  //         </button>
  //       </div>
  //     </div>

  //     {/* 스크롤 가능한 컨테이너 - flex-grow로 나머지 공간 차지 */}
  //     <div className="container mx-auto px-4 flex-grow overflow-y-auto pb-6 news-container">
  //       <NewsList
  //         searchQuery={searchQuery}
  //         keywords={keywords}
  //       />
  //     </div>

  //     {/* 공통 Modal 컴포넌트 사용 */}
  //     <Modal
  //       isOpen={showTimelineModal}
  //       title="타임라인을 생성하시겠습니까?"
  //       content="검색창의 키워드와 관련된 타임라인이 생성됩니다."
  //       onConfirm={() => {
  //         // TODO: Implement timeline creation
  //         setShowTimelineModal(false);
  //         // Navigate to PN-003
  //         window.location.href = '/timeline';
  //       }}
  //       onCancel={() => setShowTimelineModal(false)}
  //     />

  //     <Modal
  //       isOpen={showLoginModal}
  //       title="로그인 후 이용 가능합니다."
  //       content="확인을 누르면 로그인 페이지로 이동합니다."
  //       onConfirm={handleLogin}
  //       onCancel={() => setShowLoginModal(false)}
  //     />
  //   </div>
  // );
}
