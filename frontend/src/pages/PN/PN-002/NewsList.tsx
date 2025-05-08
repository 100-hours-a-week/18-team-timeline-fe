import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface News {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  matchScore: number;
}

interface NewsListProps {
  searchQuery: string;
  keywords: string[];
}

export const NewsList: React.FC<NewsListProps> = ({ searchQuery, keywords }) => {
  const [news, setNews] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 20;

  const loadMoreNews = useCallback(async () => {
    if (!hasMore) return;

    try {
      const newNews = await fetchNews(searchQuery, keywords, page);
      
      if (newNews.length > 0) {
        setNews(prev => [...prev, ...newNews]);
        setPage(prev => prev + 1);
        setHasMore(newNews.length === pageSize);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    }
  }, [searchQuery, keywords, hasMore, page]);

  useEffect(() => {
    loadMoreNews();
  }, [loadMoreNews]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 10) {
      loadMoreNews();
    }
  }, [loadMoreNews]);

  useEffect(() => {
    const container = document.querySelector('.news-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Simulated API call with search functionality
  const fetchNews = async (query: string, keywords: string[], page: number): Promise<News[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const baseNews: News[] = Array.from({ length: pageSize }, (_, i) => ({
      id: `${page * pageSize + i + 1}`,
      title: `검색 결과 ${page * pageSize + i + 1} - ${query} 관련 뉴스`,
      imageUrl: `https://picsum.photos/seed/${page * pageSize + i + 1}/400/200`,
      category: ['economy', 'sports', 'entertainment'][i % 3],
      createdAt: new Date(Date.now() - ((page - 1) * pageSize + i) * 24 * 60 * 60 * 1000).toISOString(),
      matchScore: Math.random() * 100
    }));

    // Filter and sort news based on keywords and match score
    const filteredNews = baseNews.filter(news => {
      const title = news.title.toLowerCase();
      const queryMatch = title.includes(query.toLowerCase());
      const keywordMatch = keywords.some(keyword => title.includes(keyword.toLowerCase()));
      return queryMatch || keywordMatch;
    }).sort((a, b) => b.matchScore - a.matchScore);

    return filteredNews;
  };

  return (
    <div className="space-y-4 news-container">
      {news.map((newsItem) => (
        <Link
          key={newsItem.id}
          to={`/timeline/${newsItem.id}`}
          className="group flex flex-col md:flex-row md:items-center bg-white rounded-lg overflow-hidden shadow-md"
        >
          <div className="flex-shrink-0 w-[120px] h-[100px] flex items-center justify-center pl-3">
            <img
              src={newsItem.imageUrl}
              alt={newsItem.title}
              className="w-[120px] h-[100px] object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
            />
          </div>
          <div className="flex-1 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#F2A359] transition-colors">
              {newsItem.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {newsItem.category} • {new Date(newsItem.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NewsList;
