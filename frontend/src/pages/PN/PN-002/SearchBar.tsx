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

  const handleAddKeyword = () => {
    // 빈 문자열이거나 이미 존재하는 키워드는 추가하지 않음
    if (query.trim() && !keywords.includes(query.trim())) {
      onKeywordAdd(query.trim());
      setQuery(''); // 입력 후 검색창 비우기
    }
  };

  // 엔터 키 처리를 위한 함수
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddKeyword();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 w-full mb-4">
        {/* Back button */}
        <button
          className="flex-shrink-0 text-gray-500 hover:text-gray-700"
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
          onClick={handleAddKeyword}
        >
          확인
        </button>
      </div>

      {/* Selected keywords */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 mb-4">
          {keywords.map((keyword) => (
            <div
              key={keyword}
              className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              <span>{keyword}</span>
              <button
                onClick={() => onKeywordRemove(keyword)}
                className="ml-2 text-gray-500 hover:text-gray-700"
                aria-label={`${keyword} 키워드 삭제`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}