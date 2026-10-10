/**
 * Componente Saludo.jsx
 * Cumple con el requisito: "Un componente Saludo o equivalente que reciba información mediante props"
 * 
 * Props:
 * - nombre (string): Nombre del usuario
 * - rol (string): Rol o categoría del usuario (ej: "Administrador Financiero")
 * - mensaje (string): Mensaje personalizado de bienvenida
 * - ultimoAcceso (string): Marca de tiempo del último acceso
 */
function Saludo({
  nombre = 'Usuario SIDAN',
  rol = 'Gestor Financiero',
  mensaje = 'Bienvenido de nuevo a tu plataforma de finanzas personales.',
  ultimoAcceso = 'Hoy a las 16:15'
}) {
  return (
    <div className="saludo-banner">
      <div className="saludo-avatar-box">
        <div className="saludo-avatar">
          {nombre.charAt(0).toUpperCase()}
        </div>
        <div className="saludo-status-dot" title="En línea"></div>
      </div>

      <div className="saludo-info">
        <div className="saludo-header">
          <h2 className="saludo-title">¡Hola, {nombre}! 👋</h2>
          <span className="saludo-badge">{rol}</span>
        </div>
        <p className="saludo-message">{mensaje}</p>
        <div className="saludo-meta">
          <span>🕒 Última conexión: <strong>{ultimoAcceso}</strong></span>
          <span className="saludo-tag">React Props</span>
        </div>
      </div>
    </div>
  )
}

export default Saludo
