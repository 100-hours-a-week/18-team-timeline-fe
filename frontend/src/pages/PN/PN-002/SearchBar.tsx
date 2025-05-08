import React, { useState } from 'react';

interface SearchBarProps {
  initialQuery: string;
  onKeywordAdd: (keyword: string) => void;
  keywords: string[];
}

export default function SearchBar({ initialQuery, onKeywordAdd, keywords }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleKeywordClick = (keyword: string) => {
    onKeywordAdd(keyword);
    setQuery('');
  };

  const handleKeywordRemove = (keyword: string) => {
    onKeywordAdd(keyword);
    setQuery('');
  };

  return (
    <>
    <div className="flex items-center gap-1 w-full mb-4">
      {/* Back button */}
      <button
        className="flex-shrink-0 text-gray-500 hover:text-gray-700"
        onClick={() => window.history.back()}
      >
        ←
      </button>

      {/* Search input */}
      <div className="flex-grow bg-white rounded-lg">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="검색어를 입력하세요."
          className="flex-grow w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F2A359]"
        />
      </div>

      {/* Confirm button */}
      <button
        className="flex-shrink-0 bg-[#F2A359] text-white px-4 py-2 rounded-lg hover:bg-[#E29349] transition-colors"
        onClick={() => onKeywordAdd(query)}
      >
        확인
      </button>
    </div>

    {/* Selected keywords */}
    <div className="mt-4 flex gap-2">
      {keywords.map((keyword) => (
        <div
          key={keyword}
          className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
        >
          {keyword}
          <button
            onClick={() => handleKeywordRemove(keyword)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      ))}
    </div>
    </>
  );
}
