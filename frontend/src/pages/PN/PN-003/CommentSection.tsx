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
  commentsEndRef: React.RefObject<HTMLDivElement>;
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
    <>
      {/* 댓글 영역 */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">댓글</h3>
        
        {/* 댓글 목록 */}
        <div className="space-y-4 mb-20">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="font-medium">{comment.author}</span>
                  {comment.isMyComment && (
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="ml-2 text-xs text-red-500"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-800">{comment.content}</p>
            </div>
          ))}
          
          {/* 무한 스크롤 감지용 엘리먼트 */}
          {hasMore && (
            <div ref={commentsEndRef} className="h-10 flex justify-center items-center">
              <span className="text-sm text-gray-500">댓글 불러오는 중...</span>
            </div>
          )}
        </div>
      </div>
      
      {/* 댓글 입력 영역 (하단 고정) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={commentText}
            onChange={onCommentChange}
            ref={commentInputRef}
            placeholder="댓글을 입력하세요."
            className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:border-gray-500"
            maxLength={150}
          />
          <button
            onClick={onSubmitComment}
            disabled={!commentText.trim() || commentText.length > 150 || !isLoggedIn}
            className={`ml-2 p-2 rounded-full ${
              commentText.trim() && commentText.length <= 150 && isLoggedIn
                ? 'text-black'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default CommentSection;