import React from 'react';
import TimelineCard from './TimelineCard';
import type { TimelineCard as TimelineCardType } from './types';

interface TimelineContainerProps {
  timeline: TimelineCardType[];
  showSources: Record<string, boolean>;
  toggleSources: (cardId: string) => void;
}

const TimelineContainer: React.FC<TimelineContainerProps> = ({
  timeline,
  showSources,
  toggleSources
}) => {
  return (
    <div className="max-h-[calc(100vh-500px)] overflow-y-auto pr-2 py-2">
      <div className="relative">
        {/* 타임라인 배경 수직선 (선택 사항) */}
        {timeline.length > 0 && (
          <div className="absolute left-[1.1rem] top-0 w-0.5 h-full bg-gray-100 -z-10"></div>
        )}
        
        {timeline.map((card, index) => (
          <TimelineCard
            key={card.id}
            data={card}
            showSources={showSources[card.id] || false}
            onToggleSources={() => toggleSources(card.id)}
            isLast={index === timeline.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineContainer;