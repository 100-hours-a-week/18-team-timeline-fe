import React from 'react';

interface SentimentAnalysisProps {
  title: string;
  statistics: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ title, statistics }) => {
  if (
    !statistics ||
    statistics.positive == null ||
    statistics.neutral == null ||
    statistics.negative == null
  ) {
    return <div className="text-gray-500 text-sm">감정 분석 데이터를 불러오는 중입니다.</div>;
  }

  return (
    <div className="mt-6 mb-4">
      <h3 className="text-lg text-black font-bold whitespace-pre-line">
        {`${title.slice(0, 20)}...,\n다른 사람들은 어떻게 생각할까?`}
      </h3>
      
      {/* 감정 분석 통계 */}
      <div className="mt-6 mb-8">
        <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
          <div 
            className="bg-gray-600 h-full" 
            style={{ width: `${statistics.positive}%` }}
          ></div>
          <div 
            className="bg-gray-400 h-full" 
            style={{ width: `${statistics.neutral}%` }}
          ></div>
          <div 
            className="bg-black h-full" 
            style={{ width: `${statistics.negative}%` }}
          ></div>
        </div>
        
        {/* 범례 개선: 글자 옆에 색 원, 가까이 붙임 */}
        <div className="flex justify-center mt-3 space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1 text-black">
            <span className="w-3 h-3 bg-gray-600 rounded-full inline-block"></span>
            <span>긍정</span>
          </div>
          <div className="flex items-center space-x-1 text-black">
            <span className="w-3 h-3 bg-gray-400 rounded-full inline-block"></span>
            <span>중립</span>
          </div>
          <div className="flex items-center space-x-1 text-black">
            <span className="w-3 h-3 bg-black rounded-full inline-block"></span>
            <span>부정</span>
          </div>
        </div>

        <div className="text-xs text-center mt-4 text-gray-500">
          *Bge-m3 기반 모델을 활용하여 해당 뉴스에 대한 온라인 반응을<br />긍정/중립/부정으로 분류했습니다.
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
