import { useState } from 'react'
import { Carousel } from './Carousel'
import { useFetchNormal } from './useFetchNormal'
import { MainMessage } from '@/constants/PN/MainMessage'
import { CategoryListBox } from './CategoryListBox'

interface MainPageProps {
  initialCategory?: string
}

export default function MainPage({ initialCategory = 'all' }: MainPageProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const { newsByCategory } = useFetchNormal()

  return (
    <div className="w-full h-full bg-pageBg">
      <div className="w-full px-4 pt-6 pb-4 flex-shrink-0">
        <Carousel />
      </div>
      <CategoryListBox
        newsByCategory={newsByCategory}
        selectedCategory={selectedCategory}
        noNewsText={MainMessage.NO_RESULT}
        onCategoryChange={(category) => setSelectedCategory(category)}
      />
    </div>
  )
}
