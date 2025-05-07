import type { DetailedHTMLProps, HTMLAttributes } from "react"
import { Text } from "@/components/ui/Text"
import clsx from "clsx"


type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type WrapperProps = ReactDivProps & {
  title: string,
  children: React.ReactNode
}

export const Wrapper = ({
  title, className: _className, children
}: WrapperProps) => {

  const className = clsx(
    'h-fit rounded-xl mx-7 mt-16 py-14',
    'flex flex-col bg-puWrapperColor',
    _className
  )

  const titleClass = clsx(
    'text-3xl font-extrabold text-puTitleColor',
    'pb-9 text-center'
  )

  return (
    <div className={className}>
      <Text className={titleClass}>{title}</Text>
      <div>
        {children}
      </div>
    </div>
  )
}