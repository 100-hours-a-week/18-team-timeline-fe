import { useEffect, useState } from 'react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'

type ReactDivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

type ContainerProps = ReactDivProps & {
  children: React.ReactNode
}

export const Container = ({ className: _className, children }: ContainerProps) => {
  const [isSmall, setIsSmall] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < window.screen.width / 2.5)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const containerClass = 'flex items-center justify-center min-h-screen bg-mainBgColor'

  const wrapperClass = clsx(
    isSmall ? 'w-full' : 'w-full max-w-[390px]',
    'h-screen mx-auto bg-myWhite relative overflow-hidden',
    _className
  )
  
  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        {children}
      </div>
    </div>
  )
}
