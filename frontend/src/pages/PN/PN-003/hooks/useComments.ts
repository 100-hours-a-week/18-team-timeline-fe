import { useState, useEffect, useRef } from 'react';
import type { Comment, NewsResponse, UserInfo } from '../types';
import { API_BASE_URL } from '@/constants/url';

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
  const loadComments = async (pageNum: number) => {
    if (!newsData) return;

    const offset = (pageNum - 1) * 20;
    try {
      const res = await fetch(
        `${API_BASE_URL}/news/${newsData.id}/comments?offset=${offset}`
      );
      const result = await res.json();

      if (res.ok && result.success) {
        const currentUserId = userInfo?.id;

        const newComments: Comment[] = result.data.comments.map((comment: any) => ({
          id: comment.id.toString(),
          author:
            comment.userId === currentUserId
              ? userInfo?.nickname || '나'
              : `익명 ${comment.userId}`,
          content: comment.content,
          createdAt: comment.createdAt,
          isMyComment: comment.userId === currentUserId
        }));

        if (pageNum === 1) {
          setComments(newComments);
        } else {
          setComments(prev => [...prev, ...newComments]);
        }

        setHasMore(result.data.hasNext);
        setPage(pageNum);
      } else {
        onToastShow?.(result.message || '댓글을 불러오지 못했습니다.', 'bottom');
      }
    } catch (err) {
      console.error('댓글 로딩 실패:', err);
      onToastShow?.('댓글을 불러오는 중 오류가 발생했습니다.', 'bottom');
    }
  };

  // 스크롤 감지 및 추가 댓글 로드
  useEffect(() => {
    if (!commentListRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
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
  const handleSubmitComment = async () => {
    if (!commentText.trim() || commentText.length > 150 || !isLoggedIn || !newsData) return;

    const payload = { content: commentText.trim() };

    try {
      const res = await fetch(`${API_BASE_URL}/news/${newsData.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // 서버에서 받은 commentId 사용
        const newComment: Comment = {
          id: result.data.commentId.toString(),
          author: `${userInfo?.nickname || '사용자'}(나)`,
          content: commentText.trim(),
          createdAt: new Date().toISOString(),
          isMyComment: true
        };

        setComments(prev => [...prev, newComment]);
        setCommentText('');
        onToastShow?.('댓글이 등록되었습니다.', 'bottom');

        // 스크롤을 최하단으로 이동
        setTimeout(() => {
          commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        onToastShow?.(result.message || '댓글 등록에 실패했습니다.', 'commentInput');
      }
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      onToastShow?.('댓글 등록 중 오류가 발생했습니다.', 'commentInput');
    }
  };

  // 댓글 삭제 핸들러 (로컬 업데이트 / 서버 연동 시 DELETE 호출 추가 가능)
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
