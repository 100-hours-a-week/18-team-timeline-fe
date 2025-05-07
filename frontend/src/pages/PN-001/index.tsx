import React from 'react';
import Banner from './Banner';
import Category from './Category';
import NewsList from './NewsList';

export default function MainPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  return (
    <div className="container mx-auto px-4 py-4">
      <Banner />
      <Category onCategoryChange={setSelectedCategory} />
      <NewsList category={selectedCategory} />
    </div>
  );
}