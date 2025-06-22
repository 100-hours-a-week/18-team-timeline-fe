import { useEffect, useRef, useCallback } from 'react'
import NewsCardListBox from '../components/layout/NewsCardListBox'
import type { NewsByCategory, Category as CategoryType } from '../types/category'

interface CategoryListBoxProps {
  newsByCategory: NewsByCategory
  selectedCategory: string
  noNewsText: string
  onCategoryChange: (category: string) => void
  loading?: boolean
  loadMore?: (category: CategoryType) => Promise<void>
  hasMore?: (category: CategoryType) => boolean
}

export const CategoryListBox = ({
  newsByCategory,
  selectedCategory,
  noNewsText,
  onCategoryChange,
  loading = false,
  loadMore,
  hasMore
}: CategoryListBoxProps) => {
  const upperCategory = selectedCategory.toUpperCase() as CategoryType
  const selectedNews = newsByCategory?.[upperCategory]?.newsList ?? []
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // 디버깅을 위한 로그
  console.log('CategoryListBox Debug:', {
    selectedCategory,
    upperCategory,
    newsCount: selectedNews.length,
    hasMore: hasMore ? hasMore(upperCategory) : false,
    loading
  })

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries
    if (target.isIntersecting && loadMore && hasMore && hasMore(upperCategory) && !loading) {
      loadMore(upperCategory)
    }
  }, [loadMore, hasMore, upperCategory, loading])

  useEffect(() => {
    const element = loadingRef.current
    if (element) {
      observerRef.current = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: '20px',
        threshold: 0.1
      })
      observerRef.current.observe(element)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  return (
    <div className="w-full">
      <NewsCardListBox news={selectedNews} noNewsText={noNewsText} />
      
      {/* 무한 스크롤 로딩 인디케이터 또는 완료 메시지 */}
      {selectedNews.length > 0 && (
        <div ref={loadingRef} className="w-full flex justify-center items-center py-4">
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          ) : hasMore && hasMore(upperCategory) ? (
            <div className="text-sm text-gray-500">더 많은 뉴스를 불러오는 중...</div>
          ) : (
            <div className="text-sm text-gray-400">모든 뉴스를 불러왔습니다</div>
          )}
        </div>
      )}
    </div>
  )
}
