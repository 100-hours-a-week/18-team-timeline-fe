import { useEffect, useRef, type DetailedHTMLProps, type HTMLAttributes } from 'react'
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
}

export const CommentContainer = ({
  comments,
  commentText,
  isLoggedIn,
  onCommentChange,
  onSubmitComment,
  onDeleteComment,
  onLoadMore,
}: CommentContainerProps) => {
  const commentInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)
  const typingText = useTypingText(`${!isLoggedIn ? '로그인하고 ' : ''}${TimelineMessage.NO_COMMENT}`)

  const sortedComments = [...comments].sort((a, b) => Number(a.id) - Number(b.id))

  useEffect(() => {
    if (listRef.current) {
      if (isInitialMount.current) {
        listRef.current.scrollTop = 0
        isInitialMount.current = false
      }
    }
  }, [sortedComments.length])

  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current || !onLoadMore) return

      const el = listRef.current
      const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5

      if (reachedBottom) {
        onLoadMore()
      }
    }

    const listElement = listRef.current
    listElement?.addEventListener('scroll', handleScroll)
    return () => listElement?.removeEventListener('scroll', handleScroll)
  }, [onLoadMore])

  const wrapperClass = 'flex flex-col w-full min-h-[25vh] max-h-[50vh] bg-inputBg text-black rounded-t-xl shadow-inner'
  const cardContainerClass = 'flex-1 flex flex-col gap-4 overflow-y-auto overflow-x-hidden px-4 pb-4 mt-2'

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

      <CommentInput
        isLoggedIn={isLoggedIn}
        commentText={commentText}
        onCommentChange={onCommentChange}
        onSubmitComment={onSubmitComment}
        commentInputRef={commentInputRef}
      />
    </div>
  )
}
