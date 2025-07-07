import { useState, useEffect, useRef, useCallback } from 'react'
import type { Comment } from '../../types/comment'
import { ENDPOINTS } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import { TimelineMessage } from '@/constants/PN/TimelineMessage'
import { useAuthStore } from '@/stores/useAuthStore'

interface UseCommentsProps {
  newsId: string
  isLoggedIn: boolean
  userId?: number | null,
  username?: string | null,
  setToastMessage: (message: string, position?: any) => void
}

interface UseCommentsReturn {
  comments: Comment[]
  commentText: string
  page: number
  commentsEndRef: React.RefObject<HTMLDivElement>
  commentListRef: React.RefObject<HTMLDivElement>
  handleCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmitComment: () => void
  handleDeleteComment: (commentId: string) => void
  loadMoreComments: () => void
  shouldScrollToBottom: boolean
  setShouldScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * 댓글 기능을 관리하는 커스텀 훅
 */
export const useComments = ({ newsId, isLoggedIn, userId, username, setToastMessage }: UseCommentsProps): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false)

  const commentListRef = useRef<HTMLDivElement>(null)
  const commentsEndRef = useRef<HTMLDivElement>(null)

  const { getData, postData, deleteData } = useRequestStore()

  /* -------------------------------------------------- */
  /* 초기 댓글 로드                                        */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (newsId) loadComments(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsId])

  /* -------------------------------------------------- */
  /* 댓글 불러오기                                       */
  /* -------------------------------------------------- */
  const loadComments = useCallback(
    async (pageNum: number) => {
      if (!newsId || loading) return

      setLoading(true)
      const offset = (pageNum - 1) * 20
      try {
        const res = await getData(ENDPOINTS.COMMENT_FETCH(newsId, offset))
        if (res.success == false) {
          return
        }

        const newComments: Comment[] = res.data.comments.map((comment: any) => {
          const isMine = comment.userId && comment.userId === userId

          return {
            id: comment.id.toString(),
            userId: comment.userId,
            username: isMine ? `${username}(나)` : `${comment.username ?? '탈퇴한 회원'}`,
            content: comment.content,
            createdAt: comment.createdAt,
            isMine: isMine,
          }
        })

        /* 첫 페이지인지 추가 페이지인지에 따라 댓글 병합 */
        setComments((prev) => (pageNum === 1 ? newComments : [...newComments, ...prev]))

        setHasMore(res.data.hasNext)
        setPage(pageNum)
      } catch (err) {
        console.error('댓글 로딩 실패:', err)
        setToastMessage(TimelineMessage.COMMENT_FETCH_FAIL)
      } finally {
        setLoading(false)
      }
    },
    [newsId, loading, setToastMessage],
  )

  /* -------------------------------------------------- */
  /* 무한 스크롤                                         */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadComments(page + 1)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        root: commentListRef.current, // 댓글창 스크롤 컨테이너를 root로 설정
      },
    )

    const target = commentsEndRef.current
    if (target) observer.observe(target)

    return () => observer.disconnect()
  }, [hasMore, loading, page])

  /* -------------------------------------------------- */
  /* 폴링: 5초마다 댓글 자동 새로고침                    */
  /* -------------------------------------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      if (newsId) {
        console.log('폴링: 댓글 새로고침');
        loadComments(1);
      }
    }, 5000); // 5초마다 새로고침
    return () => clearInterval(interval);
  }, [newsId, loadComments]);

  /* -------------------------------------------------- */
  /* 입력 핸들러                                         */
  /* -------------------------------------------------- */
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value.length > 150) {
      setToastMessage(TimelineMessage.COMMENT_LENGTH_FAIL)
      return
    }

    setCommentText(value)
  }

  /* -------------------------------------------------- */
  /* 댓글 작성                                           */
  /* -------------------------------------------------- */
  const handleSubmitComment = async () => {
    if (!commentText.trim() || commentText.length > 150 || !isLoggedIn || !newsId) return

    const payload = { content: commentText.trim() }

    try {
      const res = await postData(ENDPOINTS.COMMENT_CREATE(newsId), payload)
      if (userId == null || username == null) return
      if (res.success) {
        const newComment: Comment = {
          id: res.data.commentId,
          userId: userId,
          username: `${username ?? ''}(나)`,
          content: commentText.trim(),
          createdAt: new Date().toISOString(),
          isMine: true,
        }

        setComments((prev) => [...prev, newComment])
        setCommentText('')
        setToastMessage(TimelineMessage.COMMENT_POST_SUCCESS)
        setShouldScrollToBottom(true)
      } else {
        setToastMessage(TimelineMessage.COMMENT_POST_FAIL)
      }
    } catch (err) {
      console.error('댓글 등록 실패:', err)
      setToastMessage(TimelineMessage.COMMENT_POST_FAIL)
    }
  }

  /* -------------------------------------------------- */
  /* 댓글 삭제 (서버 반영)                                */
  /* -------------------------------------------------- */
  const handleDeleteComment = async (commentId: string) => {
    if (!isLoggedIn || !newsId) return

    try {
      const res = await deleteData(ENDPOINTS.COMMENT_DELETE(newsId, commentId))
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
      setToastMessage(TimelineMessage.COMMENT_DELETE_SUCCESS)
    } catch (err) {
      console.error('댓글 삭제 실패:', err)
      setToastMessage(TimelineMessage.COMMENT_DELETE_FAIL)
    }
  }

  /* -------------------------------------------------- */
  /* 수동으로 더 많은 댓글 불러오기                      */
  /* -------------------------------------------------- */
  const loadMoreComments = () => {
    if (hasMore && !loading) {
      loadComments(page + 1)
    }
  }

  /* -------------------------------------------------- */
  /* 반환                                                */
  /* -------------------------------------------------- */
  return {
    comments,
    commentText,
    page,
    commentsEndRef: commentsEndRef as React.RefObject<HTMLDivElement>,
    commentListRef: commentListRef as React.RefObject<HTMLDivElement>,
    handleCommentChange,
    handleSubmitComment,
    handleDeleteComment,
    loadMoreComments,
    shouldScrollToBottom,
    setShouldScrollToBottom,
  }
}
