// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';

// interface News {
//   id: string;
//   title: string;
//   imageUrl: string;
//   category: string;
//   createdAt: string;
// }

// interface NewsListProps {
//   category: string;
// }

// export const NewsList: React.FC<NewsListProps> = ({ category }) => {
//   const [news, setNews] = useState<News[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const pageSize = 20;

//   const loadMoreNews = useCallback(async () => {
//     if (!hasMore) return;

//     try {
//       // Simulate API call
//       const newNews = await fetchNews(category, page);
      
//       if (newNews.length > 0) {
//         setNews(prev => [...prev, ...newNews]);
//         setPage(prev => prev + 1);
//         setHasMore(newNews.length === pageSize);
//       }
//     } catch (error) {
//       console.error('Error loading news:', error);
//     }
//   }, [category, hasMore]);

//   useEffect(() => {
//     // 페이지 초기화 후 한 번만 로드
//     setNews([]);
//     setPage(1);
//     setHasMore(true);
//     loadMoreNews();
//   }, [category]);  // 카테고리가 바뀔 때만 재실행

//   const handleScroll = useCallback((e: Event) => {
//     const element = e.currentTarget as HTMLElement;
//     if (element.scrollHeight - element.scrollTop <= element.clientHeight + 10) {
//       loadMoreNews();
//     }
//   }, [loadMoreNews]);

//   useEffect(() => {
//     const container = document.querySelector('.news-container');
//     if (container) {
//       container.addEventListener('scroll', handleScroll);
//       return () => container.removeEventListener('scroll', handleScroll);
//     }
//   }, [handleScroll]);

//   // Simulated API call
//   const fetchNews = async (category: string, page: number): Promise<News[]> => {
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     // Generate news items for the current page
//     const baseNews: News[] = Array.from({ length: pageSize }, (_, i) => ({
//       id: `${page * pageSize + i + 1}`,
//       title: `Sample News ${page * pageSize + i + 1}`,
//       imageUrl: `https://picsum.photos/seed/${page * pageSize + i + 1}/400/200`,
//       category: ['economy', 'sports', 'entertainment'][i % 3],
//       createdAt: new Date(Date.now() - ((page - 1) * pageSize + i) * 24 * 60 * 60 * 1000).toISOString(),
//       content: `뉴스 ${page * pageSize + i + 1}의 내용입니다. 내용이 길면 잘릴 수도 있습니다. 바로 이렇게요.`
//     }));

//     if (category === 'ktb') {
//       return [
//         {
//           id: 'ktb-vote',
//           title: '투표 페이지로 이동',
//           imageUrl: '',
//           category: 'ktb',
//           createdAt: ''
//         },
//         ...baseNews
//       ];
//     }

//     return baseNews;
//   };

//   return (
//     <div className="space-y-4 news-container">
//       {news.map((newsItem) => (
//         <Link
//           key={newsItem.id}
//           to={newsItem.category === 'ktb' ? '/vote' : `/timeline/${newsItem.id}`}
//           className="group flex flex-col md:flex-row md:items-center bg-white rounded-lg overflow-hidden shadow-md"
//         >
//           {newsItem.category === 'ktb' ? (
//             <div className="md:w-1/3 bg-black text-white flex items-center justify-center p-4">
//               <h3 className="text-xl font-bold">투표 페이지로 이동</h3>
//             </div>
//           ) : (
//             <>
//               <div className="flex-shrink-0 w-[120px] h-[100px] flex items-center justify-center pl-3">
//                 <img
//                   src={newsItem.imageUrl}
//                   alt={newsItem.title}
//                   className="w-[120px] h-[100px] object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
//                 />
//               </div>
//               <div className="p-4 md:p-6 flex-grow">
//                 <h3 className="text-lg font-semibold mb-2 line-clamp-2">
//                   {newsItem.title}
//                 </h3>
//                 <p className="text-gray-600 line-clamp-2 mb-2">
//                   {newsItem.content}
//                 </p>
//                 <div className="text-sm text-gray-500">
//                   {new Date(newsItem.createdAt).toLocaleDateString()}
//                 </div>
//               </div>
//             </>
//           )}
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default NewsList;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface News {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  content: string;
}

interface NewsListProps {
  category: string;
}

export default function NewsList({ category }: NewsListProps) {
  const [news, setNews] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);
  const pageSize = 20;

  // 뉴스 불러오는 함수
  const fetchNews = async (category: string, page: number): Promise<News[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 현재 페이지에 대한 뉴스 아이템 생성
    const baseNews: News[] = Array.from({ length: pageSize }, (_, i) => ({
      id: `${page * pageSize + i + 1}`,
      title: `Sample News ${page * pageSize + i + 1}`,
      imageUrl: `https://picsum.photos/seed/${page * pageSize + i + 1}/400/200`,
      category: ['economy', 'sports', 'entertainment'][i % 3],
      createdAt: new Date(Date.now() - ((page - 1) * pageSize + i) * 24 * 60 * 60 * 1000).toISOString(),
      content: `뉴스 ${page * pageSize + i + 1}의 내용입니다. 내용이 길면 잘릴 수도 있습니다. 바로 이렇게요.`
    }));

    if (category === 'ktb') {
      return [
        {
          id: 'ktb-vote',
          title: '투표 페이지로 이동',
          imageUrl: '',
          category: 'ktb',
          createdAt: '',
          content: ''
        },
        ...baseNews
      ];
    }

    return baseNews;
  };

  // 더 많은 뉴스를 로드하는 함수
  const loadMoreNews = useCallback(async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const newNews = await fetchNews(category, page);
      
      if (newNews.length > 0) {
        setNews(prev => [...prev, ...newNews]);
        setPage(prev => prev + 1);
        setHasMore(newNews.length === pageSize);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setIsLoading(false);
    }
  }, [category, page, hasMore, isLoading]);

  // IntersectionObserver 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreNews();
        }
      },
      { threshold: 0.1 }
    );
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMoreNews, hasMore]);

  // 카테고리가 변경될 때 뉴스 목록 초기화
  useEffect(() => {
    setNews([]);
    setPage(1);
    setHasMore(true);
    loadMoreNews();
  }, [category]);

  // 뉴스 아이템 컴포넌트
  const NewsItem = ({ newsItem }) => {
    if (newsItem.category === 'ktb') {
      return (
        <a
          href="/vote"
          className="group flex flex-col md:flex-row md:items-center bg-white rounded-lg overflow-hidden shadow-md mb-4"
        >
          <div className="w-full bg-[#002A22] text-white flex items-center justify-center p-4">
            <h3 className="text-xl font-bold">투표 페이지로 이동</h3>
          </div>
        </a>
      );
    }

    return (
      <a
        href={`/timeline/${newsItem.id}`}
        className="group flex flex-col md:flex-row items-center w-full overflow-hidden bg-white rounded-lg mb-4"
      >
        <div className="flex-shrink-0 w-[120px] h-[100px] flex items-center justify-center pl-3">
          <img
            src={newsItem.imageUrl}
            alt={newsItem.title}
            className="w-[120px] h-[100px] object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
          />
        </div>
        <div className="p-4 md:p-4 flex-grow text-right">
          <h3 className="text-lg font-semibold text-[20px] line-clamp-2 mb-1">
            {newsItem.title}
          </h3>
          <p className="text-gray-600 text-[14px] line-clamp-2 mb-1">
            {newsItem.content}
          </p>
          <div className="text-[10px] text-[#F2A359]">
            {new Date(newsItem.createdAt).toLocaleDateString()}
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="space-y-2">
      {news.map((newsItem) => (
        <NewsItem key={newsItem.id} newsItem={newsItem} />
      ))}
      
      {/* 로딩 인디케이터 및 observer의 타겟 */}
      <div ref={loaderRef} className="py-4">
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
}