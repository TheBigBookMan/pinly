import { useMemo } from "react"

export default function Starfield() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      twinkleDuration: Math.random() * 3 + 2,
      twinkleDelay: Math.random() * 3,
      driftDuration: Math.random() * 20 + 20,
      driftDelay: Math.random() * 10,
    }))
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-foreground"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0.4,
            animation: `twinkle ${star.twinkleDuration}s ease-in-out infinite ${star.twinkleDelay}s, drift ${star.driftDuration}s linear infinite ${star.driftDelay}s`,
          }}
        />
      ))}
    </div>
  )
}