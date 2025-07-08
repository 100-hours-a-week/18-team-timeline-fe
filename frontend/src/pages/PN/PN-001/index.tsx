import { useState } from 'react'
import { Carousel } from './Carousel'
import { useFetchNormal } from './hooks/useFetchNormal'
import { MainMessage } from '@/constants/PN/MainMessage'
import { CategoryListBox } from './CategoryListBox'

interface MainPageProps {
  initialCategory?: string
}

export default function MainPage({ initialCategory = 'all' }: MainPageProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const { newsByCategory, fetchNews } = useFetchNormal()

  const carouselContainerClass = 'flex flex-col items-center w-full mx-auto px-4 pt-6 pb-4 flex-shrink-0'

  return (
    <div className="flex flex-col w-full">
      <div className={carouselContainerClass}>
        <Carousel />
      </div>
      <CategoryListBox
        newsByCategory={newsByCategory}
        selectedCategory={selectedCategory}
        noNewsText={MainMessage.NO_RESULT}
        onCategoryChange={setSelectedCategory}
        fetchNews={fetchNews}
      />
    </div>
  )
}
