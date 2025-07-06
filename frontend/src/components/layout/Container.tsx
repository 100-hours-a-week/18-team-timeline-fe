import { useEffect, useState } from 'react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'
import { BgItem1, BgItem2, BgItem3 } from '@/assets'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type ContainerProps = ReactDivProps & {
  children: React.ReactNode
}

export const Container = ({ children }: ContainerProps) => {
  const [isSmall, setIsSmall] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < window.screen.width / 2.5)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const containerClass = clsx(
    'flex items-center justify-center min-h-screen bg-mainBg',
    'bg-[radial-gradient(theme(colors.mainPoint)_1.5px,transparent_1px)]',
    'bg-[size:60px_60px]',
    'relative overflow-hidden',
  )

  const wrapperClass = clsx(
    isSmall ? 'w-full' : 'w-full max-w-[390px]',
    'h-screen flex flex-col mx-auto bg-myWhite relative overflow-hidden shadow-lg z-30',
  )

  const bgGradationClass = 'absolute bottom-0 left-0 z-20 w-full h-1/3 bg-gradient-to-t from-white to-transparent'

  const bgItemClass = 'absolute top-0 object-contain h-3/4 z-10'
  const bgItemBottomContainerClass = 'absolute bottom-[-20%] right-[-18%] w-2/3 overflow-visible z-10'
  const bgItemBottomClass = 'object-contain h-full animate-rise-up'

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>{children}</div>

      <div className={bgGradationClass} />
      <div className={bgItemBottomContainerClass} style={{ height: '60%' }}>
        <img src={BgItem3} className={bgItemBottomClass} style={{ display: 'block' }} alt="background bottom" />
      </div>

      <img src={BgItem1} className={clsx(bgItemClass, 'left-0 animate-slide-in-left')} alt="background left" />
      <img
        src={BgItem2}
        className={clsx(bgItemClass, 'right-0 scale-x-[-1] animate-slide-in-right')}
        alt="background right"
      />
    </div>
  )
}
