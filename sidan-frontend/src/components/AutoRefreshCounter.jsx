import { useState, useEffect } from 'react'

/**
 * Componente AutoRefreshCounter.jsx
 * Cumple con los requisitos:
 * 1. "Un contador automático mediante setInterval"
 * 2. "La función de limpieza correspondiente: clearInterval"
 * 3. "Al menos un evento de usuario, por ejemplo onClick"
 * 4. "Un componente interactivo que utilice useState"
 */
function AutoRefreshCounter() {
  const [segundos, setSegundos] = useState(0)
  const [activo, setActivo] = useState(true)
  const [ciclosCompletados, setCiclosCompletados] = useState(0)

  // Cada 30 segundos simula un ciclo completo de sincronización
  const INTERVALO_CICLO = 30
  const segundosRestantes = INTERVALO_CICLO - (segundos % INTERVALO_CICLO)

  useEffect(() => {
    // Si el usuario pausó el contador, no creamos el intervalo
    if (!activo) return

    // 1. Iniciar contador automático con setInterval (cada 1000ms = 1s)
    const intervalId = setInterval(() => {
      setSegundos((prev) => {
        const nuevoSegundo = prev + 1
        if (nuevoSegundo % INTERVALO_CICLO === 0) {
          setCiclosCompletados((c) => c + 1)
        }
        return nuevoSegundo
      })
    }, 1000)

    // 2. FUNCIÓN DE LIMPIEZA: clearInterval
    // Se ejecuta al desmontar el componente o al cambiar la dependencia [activo]
    // Esto garantiza que no queden intervalos huérfanos en segundo plano.
    return () => {
      clearInterval(intervalId)
    }
  }, [activo])

  // Formato MM:SS
  const formatearTiempo = (totalSegundos) => {
    const mins = Math.floor(totalSegundos / 60).toString().padStart(2, '0')
    const segs = (totalSegundos % 60).toString().padStart(2, '0')
    return `${mins}:${segs}`
  }

  return (
    <div className="interval-card">
      <div className="interval-header">
        <div>
          <h3>⏱️ Contador Automático (Sesión en Vivo)</h3>
          <p className="interval-desc">
            Gestionado con <code>useEffect</code> + <code>setInterval</code> y limpieza con <code>clearInterval</code>.
          </p>
        </div>
        <div className={`ticker-badge ${activo ? 'pulse' : 'paused'}`}>
          <span className="ticker-dot"></span>
          <span>{activo ? 'TEMPORIZADOR ACTIVO' : 'PAUSADO'}</span>
        </div>
      </div>

      <div className="interval-display-box">
        <div className="interval-time-box">
          <span className="interval-label">Tiempo de Sesión Activa</span>
          <div className="interval-clock">{formatearTiempo(segundos)}</div>
        </div>

        <div className="interval-cycle-box">
          <span className="interval-label">Próxima Auto-Sincronización</span>
          <div className="interval-countdown">
            {segundosRestantes}s
          </div>
          <span className="interval-subtext">Ciclos completados: {ciclosCompletados}</span>
        </div>
      </div>

      {/* Barra de progreso visual hasta el próximo ciclo */}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${((INTERVALO_CICLO - segundosRestantes) / INTERVALO_CICLO) * 100}%` }}
        ></div>
      </div>

      {/* Controles de usuario con eventos onClick */}
      <div className="interval-controls">
        <button
          className={`btn-control ${activo ? 'btn-pause' : 'btn-resume'}`}
          onClick={() => setActivo(!activo)}
        >
          {activo ? '⏸️ Pausar Temporizador' : '▶️ Reanudar Temporizador'}
        </button>

        <button
          className="btn-control btn-reset"
          onClick={() => setSegundos(0)}
        >
          🔄 Reiniciar Segundero
        </button>
      </div>
    </div>
  )
}

export default AutoRefreshCounter
