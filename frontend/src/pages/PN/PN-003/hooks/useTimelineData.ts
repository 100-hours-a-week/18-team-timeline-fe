import { useState, useEffect, useCallback } from 'react';
import { NewsResponse, UserInfo, NewsSearchItem } from '../types';

interface UseTimelineDataProps {
  id: string | undefined;
  userInfo: UserInfo | null;
}

interface UseTimelineDataReturn {
  newsData: NewsResponse | null;
  loading: boolean;
  error: string | null;
  isBookmarked: boolean;
  setIsBookmarked: React.Dispatch<React.SetStateAction<boolean>>;
  showSources: Record<string, boolean>;
  setShowSources: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isUpdateAvailable: boolean;
  isUpdating: boolean;
  handleTimelineUpdate: () => void;
  toggleSources: (cardId: string) => void;
}

/**
 * 타임라인 데이터를 관리하는 커스텀 훅 (더미 데이터 버전)
 */
export const useTimelineData = ({ id, userInfo }: UseTimelineDataProps): UseTimelineDataReturn => {
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSources, setShowSources] = useState<Record<string, boolean>>({});
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // 더미 데이터 가져오기
  const fetchNewsData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      
      // 딜레이 시뮬레이션 (실제 API 요청처럼 보이게)
      await new Promise(resolve => setTimeout(resolve, 800));

      // 더미 데이터
      const mockData: NewsResponse = {
        id: id,
        title: '판교 유스페이스 벚꽃 만개',
        lastUpdated: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25분 전
        imageUrl: 'https://picsum.photos/seed/${id}/400/200',
        sourceUrl: 'https://example.com',
        sourceName: 'Example News',
        isBookmarked: false,
        timeline: [
          {
            id: '1',
            title: '4월 동안교의 정경',
            startDate: '2025.04.01',
            endDate: '2025.04.07',
            content: '대동병이 권위된 때 또는 대통령 선거자가 사망하거나 판결기타의 사유로 그 자격을 상실한 때에는 60일 이내에 후임자를 선거한다. 국가는 법률이 정하는 바에 의하여 재외국민을 보호할 의무를 진다.',
            sources: [
              { url: 'https://www.example.com/article/12345', name: 'Example News' },
              { url: 'https://www.loremipsum.io', name: 'Lorem Ipsum' },
              { url: 'https://dummy-source.net', name: 'Dummy Source' }
            ]
          },
          {
            id: '2',
            title: '3월 동안교의 정경',
            startDate: '2025.03.01',
            endDate: '2025.03.31',
            content: '대동병이 권위된 때 또는 대통령 선거자가 사망하거나 판결기타의 사유로 그 자격을 상실한 때에는 60일 이내에 후임자를 선거한다. 국가는 법률이 정하는 바에 의하여 재외국민을 보호할 의무를 진다.',
            sources: [
              { url: 'https://www.example.com/article/12345', name: 'Example News' }
            ]
          },
          {
            id: '3',
            title: '2월 동안교의 정경',
            startDate: '2025.02.01',
            endDate: '2025.02.15',
            content: '모든 국민은 종교의 자유를 가진다. 공화국민회의법률에서의 언론권리는 국민투표리의 또는 정치사태에 관한 규칙을 제한할 수 있으며, 법위의 집권 대통령이 아닌 법원의 한가는 10년으로 하며, 법원이 정하는 바에 의하여 연임할 수 있다. 모든 국민은 헌법에 법이 한한 법례에 의하여 법관에 의한 재판을 받을 권리를 가진다.',
            sources: [
              { url: 'https://www.example.com/article/12345', name: 'Example News' }
            ]
          },
          {
            id: '4',
            title: '1월 동안교의 정경',
            startDate: '2025.01.01',
            endDate: '2025.01.31',
            content: '대동병이 권위된 때 또는 대통령 선거자가 사망하거나 판결기타의 사유로 그 자격을 상실한 때에는 60일 이내에 후임자를 선거한다.',
            sources: [
              { url: 'https://www.example.com/article/12345', name: 'Example News' }
            ]
          }
        ],
        comments: Array(40).fill(null).map((_, index) => ({
          id: `comment-${index + 1}`,
          author: index % 5 === 0 ? `${userInfo?.nickname || '사용자'}(나)` : `사용자${index + 1}`,
          content: `댓글 내용 ${index + 1}. 이 기사에 대한 의견입니다.`,
          createdAt: new Date(Date.now() - index * 3600000).toISOString(),
          isMyComment: index % 5 === 0
        })),
        sentiment: {
          positive: 35,
          neutral: 45,
          negative: 20
        }
      };
      
      // 마지막 업데이트 시간이 24시간이 지났는지 확인
      const lastUpdated = new Date(mockData.lastUpdated);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
      
      // 테스트를 위해 항상 업데이트 가능하도록 설정 (실제로는 24시간 조건 사용)
      // setIsUpdateAvailable(hoursDiff >= 24);
      setIsUpdateAvailable(true);
      
      setNewsData(mockData);
      setIsBookmarked(mockData.isBookmarked);
      setLoading(false);
    } catch (err) {
      console.error('더미 데이터 로드 오류:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  }, [id, userInfo]);

  // 최초 데이터 로드
  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  // 타임라인 업데이트 핸들러
  const handleTimelineUpdate = async () => {
    if (!isUpdateAvailable || !id) {
      return;
    }
    
    setIsUpdating(true);
    
    // 딜레이 시뮬레이션 (실제 API 요청처럼 보이게)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 업데이트 성공 가정
    if (newsData) {
      setNewsData({
        ...newsData,
        lastUpdated: new Date().toISOString()
      });
    }
    
    setIsUpdateAvailable(false);
    setIsUpdating(false);
  };
  
  // 소스 토글 핸들러
  const toggleSources = (cardId: string) => {
    setShowSources(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  return {
    newsData,
    loading,
    error,
    isBookmarked,
    setIsBookmarked,
    showSources,
    setShowSources,
    isUpdateAvailable,
    isUpdating,
    handleTimelineUpdate,
    toggleSources
  };
};

/**
 * 뉴스 검색 결과를 관리하는 커스텀 훅 (더미 데이터 버전)
 */
export const useNewsSearch = (initialTags: string[] = []) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newsList, setNewsList] = useState<NewsSearchItem[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 더미 뉴스 생성 함수
  const generateDummyNews = (count: number, startIndex: number): NewsSearchItem[] => {
    return Array(count).fill(null).map((_, index) => ({
      id: startIndex + index,
      title: `${tags.join(', ')}에 관한 뉴스 #${startIndex + index}`,
      summary: `이것은 ${tags.join(', ')}에 관한 뉴스 기사 요약입니다. 최대 36자까지 표시됩니다.`,
      image: `https://source.unsplash.com/random/300x200?sig=${startIndex + index}`,
      updatedAt: new Date(Date.now() - (startIndex + index) * 3600000).toISOString(),
      bookmarked: Math.random() > 0.8 // 20% 확률로 북마크됨
    }));
  };

  // 태그 업데이트
  const updateTags = (newTags: string[]) => {
    // 태그 최대 6개로 제한
    if (newTags.length > 6) {
      newTags = newTags.slice(0, 6);
    }
    
    setTags(newTags);
    setOffset(0);
    setNewsList([]);
    setHasNext(true);
  };

  // 뉴스 검색 시뮬레이션
  const fetchNewsSearch = useCallback(async (reset: boolean = false) => {
    // 태그가 없으면 검색 불가
    if (tags.length === 0) {
      setError('검색어를 입력해주세요.');
      return;
    }

    // 마지막 페이지인 경우 더 불러오지 않음
    if (!hasNext && !reset) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Reset이 true이면 offset 초기화
      const currentOffset = reset ? 0 : offset;
      
      // 딜레이 시뮬레이션 (실제 API 요청처럼 보이게)
      await new Promise(resolve => setTimeout(resolve, 800));

      // 더미 데이터 생성 (20개씩)
      const PAGE_SIZE = 20;
      const dummyNews = generateDummyNews(PAGE_SIZE, currentOffset);
      
      // 총 100개만 생성 (5페이지)
      const newOffset = currentOffset + PAGE_SIZE;
      const moreData = newOffset < 100;
      
      // 데이터 업데이트
      setNewsList(prev => reset ? dummyNews : [...prev, ...dummyNews]);
      setOffset(newOffset);
      setHasNext(moreData);
    } catch (err) {
      console.error('뉴스 검색 오류:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [tags, offset, hasNext]);

  // 태그가 변경되면 데이터 다시 로드
  useEffect(() => {
    if (tags.length > 0) {
      fetchNewsSearch(true);
    }
  }, [tags]);

  // 더 보기
  const loadMore = () => {
    if (!loading && hasNext) {
      fetchNewsSearch();
    }
  };

  return {
    tags,
    newsList,
    hasNext,
    loading,
    error,
    updateTags,
    loadMore
  };
};

// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { NewsResponse, UserInfo } from '../types';

// interface UseTimelineDataProps {
//   id: string | undefined;
//   userInfo: UserInfo | null;
// }

// interface UseTimelineDataReturn {
//   newsData: NewsResponse | null;
//   loading: boolean;
//   error: string | null;
//   isBookmarked: boolean;
//   setIsBookmarked: React.Dispatch<React.SetStateAction<boolean>>;
//   showSources: Record<string, boolean>;
//   setShowSources: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   isUpdateAvailable: boolean;
//   isUpdating: boolean;
//   handleTimelineUpdate: () => void;
//   toggleSources: (cardId: string) => void;
// }

// interface NewsApiResponse {
//   success: boolean;
//   message: string;
//   data: {
//     newsList: Array<{
//       id: number;
//       title: string;
//       summary: string;
//       image: string;
//       updatedAt: string;
//       bookmarked: boolean;
//     }>;
//     offset: number;
//     hasNext: boolean;
//   };
// }

// /**
//  * 타임라인 데이터를 관리하는 커스텀 훅
//  */
// export const useTimelineData = ({ id, userInfo }: UseTimelineDataProps): UseTimelineDataReturn => {
//   const [newsData, setNewsData] = useState<NewsResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [showSources, setShowSources] = useState<Record<string, boolean>>({});
//   const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);

//   // 데이터를 가져오는 함수
//   const fetchNewsData = useCallback(async () => {
//     if (!id) return;

//     try {
//       setLoading(true);

//       // 실제 API 호출 - 단일 뉴스 상세 정보 가져오기 (API가 구현되었다고 가정)
//       // 참고: tags 쿼리 파라미터는 검색 결과 API에서 사용하는 것으로 보입니다.
//       // 상세 페이지에서는 id를 사용하는 엔드포인트가 필요할 것입니다.
//       const response = await axios.get(`/api/news/${id}`);
      
//       if (response.data.success) {
//         // API 응답을 NewsResponse 형식으로 변환
//         const newsItem = response.data.data;
        
//         // 마지막 업데이트 시간이 24시간이 지났는지 확인
//         const lastUpdated = new Date(newsItem.updatedAt);
//         const now = new Date();
//         const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
//         setIsUpdateAvailable(hoursDiff >= 24);
        
//         // 북마크 상태 설정
//         setIsBookmarked(newsItem.bookmarked || false);
        
//         // 변환된 데이터 설정
//         setNewsData({
//           id: newsItem.id.toString(),
//           title: newsItem.title,
//           lastUpdated: newsItem.updatedAt,
//           imageUrl: newsItem.image,
//           sourceUrl: newsItem.sourceUrl || '',
//           sourceName: newsItem.sourceName || '출처 없음',
//           isBookmarked: newsItem.bookmarked || false,
//           timeline: newsItem.timeline || [],
//           comments: newsItem.comments || [],
//           sentiment: newsItem.sentiment || { positive: 33, neutral: 33, negative: 34 }
//         });
//       } else {
//         setError(response.data.message || '데이터를 불러오는 중 오류가 발생했습니다.');
//       }
      
//       setLoading(false);
//     } catch (err) {
//       console.error('뉴스 데이터 가져오기 오류:', err);
      
//       if (axios.isAxiosError(err)) {
//         // API 에러 처리
//         if (err.response) {
//           // 서버가 응답을 반환한 경우
//           switch (err.response.status) {
//             case 400:
//               setError('잘못된 요청입니다. 요청 형식을 확인해주세요.');
//               break;
//             case 404:
//               setError('요청한 뉴스를 찾을 수 없습니다.');
//               break;
//             case 405:
//               setError('허용되지 않은 요청 방식입니다.');
//               break;
//             case 429:
//               setError('요청 속도가 너무 빠릅니다. 잠시 후 다시 시도해주세요.');
//               break;
//             default:
//               setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
//           }
//         } else if (err.request) {
//           // 요청은 보냈으나 응답을 받지 못한 경우
//           setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
//         } else {
//           // 요청 설정 중 오류가 발생한 경우
//           setError('요청을 처리하는 중 오류가 발생했습니다.');
//         }
//       } else {
//         // 기타 오류
//         setError('알 수 없는 오류가 발생했습니다.');
//       }
      
//       setLoading(false);
//     }
//   }, [id]);

//   // 최초 데이터 로드
//   useEffect(() => {
//     fetchNewsData();
//   }, [fetchNewsData]);

//   // 타임라인 업데이트 핸들러
//   const handleTimelineUpdate = async () => {
//     if (!isUpdateAvailable || !id) {
//       return;
//     }
    
//     setIsUpdating(true);
    
//     try {
//       // API로 타임라인 업데이트 요청 (API가 구현되었다고 가정)
//       const response = await axios.post(`/api/news/${id}/update`);
      
//       if (response.data.success) {
//         // 업데이트 성공 시 데이터 다시 불러오기
//         await fetchNewsData();
//         setIsUpdateAvailable(false);
//       } else {
//         setError(response.data.message || '타임라인 업데이트 중 오류가 발생했습니다.');
//       }
//     } catch (err) {
//       console.error('타임라인 업데이트 오류:', err);
//       setError('타임라인 업데이트 중 오류가 발생했습니다.');
//     } finally {
//       setIsUpdating(false);
//     }
//   };
  
//   // 북마크 토글 핸들러 (이 함수는 외부에서 호출할 예정)
//   const toggleBookmark = async () => {
//     if (!id) return;
    
//     try {
//       // API로 북마크 토글 요청 (API가 구현되었다고 가정)
//       const response = await axios.post(`/api/news/${id}/bookmark`, {
//         bookmarked: !isBookmarked
//       });
      
//       if (response.data.success) {
//         // 북마크 상태 업데이트
//         setIsBookmarked(!isBookmarked);
        
//         // newsData의 북마크 상태도 업데이트
//         if (newsData) {
//           setNewsData({
//             ...newsData,
//             isBookmarked: !isBookmarked
//           });
//         }
//       }
//     } catch (err) {
//       console.error('북마크 토글 오류:', err);
//       // 에러 처리는 호출하는 측에서 처리
//     }
//   };
  
//   // 소스 토글 핸들러
//   const toggleSources = (cardId: string) => {
//     setShowSources(prev => ({
//       ...prev,
//       [cardId]: !prev[cardId]
//     }));
//   };

//   return {
//     newsData,
//     loading,
//     error,
//     isBookmarked,
//     setIsBookmarked,
//     showSources,
//     setShowSources,
//     isUpdateAvailable,
//     isUpdating,
//     handleTimelineUpdate,
//     toggleSources
//   };
// };

// // 검색 결과를 가져오는 커스텀 훅 (PN-002 페이지용)
// export const useNewsSearch = (initialTags: string[] = []) => {
//   const [tags, setTags] = useState<string[]>(initialTags);
//   const [newsList, setNewsList] = useState<any[]>([]);
//   const [offset, setOffset] = useState<number>(0);
//   const [hasNext, setHasNext] = useState<boolean>(true);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // 검색 태그 업데이트
//   const updateTags = (newTags: string[]) => {
//     // 최대 6개까지만 허용
//     if (newTags.length > 6) {
//       newTags = newTags.slice(0, 6);
//     }
    
//     setTags(newTags);
//     // 태그가 변경되면 offset 초기화하고 데이터 다시 로드
//     setOffset(0);
//     setNewsList([]);
//   };

//   // 뉴스 검색 데이터 가져오기
//   const fetchNewsSearch = useCallback(async (reset: boolean = false) => {
//     // 태그가 없으면 검색 불가
//     if (tags.length === 0) {
//       setError('검색어를 입력해주세요.');
//       return;
//     }

//     // 마지막 페이지인 경우 더 불러오지 않음
//     if (!hasNext && !reset) {
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       // Reset이 true이면 offset 초기화
//       const currentOffset = reset ? 0 : offset;

//       // API 호출
//       const response = await axios.get<NewsApiResponse>('/api/news', {
//         params: {
//           tags: tags.join(','),
//           offset: currentOffset
//         }
//       });

//       if (response.data.success) {
//         const { newsList: fetchedNewsList, offset: newOffset, hasNext: moreData } = response.data.data;
        
//         // 데이터 업데이트
//         setNewsList(prev => reset ? fetchedNewsList : [...prev, ...fetchedNewsList]);
//         setOffset(newOffset);
//         setHasNext(moreData);
//       } else {
//         setError(response.data.message || '데이터를 불러오는 중 오류가 발생했습니다.');
//       }
//     } catch (err) {
//       console.error('뉴스 검색 오류:', err);
      
//       if (axios.isAxiosError(err)) {
//         // API 에러 처리
//         if (err.response) {
//           switch (err.response.status) {
//             case 400:
//               setError('잘못된 요청입니다. 검색어를 확인해주세요.');
//               break;
//             case 429:
//               setError('요청 속도가 너무 빠릅니다. 잠시 후 다시 시도해주세요.');
//               break;
//             default:
//               setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
//           }
//         } else if (err.request) {
//           setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
//         } else {
//           setError('요청을 처리하는 중 오류가 발생했습니다.');
//         }
//       } else {
//         setError('알 수 없는 오류가 발생했습니다.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [tags, offset, hasNext]);

//   // 태그가 변경되면 데이터 다시 로드
//   useEffect(() => {
//     if (tags.length > 0) {
//       fetchNewsSearch(true);
//     }
//   }, [tags]);

//   // 더 보기
//   const loadMore = () => {
//     if (!loading && hasNext) {
//       fetchNewsSearch();
//     }
//   };

//   return {
//     tags,
//     newsList,
//     hasNext,
//     loading,
//     error,
//     updateTags,
//     loadMore
//   };
// };