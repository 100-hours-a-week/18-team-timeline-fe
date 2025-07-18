import React, { useEffect, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export const Background = () => {
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

  // 랜덤 애니메이션 값 상태
  const [randomAnim, setRandomAnim] = useState({ x: 100, y: 0 })
  const [animKey, setAnimKey] = useState(0)

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
    const timer = setTimeout(() => setAnimationComplete(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleLetterClick = (index: number) => {
    if (!animationComplete) return

    const randomX = basePositions[index].x + Math.random() * 50 - 25
    const randomY = basePositions[index].y + Math.random() * 30 - 15

    setLetterPositions((prev) =>
      prev.map((pos, i) => (i === index ? { ...pos, x: randomX, y: randomY, isMoving: true } : pos))
    )
  }

  // 웨이브 곡선용 유틸
  function getWaveKeyframes(xTarget: number, amplitude: number, waveCount: number) {
    // 0~1 사이 7개 구간 (0%, 16%, 32%, 48%, 64%, 80%, 100%)
    const steps = [0, 0.16, 0.32, 0.48, 0.64, 0.8, 1]
    return steps.map((t, i) => {
      const percent = Math.round(t * 100)
      const x = xTarget * Math.sin((Math.PI / 2) * t) // X는 처음엔 빠르게, 끝에서 감속
      const y = amplitude * Math.sin(2 * Math.PI * waveCount * t)
      const opacity = 1 - 0.5 * t
      return `${percent}% { transform: translateX(${x.toFixed(2)}vw) translateY(${y.toFixed(2)}vh); opacity: ${opacity.toFixed(2)}; }`
    }).join('\n')
  }

  // 오른쪽 Lottie 클릭 핸들러
  const handleLottieClick = () => {
    if (!isAnimating) {
      // X, Y는 각각 -180~180vw, -60~60vh
      const x = Math.round(Math.random() * 180 + 60) * (Math.random() > 0.5 ? 1 : -1)
      const y = Math.round(Math.random() * 60) * (Math.random() > 0.5 ? 1 : -1)
      setRandomAnim({ x, y })
      setAnimKey((k) => k + 1)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1500)
    }
  }

  return (
    <div
      className={`
        absolute top-0 left-0 w-full h-full
        bg-mainBg
        bg-[radial-gradient(theme(colors.mainPoint)_1.5px,transparent_1px)]
        bg-[size:60px_60px]
        overflow-hidden
        z-0
      `}
    >
      {/* 동적 keyframes */}
      <style key={animKey}>{`
        @keyframes moveLeftRight {
          0% { transform: translateX(0); }
          50% { transform: translateX(40px); }
          100% { transform: translateX(0); }
        }
        @keyframes clickAnimation {
          0%   { transform: translateX(0) translateY(0); opacity: 1; }
          30%  { transform: translateX(${randomAnim.x * 0.3}vw) translateY(${randomAnim.y * 0.3}vh); opacity: 0.8; }
          60%  { transform: translateX(${randomAnim.x * 0.7}vw) translateY(${randomAnim.y * 0.7}vh); opacity: 0.6; }
          80%  { transform: translateX(${randomAnim.x}vw) translateY(${randomAnim.y}vh); opacity: 0.5; }
          100% { transform: translateX(0) translateY(0); opacity: 1; }
        }
      `}</style>

      <div className="absolute top-0 left-0 flex items-center justify-between w-full h-full">
        {/* 왼쪽 영역 (TAMNARA 글자) */}
        <div className="relative flex items-center justify-start flex-1 h-full pl-20">
          <div className="relative">
            {['T', 'A', 'M', 'N', 'A', 'R', 'A'].map((letter, index) => (
              <span
                key={index}
                className={`absolute text-6xl font-extrabold text-point ${
                  animationComplete ? 'cursor-pointer hover:scale-110' : ''
                }`}
                style={{
                  left: `${letterPositions[index].x}px`,
                  top: `${letterPositions[index].y}px`,
                  transform: letterPositions[index].isMoving ? 'scale(1.2)' : 'scale(1)',
                  transition: letterPositions[index].isMoving ? 'all 0.5s ease' : 'all 0.3s ease',
                  zIndex: letterPositions[index].isMoving ? 50 : 10,
                }}
                onClick={() => handleLetterClick(index)}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* 오른쪽 영역 (Lottie 애니메이션) */}
        <div className="flex items-center justify-center flex-1 h-full">
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
            className="w-[180px] h-[180px] flex items-center justify-center cursor-pointer ml-8"
            style={{
              animation: isAnimating ? 'clickAnimation 1.5s ease-in-out' : 'moveLeftRight 2s infinite ease-in-out',
              animationDelay: isAnimating ? '0s' : '1s',
            }}
            onClick={handleLottieClick}
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

      {/* 하단 그라데이션 */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent" />
    </div>
  )
}
