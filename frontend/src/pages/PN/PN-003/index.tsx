import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Toast } from '@/components/ui/Toast'
import { TimelineHeader } from './TimelineHeader'
import { TimelineContainer } from './Timeline/TimelineContainer'
import { useTimelineData } from './hooks/useTimelineData'
import { useAuthStore } from '@/stores/useAuthStore'
import { Thumbnail } from './Thumbnail'
import { UpdateButtonBox } from './UpdateButtonBox'
import { useComments } from './hooks/useComments'
import SentimentAnalysis from './SentimentAnalysis'
import { CommentContainer } from './Comment/CommentContainer'
import { ROUTES } from '@/constants/url'

export default function NewsDetail() {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const { isLoggedIn, userId, username } = useAuthStore()
  const navigate = useNavigate()

  const params = useParams<{ id: string }>()
  const newsId = params.id
  if (!newsId) {
    navigate(ROUTES.MAIN)
    return
  }

  const { news, bookmarked, isUpdateAvailable, isUpdating, handleBookmark, handleShare, handleTimelineUpdate } =
    useTimelineData({
      newsId,
      setToastMessage,
    })

  const {
    comments,
    commentText,
    commentListRef,
    handleCommentChange,
    handleSubmitComment,
    handleDeleteComment,
    loadMoreComments,
    shouldScrollToBottom,
    setShouldScrollToBottom,
  } = useComments({
    newsId,
    isLoggedIn,
    userId,
    username,
    setToastMessage,
  })

  if (!news) {
    return null
  }

  return (
    <div className="flex flex-col w-full h-screen scrollbar-hide overflow-y-auto">
      <TimelineHeader
        isLoggedIn={isLoggedIn}
        title={news.title}
        updatedAt={news.updatedAt}
        bookmarked={bookmarked}
        onToggleBookmark={handleBookmark}
        onShare={handleShare}
      />
      <Thumbnail title={news.title} image={news.image} />
      {news.category !== 'KTB' && (
        <UpdateButtonBox
          isUpdating={isUpdating}
          isUpdateAvailable={isUpdateAvailable}
          isLoggedIn={isLoggedIn}
          handleTimelineUpdate={handleTimelineUpdate}
        />
      )}

      <TimelineContainer timeline={news.timeline} />

      <div className="px-4 pt-4 shadow-2xl bg-commentBoxBg rounded-t-xl" ref={commentListRef}>
        <SentimentAnalysis statistics={news.statistics} />
        <CommentContainer
          comments={comments}
          commentText={commentText}
          isLoggedIn={isLoggedIn}
          onCommentChange={handleCommentChange}
          onSubmitComment={handleSubmitComment}
          onDeleteComment={handleDeleteComment}
          onLoadMore={loadMoreComments}
          shouldScrollToBottom={shouldScrollToBottom}
          setShouldScrollToBottom={setShouldScrollToBottom}
        />
      </div>

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  )
}
