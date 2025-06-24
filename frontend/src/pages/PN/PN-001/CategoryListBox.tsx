import { useEffect, useRef } from 'react'
import type { NewsByCategory } from '../types/category'
import NewsCardListBox from '../components/layout/NewsCardListBox'
import Category from './Category'

interface CategoryListBoxProps {
  newsByCategory: NewsByCategory
  selectedCategory: string
  noNewsText: string
  onCategoryChange: (category: string) => void
  fetchNews: (category: string, offset: string, append?: boolean) => void
}

export const CategoryListBox = ({
  newsByCategory,
  selectedCategory,
  noNewsText,
  onCategoryChange,
  fetchNews,
}: CategoryListBoxProps) => {
  const upperCategory = selectedCategory.toUpperCase() as keyof NewsByCategory
  const selectedData = newsByCategory[upperCategory]
  const selectedNews = selectedData?.newsList ?? []
  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && selectedData?.hasNext) {
          fetchNews(
            selectedCategory,
            String(selectedData.offset ?? selectedNews.length),
            true,
          )
        }
      },
      { threshold: 1.0 },
    )

    const target = observerRef.current
    if (target) observer.observe(target)
    return () => {
      if (target) observer.unobserve(target)
    }
  }, [selectedCategory, selectedData?.hasNext, selectedData?.offset, fetchNews])

  return (
    <div>
      <Category onCategoryChange={onCategoryChange} />
      <NewsCardListBox news={selectedNews} noNewsText={noNewsText} />
      {selectedData?.hasNext && <div ref={observerRef} className="h-10" />}
    </div>
  )
}
