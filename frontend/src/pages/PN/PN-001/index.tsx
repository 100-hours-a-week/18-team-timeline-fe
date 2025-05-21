import React from 'react';
import Banner from './Banner';
import Category from './Category';
import NewsList from './NewsList';

interface MainPageProps {
  initialCategory?: string;
}

export default function MainPage({ initialCategory = 'all' }: MainPageProps) {
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);

  return (
    <div className="h-screen bg-[#FDFAF7] flex flex-col">
      <div className="container mx-auto px-4 pt-6 pb-4 flex-shrink-0">
        <Banner />
        <Category onCategoryChange={setSelectedCategory} />
      </div>
      
      {/* 스크롤 가능한 컨테이너 - flex-grow로 나머지 공간 차지 */}
      <div className="container mx-auto px-4 flex-grow overflow-y-auto pb-20 news-container">
        <NewsList category={selectedCategory} />
      </div>
    </div>
  );
}