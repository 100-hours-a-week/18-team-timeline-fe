import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { TimelineCard as TimelineCardType } from '../../types/timelineCard'
import { TimelineCard } from './TimelineCard'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type TimelineContainerProps = ReactDivProps & {
  timeline: TimelineCardType[]
}

export const TimelineContainer = ({ timeline }: TimelineContainerProps) => {
  const wrapperClass = 'flex flex-col px-4 my-4'

  return (
    <div className={wrapperClass}>
      {timeline.map((card, index) => (
        <TimelineCard key={index} data={card} isLast={index === timeline.length - 1} />
      ))}
    </div>
  )
}
