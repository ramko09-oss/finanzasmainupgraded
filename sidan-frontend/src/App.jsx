import '../../frontend/css/styles.css'
import Sidebar from './components/Sidebar'
import ThemeToggle from './components/ThemeToggle'
import FinancialDashboard from './components/FinancialDashboard'

export default function App() {
  return (
    <div id="app-container">
      <Sidebar />
      <div className="main-content">
        <header className="view-header">
          <div>
            <h2>Panel ampliado</h2>
            <p className="view-subtitle">Tu cuenta, tus movimientos y tus métricas en un solo lugar</p>
          </div>
          <div><ThemeToggle /></div>
        </header>
        <div className="view-container"><FinancialDashboard /></div>
        <p className="view-subtitle">SIDAA Finanzas · Controla tus ingresos y gastos</p>
      </div>
      <nav className="mobile-bottom-nav" aria-label="Navegación móvil">
        <a className="bottom-nav-item active" href="/react/" aria-current="page"><span>◈</span><span>Panel</span></a>
        <a className="bottom-nav-item" href="/#registrar"><span>+</span><span>Registrar</span></a>
        <a className="bottom-nav-item" href="/#historial"><span>≡</span><span>Historial</span></a>
        <a className="bottom-nav-item" href="/#graficas"><span>▥</span><span>Gráficas</span></a>
        <a className="bottom-nav-item" href="/#dashboard"><span>↗</span><span>Inicio</span></a>
      </nav>
    </div>
  )
}
