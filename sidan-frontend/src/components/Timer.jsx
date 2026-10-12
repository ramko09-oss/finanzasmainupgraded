import { useEffect, useState } from 'react'

export default function Timer() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const startedAt = Date.now()
    const interval = setInterval(() => setSeconds(Math.floor((Date.now() - startedAt) / 1000)), 1000)
    return () => clearInterval(interval)
  }, [])
  return <span className="view-timer" role="timer" aria-label="Tiempo en esta vista">Tiempo en esta vista: <strong>{seconds} s</strong></span>
}
