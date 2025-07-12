import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import type { Comment } from '../../types/comment'
import { ENDPOINTS } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import { TimelineMessage } from '@/constants/PN/TimelineMessage'
import { useSidebarAlarmStore } from '@/stores/useSidebarAlarmStore'

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

  const isAlarmOpen = useSidebarAlarmStore((state) => state.isOpen)
  const commentListRef = useRef<HTMLDivElement>(null)
  const commentsEndRef = useRef<HTMLDivElement>(null)

  const { getData, postData, deleteData } = useRequestStore()

  /* -------------------------------------------------- */
  /* 스크롤 보존용 ref                                   */
  /* -------------------------------------------------- */
  const initialScrollDoneRef = useRef(false)
  const prevScrollHeightRef = useRef<number | null>(null)
  const prevScrollTopRef = useRef<number | null>(null)

  /* -------------------------------------------------- */
  /* 댓글 데이터 매핑 공통 함수                           */
  /* -------------------------------------------------- */
  const mapComments = (rawComments: Comment[]): Comment[] => {
    return rawComments.map((comment: Comment) => {
      const isMine = !!(comment.userId && comment.userId === userId)
      return {
        id: comment.id.toString(),
        userId: comment.userId,
        username: isMine ? `${username}(나)` : `${comment.username ?? '탈퇴한 회원'}`,
        content: comment.content,
        createdAt: comment.createdAt,
        isMine,
      }
    })
  }

  /* -------------------------------------------------- */
  /* 댓글 불러오기                                       */
  /* -------------------------------------------------- */
  const loadComments = useCallback(
    async (pageNum: number) => {
      if (!newsId || loading) return

      setLoading(true)

      // 현재 스크롤 상태 저장
      const listEl = commentListRef.current
      if (listEl) {
        prevScrollHeightRef.current = listEl.scrollHeight
        prevScrollTopRef.current = listEl.scrollTop
      }

      const offset = (pageNum - 1) * 20

      try {
        const res = await getData(ENDPOINTS.COMMENT_FETCH(newsId, offset))
        if (!res.success) return

        const newComments = mapComments(res.data.comments)

        setComments((prev) => (pageNum === 1 ? newComments : [...prev, ...newComments]))
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
  /* 스크롤 위치 복원                                    */
  /* -------------------------------------------------- */
  useLayoutEffect(() => {
    const listEl = commentListRef.current
    if (listEl && prevScrollHeightRef.current !== null && prevScrollTopRef.current !== null) {
      const newScrollHeight = listEl.scrollHeight
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current
      listEl.scrollTop = (prevScrollTopRef.current ?? 0) + scrollDiff
    }
    // 사용 후 초기화
    prevScrollHeightRef.current = null
    prevScrollTopRef.current = null
  }, [comments])

  /* -------------------------------------------------- */
  /* 최신 댓글 폴링                                      */
  /* -------------------------------------------------- */
  const pollLatestComments = useCallback(async () => {
    if (!newsId) return

    try {
      const res = await getData(ENDPOINTS.COMMENT_FETCH(newsId, 0))
      if (!res.success) return

      const newComments = mapComments(res.data.comments)

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

    let interval: NodeJS.Timeout | null = null

    if (!isAlarmOpen) {
      interval = setInterval(() => {
        pollLatestComments()
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [pollLatestComments, isAlarmOpen])

  /* -------------------------------------------------- */
  /* 초기 로딩 시 맨 아래로 이동                         */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (commentsEndRef.current && page === 1 && !initialScrollDoneRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'auto' })
      initialScrollDoneRef.current = true // 새로고침 시 한 번만 실행
    }
  }, [comments, page])

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

    setToastMessage('')

    try {
      const res = await postData(ENDPOINTS.COMMENT_CREATE(newsId), payload)
      if (userId == null || username == null) return

      if (res.success) {
        setCommentText('')
        setToastMessage(TimelineMessage.COMMENT_POST_SUCCESS)

        await pollLatestComments()
        setShouldScrollToBottom(true)
      }
    } catch (err) {
      console.error('댓글 등록 실패:', err)
      setToastMessage(TimelineMessage.COMMENT_POST_FAIL)
    }
  }

  /* -------------------------------------------------- */
  /* 댓글 삭제                                           */
  /* -------------------------------------------------- */
  const handleDeleteComment = async (commentId: string) => {
    if (!isLoggedIn || !newsId) return

    setToastMessage('')

    try {
      await deleteData(ENDPOINTS.COMMENT_DELETE(newsId, commentId))
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
      setToastMessage(TimelineMessage.COMMENT_DELETE_SUCCESS)
    } catch (err) {
      console.error('댓글 삭제 실패:', err)
      setToastMessage(TimelineMessage.COMMENT_DELETE_FAIL)
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
