import { useState, useEffect, useRef } from 'react';
import type { Comment, NewsResponse, UserInfo } from '../types';

interface UseCommentsProps {
  newsData: NewsResponse | null;
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  onToastShow?: (message: string, position: 'bottom' | 'commentInput') => void;
}

interface UseCommentsReturn {
  comments: Comment[];
  commentText: string;
  page: number;
  hasMore: boolean;
  commentsEndRef: React.RefObject<HTMLDivElement>;
  commentListRef: React.RefObject<HTMLDivElement>;
  handleCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitComment: () => void;
  handleDeleteComment: (commentId: string) => void;
}

/**
 * 댓글 기능을 관리하는 커스텀 훅
 */
export const useComments = ({ 
  newsData, 
  userInfo, 
  isLoggedIn,
  onToastShow
}: UseCommentsProps): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const commentListRef = useRef<HTMLDivElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  
  // 초기 댓글 로드
  useEffect(() => {
    if (newsData) {
      loadComments(1);
    }
  }, [newsData]);
  
  // 댓글 불러오기 함수
  const loadComments = (pageNum: number) => {
    if (!newsData) return;
    
    const startIndex = (pageNum - 1) * 20;
    const endIndex = startIndex + 20;
    const newComments = newsData.comments.slice(startIndex, endIndex);
    
    if (pageNum === 1) {
      setComments(newComments);
    } else {
      setComments(prev => [...prev, ...newComments]);
    }
    
    setPage(pageNum);
    setHasMore(endIndex < newsData.comments.length);
  };
  
  // 스크롤 감지 및 추가 댓글 로드
  useEffect(() => {
    if (!commentListRef.current || !hasMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadComments(page + 1);
        }
      },
      { threshold: 0.5 }
    );
    
    if (commentsEndRef.current) {
      observer.observe(commentsEndRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [commentListRef, commentsEndRef, hasMore, page]);
  
  // 댓글 입력 핸들러
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.length > 150) {
      onToastShow && onToastShow('댓글 입력은 최대 150자까지 가능합니다.', 'commentInput');
      return;
    }
    
    setCommentText(value);
  };
  
  // 댓글 제출 핸들러
  const handleSubmitComment = () => {
    if (!commentText.trim() || commentText.length > 150 || !isLoggedIn) return;
    
    const newComment: Comment = {
      id: `comment-new-${Date.now()}`,
      author: `${userInfo?.nickname || '사용자'}(나)`,
      content: commentText,
      createdAt: new Date().toISOString(),
      isMyComment: true
    };
    
    // 댓글 목록 업데이트
    setComments(prev => [...prev, newComment]);
    setCommentText('');
    
    // 스크롤을 최하단으로 이동
    setTimeout(() => {
      if (commentsEndRef.current) {
        commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  // 댓글 삭제 핸들러
  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  return {
    comments,
    commentText,
    page,
    hasMore,
    commentsEndRef: commentsEndRef as React.RefObject<HTMLDivElement>,
    commentListRef: commentListRef as React.RefObject<HTMLDivElement>,
    handleCommentChange,
    handleSubmitComment,
    handleDeleteComment
  };
};