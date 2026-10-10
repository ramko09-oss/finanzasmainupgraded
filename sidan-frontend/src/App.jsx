import { useState } from 'react'
import './index.css'

// Componentes organizados en src/components
import Sidebar from './components/Sidebar'
import Card from './components/Card'
import MetricCard from './components/MetricCard'
import ThemeToggle from './components/ThemeToggle'
import Counter from './components/Counter'
import CurrencySelector from './components/CurrencySelector'

// Imágenes del proyecto SIDAN original
import slide1 from './assets/img/slide-1-bienvenido.jpg'
import slide2 from './assets/img/slide-2-desorden.jpg'
import slide3 from './assets/img/slide-3-simplifica.jpg'
import slide4 from './assets/img/slide-4-crecimiento.jpg'
import slide5 from './assets/img/slide-5-conectalo.jpg'

/**
 * Datos de las tarjetas — migradas del prototipo estático SIDAN
 * Cada card usa props: titulo, descripcion, imagen, categoria
 */
const CARDS_DATA = [
  {
    titulo: 'Bienvenido a SIDAN',
    descripcion: 'Tu plataforma integral de gestión financiera personal. Controla ingresos, gastos y visualiza tu salud económica en tiempo real.',
    imagen: slide1,
    categoria: 'info',
  },
  {
    titulo: '¿Tus finanzas son un desorden?',
    descripcion: 'SIDAN te ayuda a organizar todas tus transacciones financieras de manera clara y eficiente, sin complicaciones.',
    imagen: slide2,
    categoria: 'gasto',
  },
  {
    titulo: 'Simplifica todo en un lugar',
    descripcion: 'Registra transacciones, visualiza gráficas de evolución, analiza por categorías y obtén diagnósticos financieros automáticos.',
    imagen: slide3,
    categoria: 'ingreso',
  },
  {
    titulo: 'Mira cómo crecen tus números',
    descripcion: 'Dashboard con métricas en tiempo real, gráficas de evolución histórica y distribución inteligente de tus recursos.',
    imagen: slide4,
    categoria: 'ingreso',
  },
  {
    titulo: '¡Conéctalo ya!',
    descripcion: 'Empieza hoy mismo a tomar el control de tu dinero. SIDAN está listo para ti en cualquier dispositivo.',
    imagen: slide5,
    categoria: 'info',
  },
]

/**
 * App Principal — Componente raíz
 * Utiliza useState para:
 * 1. Navegación entre vistas (activeView)
 * 2. El tema claro/oscuro se maneja en ThemeToggle
 * 3. Los Likes se manejan dentro de cada Card
 * 4. El contador se maneja en Counter
 * 5. La moneda se maneja en CurrencySelector
 */
function App() {
  const [activeView, setActiveView] = useState('dashboard')

  return (
    <div className="app-layout">
      {/* Sidebar con props: activeView + onNavigate */}
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* Contenido Principal */}
      <div className="main-content">
        {/* Barra Superior */}
        <header className="topbar">
          <div className="topbar-left">
            <h1>
              {activeView === 'dashboard' && '📊 Dashboard Principal'}
              {activeView === 'features' && '⭐ Características SIDAN'}
              {activeView === 'interacciones' && '🔧 Interacciones con Estado'}
            </h1>
            <p>
              {activeView === 'dashboard' && 'Resumen global y métricas clave de tus finanzas'}
              {activeView === 'features' && 'Tarjetas reutilizables con componente <Card /> y props'}
              {activeView === 'interacciones' && 'Componentes interactivos usando useState de React'}
            </p>
          </div>
          <div className="topbar-actions">
            {/* ThemeToggle — Actividad 3: Selector claro/oscuro con useState */}
            <ThemeToggle />
          </div>
        </header>

        {/* ============================================= */}
        {/* VISTA: DASHBOARD */}
        {/* ============================================= */}
        {activeView === 'dashboard' && (
          <>
            {/* Métricas — componente MetricCard con props de variante */}
            <div className="metrics-grid">
              <MetricCard titulo="Saldo Total" valor="$12,580.00" variante="primary" />
              <MetricCard titulo="Ingresos del Mes" valor="$4,200.00" variante="income" />
              <MetricCard titulo="Gastos del Mes" valor="$1,850.00" variante="expense" />
              <MetricCard titulo="Transacciones" valor="34" variante="neutral" />
            </div>

            {/* Cards destacadas — Componente <Card /> con props */}
            <section className="features-section">
              <h2>Características Destacadas</h2>
              <div className="cards-grid">
                {CARDS_DATA.slice(0, 3).map((card, index) => (
                  <Card
                    key={index}
                    titulo={card.titulo}
                    descripcion={card.descripcion}
                    imagen={card.imagen}
                    categoria={card.categoria}
                  />
                ))}
              </div>
            </section>

            {/* Interacciones rápidas */}
            <section className="interactions-section">
              <h2>Interacciones Dinámicas</h2>
              <div className="interactions-grid">
                <Counter />
                <CurrencySelector />
              </div>
            </section>
          </>
        )}

        {/* ============================================= */}
        {/* VISTA: CARACTERÍSTICAS (todas las cards)      */}
        {/* ============================================= */}
        {activeView === 'features' && (
          <section className="features-section">
            <h2>Todas las Características de SIDAN</h2>
            <div className="cards-grid">
              {CARDS_DATA.map((card, index) => (
                <Card
                  key={index}
                  titulo={card.titulo}
                  descripcion={card.descripcion}
                  imagen={card.imagen}
                  categoria={card.categoria}
                />
              ))}
            </div>
          </section>
        )}

        {/* ============================================= */}
        {/* VISTA: INTERACCIONES CON ESTADO               */}
        {/* ============================================= */}
        {activeView === 'interacciones' && (
          <section className="interactions-section">
            <h2>Componentes Interactivos con useState</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              Cada componente mantiene su propio estado interno usando el hook <code>useState</code>.
              Los cambios se reflejan en tiempo real y pueden verificarse con React DevTools.
            </p>
            <div className="interactions-grid">
              <Counter />
              <CurrencySelector />
            </div>

            <h2 style={{ marginTop: '2rem' }}>Cards con Sistema de Likes</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              Cada <code>&lt;Card /&gt;</code> gestiona su estado de &quot;likes&quot; de manera independiente.
            </p>
            <div className="cards-grid">
              {CARDS_DATA.slice(0, 2).map((card, index) => (
                <Card
                  key={index}
                  titulo={card.titulo}
                  descripcion={card.descripcion}
                  imagen={card.imagen}
                  categoria={card.categoria}
                />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="app-footer">
          SIDAN Finanzas — Migrado a React + Vite | Sesión 05 — Componentes, Props y useState
        </footer>
      </div>
    </div>
  )
}

export default App
