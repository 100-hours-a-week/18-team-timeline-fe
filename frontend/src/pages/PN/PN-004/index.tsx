import { Text } from '@/components/ui/Text'
import NewsCardListBox from '../components/layout/NewsCardListBox'
import { useBookmarkLogic } from './useBookmarkLogic'
import { BookmarkMessage } from '@/constants/PN/BookmarkMessage'
import { BookmarkTitleBox } from './BookmarkTitleBox'

export default function BookmarkPage() {
  const { newsCards, hasNext, offset } = useBookmarkLogic()
  return (
    <div className="wrap">
      <BookmarkTitleBox />
      <NewsCardListBox news={newsCards} noNewsText={BookmarkMessage.NO_RESULT} />
    </div>
  )
}
