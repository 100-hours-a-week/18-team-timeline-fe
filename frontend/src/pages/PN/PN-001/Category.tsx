import { useState } from 'react'
import clsx from 'clsx'

interface Category {
  id: string
  name: string
}

interface CategoryProps {
  onCategoryChange: (category: string) => void
}

const categories: Category[] = [
  { id: 'all', name: '전체' },
  { id: 'economy', name: '경제' },
  { id: 'sports', name: '스포츠' },
  { id: 'entertainment', name: '연예' },
  { id: 'ktb', name: 'KTB' },
]

const Category: React.FC<CategoryProps> = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    onCategoryChange(category)
  }

  const wrapperClass = 'flex justify-between flex-wrap w-full'
  const categoryItemClass = 'flex-1 text-center py-2 text-sm text-categoryText'

  return (
    <div className="w-full px-4">
      <div className={wrapperClass}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={clsx(
              categoryItemClass,
              selectedCategory === category.id
                ? 'font-bold border-b-2 border-point'
                : 'font-medium border-b-2 border-categoryBorder',
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Category
