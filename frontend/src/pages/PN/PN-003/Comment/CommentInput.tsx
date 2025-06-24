import { type DetailedHTMLProps, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Icon } from '@/components/ui/Icon'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type CommentInputProps = ReactDivProps & {
  isLoggedIn: boolean
  commentText: string
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmitComment: () => void
  commentInputRef: React.RefObject<HTMLInputElement | null>
}

export const CommentInput = ({
  isLoggedIn,
  commentText,
  onCommentChange,
  onSubmitComment,
  commentInputRef,
}: CommentInputProps) => {
  const textInputBoxClass = 'flex sticky justify-center items-center bg-white px-2 py-2 flex-shrink-0 gap-2'
  const textInputClass =
    'flex w-full px-4 py-2 bg-inputBg placeholder-inputPlaceholder text-sm text-black border border-inputBorder rounded-2xl focus:outline-none focus:ring-1 focus:ring-inputBorder'
  const iconClass = clsx('text-newsCardIcon flex-shrink-0', isLoggedIn && 'cursor-pointer')

  return (
    <div className={textInputBoxClass}>
      <input
        type="text"
        value={commentText}
        onChange={onCommentChange}
        ref={commentInputRef}
        placeholder="댓글을 입력하세요."
        className={textInputClass}
        maxLength={150}
      />
      <Icon name="PaperAirplaneIcon" size={28} variant={'solid'} className={iconClass} onClick={onSubmitComment} />
    </div>
  )
}
