import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface News {
    id: string;
    title: string;
    imageUrl: string;
    category: string;
    createdAt: string;
    matchScore: number;
    content: string;
    source: string;
    author: string;
}

export default function NewsDetail() {
    const { id } = useParams<{ id: string }>();
    const { isLoggedIn } = useAuthStore();
    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                setLoading(true);
                // TODO: Implement actual news fetching logic
                const mockNews: News = {
                    id: id || '',
                    title: 'Sample News Title',
                    imageUrl: 'https://via.placeholder.com/800x400',
                    category: 'Finance',
                    createdAt: new Date().toISOString(),
                    matchScore: 0.95,
                    content: 'This is the detailed content of the news article. It should contain the full text of the article that was summarized in the search results.',
                    source: 'Sample News Source',
                    author: 'John Doe'
                };
                setNews(mockNews);
            } catch (error) {
                console.error('Failed to fetch news detail:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNewsDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFAF7]">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-screen bg-[#FDFAF7]">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold mb-4">News Not Found</h1>
                    <p className="text-gray-600">The requested news article could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFAF7]">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Image */}
                        <div className="w-full md:w-1/3">
                            <img 
                                src={news.imageUrl} 
                                alt={news.title} 
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
                            <div className="flex items-center gap-4 text-gray-600 mb-4">
                                <span>{new Date(news.createdAt).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{news.category}</span>
                                <span>•</span>
                                <span>{news.source}</span>
                            </div>
                            <div className="prose max-w-none mb-6">
                                <p>{news.content}</p>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600">
                                <span>Author: {news.author}</span>
                                <span>•</span>
                                <span>Match Score: {(news.matchScore * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}