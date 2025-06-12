import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toast } from '@/components/ui/Toast';
import TimelineHeader from './TimelineHeader';
import TimelineContainer from './TimelineContainer';
import { useTimelineData } from './hooks/useTimelineData';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from './hooks/useToast';
import { useComments } from './hooks/useComments'; // useComments 훅 import
import { useRequestStore } from '@/stores/requestStore';
import { ENDPOINTS } from '@/constants/url';
import SentimentAnalysis from './SentimentAnalysis';
import CommentSection from './CommentSection';
import type { UserInfo } from './types';

export default function NewsDetail() {
  // 주의: 파라미터 이름이 'id'로 설정되어 있습니다!
  const params = useParams<{ id: string }>();
  const newsId = params.id; // id 파라미터를 사용
  
  console.log('NewsDetail rendered with params:', params);
  console.log('NewsDetail extracted newsId:', newsId);
  
  const navigate = useNavigate();
  const { showToast, toastMessage, setToastMessage } = useToast();
  const { isLoggedIn, checkAuth } = useAuthStore();
  const { getData } = useRequestStore();
  
  // 사용자 정보 상태
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
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

  // 타임라인 데이터 훅 사용
  const { 
    newsData, 
    loading, 
    error, 
    bookmarked,
    showSources,
    toggleSources,
    isUpdating,
    isUpdateAvailable,
    handleToggleBookmark,
    handleShare,
    handleTimelineUpdate,
    formattedTimeline
  } = useTimelineData({ newsId });

  // 댓글 관련 훅 사용
  const {
    comments,
    commentText,
    hasMore,
    commentsEndRef,
    commentListRef,
    handleCommentChange,
    handleSubmitComment,
    handleDeleteComment
  } = useComments({
    newsData,
    userInfo,
    isLoggedIn,
    onToastShow: (message, position) => {
      setToastMessage(message);
    }
  });

  // 토스트 메시지 표시 함수
  const showToastMessage = (message: string) => {
    setToastMessage(message);
  };

  // 북마크 토글 핸들러 (토스트 메시지 추가)
  const onToggleBookmark = async () => {
    try {
      // await handleToggleBookmark();
      // showToastMessage(bookmarked ? '북마크가 해제되었습니다.' : '북마크에 추가되었습니다.');
      showToastMessage('업데이트 예정입니다.');
    } catch (err) {
      // showToastMessage('북마크 업데이트에 실패했습니다.');
      showToastMessage('업데이트 예정입니다.');
    }
  };

  // 공유하기 핸들러 (토스트 메시지 추가)
  const onShare = async () => {
    try {
      await handleShare();
      showToastMessage('URL이 복사되었습니다!');
    } catch (err) {
      showToastMessage('URL 복사에 실패했습니다.');
    }
  };

  // 타임라인 업데이트 버튼 클릭 핸들러 (토스트 메시지 처리 추가)
  const handleTimelineUpdateWithToast = async () => {
    // 로그인 여부 확인
    if (!isLoggedIn) {
      setToastMessage('로그인이 필요한 기능입니다.');
      return;
    }
    
    // 업데이트 가능 여부 확인
    if (!isUpdateAvailable) {
      setToastMessage('이미 최신 상태입니다.');
      return;
    }
    
    try {
      await handleTimelineUpdate();
      setToastMessage('타임라인이 성공적으로 업데이트되었습니다.');
    } catch (err) {
      // 오류 메시지 처리
      const errorMessage = err instanceof Error ? err.message : '타임라인 업데이트에 실패했습니다.';
      setToastMessage(errorMessage);
      
      // 401 오류일 경우 로그인 페이지로 이동
      if (errorMessage.includes('인증되지 않은 사용자') || errorMessage.includes('다시 로그인')) {
        setTimeout(() => {
          navigate('/login', { state: { returnUrl: window.location.pathname } });
        }, 1500);
      }
      
      // 409 Conflict (24시간 제한) 오류일 경우 로그 남기기
      if (errorMessage.includes('24시간')) {
        console.log('24시간 제한으로 인해 업데이트 불가');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-500 p-4">
        <p className="text-center mb-4">{error || '데이터를 불러올 수 없습니다.'}</p>
        <div className="text-gray-700 mb-4 text-sm">
          <p>디버그 정보:</p>
          <p>파라미터: {JSON.stringify(params)}</p>
          <p>사용된 ID: {newsId || '없음'}</p>
          <p>URL: {window.location.pathname}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#FDFAF7]">  
      {/* 나머지 영역 - 스크롤 */}
      <div className="flex-grow overflow-y-auto">
        <div className="container mx-auto px-0 pb-6">
          {/* 타임라인 헤더 */}
          <div className="shadow-sm bg-white z-10">
            <TimelineHeader 
              title={newsData.title}
              updatedAt={newsData.updatedAt}
              bookmarked={bookmarked}
              onToggleBookmark={onToggleBookmark}
              onShare={onShare}
            />
          </div>
          <div className="px-4">
            {/* 메인 이미지 */}
            {newsData.image && (
              <div className="relative mt-4 mb-6 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 w-full">
                  <img 
                    src={newsData.image} 
                    alt={newsData.title} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="absolute bottom-2 right-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded max-w-[70%] overflow-hidden whitespace-nowrap text-ellipsis">
                  <a 
                    href={newsData.image } 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    이미지 출처: {newsData.image}
                  </a>
                </div>
              </div>
            )}
  
            {/* 타임라인 업데이트 버튼 */}
            <div 
              className="flex justify-center pb-4"
              style={{ boxShadow: '0 10px 8px -6px rgba(0, 0, 0, 0.1)' }}
            >
              <button
                onClick={handleTimelineUpdateWithToast}
                disabled={isUpdating || !isUpdateAvailable || !isLoggedIn}
                className={`px-6 py-2 rounded-full transition-colors flex items-center ${
                  isUpdating 
                    ? 'bg-black text-white cursor-wait' 
                    : isUpdateAvailable && isLoggedIn
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    업데이트 중...
                  </>
                ) : (
                  <>
                    {isUpdateAvailable && (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    )}
                    {!isLoggedIn ? '로그인 필요' : '타임라인 업데이트'}
                  </>
                )}
              </button>
            </div>
  
            {/* 타임라인 컨테이너 */}
            <div className="rounded-xl">
              <TimelineContainer 
                timeline={formattedTimeline} 
                showSources={showSources}
                toggleSources={toggleSources}
              />
            </div>
          </div>
        </div>
  
        {/* 감정 분석 및 댓글 */}
        <div 
          className="bg-[#FFFFFF] rounded-xl mb-28 mx-4 p-4"
          style={{ boxShadow: '0 -10px 8px -6px rgba(0, 0, 0, 0.1)' }}
          ref={commentListRef}
        >
          <SentimentAnalysis 
            title={newsData.title}
            statistics={newsData.statistics}
          />

          <CommentSection 
            comments={comments}
            commentText={commentText}
            isLoggedIn={isLoggedIn}
            hasMore={hasMore}
            onCommentChange={handleCommentChange}
            onSubmitComment={handleSubmitComment}
            onDeleteComment={handleDeleteComment}
            commentsEndRef={commentsEndRef}
          />    
        </div>
      </div>
  
      {/* 토스트 메시지 */}
      {showToast && (
        <Toast message={toastMessage} />
      )}
    </div>
  );  
}
