import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/url';
import SearchNewsList from './NewsList';

interface SearchResultsProps {
  searchQuery?: string; // 기존 props 유지 (호환성을 위해)
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchQuery }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [isValidSearch, setIsValidSearch] = useState(false);

  useEffect(() => {
    // URL 쿼리 파라미터에서 tags 추출
    const tagsParam = searchParams.get('tags');
    
    if (tagsParam) {
      // 쉼표로 구분된 태그들을 배열로 변환
      const tagArray = tagsParam.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // 태그 개수 검증 (1~6개)
      if (tagArray.length >= 1 && tagArray.length <= 6) {
        setTags(tagArray);
        setIsValidSearch(true);
      } else {
        setIsValidSearch(false);
      }
    } else {
      // tags 파라미터가 없으면 메인 페이지로 리다이렉트
      navigate(ROUTES.MAIN);
    }
  }, [searchParams, navigate]);

  // 검색 조건이 유효하지 않은 경우
  if (!isValidSearch && tags.length === 0) {
    return (
      <main className="flex-1 p-6 bg-[#F8F9FA] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              올바르지 않은 검색 조건
            </h2>
            <p className="text-gray-600 mb-4">
              검색 태그는 1개 이상 6개 이하로 입력해주세요.
            </p>
            <button
              onClick={() => navigate(ROUTES.MAIN)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              메인 페이지로 돌아가기
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 bg-[#FDFAF7] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              검색 결과
            </h1>
            <button
              onClick={() => navigate(ROUTES.MAIN)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              메인으로 돌아가기
            </button>
          </div>
          
          {/* 검색 조건 표시 */}
          <div className="bg-white shadow-sm rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <svg 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <span>검색 태그:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * 태그들은 OR 조건으로 검색됩니다.
            </p>
          </div>
          
          {/* 검색 결과 목록 */}
          <div className="bg-white shadow-sm rounded-lg px-2 py-4">
            {isValidSearch && tags.length > 0 && (
              <SearchNewsList tags={tags} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SearchResults;