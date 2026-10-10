/**
 * Componente <MetricCard /> 
 * Muestra una métrica financiera con su valor y un acento de color.
 * Recibe props: titulo, valor, variante (primary | income | expense | neutral)
 */
function MetricCard({ titulo, valor, variante = 'primary' }) {
  return (
    <div className={`metric-card ${variante}`}>
      <div className="metric-title">{titulo}</div>
      <div className="metric-value">{valor}</div>
    </div>
  )
}

export default MetricCard
