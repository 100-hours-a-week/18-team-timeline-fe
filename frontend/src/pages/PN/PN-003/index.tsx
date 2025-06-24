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
  const { isLoggedIn } = useAuthStore()
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
    setToastMessage,
  })

  if (!news) {
    return null
  }

  return (
    <div className="wrap">
      <TimelineHeader
        isLoggedIn={isLoggedIn}
        title={news.title}
        updatedAt={news.updatedAt}
        bookmarked={bookmarked}
        onToggleBookmark={handleBookmark}
        onShare={handleShare}
      />
      <Thumbnail title={news.title} image={news.image} />
      <UpdateButtonBox
        isUpdating={isUpdating}
        isUpdateAvailable={isUpdateAvailable}
        isLoggedIn={isLoggedIn}
        handleTimelineUpdate={handleTimelineUpdate}
      />
      <TimelineContainer timeline={news.timeline} />

      <div className="bg-commentBoxBg rounded-xl pt-4 px-4 shadow-2xl" ref={commentListRef}>
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
