import { useEffect, useState } from 'react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'
import { BgItem1, BgItem2 } from '@/assets'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type ContainerProps = ReactDivProps & {
  children: React.ReactNode
}

export const Container = ({ children }: ContainerProps) => {
  const [isSmall, setIsSmall] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

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

  // 애니메이션 keyframes 동적 생성
  const leftPositions = [0, 160, 320, 480];
  const rightPositions = [0, 160, 320, 480];
  const animationId = Date.now();
  const leftKeyframes = leftPositions.map(
    (left) => `@keyframes slideInLeft${left}_${animationId} { from { left: -200px; } to { left: ${left}px; } }`
  ).join('\n');
  const rightKeyframes = rightPositions.map(
    (right) => `@keyframes slideInRight${right}_${animationId} { from { right: -200px; } to { right: ${right}px; } }`
  ).join('\n');

  return (
    <div className={containerClass}>
      <style>{`
        ${leftKeyframes}
        ${rightKeyframes}
        @keyframes fadeInCenter {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes moveLeftRight {
          0% { transform: translateX(0); }
          50% { transform: translateX(40px); }
          100% { transform: translateX(0); }
        }
        @keyframes clickAnimation {
          0% { transform: translateX(0) translateY(0); opacity: 1; }
          30% { transform: translateX(100vw) translateY(0); opacity: 0; }
          35% { transform: translateX(-100vw) translateY(-50vh); opacity: 0; }
          100% { transform: translateX(0) translateY(0); opacity: 1; }
        }
      `}</style>
      <div className={wrapperClass}>{children}</div>

      <div className={bgGradationClass} />

      {/* 미니멀 2분할 레이아웃: 좌측 중앙 TAMNARA, 우측 중앙 감귤 Lottie */}
      <div className="w-full h-full flex items-center justify-between absolute top-0 left-0">
        {/* 왼쪽 50% */}
        <div className="flex-1 flex items-center justify-center h-full relative">
          {/* 비행기 Lottie: TAMNARA 위에 겹치게 */}
          <span className="text-6xl font-extrabold text-point animate-tamnara-pop">TAMNARA</span>
        </div>
        {/* 오른쪽 50% */}
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="w-[180px] h-[180px] flex items-center justify-center"
            style={{ animation: 'moveLeftRight 2s infinite ease-in-out' }}>
            <DotLottieReact
              src="https://lottie.host/66b80d91-8aa2-4df7-b433-5e7d7175c4c5/g1mY1bWz3p.lottie"
              loop
              autoplay
              className="w-full h-full object-contain block"
            />
          </div>
          <div 
            className="w-[180px] h-[180px] flex items-center justify-center cursor-pointer"
            style={{ 
              animation: isAnimating 
                ? 'clickAnimation 1.5s ease-in-out' 
                : 'moveLeftRight 2s infinite ease-in-out', 
              animationDelay: isAnimating ? '0s' : '1s', 
              marginLeft: '32px' 
            }}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true)
                setTimeout(() => setIsAnimating(false), 1500)
              }
            }}
          >
            <DotLottieReact
              src="https://lottie.host/3ff0e72f-ffbb-4f55-b2d0-1c6be9239070/G447bh5VPq.lottie"
              loop
              autoplay
              className="w-full h-full object-contain block"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
