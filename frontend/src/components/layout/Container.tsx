import { useEffect, useState } from 'react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import React from 'react'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type ContainerProps = ReactDivProps & {
  children: React.ReactNode
}

export const Container = ({ children }: ContainerProps) => {
  const [isSmall, setIsSmall] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [letterPositions, setLetterPositions] = useState([
    { x: -30, y: 0, isMoving: false },
    { x: 20, y: 0, isMoving: false },
    { x: 80, y: 0, isMoving: false },
    { x: 150, y: 0, isMoving: false },
    { x: 210, y: 0, isMoving: false },
    { x: 270, y: 0, isMoving: false },
    { x: 330, y: 0, isMoving: false },
  ])
  const [animationComplete, setAnimationComplete] = useState(false)

  const basePositions = [
    { x: -30, y: 0 },
    { x: 20, y: 0 },
    { x: 80, y: 0 },
    { x: 150, y: 0 },
    { x: 210, y: 0 },
    { x: 270, y: 0 },
    { x: 330, y: 0 },
  ]

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

  // 애니메이션 완료 후 클릭 시 무작위 이동
  const handleLetterClick = (index: number) => {
    if (!animationComplete) return

    const randomX = basePositions[index].x + Math.random() * 50 - 25
    const randomY = basePositions[index].y + Math.random() * 30 - 15

    setLetterPositions((prev) =>
      prev.map((pos, i) => (i === index ? { ...pos, x: randomX, y: randomY, isMoving: true } : pos)),
    )
  }

  // 애니메이션 완료 감지
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 2000) // letterSpread 애니메이션 시간과 동일

    return () => clearTimeout(timer)
  }, [])

  // 애니메이션 keyframes 동적 생성
  const leftPositions = [0, 160, 320, 480]
  const rightPositions = [0, 160, 320, 480]
  const animationId = Date.now()
  const leftKeyframes = leftPositions
    .map((left) => `@keyframes slideInLeft${left}_${animationId} { from { left: -200px; } to { left: ${left}px; } }`)
    .join('\n')
  const rightKeyframes = rightPositions
    .map(
      (right) => `@keyframes slideInRight${right}_${animationId} { from { right: -200px; } to { right: ${right}px; } }`,
    )
    .join('\n')

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
          50% { transform: translateX(-100vw) translateY(-50vh); opacity: 0; }
          100% { transform: translateX(0) translateY(0); opacity: 1; }
        }
        @keyframes letterSpread {
          0% { transform: translateX(var(--spread-x)) translateY(var(--spread-y)); }
          100% { transform: translateX(0) translateY(0); }
        }
        .letter-spread {
          animation: letterSpread 2s ease-out forwards;
        }
      `}</style>
      <div className={wrapperClass}>{children}</div>

      <div className={bgGradationClass} />

      {/* 미니멀 2분할 레이아웃: 좌측 중앙 TAMNARA, 우측 중앙 감귤 Lottie */}
      <div className="absolute top-0 left-0 flex items-center justify-between w-full h-full">
        {/* 왼쪽 50% */}
        <div className="relative flex items-center justify-start flex-1 h-full pl-20">
          {/* TAMNARA 글자들을 개별적으로 배치 */}
          <div className="relative">
            {['T', 'A', 'M', 'N', 'A', 'R', 'A'].map((letter, index) => (
              <span
                key={index}
                className={`absolute text-6xl font-extrabold text-point letter-spread ${
                  animationComplete ? 'cursor-pointer hover:scale-110' : ''
                }`}
                style={
                  {
                    '--spread-x': ['-180px', '-120px', '-60px', '0px', '60px', '120px', '180px'][index],
                    '--spread-y': ['-60px', '80px', '-40px', '60px', '-30px', '50px', '-20px'][index],
                    left: `${letterPositions[index].x}px`,
                    top: `${letterPositions[index].y}px`,
                    transform: letterPositions[index].isMoving ? 'scale(1.2)' : 'scale(1)',
                    transition: letterPositions[index].isMoving ? 'all 0.5s ease' : 'all 0.3s ease',
                    zIndex: letterPositions[index].isMoving ? 50 : 10,
                  } as React.CSSProperties
                }
                onClick={() => handleLetterClick(index)}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
        {/* 오른쪽 50% */}
        <div className="flex items-center justify-end flex-1 h-full pr-20">
          <div
            className="w-[180px] h-[180px] flex items-center justify-center"
            style={{ animation: 'moveLeftRight 2s infinite ease-in-out' }}
          >
            <DotLottieReact
              src="https://lottie.host/66b80d91-8aa2-4df7-b433-5e7d7175c4c5/g1mY1bWz3p.lottie"
              loop
              autoplay
              className="block object-contain w-full h-full"
            />
          </div>
          <div
            className="w-[180px] h-[180px] flex items-center justify-center cursor-pointer"
            style={{
              animation: isAnimating ? 'clickAnimation 1.5s ease-in-out' : 'moveLeftRight 2s infinite ease-in-out',
              animationDelay: isAnimating ? '0s' : '1s',
              marginLeft: '32px',
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
              className="block object-contain w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
