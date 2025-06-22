import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { NewsCard } from './NewsCard'
import type { News } from '../../types/news'

type SearchResultBoxProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  news: News[]
  noNewsText: string
}

export default function NewsCardListBox({ news, noNewsText }: SearchResultBoxProps) {
  const metaTextBoxClass = 'flex justify-center items-start min-h-screen pt-[30vh]'
  const metaTextClass = 'text-sm text-center text-gray-500 justify-center items-center'

  return (
    <div className="w-full">
      {news.length === 0 && (
        <div className={metaTextBoxClass}>
          <div className={metaTextClass}>{noNewsText}</div>
        </div>
      )}

      {news.map((item) => (
        <NewsCard
          key={item.id}
          id={item.id}
          title={item.title}
          summary={item.summary}
          image={item.image}
          updatedAt={item.updatedAt}
          bookmarked={item.bookmarked === null ? false : item.bookmarked}
        />
      ))}
    </div>
  )
}
