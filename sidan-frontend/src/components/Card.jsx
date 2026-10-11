/** Tarjeta compartida para métricas y contenido informativo del dashboard. */
export default function Card({ titulo, descripcion, imagen, imagenAlt = '', className = 'metric-card', titleClassName = 'metric-title', descriptionClassName = 'metric-delta', imageClassName = 'sidaa-welcome-logo', descriptionId, children, footer }) {
  return <div className={className}>
    {imagen && <div className="sidaa-welcome-logo-wrap"><img src={imagen} alt={imagenAlt} className={imageClassName} /></div>}
    <div className={titleClassName}>{titulo}</div>
    {children}
    {descripcion != null && <div id={descriptionId} className={descriptionClassName}>{descripcion}</div>}
    {footer}
  </div>
}
