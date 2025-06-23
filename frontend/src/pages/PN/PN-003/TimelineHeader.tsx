import React from 'react'
import { formatRelativeTime } from '@/pages/PN/utils/formatRelativeTime'

// API 응답 구조에 맞춘 인터페이스
interface TimelineHeaderProps {
  title: string
  updatedAt: string
  bookmarked: boolean
  onToggleBookmark: () => void
  onShare: () => void
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ title, updatedAt, bookmarked, onToggleBookmark, onShare }) => {
  return (
    <div className="w-full bg-white p-4">
      <div className="flex justify-between items-start mb-1 gap-4">
        <h2 className="text-lg font-bold flex-grow text-black break-words">{title}</h2>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button onClick={onShare} aria-label="공유하기" className="text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
          <button
            onClick={onToggleBookmark}
            aria-label={bookmarked ? '북마크 취소' : '북마크 추가'}
            className="text-gray-600"
          >
            {bookmarked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-500">{formatRelativeTime(updatedAt)} 마지막 업데이트</p>
    </div>
  )
}

export default TimelineHeader
