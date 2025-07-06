import { type DetailedHTMLProps, type HTMLAttributes } from 'react'
import type { Comment } from '../../types/comment'
import { getRelativeDateTime } from '@/utils/getRelativeDateTime'
import clsx from 'clsx'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type CommentCardProps = ReactDivProps & {
  comment: Comment
  onDeleteComment: (commentId: string) => void
}

export const CommentCard = ({ comment, onDeleteComment }: CommentCardProps) => {
  const wrapperClass = clsx(
    'w-full bg-commentCardBg p-4 shadow-sm',
    comment.isMine ? 'rounded-t-xl rounded-bl-xl' : 'rounded-t-xl rounded-br-xl',
  )
  const titleDeleteClass = 'flex justify-center items-center gap-2'
  const titleClass = 'flex justify-between items-center mb-1 text-sm'
  const authorClass = clsx('font-bold', comment.userId ? 'text-newsCardTitle' : 'text-commentWithdrawAuthor')
  const contentClass = 'text-sm text-newsCardSummary leading-relaxed break-words'
  const btnClass = 'text-xs text-newsCardTime'
  const metaTextClass = 'text-xs text-newsCardSummary'

  return (
    <div className={wrapperClass}>
      <div className={titleClass}>
        <div className={titleDeleteClass}>
          <span className={authorClass}>{comment.username}</span>
          {comment.isMine && (
            <button onClick={() => onDeleteComment(comment.id)} className={btnClass}>
              삭제
            </button>
          )}
        </div>
        <span className={metaTextClass}>{getRelativeDateTime(comment.createdAt)}</span>
      </div>
      <p className={contentClass}>{comment.content}</p>
    </div>
  )
}
