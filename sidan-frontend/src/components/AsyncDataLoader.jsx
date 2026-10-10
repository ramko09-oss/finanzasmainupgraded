import { useState, useEffect } from 'react'

/**
 * Componente AsyncDataLoader.jsx
 * Cumple con los requisitos:
 * 1. "Un efecto con useEffect que simule una carga de datos mediante setTimeout"
 * 2. "La función de limpieza correspondiente: clearTimeout"
 * 3. "Un componente interactivo que utilice useState"
 * 4. "Al menos un evento de usuario, por ejemplo onClick"
 */
function AsyncDataLoader() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [recargaId, setRecargaId] = useState(0)
  const [mensajeEstado, setMensajeEstado] = useState('Iniciando sincronización...')

  useEffect(() => {
    // 1. Indicar inicio de carga asincrónica con useState
    setCargando(true)
    setMensajeEstado('Conectando con el servidor financiero...')

    // 2. Simular carga asincrónica de datos con setTimeout (2000 ms)
    const timerId = setTimeout(() => {
      const datosSimulados = {
        saldoActual: 14850.50,
        ingresosMes: 5200.00,
        gastosMes: 2150.00,
        transacciones: [
          { id: 1, desc: 'Pago de Salario Mensual', tipo: 'Ingreso', monto: 3500.00, fecha: '2026-10-09' },
          { id: 2, desc: 'Servicios de Nube (Render/Aiven)', tipo: 'Gasto', monto: 120.00, fecha: '2026-10-08' },
          { id: 3, desc: 'Consultoría de Desarrollo', tipo: 'Ingreso', monto: 1700.00, fecha: '2026-10-07' },
          { id: 4, desc: 'Suministros y Licencias', tipo: 'Gasto', monto: 450.00, fecha: '2026-10-06' }
        ],
        sincronizadoAt: new Date().toLocaleTimeString()
      }

      setDatos(datosSimulados)
      setCargando(false)
      setMensajeEstado(`Datos cargados correctamente a las ${datosSimulados.sincronizadoAt}`)
    }, 1800)

    // 3. FUNCIÓN DE LIMPIEZA: clearTimeout
    // Si el componente se desmonta o se vuelve a disparar la recarga antes de los 1.8s,
    // clearTimeout cancela el timer para prevenir fugas de memoria (memory leaks).
    return () => {
      clearTimeout(timerId)
    }
  }, [recargaId]) // Se re-ejecuta cada vez que el usuario presiona el botón de recarga

  // Evento onClick para recargar
  const handleRecargar = () => {
    setRecargaId((prev) => prev + 1)
  }

  return (
    <div className="async-loader-card">
      <div className="async-loader-header">
        <div>
          <h3>📡 Carga Asincrónica con <code>useEffect</code></h3>
          <p className="async-loader-desc">
            Simula petición a API mediante <code>setTimeout</code> con función de limpieza <code>clearTimeout</code>.
          </p>
        </div>
        <button
          className="btn-reload"
          onClick={handleRecargar}
          disabled={cargando}
          title="Forzar nueva petición asincrónica"
        >
          <svg
            className={cargando ? 'spin-icon' : ''}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span>{cargando ? 'Cargando datos...' : 'Recargar Simulación'}</span>
        </button>
      </div>

      <div className="async-status-bar">
        <span className={`status-pill ${cargando ? 'loading' : 'ready'}`}>
          {cargando ? '⏳ Simulando petición (1.8s)' : '✅ Datos actualizados'}
        </span>
        <span className="status-msg">{mensajeEstado}</span>
      </div>

      {cargando ? (
        <div className="skeleton-container">
          <div className="skeleton-bar" style={{ width: '60%' }}></div>
          <div className="skeleton-bar" style={{ width: '85%' }}></div>
          <div className="skeleton-bar" style={{ width: '45%' }}></div>
        </div>
      ) : (
        datos && (
          <div className="async-data-content">
            <div className="async-metrics-row">
              <div className="async-mini-card">
                <span className="mini-label">Saldo Simulado</span>
                <span className="mini-val text-primary">${datos.saldoActual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="async-mini-card">
                <span className="mini-label">Ingresos</span>
                <span className="mini-val text-income">+${datos.ingresosMes.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="async-mini-card">
                <span className="mini-label">Gastos</span>
                <span className="mini-val text-expense">-${datos.gastosMes.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="async-table-wrapper">
              <table className="async-table">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.transacciones.map((tx) => (
                    <tr key={tx.id}>
                      <td><strong>{tx.desc}</strong></td>
                      <td>
                        <span className={`category-pill ${tx.tipo === 'Ingreso' ? 'ingreso' : 'gasto'}`}>
                          {tx.tipo}
                        </span>
                      </td>
                      <td className={tx.tipo === 'Ingreso' ? 'text-income' : 'text-expense'}>
                        {tx.tipo === 'Ingreso' ? '+' : '-'}${tx.monto.toFixed(2)}
                      </td>
                      <td>{tx.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default AsyncDataLoader
