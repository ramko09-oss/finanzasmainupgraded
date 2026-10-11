import sidaaLogo from '../assets/img/sidaa-logo.png'

const destinations = [
  { href: '/#registrar', label: 'Registrar movimiento', symbol: '+' },
  { href: '/#historial', label: 'Historial', symbol: '≡' },
  { href: '/#analitica', label: 'Analítica', symbol: '↗' },
  { href: '/#resumen', label: 'Resumen mensual', symbol: '▤' },
  { href: '/#graficas', label: 'Gráficas', symbol: '▥' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand-card">
        <img className="sidebar-brand-logo" src={sidaaLogo} alt="SIDAA" />
        <div className="sidebar-brand-meta">
          <span className="sidebar-brand-name">SIDAA</span>
          <span className="sidebar-brand-sub">Finanzas</span>
        </div>
      </div>
      <div className="nav-section-title">MENÚ PRINCIPAL</div>
      <nav className="sidebar-nav" aria-label="Navegación financiera">
        <a className="nav-item active" href="/react/" aria-current="page"><span aria-hidden="true">◈</span><span className="nav-text">Panel ampliado</span></a>
        {destinations.map(item => <a key={item.href} className="nav-item" href={item.href}><span aria-hidden="true">{item.symbol}</span><span className="nav-text">{item.label}</span></a>)}
      </nav>
      <div className="sidebar-footer-card">
        <a href="/#dashboard" className="nav-item">Dashboard principal</a>
      </div>
    </aside>
  )
}
