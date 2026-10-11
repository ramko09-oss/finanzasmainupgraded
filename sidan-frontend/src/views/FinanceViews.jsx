import { useEffect, useState } from 'react'
import { db, CURRENCIES, calcMetrics, calcHealthStatus, formatCurrency, getAvailableMonths, groupByMonth } from '../api.js'
import { renderDashboardDonut, renderDashboardEvolution, renderResumenDonut, renderEvolutionCharts, destroyCharts } from '../charts.js'
import { currentMonth, localDate, period, categories, categoryStyle, getCategory, filterHistory, filterAnalytics } from '../finance.js'
import DashboardLayout from './DashboardLayout.jsx'
import RegistrarLayout from './RegistrarLayout.jsx'
import HistoryLayout from './HistoryLayout.jsx'
import AnalyticsLayout from './AnalyticsLayout.jsx'
import SummaryLayout from './SummaryLayout.jsx'
import ChartsLayout from './ChartsLayout.jsx'

export default function FinanceViews(props) {
  const [month, setMonth] = useState(currentMonth)
  const { view, rows, currency, theme } = props
  const fmt = amount => formatCurrency(amount, currency)
  const selectedMonth = getAvailableMonths(rows).includes(month) ? month : currentMonth()
  const { metrics } = period(rows, selectedMonth)
  useEffect(() => {
    const format = amount => formatCurrency(amount, currency)
    const rate = CURRENCIES[currency].rate
    if (view === 'dashboard') {
      renderDashboardEvolution(groupByMonth(rows), format, rate)
      renderDashboardDonut(metrics.totalIngresos, metrics.totalGastos, format)
    } else if (view === 'resumen') renderResumenDonut(metrics.totalIngresos, metrics.totalGastos, format)
    else if (view === 'graficas') renderEvolutionCharts(groupByMonth(rows), format, rate)
    return destroyCharts
  }, [view, rows, currency, theme, metrics.totalIngresos, metrics.totalGastos])
  const common = { ...props, fmt, month: selectedMonth, setMonth }
  if (view === 'registrar') return <Registrar {...common} />
  if (view === 'historial') return <History {...common} />
  if (view === 'analitica') return <Analytics {...common} />
  if (view === 'resumen') return <Summary {...common} />
  if (view === 'graficas') return <ChartsLayout />
  return <Dashboard {...common} />
}

const monthOptions = rows => getAvailableMonths(rows).map(month => <option key={month} value={month}>{month}</option>)
const delta = (amount, fmt) => amount === 0 ? 'Sin cambio' : `${amount > 0 ? '↑' : '↓'} ${fmt(Math.abs(amount))}`

function Dashboard({ rows, fmt, month, setMonth }) {
  const all = calcMetrics(rows)
  const { metrics: now, previous: prior } = period(rows, month)
  const health = calcHealthStatus(now.totalIngresos, now.totalGastos)
  return <DashboardLayout bindings={{ 'dashboard-month-selector': { value: month, onChange: e => setMonth(e.target.value) } }} content={{
    'dashboard-month-selector': monthOptions(rows),
    'dash-saldo': fmt(all.saldoTotal), 'dash-saldo-delta': delta(now.saldoTotal - prior.saldoTotal, fmt),
    'dash-ingresos': fmt(now.totalIngresos), 'dash-ingresos-delta': delta(now.totalIngresos - prior.totalIngresos, fmt),
    'dash-gastos': fmt(now.totalGastos), 'dash-gastos-delta': delta(now.totalGastos - prior.totalGastos, fmt),
    'dash-transacciones': all.totalTransacciones, 'dash-transacciones-delta': `${now.totalTransacciones} este mes`,
    'analysis-content': rows.length ? <>
      <div className="analysis-item"><div className="analysis-icon">💰</div><div className="analysis-text">Ingresos: <strong>{fmt(now.totalIngresos)}</strong></div></div>
      <div className="analysis-item"><div className="analysis-icon">💸</div><div className="analysis-text">Gastos: <strong>{fmt(now.totalGastos)}</strong></div></div>
      <div className="analysis-item"><div className="analysis-icon">📈</div><div className="analysis-text">Tasa de ahorro: <strong>{health.savingsRate.toFixed(1)}%</strong></div></div>
      <div className={`health-${health.color}`}><strong>{health.icon} Salud financiera: {health.text}</strong><p>{health.msg}</p></div>
    </> : <div className="sidaa-welcome-card"><h4 className="sidaa-welcome-title">Bienvenido a SIDAA</h4><p>Aún no tienes transacciones registradas. Registra tu primer ingreso o gasto para comenzar.</p><a className="btn btn-primary" href="#registrar">Registrar Transacción</a></div>,
  }} />
}

function Registrar({ currency, refresh, notify }) {
  const [type, setType] = useState('Ingreso')
  const [category, setCategory] = useState('Otros')
  const [date, setDate] = useState(localDate)
  const [busy, setBusy] = useState(false)
  const submit = async e => {
    e.preventDefault()
    if (busy) return
    const form = e.currentTarget
    const amount = Number(form.elements.namedItem('tx-monto').value)
    const raw = form.elements.namedItem('tx-desc').value.trim()
    if (!Number.isFinite(amount) || amount <= 0 || !raw || !date) { notify('Completa los campos con valores válidos.', 'error'); return }
    const description = category !== 'Otros' && !raw.startsWith(`[${category}]`) ? `[${category}] ${raw}` : raw
    setBusy(true)
    try {
      await db.addTransaction({ tipo: type, montoLocal: amount, descripcion: description, fecha: date, currencyCode: currency })
      form.reset(); setType('Ingreso'); setCategory('Otros'); setDate(localDate())
      notify('Transacción registrada'); await refresh(); window.location.hash = '#analitica'
    } catch (e) { notify(`Error al guardar: ${e.message}`, 'error') }
    finally { setBusy(false) }
  }
  return <RegistrarLayout bindings={{
    'form-transaction': { onSubmit: submit, 'aria-busy': busy },
    'btn-type-ingreso': { onClick: () => setType('Ingreso'), className: `type-btn ${type === 'Ingreso' ? 'active' : ''}` },
    'btn-type-gasto': { onClick: () => setType('Gasto'), className: `type-btn ${type === 'Gasto' ? 'active' : ''}` },
    'tx-tipo': { value: type, readOnly: true },
    'tx-fecha': { value: date, onChange: e => setDate(e.target.value) },
    'tx-categoria': { value: category, onChange: e => setCategory(e.target.value) },
  }} content={{ 'tx-currency-symbol': CURRENCIES[currency].symbol }} />
}

function History({ rows, fmt, refresh, notify, historySearch: search, setHistorySearch: setSearch }) {
  const [type, setType] = useState('ALL')
  const [selected, setSelected] = useState([])
  const [busy, setBusy] = useState(false)
  const visible = filterHistory(rows, search, type)
  // Selection is limited to the current visible list and existing records.
  const ids = selected.filter(id => visible.some(row => row.id === id))
  const all = calcMetrics(rows)
  const remove = async () => {
    if (!ids.length || busy || !window.confirm(`¿Deseas eliminar las ${ids.length} transacciones seleccionadas?`)) return
    setBusy(true)
    let removed = 0
    try { for (const id of ids) { await db.deleteTransaction(id); removed++ } notify(`${removed} transacciones eliminadas.`) }
    catch (e) { notify(`Se eliminaron ${removed} de ${ids.length}. ${e.message}`, 'error') }
    finally { setSelected([]); await refresh(); setBusy(false) }
  }
  return <HistoryLayout bindings={{
    'historial-search': { value: search, onChange: e => { setSearch(e.target.value); setSelected([]) }, 'aria-label': 'Buscar transacciones' },
    'historial-filter-type': { value: type, onChange: e => { setType(e.target.value); setSelected([]) }, 'aria-label': 'Tipo de operación' },
    'btn-delete-selected': { onClick: remove, disabled: !ids.length || busy },
    'select-all-tx': { checked: visible.length > 0 && ids.length === visible.length, onChange: e => setSelected(e.target.checked ? visible.map(row => row.id) : []), 'aria-label': 'Seleccionar todos' },
  }} content={{
    'historial-kpi-count': rows.length, 'historial-kpi-ingresos': fmt(all.totalIngresos), 'historial-kpi-gastos': fmt(all.totalGastos), 'historial-kpi-balance': fmt(all.saldoTotal),
    'delete-count': ids.length,
    'historial-tbody': visible.length ? visible.map(row => <tr key={row.id}>
      <td style={{ textAlign: 'center' }}><input type="checkbox" aria-label={`Seleccionar ${row.descripcion}`} checked={ids.includes(row.id)} disabled={busy} onChange={e => setSelected(e.target.checked ? [...ids, row.id] : ids.filter(id => id !== row.id))} /></td>
      <td>{row.fecha.toLocaleDateString('es-ES')}</td><td>{row.descripcion}</td><td style={{ textAlign: 'center' }}><span className={`badge ${row.tipo === 'Ingreso' ? 'badge-income' : 'badge-expense'}`}>{row.tipo}</span></td>
      <td style={{ textAlign: 'right', fontWeight: 700, color: `var(--color-${row.tipo === 'Ingreso' ? 'income' : 'expense'})` }}>{row.tipo === 'Ingreso' ? '+' : '-'} {fmt(row.monto)}</td>
    </tr>) : <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>{rows.length ? 'No se encontraron coincidencias' : 'No hay transacciones registradas aún'} <a href="#registrar">Registrar</a></td></tr>,
    'historial-footer-info': `Mostrando ${visible.length} de ${rows.length} operaciones`,
    'historial-footer-balance': `Balance de lista: ${fmt(calcMetrics(visible).saldoTotal)}`,
  }} />
}

const emptyFilters = { search: '', category: 'all', type: 'all', min: '', max: '', preset: 'all' }
function Analytics({ rows, fmt, currency, setCurrency }) {
  const [filters, setFilters] = useState(emptyFilters)
  const [month, setMonth] = useState(() => rows.length ? localDate(new Date(Math.max(...rows.map(row => row.fecha)))).slice(0, 7) : currentMonth())
  const update = key => ({ value: filters[key], onChange: e => setFilters(old => ({ ...old, [key]: e.target.value })), 'aria-label': key })
  const effectiveMonth = filters.preset === 'current' ? currentMonth() : month
  const data = period(filterAnalytics(rows, filters, CURRENCIES[currency].rate), effectiveMonth)
  const label = key => new Date(`${key}-01T12:00:00`).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  const tableRows = []
  for (const type of ['Ingreso', 'Gasto']) {
    if (filters.type !== 'all' && filters.type !== type) continue
    const total = list => list.filter(t => t.tipo === type).reduce((sum, t) => sum + t.monto, 0)
    tableRows.push(<tr key={type} className="row-total-group"><td><strong>{type} total</strong></td><td className="td-amount"><strong>{fmt(total(data.current))}</strong></td><td className="td-amount"><strong>{fmt(total(data.prior))}</strong></td></tr>)
    const names = [...new Set([...(type === 'Ingreso' ? ['Ingresos'] : categories), ...rows.filter(t => t.tipo === type).map(getCategory)])]
    for (const name of names) {
      if (filters.category !== 'all' && filters.category !== name) continue
      const sum = list => list.filter(t => t.tipo === type && getCategory(t) === name).reduce((acc, t) => acc + t.monto, 0)
      const [icon, badge] = categoryStyle[name] || ['📄', 'others']
      tableRows.push(<tr key={`${type}-${name}`} className="row-cat-item"><td><div className="cat-item-content"><span className={`cat-badge cat-badge-${badge}`}>{icon}</span><span className="cat-label-text">{name}</span></div></td><td className="td-amount">{fmt(sum(data.current))}</td><td className="td-amount">{fmt(sum(data.prior))}</td></tr>)
    }
  }
  return <AnalyticsLayout bindings={{
    'analitica-search': update('search'), 'analitica-filter-category': update('category'), 'analitica-filter-type': update('type'),
    'analitica-min-amount': update('min'), 'analitica-max-amount': update('max'), 'analitica-filter-preset': update('preset'),
    'analitica-filter-currency': { value: currency, onChange: e => setCurrency(e.target.value), 'aria-label': 'Moneda analítica' },
    'btn-analitica-reset': { onClick: () => setFilters(emptyFilters) },
  }} content={{
    'analitica-col-current': label(effectiveMonth), 'analitica-col-prev': label(data.previousMonth), 'analitica-currency-label': currency, 'analitica-table-body': tableRows,
    'analitica-filter-category': <><option value="all">Todas las categorías</option>{['Ingresos', ...categories].map(name => <option key={name} value={name}>{name}</option>)}</>,
  }} monthControl={<select className="input-select" aria-label="Periodo analítico" value={effectiveMonth} disabled={filters.preset === 'current'} onChange={e => setMonth(e.target.value)}>{monthOptions(rows)}</select>} />
}

function Summary({ rows, fmt, month, setMonth }) {
  const { metrics } = period(rows, month)
  const health = calcHealthStatus(metrics.totalIngresos, metrics.totalGastos)
  const total = metrics.totalIngresos + metrics.totalGastos
  const pct = value => total ? `${(value / total * 100).toFixed(1)}%` : '0%'
  return <SummaryLayout bindings={{
    'resumen-month-selector': { value: month, onChange: e => setMonth(e.target.value) },
    'resumen-savings-bar': { style: { width: `${Math.min(100, Math.max(0, health.savingsRate))}%` } },
    'resumen-health-pill': { className: `health-pill health-${health.color}` },
  }} content={{
    'resumen-month-selector': monthOptions(rows), 'resumen-ingresos': fmt(metrics.totalIngresos), 'resumen-gastos': fmt(metrics.totalGastos), 'resumen-balance': fmt(metrics.saldoTotal),
    'resumen-health-pill': health.text, 'resumen-savings-pct': `${health.savingsRate.toFixed(1)}%`, 'resumen-advice-text': total ? health.msg : 'Aún no hay movimientos en este periodo.',
    'donut-income-pct': pct(metrics.totalIngresos), 'donut-expense-pct': pct(metrics.totalGastos),
  }} />
}
