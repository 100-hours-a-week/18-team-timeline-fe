import React, { useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoryProps {
  onCategoryChange: (category: string) => void;
}

const categories: Category[] = [
  { id: 'all', name: '전체' },
  { id: 'economy', name: '경제' },
  { id: 'sports', name: '스포츠' },
  { id: 'entertainment', name: '연예' },
  { id: 'ktb', name: 'KTB' }
];

const Category: React.FC<CategoryProps> = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="flex justify-center space-x-3 border-b border-gray-200 pb-2 pt-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`px-4 py-2 text-sm font-medium ${
            selectedCategory === category.id
              ? 'text-black font-bold border-b-2 border-black'
              : 'text-gray-500'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default Category;
