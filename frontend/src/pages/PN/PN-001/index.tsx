import { useState } from 'react'
import { Carousel } from './Carousel'
import { useFetchNormal } from './useFetchNormal'
import { MainMessage } from '@/constants/PN/MainMessage'
import { CategoryListBox } from './CategoryListBox'
import Category from './Category'

interface MainPageProps {
  initialCategory?: string
}

export default function MainPage({ initialCategory = 'all' }: MainPageProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const { newsByCategory, loading, loadMore, hasMore } = useFetchNormal()

  return (
    <div className="flex flex-col h-full bg-pageBg">
      <div className="max-w-screen-md mx-auto w-full px-4 pt-6 pb-4 flex-shrink-0">
        <Carousel />
      </div>
      <div className="max-w-screen-md mx-auto w-full flex-shrink-0">
        <Category onCategoryChange={(category) => setSelectedCategory(category)} />
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="max-w-screen-md mx-auto w-full">
          <CategoryListBox
            newsByCategory={newsByCategory}
            selectedCategory={selectedCategory}
            noNewsText={MainMessage.NO_RESULT}
            onCategoryChange={(category) => setSelectedCategory(category)}
            loading={loading}
            loadMore={loadMore}
            hasMore={hasMore}
          />
        </div>
      </div>
    </div>
  )
}
