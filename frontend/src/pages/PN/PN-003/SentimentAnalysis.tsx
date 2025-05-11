import React from 'react';

interface SentimentAnalysisProps {
  title: string;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ title, sentiment }) => {
  return (
    <div className="mt-12 mb-4">
      <h3 className="text-lg font-bold whitespace-pre-line">
        {`${title},\n다른 사람들은 어떻게 생각할까?`}
      </h3>
      
      {/* 감정 분석 통계 */}
      <div className="mt-6 mb-8">
        <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
          <div 
            className="bg-black h-full" 
            style={{ width: `${sentiment.negative}%` }}
          ></div>
          <div 
            className="bg-gray-400 h-full" 
            style={{ width: `${sentiment.neutral}%` }}
          ></div>
          <div 
            className="bg-gray-600 h-full" 
            style={{ width: `${sentiment.positive}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>긍정</span>
          <span>중립</span>
          <span>부정</span>
        </div>
        <div className="text-xs text-center mt-4 text-gray-500">
          *BERT 기반 모델을 활용하여 긍정/중립/부정으로 분류했습니다.
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;