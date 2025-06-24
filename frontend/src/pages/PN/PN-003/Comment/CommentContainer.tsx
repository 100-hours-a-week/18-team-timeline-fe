import { useEffect, useRef, useState, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import type { Comment } from '../../types/comment'
import { CommentCard } from './CommentCard'
import { CommentInput } from './CommentInput'
import { TimelineMessage } from '@/constants/PN/TimelineMessage'
import { MockComment } from './MockComment'
import { useTypingText } from '../hooks/useTypingText'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type CommentContainerProps = ReactDivProps & {
  comments: Comment[]
  commentText: string
  isLoggedIn: boolean
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmitComment: () => void
  onDeleteComment: (commentId: string) => void
  onLoadMore?: () => void
  shouldScrollToBottom: boolean
  setShouldScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>
}

export const CommentContainer = ({
  comments,
  commentText,
  isLoggedIn,
  onCommentChange,
  onSubmitComment,
  onDeleteComment,
  onLoadMore,
  shouldScrollToBottom,
  setShouldScrollToBottom,
}: CommentContainerProps) => {
  const typingText = useTypingText(`${!isLoggedIn ? '로그인하고 ' : ''}${TimelineMessage.NO_COMMENT}`)

  const commentInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)
  const [shouldPreserveScroll, setShouldPreserveScroll] = useState(false)
  const [shouldPreserveOnDelete, setShouldPreserveOnDelete] = useState(false)
  const prevScrollHeightRef = useRef(0)
  const prevScrollTopRef = useRef(0)

  const sortedComments = [...comments].sort((a, b) => Number(a.id) - Number(b.id))

  useEffect(() => {
    if (listRef.current && isInitialMount.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
      isInitialMount.current = false
    }
  }, [sortedComments.length])

  useEffect(() => {
    const el = listRef.current
    if (!el || !onLoadMore) return

    const handleScroll = () => {
      const reachedTop = el.scrollTop <= 5
      if (reachedTop) {
        prevScrollHeightRef.current = el.scrollHeight
        prevScrollTopRef.current = el.scrollTop
        setShouldPreserveScroll(true)
        onLoadMore()
      }
    }

    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [onLoadMore])

  useEffect(() => {
    if (shouldScrollToBottom && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
      setShouldScrollToBottom(false)
    }
  }, [comments.length, shouldScrollToBottom])

  useEffect(() => {
    if (shouldPreserveScroll && listRef.current) {
      const el = listRef.current
      const newScrollHeight = el.scrollHeight
      el.scrollTop = newScrollHeight - prevScrollHeightRef.current + prevScrollTopRef.current
      setShouldPreserveScroll(false)
    }
  }, [sortedComments.length])

  useEffect(() => {
    if (!listRef.current) return

    prevScrollHeightRef.current = listRef.current.scrollHeight
    prevScrollTopRef.current = listRef.current.scrollTop
    setShouldPreserveOnDelete(true)
  })

  const wrapperClass = 'flex flex-col w-full min-h-[25vh] max-h-[50vh] bg-inputBg text-black rounded-t-xl shadow-inner'
  const cardContainerClass = 'flex-1 flex flex-col gap-4 overflow-y-auto overflow-x-hidden px-4 pb-4 mt-2'
  const inputContainerClass = 'sticky bottom-0 z-10'

  return (
    <div className={wrapperClass}>
      <div ref={listRef} className={cardContainerClass}>
        {sortedComments.length <= 0 && (
          <CommentCard key={'typing'} comment={{ ...MockComment, content: typingText }} onDeleteComment={() => {}} />
        )}
        {sortedComments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} onDeleteComment={onDeleteComment} />
        ))}
      </div>

      <div className={inputContainerClass}>
        <CommentInput
          isLoggedIn={isLoggedIn}
          commentText={commentText}
          onCommentChange={onCommentChange}
          onSubmitComment={onSubmitComment}
          commentInputRef={commentInputRef}
        />
      </div>
    </div>
  )
}
