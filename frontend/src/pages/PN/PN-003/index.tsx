import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toast } from '@/components/ui/Toast';
import TimelineHeader from './TimelineHeader';
import TimelineContainer from './TimelineContainer';
import { useTimelineData } from './hooks/useTimelineData';

export default function NewsDetail() {
  // 주의: 파라미터 이름이 'id'로 설정되어 있습니다!
  const params = useParams<{ id: string }>();
  const newsId = params.id; // id 파라미터를 사용
  
  console.log('NewsDetail rendered with params:', params);
  console.log('NewsDetail extracted newsId:', newsId);
  
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // 타임라인 데이터 훅 사용
  const { 
    newsData, 
    loading, 
    error, 
    bookmarked,
    showSources,
    toggleSources,
    isUpdating,
    handleToggleBookmark,
    handleShare,
    formattedTimeline
  } = useTimelineData({ newsId });

  // 토스트 메시지 표시 함수
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    
    // 3초 후 토스트 메시지 숨기기
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // 북마크 토글 핸들러 (토스트 메시지 추가)
  const onToggleBookmark = async () => {
    try {
      await handleToggleBookmark();
      showToastMessage(bookmarked ? '북마크가 해제되었습니다.' : '북마크에 추가되었습니다.');
    } catch (err) {
      showToastMessage('북마크 업데이트에 실패했습니다.');
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
    <div className="min-h-screen bg-[#FDFAF7] pb-20">
      {/* 타임라인 컨텐츠 */}
      <div className="container mx-auto px-0 pb-6">
        {/* 타임라인 헤더 */}
        <TimelineHeader 
          title={newsData.title}
          updatedAt={newsData.updatedAt}
          bookmarked={bookmarked}
          onToggleBookmark={onToggleBookmark}
          onShare={onShare}
        />
        
        {/* 나머지 컨텐츠에는 패딩 적용 */}
        <div className="px-4">
          {/* 메인 이미지/비디오 */}
          {newsData.image && (
            <div className="relative mt-4 mb-6 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 w-full">
                <img 
                  src={newsData.image} 
                  alt={newsData.title} 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="absolute bottom-2 right-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                {/* 이미지 출처: {newsData.source} */}
              </div>
            </div>
          )}

          {/* 타임라인 컨테이너 */}
          <TimelineContainer 
            timeline={formattedTimeline} 
            showSources={showSources}
            toggleSources={toggleSources}
          />
        </div>
      </div>
      
      {/* 감정 분석 결과 */}
      {/* <div className="container mx-auto px-4 py-6">
        <div className="mt-12 mb-4">
          <h3 className="text-lg font-bold whitespace-pre-line">
            {`${newsData.title},\n다른 사람들은 어떻게 생각할까?`}
          </h3> */}
          
          {/* 감정 분석 통계 */}
          {/* <div className="mt-6 mb-8">
            <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
              <div 
                className="bg-black h-full" 
                style={{ width: `${newsData.statistics.negative}%` }}
              ></div>
              <div 
                className="bg-gray-400 h-full" 
                style={{ width: `${newsData.statistics.neutral}%` }}
              ></div>
              <div 
                className="bg-gray-600 h-full" 
                style={{ width: `${newsData.statistics.positive}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>긍정</span>
              <span>중립</span>
              <span>부정</span>
            </div>
            <div className="text-xs text-center mt-4 text-gray-500">
              *BERT 기반 모델을 활용하여 긍정/중립/부정으로 분류했습니다.
            </div>
          </div>
        </div>
      </div> */}
      
      {/* 토스트 메시지 */}
      {showToast && (
        <Toast message={toastMessage} />
      )}
    </div>
  );
}