import type { News } from "./news"

export type Category = 'ALL' | 'ECONOMY' | 'ENTERTAINMENT' | 'SPORTS' | 'KTB'
export type NewsByCategory = {
  [key in Category]?: {
    newsList: News[]
    offset: number
    hasNext: boolean
  }
}