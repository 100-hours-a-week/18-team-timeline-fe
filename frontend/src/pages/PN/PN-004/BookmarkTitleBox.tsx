import { Text } from '@/components/ui/Text'
import { BookmarkMessage } from '@/constants/PN/BookmarkMessage'

export const BookmarkTitleBox = () => {
  const wrapperClass = 'w-full h-[60px] flex justify-center items-center text-center'
  const titleClass = 'text-2xl font-bold text-bookmarkTitle'

  return (
    <div className={wrapperClass}>
      <Text className={titleClass}>{BookmarkMessage.TITLE}</Text>
    </div>
  )
}
