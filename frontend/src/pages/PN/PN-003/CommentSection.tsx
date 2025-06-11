import React, { useRef } from 'react';
import type { Comment } from './types';
import { formatRelativeTime } from '@/pages/PN/utils/dateUtils';

interface CommentSectionProps {
  comments: Comment[];
  commentText: string;
  isLoggedIn: boolean;
  hasMore: boolean;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitComment: () => void;
  onDeleteComment: (commentId: string) => void;
  commentsEndRef: React.RefObject<HTMLDivElement | null>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  commentText,
  isLoggedIn,
  hasMore,
  onCommentChange,
  onSubmitComment,
  onDeleteComment,
  commentsEndRef,
}) => {
  const commentInputRef = useRef<HTMLInputElement>(null);

  return (
    // 최대 높이를 제한하고, 내부에서 스크롤되는 컨테이너
    <div className="mt-8 bg-gray-100 text-black rounded-t-xl shadow-inner max-h-[50vh] h-[50vh] flex flex-col relative">
      {/* 헤더 */}
      <h3 className="text-lg font-bold px-4 pt-4 flex-shrink-0">댓글</h3>

      {/* 댓글 목록 (flex-1로 남은 영역 차지, 내부 스크롤) */}
      <div className="flex-1 overflow-y-auto space-y-4 px-4 pb-28 mt-2">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-300 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-1 text-sm">
              <div className="flex items-center">
                <span className="font-bold">{comment.author}</span>
                {comment.isMyComment && (
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    삭제
                  </button>
                )}
              </div>
              <span className="text-xs text-gray-700">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm leading-relaxed break-words">{comment.content}</p>
          </div>
        ))}

        {/* 무한 스크롤 감지용 엘리먼트 */}
        {hasMore && (
          <div ref={commentsEndRef} className="h-10 flex justify-center items-center text-gray-300">
            댓글 불러오는 중...
          </div>
        )}
      </div>

      {/* 댓글 입력 영역 (sticky 하단) */}
      <div className="sticky bottom-0 left-0 right-0 bg-gray-100 px-4 py-3 flex-shrink-0">
        <div className="flex items-center">
          <input
            type="text"
            value={commentText}
            onChange={onCommentChange}
            ref={commentInputRef}
            placeholder="댓글을 입력하세요."
            className="flex-grow p-2 bg-gray-300 placeholder-gray-400 text-black rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
            maxLength={150}
          />
          <button
            onClick={onSubmitComment}
            disabled={!commentText.trim() || commentText.length > 150 || !isLoggedIn}
            className={`ml-2 p-2 rounded-full transition-colors ${
              commentText.trim() && commentText.length <= 150 && isLoggedIn
                ? 'text-black hover:bg-gray-500'
                : 'text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
