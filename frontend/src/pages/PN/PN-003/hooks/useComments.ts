import { useState, useEffect, useRef, useCallback } from 'react'
import type { Comment } from '../../types/comment'
import { ENDPOINTS } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import { TimelineMessage } from '@/constants/PN/TimelineMessage'

interface UseCommentsProps {
  newsId: string
  isLoggedIn: boolean
  userId?: number | null
  username?: string | null
  setToastMessage: (message: string) => void
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

export const useComments = ({
  newsId,
  isLoggedIn,
  userId,
  username,
  setToastMessage,
}: UseCommentsProps): UseCommentsReturn => {
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
  /* 댓글 불러오기                                       */
  /* -------------------------------------------------- */
  const loadComments = useCallback(
    async (pageNum: number) => {
      if (!newsId || loading) return

      setLoading(true)
      const offset = (pageNum - 1) * 20
      try {
        const res = await getData(ENDPOINTS.COMMENT_FETCH(newsId, offset))
        if (!res.success) return

        const newComments: Comment[] = res.data.comments.map((comment: Comment) => {
          const isMine = comment.userId && comment.userId === userId
          return {
            id: comment.id.toString(),
            userId: comment.userId,
            username: isMine ? `${username}(나)` : `${comment.username ?? '탈퇴한 회원'}`,
            content: comment.content,
            createdAt: comment.createdAt,
            isMine,
          }
        })

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
    [newsId, loading, getData, userId, username, setToastMessage],
  )

  /* -------------------------------------------------- */
  /* 최신 댓글 폴링                                      */
  /* -------------------------------------------------- */
  const pollLatestComments = useCallback(async () => {
    if (!newsId) return

    try {
      const res = await getData(ENDPOINTS.COMMENT_FETCH(newsId, 0))
      if (!res.success) return

      const newComments: Comment[] = res.data.comments.map((comment: Comment) => {
        const isMine = comment.userId && comment.userId === userId
        return {
          id: comment.id.toString(),
          userId: comment.userId,
          username: isMine ? `${username}(나)` : `${comment.username ?? '탈퇴한 회원'}`,
          content: comment.content,
          createdAt: comment.createdAt,
          isMine,
        }
      })

      setComments((prev) => {
        const existingIds = new Set(prev.map((c) => c.id))
        const filtered = newComments.filter((c) => !existingIds.has(c.id))
        return [...prev, ...filtered]
      })
    } catch (err) {
      console.error('댓글 폴링 실패:', err)
    }
  }, [newsId, getData, userId, username])

  /* -------------------------------------------------- */
  /* 초기 댓글 로드 및 폴링                               */
  /* -------------------------------------------------- */
  useEffect(() => {
    loadComments(1)

    const interval = setInterval(() => {
      pollLatestComments()
    }, 5000)

    return () => clearInterval(interval)
  }, [pollLatestComments])

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
        root: commentListRef.current,
      },
    )

    const target = commentsEndRef.current
    if (target) observer.observe(target)

    return () => observer.disconnect()
  }, [hasMore, loading, page])

  /* -------------------------------------------------- */
  /* 입력 핸들러                                         */
  /* -------------------------------------------------- */
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value.length > 150) {
      setToastMessage('')
      setTimeout(() => {
        setToastMessage(TimelineMessage.COMMENT_LENGTH_FAIL)
      }, 0)
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
        setCommentText('')
        setToastMessage('')
        setTimeout(() => {
          setToastMessage(TimelineMessage.COMMENT_POST_SUCCESS)
        }, 0)

        await pollLatestComments()

        setShouldScrollToBottom(true)
      }
    } catch (err) {
      console.error('댓글 등록 실패:', err)
      setToastMessage('')
      setTimeout(() => {
        setToastMessage(TimelineMessage.COMMENT_POST_FAIL)
      }, 0)
    }
  }

  /* -------------------------------------------------- */
  /* 댓글 삭제                                           */
  /* -------------------------------------------------- */
  const handleDeleteComment = async (commentId: string) => {
    if (!isLoggedIn || !newsId) return

    try {
      await deleteData(ENDPOINTS.COMMENT_DELETE(newsId, commentId))
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
      setToastMessage('')
      setTimeout(() => {
        setToastMessage(TimelineMessage.COMMENT_DELETE_SUCCESS)
      }, 0)
    } catch (err) {
      console.error('댓글 삭제 실패:', err)
      setToastMessage('')
      setTimeout(() => {
        setToastMessage(TimelineMessage.COMMENT_DELETE_FAIL)
      }, 0)
    }
  }

  /* -------------------------------------------------- */
  /* 수동 더보기                                         */
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
