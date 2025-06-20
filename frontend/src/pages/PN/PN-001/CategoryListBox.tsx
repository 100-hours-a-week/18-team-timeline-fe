import NewsCardListBox from '../components/layout/NewsCardListBox'
import type { NewsByCategory } from '../types/category'
import Category from './Category'

interface CategoryListBoxProps {
  newsByCategory: NewsByCategory
  selectedCategory: string
  noNewsText: string
  onCategoryChange: (category: string) => void
}

export const CategoryListBox = ({
  newsByCategory,
  selectedCategory,
  noNewsText,
  onCategoryChange,
}: CategoryListBoxProps) => {
  const upperCategory = selectedCategory.toUpperCase() as keyof typeof newsByCategory
  const selectedNews = newsByCategory?.[upperCategory]?.newsList ?? []

  return (
    <div>
      <Category onCategoryChange={onCategoryChange} />
      <NewsCardListBox news={selectedNews} noNewsText={noNewsText} />
    </div>
  )
}
