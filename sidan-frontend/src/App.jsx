import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import './styles.css'
import './App.css'
import AppLayout from './views/AppLayout.jsx'
import Auth from './views/Auth.jsx'
import useFinanceSession from './hooks/useFinanceSession.js'
import { useCurrency, useTheme } from './hooks/usePreferences.js'
import { filterHistory } from './finance.js'
import { formatCurrency } from './api.js'

const destinations = { dashboard: 'Dashboard Principal', registrar: 'Registrar Transacción', historial: 'Historial de Transacciones', analitica: 'Analítica', resumen: 'Resumen Mensual', graficas: 'Gráficas y Tendencias' }
const FinanceViews = lazy(() => import('./views/FinanceViews.jsx'))
const keywords = { dashboard: 'saldo inicio métricas', registrar: 'añadir ingresos gastos movimiento', historial: 'buscar operaciones registros', analitica: 'categorías desglose gastos', resumen: 'balance mensual ahorro', graficas: 'gráficos evolución tendencias histórico barras' }
const fold = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const getRoute = () => Object.hasOwn(destinations, window.location.hash.slice(1)) ? window.location.hash.slice(1) : 'dashboard'
export default function App() {
  const session = useFinanceSession()
  const [view, setView] = useState(getRoute)
  const [currency, setCurrency] = useCurrency()
  const [theme, setTheme] = useTheme()
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchIndex, setSearchIndex] = useState(0)
  const [historySearch, setHistorySearch] = useState('')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  useEffect(() => {
    const route = () => { setView(getRoute()); setSearch(''); setSearchOpen(false) }
    const resetSearch = () => { setHistorySearch(''); setSearch(''); setSearchOpen(false) }
    const storage = e => { if (!e.key || ['finanzas_jwt', 'finanzas_user'].includes(e.key)) resetSearch() }
    window.addEventListener('hashchange', route)
    window.addEventListener('finanzas:session', resetSearch)
    window.addEventListener('storage', storage)
    return () => { window.removeEventListener('hashchange', route); window.removeEventListener('finanzas:session', resetSearch); window.removeEventListener('storage', storage); clearTimeout(toastTimer.current) }
  }, [])
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  const notify = (message, type = 'success') => { clearTimeout(toastTimer.current); setToast({ message, type }); toastTimer.current = setTimeout(() => setToast(null), 5000) }
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  const name = session.user?.username || 'Usuario'
  const initial = name.slice(0, 1).toUpperCase()
  const suggestions = [
    ...Object.entries(destinations).filter(([route, label]) => fold(`${label} ${keywords[route]}`).includes(fold(search))).map(([route, label]) => ({ id: route, route, label })),
    ...(search.trim().length >= 2 ? filterHistory(session.rows, search, 'ALL').slice(0, 3).map(row => ({ id: `tx-${row.id}`, route: 'historial', label: row.descripcion, description: `${row.tipo} · ${formatCurrency(row.monto, currency)}`, query: row.descripcion })) : []),
  ]
  const choose = item => {
    if (!item) return
    if (item.query) setHistorySearch(item.query)
    window.location.assign(`#${item.route}`)
    setSearch(''); setSearchOpen(false)
  }
  const searchKeys = e => {
    if (e.key === 'Escape') setSearchOpen(false)
    if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault(); setSearchOpen(true)
      setSearchIndex(index => suggestions.length ? (index + (e.key === 'ArrowDown' ? 1 : suggestions.length - 1)) % suggestions.length : 0)
    }
    if (e.key === 'Enter') { e.preventDefault(); choose(suggestions[searchIndex] || suggestions[0]) }
  }
  return <>
    <div id="toast-container" aria-live="polite">{toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}</div>
    {session.user === undefined ? <div className="session-loading card" role="status">{session.error || 'Comprobando sesión…'}{session.error && <button className="btn btn-primary" onClick={session.verify}>Reintentar</button>}</div> : !session.user ? <Auth toggleTheme={toggleTheme} notify={notify} /> :
      <AppLayout view={view} bindings={{
        'currency-selector': { value: currency, onChange: e => setCurrency(e.target.value) },
        'theme-toggle-sidebar': { onClick: toggleTheme }, 'theme-toggle-mobile': { onClick: toggleTheme },
        'btn-logout': { onClick: session.logout }, 'btn-logout-mobile': { onClick: session.logout },
        'topbar-global-search': { value: search, onFocus: () => setSearchOpen(true), onChange: e => { setSearch(e.target.value); setSearchIndex(0); setSearchOpen(true) }, onKeyDown: searchKeys, 'aria-expanded': searchOpen, 'aria-controls': 'topbar-search-dropdown' },
        'topbar-search-container': { onBlur: e => { if (!e.currentTarget.contains(e.relatedTarget)) setSearchOpen(false) } },
        'topbar-search-dropdown': { className: `topbar-search-dropdown ${searchOpen ? '' : 'hidden'}` },
      }} content={{
        'user-avatar': initial, 'user-greeting': `Hola, ${name} 👋`, 'topbar-avatar': initial, 'topbar-username': name,
        'topbar-view-title': destinations[view],
        'theme-toggle-sidebar': <><span className="theme-icon-slot">☼</span><span className="theme-text">Modo {theme === 'dark' ? 'Claro' : 'Oscuro'}</span></>,
        'topbar-search-dropdown': suggestions.length ? suggestions.map((item, index) => <button type="button" role="option" aria-selected={index === searchIndex} className={`search-dropdown-item ${index === searchIndex ? 'selected' : ''}`} key={item.id} onClick={() => choose(item)}><div className="search-item-body"><div className="search-item-title">{item.label}</div>{item.description && <div className="search-item-desc">{item.description}</div>}</div><span className="search-item-badge">{item.query ? 'Registro' : 'Apartado'}</span></button>) : <div className="search-dropdown-empty">Sin coincidencias</div>,
      }}>
        <div className="sync-status" role="status">{session.loading ? 'Actualizando…' : session.updatedAt ? `Actualizado ${session.updatedAt.toLocaleTimeString('es-ES')}` : 'Cargando movimientos…'} <button type="button" className="btn btn-sm" disabled={session.loading} onClick={session.refresh}>Actualizar</button></div>
        {session.error && <div className="sync-error" role="alert">{session.error}. {session.updatedAt ? 'Se muestran los últimos datos disponibles.' : 'No se han podido cargar los movimientos.'} <button className="btn btn-sm" onClick={session.refresh}>Reintentar</button></div>}
        {session.updatedAt && <Suspense fallback={<p role="status">Cargando vista…</p>}><FinanceViews key={view} view={view} rows={session.rows} currency={currency} setCurrency={setCurrency} theme={theme} refresh={session.refresh} notify={notify} historySearch={historySearch} setHistorySearch={setHistorySearch} /></Suspense>}
      </AppLayout>}
  </>
}
