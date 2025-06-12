import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/url';
import SearchNewsList from './NewsList';
import { useAuthStore } from '../../../stores/authStore';
import { useRequestStore } from '../../../stores/requestStore';
import { ENDPOINTS } from '../../../constants/url';
import type { UserInfo } from '../PN-003/types';
import { useToast } from '../PN-003/hooks/useToast';
import axios from 'axios';
import { API_BASE_URL } from '../../../constants/url';

interface SearchResultsProps {
  searchQuery?: string; // 기존 props 유지 (호환성을 위해)
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchQuery }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [isValidSearch, setIsValidSearch] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toastMessage, setToastMessage } = useToast();
  const showToastMessage = (msg: string) => setToastMessage(msg);

  /* ------------------------------------------------------------
    타임라인 생성 핸들러
  ------------------------------------------------------------ */
  const handleCreateTimeline = async () => {
    if (!tags.length) {
      showToastMessage('검색 태그가 필요합니다.');
      return;
    }

    if (!isLoggedIn) {
      showToastMessage('로그인이 필요한 기능입니다.');
      return;
    }

    try {
      setIsCreating(true);

      const accessToken = localStorage.getItem('token');
      const res = await axios.post(
        API_BASE_URL + ENDPOINTS.NEWS,          // POST /news
        { query: tags },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      /* 201 Created → /news/{id} 로 이동 */
      if (res.status === 201 && res.data?.data?.news?.id) {
        navigate(ROUTES.getNewsDetailPath(res.data.data.news.id));
        return;
      }

      /* 204 No Content */
      if (res.status === 204) {
        showToastMessage('타임라인을 생성할 수 없습니다.');
      }
    } catch (e: any) {
      const msg =
        e.response?.status === 400
          ? '요청 형식이 올바르지 않습니다.'
          : e.response?.status === 401
          ? '로그인이 필요합니다.'
          : e.response?.status === 429
          ? '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
          : '타임라인 생성 중 오류가 발생했습니다.';
      showToastMessage(msg);
    } finally {
      setIsCreating(false);
    }
  };

  // 사용자 정보 상태
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { isLoggedIn, checkAuth } = useAuthStore();
  const { getData } = useRequestStore();
  
  // 로그인 상태 체크 및 사용자 정보 가져오기
  useEffect(() => {
    checkAuth();
    
    // 로그인된 경우에만 사용자 정보 가져오기
    if (isLoggedIn) {
      const fetchUserInfo = async () => {
        try {
          const res = await getData(ENDPOINTS.USER_INFO);
          setUserInfo({
            id: res.data.user.userId,
            nickname: res.data.user.username,
            email: res.data.user.email
          });
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
          setUserInfo({
            id: '',
            nickname: localStorage.getItem('userName') || '사용자',
            email: ''
          });
        }
      };
      
      fetchUserInfo();
    } else {
      setUserInfo(null);
    }
  }, [checkAuth, isLoggedIn, getData]);

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
        </div>

        {/* 통합된 검색 결과 박스 */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          {/* 검색 조건 표시 */}
          <div className="px-4 pt-4">
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
          
          {/* 타임라인 생성 버튼 */}
          <div className="flex justify-center py-4">
            {isCreating ? (
              <svg
                className="animate-spin h-6 w-6 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                />
              </svg>
            ) : (
              <button
                onClick={handleCreateTimeline}
                disabled={!isValidSearch || !isLoggedIn}
                className={`px-4 py-2 rounded-3xl transition-colors flex items-center
                  ${!isLoggedIn
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'      // 로그인 X
                    : !isValidSearch
                      ? 'bg-gray-600 text-white opacity-40 cursor-not-allowed' // 태그 조건 X
                      : 'bg-gray-600 text-white hover:bg-gray-800'        // 정상
                  }`}
                >
                  {!isLoggedIn ? '타임라인 생성(로그인 필요)' : '타임라인 생성하기'}
                </button>
            )}
          </div>

          {/* 검색 결과 목록 */}
          <div className="px-2 pb-4">
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