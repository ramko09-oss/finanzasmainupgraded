import { useEffect, useRef, useState } from 'react'
import { CURRENCIES, calcMetrics, filterByMonth, formatCurrency, getAvailableMonths, getToken, fetchAPI, normalizeTransactions } from '../../../frontend/js/api.js'
import { useCurrency } from '../hooks/usePreferences'
import './FinancialDashboard.css'

const monthNow = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export default function FinancialDashboard({ embedded = false }) {
  const [currency, setCurrency] = useCurrency()
  const [month, setMonth] = useState(monthNow)
  const [snapshot, setSnapshot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [signedOut, setSignedOut] = useState(false)
  const [refreshId, setRefreshId] = useState(0)
  const controllerRef = useRef(null)

  useEffect(() => {
    let disposed = false
    let inFlight = false
    async function load() {
      if (inFlight || disposed) return
      if (!getToken()) {
        setSnapshot(null)
        setSignedOut(true)
        setLoading(false)
        return
      }
      inFlight = true
      const controller = new AbortController()
      controllerRef.current = controller
      setLoading(true)
      setError('')
      try {
        const options = { signal: controller.signal, redirectOnAuthError: false }
        const profile = await fetchAPI('/api/auth/me', options)
        if (!profile.user || !profile.user.id) throw new Error('No se pudo verificar la cuenta.')
        const rows = await fetchAPI('/api/transactions', options)
        const transactions = normalizeTransactions(rows)
        if (!disposed && !controller.signal.aborted) {
          setSnapshot({ user: profile.user, transactions, updatedAt: new Date() })
          setSignedOut(false)
          if (embedded) window.dispatchEvent(new CustomEvent('finanzas:dashboard-data', { detail: transactions }))
        }
      } catch (failure) {
        if (!disposed && failure.name !== 'AbortError') {
          if (failure.status === 401 || failure.status === 403 || !getToken()) {
            setSnapshot(null)
            setSignedOut(true)
          } else setError(failure.message || 'No se pudieron cargar tus finanzas.')
        }
      } finally {
        inFlight = false
        if (!disposed) setLoading(false)
      }
    }
    const sync = () => {
      controllerRef.current?.abort()
      setSnapshot(null)
      setRefreshId(id => id + 1)
    }
    const storage = (event) => {
      if (!event.key || ['finanzas_jwt', 'finanzas_user'].includes(event.key)) sync()
    }
    const foreground = () => {
      if (!document.hidden && (!embedded || window.location.hash === '#dashboard')) load()
    }
    load()
    const interval = setInterval(foreground, 30000)
    window.addEventListener('focus', foreground)
    document.addEventListener('visibilitychange', foreground)
    window.addEventListener('finanzas:session', sync)
    window.addEventListener('finanzas:transactions', foreground)
    window.addEventListener('storage', storage)
    return () => {
      disposed = true
      controllerRef.current?.abort()
      clearInterval(interval)
      window.removeEventListener('focus', foreground)
      document.removeEventListener('visibilitychange', foreground)
      window.removeEventListener('finanzas:session', sync)
      window.removeEventListener('finanzas:transactions', foreground)
      window.removeEventListener('storage', storage)
    }
  }, [refreshId, embedded])

  const fmt = value => formatCurrency(value, currency)
  const transactions = snapshot?.transactions || []
  const [year, monthNumber] = month.split('-').map(Number)
  const monthly = filterByMonth(transactions, year, monthNumber - 1)
  const totals = calcMetrics(transactions)
  const selected = calcMetrics(monthly)
  const recent = [...transactions].sort((a, b) => b.fecha - a.fecha).slice(0, 5)

  return <section className="financial-dashboard" aria-label="Panel financiero conectado" aria-busy={loading}>
    <div className="fd-heading">
      <div><span className="fd-eyebrow">TUS FINANZAS, AL DÍA</span>
        <h2>{snapshot ? `Hola, ${snapshot.user.username || 'Usuario'}` : 'Tu panel financiero'}</h2>
        <p>La misma cuenta y los mismos movimientos de tu sistema financiero.</p>
      </div>
      <button className="fd-button" disabled={loading} onClick={() => setRefreshId(id => id + 1)}>{loading ? 'Actualizando…' : 'Actualizar datos'}</button>
    </div>
    {signedOut ? <div className="fd-message"><h3>Inicia sesión para consultar tus finanzas</h3><p>Accede desde el sistema principal y regresa a este panel con tu sesión activa.</p><a className="fd-button" href="/#auth">Iniciar sesión</a></div> : <>
      <p className="fd-status" role="status">{loading ? 'Consultando tu cuenta…' : snapshot ? `Última actualización: ${snapshot.updatedAt.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}. Se actualiza cada 30 segundos mientras la página está visible.` : ''}</p>
      {error && <div className="fd-message fd-error" role="alert"><p>{error}</p><p>{snapshot ? 'Los datos visibles corresponden a la última actualización correcta.' : 'No se mostrarán importes hasta recuperar los datos.'}</p><button className="fd-button" onClick={() => setRefreshId(id => id + 1)}>Reintentar</button></div>}
      {snapshot && <>
        {!embedded && <>
          <div className="fd-filters">
            <label>Mes<select value={month} onChange={event => setMonth(event.target.value)}>{[...new Set([month, ...getAvailableMonths(transactions)])].sort().reverse().map(value => <option key={value} value={value}>{value}</option>)}</select></label>
            <label>Moneda<select value={currency} onChange={event => setCurrency(event.target.value)}>{Object.entries(CURRENCIES).map(([code, info]) => <option key={code} value={code}>{info.name}</option>)}</select></label>
          </div>
          <div className="metrics-grid">
            <FinancialMetric title="Saldo total" value={fmt(totals.saldoTotal)} />
            <FinancialMetric title="Ingresos del mes" value={fmt(selected.totalIngresos)} tone="income" />
            <FinancialMetric title="Gastos del mes" value={fmt(selected.totalGastos)} tone="expense" />
            <FinancialMetric title="Balance del mes" value={fmt(selected.saldoTotal)} />
          </div>
          <p className="fd-status">Conversión con las tasas de referencia del sistema; no son cotizaciones en tiempo real.</p>
        </>}
        <div className="fd-section-heading"><h3>Últimos movimientos</h3><a href="/#historial">Ver historial completo →</a></div>
        {recent.length ? <div className="fd-table-scroll"><table><caption className="fd-sr-only">Cinco transacciones más recientes en {currency}</caption><thead><tr><th>Descripción</th><th>Fecha</th><th>Tipo</th><th>Importe ({currency})</th></tr></thead><tbody>{recent.map(transaction => <tr key={transaction.id}><td>{transaction.descripcion}</td><td>{transaction.fecha.toLocaleDateString('es')}</td><td><span className={`fd-type ${transaction.tipo === 'Ingreso' ? 'income' : 'expense'}`}>{transaction.tipo}</span></td><td>{fmt(transaction.monto)}</td></tr>)}</tbody></table></div> : <div className="fd-message"><p>Todavía no has registrado movimientos.</p><a href="/#registrar">Registrar mi primera transacción →</a></div>}
        <div className="fd-actions"><a className="fd-button" href="/#registrar">Registrar ingreso o gasto</a>{embedded ? <a href="/react/">Abrir panel ampliado →</a> : <a href="/#dashboard">Volver a gráficos y análisis →</a>}</div>
      </>}
    </>}
  </section>
}

function FinancialMetric({ title, value, tone = '' }) {
  return <div className={`metric-card metric-${tone || 'primary'}`}><div className="metric-title">{title}</div><div className="metric-value">{value}</div></div>
}
