import type { TimelineCard } from './timelineCard'

export interface NewsDetail {
  id: string
  title: string
  image?: string
  category: string
  updatedAt: string
  bookmarked: boolean
  timeline: TimelineCard[]
  statistics: {
    positive: number
    neutral: number
    negative: number
  }
}
