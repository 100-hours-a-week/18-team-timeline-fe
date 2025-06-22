import { useState, useEffect, useRef, useCallback } from 'react';
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
  loadMoreComments: () => void;
}

/**
 * 댓글 기능을 관리하는 커스텀 훅
 */
export const useComments = ({
  newsData,
  userInfo,
  isLoggedIn,
  onToastShow,
}: UseCommentsProps): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const commentListRef = useRef<HTMLDivElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  /* -------------------------------------------------- */
  /* 초기 댓글 로드                                        */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (newsData) loadComments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsData]);

  /* -------------------------------------------------- */
  /* 댓글 불러오기                                       */
  /* -------------------------------------------------- */
  const loadComments = useCallback(async (pageNum: number) => {
    if (!newsData || loading) return;

    setLoading(true);
    const offset = (pageNum - 1) * 20;
    try {
      const res = await fetch(
        `${API_BASE_URL}/news/${newsData.id}/comments?offset=${offset}`,
      );
      const result = await res.json();

      if (res.ok && result.success) {
        const currentUserNickname = userInfo?.nickname ?? null;
        const currentUserId = userInfo?.id ?? null;

        const newComments: Comment[] = result.data.comments.map((comment: any) => {
          /* 로그인 사용자의 댓글인지 판단 */
          const isMine =
            (currentUserId && comment.userId === currentUserId) ||
            (currentUserNickname && comment.nickname === currentUserNickname);

          return {
            id: comment.id.toString(),
            author: isMine ? `${currentUserNickname || '나'}(나)` : `${comment.username}`,
            content: comment.content,
            createdAt: comment.createdAt,
            isMyComment: isMine,
          } as Comment;
        });

        /* 첫 페이지인지 추가 페이지인지에 따라 댓글 병합 */
        setComments(prev => (pageNum === 1 ? newComments : [...prev, ...newComments]));

        setHasMore(result.data.hasNext);
        setPage(pageNum);
      } else {
        onToastShow?.(result.message || '댓글을 불러오지 못했습니다.', 'bottom');
      }
    } catch (err) {
      console.error('댓글 로딩 실패:', err);
      onToastShow?.('댓글을 불러오는 중 오류가 발생했습니다.', 'bottom');
    } finally {
      setLoading(false);
    }
  }, [newsData, loading, userInfo, onToastShow]);

  /* -------------------------------------------------- */
  /* 무한 스크롤                                         */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          loadComments(page + 1);
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '50px',
        root: commentListRef.current // 댓글창 스크롤 컨테이너를 root로 설정
      },
    );

    const target = commentsEndRef.current;
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  /* -------------------------------------------------- */
  /* 입력 핸들러                                         */
  /* -------------------------------------------------- */
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 150) {
      onToastShow?.('댓글 입력은 최대 150자까지 가능합니다.', 'commentInput');
      return;
    }

    setCommentText(value);
  };

  /* -------------------------------------------------- */
  /* 댓글 작성                                           */
  /* -------------------------------------------------- */
  const handleSubmitComment = async () => {
    if (!commentText.trim() || commentText.length > 150 || !isLoggedIn || !newsData) return;

    const payload = { content: commentText.trim() };

    try {
      const res = await fetch(`${API_BASE_URL}/news/${newsData.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        /* 내 댓글 객체 생성 */
        const newComment: Comment = {
          id: result.data.commentId.toString(),
          author: `${userInfo?.nickname || '나'}(나)`,
          content: commentText.trim(),
          createdAt: new Date().toISOString(),
          isMyComment: true,
        };

        setComments(prev => [...prev, newComment]);
        setCommentText('');
        onToastShow?.('댓글이 등록되었습니다.', 'bottom');
        window.location.reload();
      } else {
        onToastShow?.(result.message || '댓글 등록에 실패했습니다.', 'commentInput');
      }
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      onToastShow?.('댓글 등록 중 오류가 발생했습니다.', 'commentInput');
    }
  };

  /* -------------------------------------------------- */
  /* 댓글 삭제 (서버 반영)                                */
  /* -------------------------------------------------- */
  const handleDeleteComment = async (commentId: string) => {
    if (!isLoggedIn || !newsData) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/news/${newsData.id}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        },
      );

      if (res.status === 204) {
        /* 성공적으로 삭제됐으면 로컬 상태도 제거 */
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        onToastShow?.('댓글이 삭제되었습니다.', 'bottom');
        window.location.reload();
      } else {
        const result = await res.json().catch(() => ({ message: '' }));
        onToastShow?.(result.message || '댓글 삭제에 실패했습니다.', 'commentInput');
      }
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      onToastShow?.('댓글 삭제 중 오류가 발생했습니다.', 'commentInput');
    }
  };

  /* -------------------------------------------------- */
  /* 수동으로 더 많은 댓글 불러오기                      */
  /* -------------------------------------------------- */
  const loadMoreComments = () => {
    if (hasMore && !loading) {
      loadComments(page + 1);
    }
  };

  /* -------------------------------------------------- */
  /* 반환                                                */
  /* -------------------------------------------------- */
  return {
    comments,
    commentText,
    page,
    hasMore,
    commentsEndRef: commentsEndRef as React.RefObject<HTMLDivElement>,
    commentListRef: commentListRef as React.RefObject<HTMLDivElement>,
    handleCommentChange,
    handleSubmitComment,
    handleDeleteComment,
    loadMoreComments,
  };
};
