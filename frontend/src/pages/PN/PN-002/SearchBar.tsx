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
  
    const newKeywords = input.trim().split(/\s+/).filter(k => k.length > 0);
  
    let addedCount = 0;
    newKeywords.forEach(keyword => {
      if (!keywords.includes(keyword) && keywords.length + addedCount < 6) {
        onKeywordAdd(keyword);
        addedCount++;
      }
    });
  
    setQuery(''); // 입력창 초기화
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

      {/* Selected keywords */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 mb-4">
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
    </div>
  );
}