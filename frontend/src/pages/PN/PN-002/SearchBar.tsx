import React, { useState } from 'react';

interface SearchBarProps {
  initialQuery: string;
  onKeywordAdd: (keyword: string) => void;
  keywords: string[];
  onKeywordRemove: (keyword: string) => void;
}

export default function SearchBar({ 
  initialQuery, 
  onKeywordAdd, 
  keywords,
  onKeywordRemove 
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleAddKeyword = (input: string) => {
    if (!input.trim()) return;
    
    // 띄어쓰기로 단어 분리
    const newKeywords = input.trim().split(/\s+/).filter(k => k.length > 0);
    console.log('분리된 키워드들:', newKeywords);
    
    // 각 키워드를 개별적으로 추가
    for (const keyword of newKeywords) {
      if (keywords.length >= 6) {
        console.log('최대 키워드 개수(6개) 도달, 추가 중단');
        break;
      }
      
      if (!keywords.includes(keyword)) {
        onKeywordAdd(keyword);
        console.log('키워드 추가됨:', keyword);
      } else {
        console.log('중복 키워드 무시됨:', keyword);
      }
    }
    
    // 입력창 초기화
    setQuery('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 시 폼 제출 방지
      handleAddKeyword(query);
    }
  };
  
  const handleConfirmClick = () => {
    handleAddKeyword(query);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 w-full mb-4">
        {/* Back button */}
        <button
          className="flex-shrink-0 text-gray-500 hover:text-gray-700 p-2"
          onClick={() => window.history.back()}
          aria-label="뒤로 가기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        {/* Search input */}
        <div className="flex-grow">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="검색어를 입력하세요."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F2A359]"
          />
        </div>

        {/* Confirm button */}
        <button
          className="flex-shrink-0 bg-[#F2A359] text-white px-4 py-2 rounded-lg hover:bg-[#E29349] transition-colors"
          onClick={handleConfirmClick}
        >
          확인
        </button>
      </div>

      {/* Selected keywords with count indicator */}
      <div className="flex justify-between items-center mt-2 mb-4">
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <div
                key={keyword}
                className="flex items-center bg-[#54577C] px-3 py-1 rounded-full text-white text-sm"
              >
                <span>{keyword}</span>
                <button
                  onClick={() => onKeywordRemove(keyword)}
                  className="ml-2 text-white hover:text-gray-400"
                  aria-label={`${keyword} 키워드 삭제`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {/* 키워드 개수 표시 (선택 사항) */}
        {keywords.length > 0 && (
          <div className="text-sm text-gray-500">
            {keywords.length}/6 키워드
          </div>
        )}
      </div>
    </div>
  );
}