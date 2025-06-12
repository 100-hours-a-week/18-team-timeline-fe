import React from 'react';
import type { TimelineCard as TimelineCardType } from './types';

interface TimelineCardProps {
  data: TimelineCardType;
  showSources: boolean;
  onToggleSources: () => void;
  isLast?: boolean; // 마지막 카드인지 여부
}

const TimelineCard: React.FC<TimelineCardProps> = ({ 
  data, 
  showSources, 
  onToggleSources,
  isLast = false
}) => {
  return (
    <div className="relative pl-8 mb-6">
      {/* 배경 레이어 - z-index 순서를 명확하게 하기 위함 */}
      <div className="absolute inset-0 z-0"></div>
      
      {/* 수직선 - 가장 뒤에 위치하도록 낮은 z-index */}
      {!isLast && (
        <div className="absolute left-3.5 top-0 w-0.5 h-[calc(100%+1.5rem)] bg-[#54577C] z-0"></div>
      )}
      {isLast && (
        <div className="absolute left-3.5 top-0 w-0.5 h-5 bg-[#54577C] z-0"></div>
      )}
      
      {/* 가로선 - 카드 뒤에 위치하도록 낮은 z-index */}
      <div className="absolute left-3.5 top-7 w-10 h-0.5 bg-[#54577C] z-0"></div>
      
      {/* 원형 포인트 - 수직선과 가로선 위에 위치하도록 중간 z-index */}
      <div className="absolute left-1.5 top-5 w-5 h-5 rounded-full bg-white border-2 border-[#54577C] shadow-sm z-10"></div>
      
      {/* 카드 내용 - 가장 위에 위치하도록 높은 z-index */}
      <div className="relative bg-white rounded-lg shadow-sm p-5 z-20">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-black max-w-[250px]">{data.title}</h3>
            <p className="text-xs text-[#F2A359] mt-1">
              {data.startDate} ~ {data.endDate}
            </p>
          </div>
          <button 
            onClick={onToggleSources}
            className="text-gray-600"
            aria-label={showSources ? '소스 숨기기' : '소스 보기'}
          >
            {showSources ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            )}
          </button>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-800 whitespace-pre-line text-black">{data.content}</p>
        </div>
        
        {showSources && data.sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-xs text-black font-semibold mb-2">출처:</h4>
            <ul className="space-y-2">
              {data.sources.map((source, index) => (
                <li key={index} className="text-xs">
                  <span className="text-gray-600">출처 {index + 1}:</span>{' '}
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline"
                  >
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineCard;