import { useEffect, useRef, useState } from "react"
import Globe from "react-globe.gl"

export default function RotatingGlobe() {
  const globeRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(300)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      setSize(width)
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const handleGlobeReady = () => {
    const controls = globeRef.current?.controls()
    if (!controls) return

    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableRotate = false
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto aspect-square w-full max-w-[260px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px]"
    >
      <Globe
        ref={globeRef}
        onGlobeReady={handleGlobeReady}
        width={size}
        height={size}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
      />
    </div>
  )
}