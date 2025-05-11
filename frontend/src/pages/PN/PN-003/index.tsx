import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Toast } from '@/components/ui/Toast';
import TimelineCard from './TimelineCard';
import TimelineHeader from './TimelineHeader';
import TimelineContainer from './TimelineContainer';
import SentimentAnalysis from './SentimentAnalysis';
import CommentSection from './CommentSection';
import { useTimelineData } from './hooks/useTimelineData';
import { useComments } from './hooks/useComments';
import { useToast } from './hooks/useToast';
import type { UserInfo } from './types';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, checkAuth } = useAuthStore();
  const { showToast, toastMessage, toastPosition, setToastMessage } = useToast();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
  // 인증 상태 체크 및 사용자 정보 로드
  useEffect(() => {
    checkAuth();
    
    // 실제 구현 시 API로 현재 사용자 정보를 가져와야 함
    if (isLoggedIn) {
      // 토큰이 유효하면 API 호출로 사용자 정보를 가져와야 함
      setUserInfo({
        id: '1',
        name: '사용자',
        nickname: '사용자닉네임'
      });
    } else {
      setUserInfo(null);
    }
  }, [isLoggedIn, checkAuth]);
  
  // 타임라인 데이터 관리
  const { 
    newsData, 
    loading, 
    error, 
    isBookmarked, 
    setIsBookmarked,
    showSources,
    isUpdateAvailable,
    isUpdating,
    handleTimelineUpdate,
    toggleSources
  } = useTimelineData({ id, userInfo });
  
  // 댓글 관리
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
    onToastShow: setToastMessage
  });
  
  // 북마크 토글 핸들러
  const toggleBookmark = () => {
    if (!isLoggedIn) {
      setToastMessage('로그인 후 이용 가능합니다.');
      return;
    }
    
    setIsBookmarked(prev => !prev);
    // Todo: API 호출로 북마크 상태 업데이트 (실제 구현 시)
  };
  
  // 공유하기 핸들러
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setToastMessage('URL이 복사되었습니다!');
        })
        .catch(err => {
          console.error('URL 복사 실패:', err);
        });
    }
  };
  
  // 타임라인 업데이트 버튼 클릭 핸들러 (토스트 메시지 처리 추가)
  const handleTimelineUpdateWithToast = () => {
    if (!isUpdateAvailable) {
      setToastMessage('이미 최신 상태입니다.');
      return;
    }
    
    handleTimelineUpdate();
  };
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }
  
  if (error || !newsData) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error || '데이터를 불러올 수 없습니다.'}</div>;
  }
  
  return (
    <div className="min-h-screen bg-[#FDFAF7] pb-20">
      
      {/* 타임라인 컨텐츠 */}
      <div className="container mx-auto px-0 pb-6">
        {/* 타임라인 헤더 */}
        <TimelineHeader 
          title={newsData.title}
          lastUpdated={newsData.lastUpdated}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onShare={handleShare}
        />
        
        {/* 나머지 컨텐츠에는 패딩 적용 */}
        <div className="px-4">
          {/* 메인 이미지/비디오 */}
          {newsData.imageUrl && (
            <div className="relative mt-4 mb-6 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 w-full">
                <img 
                  src={newsData.imageUrl} 
                  alt={newsData.title} 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="absolute bottom-2 right-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                이미지 출처: {newsData.sourceName}
              </div>
            </div>
          )}
        
        {newsData.videoUrl && (
          <div className="relative mb-6 rounded-lg overflow-hidden">
            <iframe
              src={newsData.videoUrl}
              className="w-full aspect-video rounded-lg"
              allowFullScreen
              title="News Video"
            ></iframe>
            <div className="absolute bottom-2 right-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              영상 출처: {newsData.sourceName}
            </div>
          </div>
        )}
        
        {/* 타임라인 업데이트 버튼 */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleTimelineUpdateWithToast}
            disabled={isUpdating || !isUpdateAvailable}
            className={`px-6 py-2 rounded-full transition-colors ${
              isUpdating 
                ? 'bg-black text-white cursor-wait' 
                : isUpdateAvailable 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isUpdating ? '업데이트 중...' : '타임라인 업데이트'}
          </button>
        </div>
        
        {/* 타임라인 카드 목록 - TimelineContainer 컴포넌트 사용 */}
        <TimelineContainer
          timeline={newsData.timeline}
          showSources={showSources}
          toggleSources={toggleSources}
        />

        {/* 감정 분석 컴포넌트 */}
        {/* <SentimentAnalysis 
          title={newsData.title}
          sentiment={newsData.sentiment}
        /> */}
        
        {/* 댓글 컴포넌트 */}
        {/* <div ref={commentListRef}>
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
        </div> */}
      </div>
    </div>
      
      {/* 토스트 메시지 */}
      {showToast && (
        <Toast 
          message={toastMessage} 
          className={toastPosition === 'commentInput' ? 'bottom-20' : undefined}
        />
      )}
    </div>
  );
}