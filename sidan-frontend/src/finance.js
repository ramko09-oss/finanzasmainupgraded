import { calcMetrics, filterByMonth } from './api.js'

export const categories = ['Comida y bebidas', 'Compras', 'Vivienda', 'Transporte', 'Vehículo', 'Vida y entretenimiento', 'Comunicación, PC', 'Gastos financieros', 'Inversiones', 'Otros']
export const categoryStyle = {
  'Ingresos': ['💰', 'income'], 'Comida y bebidas': ['🍽️', 'food'], 'Compras': ['🛍️', 'shopping'],
  'Vivienda': ['🏠', 'housing'], 'Transporte': ['🚆', 'transport'], 'Vehículo': ['🚗', 'vehicle'],
  'Vida y entretenimiento': ['🚶', 'life'], 'Comunicación, PC': ['💻', 'pc'],
  'Gastos financieros': ['💳', 'finance'], 'Inversiones': ['📈', 'investment'], 'Otros': ['📄', 'others'],
}
export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
export const currentMonth = () => localDate().slice(0, 7)
export function period(rows, month) {
  const [year, number] = month.split('-').map(Number)
  const previous = new Date(year, number - 2, 1, 12)
  const current = filterByMonth(rows, year, number - 1)
  const prior = filterByMonth(rows, previous.getFullYear(), previous.getMonth())
  return { current, prior, metrics: calcMetrics(current), previous: calcMetrics(prior), previousMonth: localDate(previous).slice(0, 7) }
}
export function getCategory(tx) {
  if (tx.tipo === 'Ingreso') return 'Ingresos'
  const explicit = (tx.descripcion || '').match(/^\[(.*?)\]/)?.[1]
  if (explicit) return explicit
  const rules = [
    /comida|almuerzo|cena|desayuno|restaurante|cafe|supermercado|mercado|snack|bebida/,
    /compra|ropa|tienda|zapatillas|amazon|regalo|mall/,
    /vivienda|alquiler|luz|agua|gas\b|departamento|casa|mantenimiento/,
    /transporte|bus|metro|pasaje|uber|taxi|tren/,
    /vehiculo|auto|carro|gasolina|combustible|taller|peaje|mecanico/,
    /entretenimiento|cine|salida|fiesta|bar|gym|gimnasio|juego|viaje/,
    /internet|celular|telefono|pc|computadora|laptop|software|wifi/,
    /banco|comision|tarjeta|interes|seguro|prestamo/,
    /inversion|acciones|cripto|fondo|deposito|bitcoin/,
  ]
  return categories[rules.findIndex(rule => rule.test((tx.descripcion || '').toLowerCase()))] || 'Otros'
}
export function filterHistory(rows, query, type) {
  const text = query.trim().toLowerCase()
  return rows.filter(t => (type === 'ALL' || t.tipo === type) && (!text || `${t.descripcion} ${t.tipo} ${t.monto} ${t.fecha.toLocaleDateString('es-ES')} ${localDate(t.fecha)}`.toLowerCase().includes(text)))
}
export function filterAnalytics(rows, filters, rate) {
  return rows.filter(t => {
    const category = getCategory(t)
    const amount = t.monto * rate
    return (!filters.search || `${t.descripcion} ${category}`.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.category === 'all' || category === filters.category) &&
      (filters.type === 'all' || t.tipo === filters.type) &&
      (filters.min === '' || amount >= Number(filters.min)) &&
      (filters.max === '' || amount <= Number(filters.max)) &&
      (filters.preset !== 'fijos' || ['Comida y bebidas', 'Vivienda', 'Transporte'].includes(category))
  })
}
