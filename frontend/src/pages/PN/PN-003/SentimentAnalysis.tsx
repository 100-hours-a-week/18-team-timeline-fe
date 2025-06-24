import { type DetailedHTMLProps, type HTMLAttributes } from 'react'
import type { Statistics } from '../types/statistics'
import { TimelineMessage } from '@/constants/PN/TimelineMessage'
import clsx from 'clsx'
import { Icon } from '@/components/ui/Icon'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type SentimentAnalysisProps = ReactDivProps & {
  statistics: Statistics
}

const SentimentAnalysis = ({ statistics }: SentimentAnalysisProps) => {
  const wrapperClass = 'flex flex-col my-4 px-4 gap-3'
  const titleBoxClass = 'flex flex-col'
  const titleClass = 'flex items-center text-xl text-statsTitle font-bold leading-tight'
  const titleNoticeClass = 'text-[10px] text-statsNotice pl-0.5 leading-tight'

  const statsNoticeContainerClass = 'flex justify-end mt-3 mr-3 space-x-3 text-xs'
  const statsCircleBoxClass = 'flex items-center space-x-0.5 text-statsTitle'
  const statsCircleClass = 'w-3 h-3 rounded-full inline-block'

  return (
    <div className={wrapperClass}>
      <div className={titleBoxClass}>
        <h3 className={titleClass}>
          <Icon name="SparklesIcon" size={20} variant="solid" />
          {TimelineMessage.STATISTICS_TITLE}
        </h3>
        <div className={titleNoticeClass}>{TimelineMessage.STATISTICS_NOTICE}</div>
      </div>

      <div>
        <div className="h-5 bg-gray-200 rounded-full overflow-hidden flex">
          <div className="bg-positive h-full" style={{ width: `${statistics.positive || 33}%` }}></div>
          <div className="bg-neutral h-full" style={{ width: `${statistics.neutral || 33}%` }}></div>
          <div className="bg-negative h-full" style={{ width: `${statistics.negative || 33}%` }}></div>
        </div>

        <div className={statsNoticeContainerClass}>
          <div className={statsCircleBoxClass}>
            <span className={clsx('bg-positive', statsCircleClass)}></span>
            <span>긍정</span>
          </div>
          <div className={statsCircleBoxClass}>
            <span className={clsx('bg-neutral', statsCircleClass)}></span>
            <span>중립</span>
          </div>
          <div className={statsCircleBoxClass}>
            <span className={clsx('bg-negative', statsCircleClass)}></span>
            <span>부정</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SentimentAnalysis
