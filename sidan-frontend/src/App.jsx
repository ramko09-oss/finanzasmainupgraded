import { useState } from 'react'
import './index.css'

// Componentes modulares organizados en src/components
import Sidebar from './components/Sidebar'
import Saludo from './components/Saludo'
import Card from './components/Card'
import MetricCard from './components/MetricCard'
import ThemeToggle from './components/ThemeToggle'
import Counter from './components/Counter'
import CurrencySelector from './components/CurrencySelector'
import AsyncDataLoader from './components/AsyncDataLoader'
import AutoRefreshCounter from './components/AutoRefreshCounter'

// Imágenes del proyecto SIDAN original
import slide1 from './assets/img/slide-1-bienvenido.jpg'
import slide2 from './assets/img/slide-2-desorden.jpg'
import slide3 from './assets/img/slide-3-simplifica.jpg'
import slide4 from './assets/img/slide-4-crecimiento.jpg'
import slide5 from './assets/img/slide-5-conectalo.jpg'

/**
 * Datos para el componente funcional reutilizable <Card />
 * Demuestra props: titulo, descripcion, imagen, categoria
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
    descripcion: 'Registra transacciones, visualiza gráficas de evolución, analiza por categorías y obtén diagnósticos automáticos.',
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

function App() {
  const [activeView, setActiveView] = useState('dashboard')

  return (
    <div className="app-layout">
      {/* Sidebar modular con props (activeView + onNavigate) */}
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* Contenido Principal */}
      <div className="main-content">
        {/* Barra Superior con ThemeToggle */}
        <header className="topbar">
          <div className="topbar-left">
            <h1>
              {activeView === 'dashboard' && '📊 Dashboard Integrado (React + Efectos)'}
              {activeView === 'efectos' && '⚡ Sesión 06: useEffect, Asincronía y Limpieza'}
              {activeView === 'features' && '⭐ Componentes Reutilizables (<Card />)'}
              {activeView === 'interacciones' && '🔧 Gestión de Estado Interno (useState)'}
            </h1>
            <p>
              {activeView === 'dashboard' && 'Composición de componentes funcionales, props, useState y useEffect'}
              {activeView === 'efectos' && 'Demostración de setTimeout (clearTimeout) e setInterval (clearInterval)'}
              {activeView === 'features' && 'Componente funcional reutilizable <Card /> con paso de props estructuradas'}
              {activeView === 'interacciones' && 'Interacciones dinámicas capturando eventos de usuario como onClick'}
            </p>
          </div>
          <div className="topbar-actions">
            <ThemeToggle />
          </div>
        </header>

        {/* ======================================================== */}
        {/* VISTA 1: DASHBOARD COMPUESTO (COMPOSICIÓN DE COMPONENTES) */}
        {/* ======================================================== */}
        {activeView === 'dashboard' && (
          <div className="view-container">
            {/* 1. Componente Saludo con Props */}
            <Saludo
              nombre="Kevyo Ramirez"
              rol="Administrador de Finanzas"
              mensaje="Panel interactivo de SIDAN evolucionado con React 19, componentes modulares y hooks avanzados."
              ultimoAcceso="10 de Octubre de 2026, 16:15"
            />

            {/* 2. Composición: Temporizador de Intervalo en Vivo */}
            <AutoRefreshCounter />

            {/* 3. Composición: Carga Asincrónica con setTimeout */}
            <AsyncDataLoader />

            {/* 4. Métricas Rápidas con <MetricCard /> */}
            <h2 className="section-title">Indicadores Clave</h2>
            <div className="metrics-grid">
              <MetricCard titulo="Saldo Disponible" valor="$14,850.50" variante="primary" />
              <MetricCard titulo="Ingresos Acumulados" valor="$5,200.00" variante="income" />
              <MetricCard titulo="Gastos Totales" valor="$2,150.00" variante="expense" />
              <MetricCard titulo="Balance Neto" valor="+$3,050.50" variante="neutral" />
            </div>

            {/* 5. Composición: Galería de Tarjetas <Card /> */}
            <section className="features-section">
              <h2 className="section-title">Tarjetas Reutilizables con Props</h2>
              <div className="cards-grid">
                {CARDS_DATA.slice(0, 3).map((card, idx) => (
                  <Card
                    key={idx}
                    titulo={card.titulo}
                    descripcion={card.descripcion}
                    imagen={card.imagen}
                    categoria={card.categoria}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 2: SESIÓN 06 - EFECTOS, ASINCRONÍA Y LIMPIEZA       */}
        {/* ======================================================== */}
        {activeView === 'efectos' && (
          <div className="view-container">
            <div className="lab-info-banner">
              <h3>🎯 Laboratorio Sesión 06: Efectos Secundarios y Limpieza</h3>
              <p>
                Esta vista demuestra directamente los requerimientos de la sesión:
                gestión de efectos secundarios con <code>useEffect</code>, simulación de carga asincrónica con <code>setTimeout</code>,
                actualización cíclica con <code>setInterval</code> y funciones de limpieza correspondientes (<code>clearTimeout</code> y <code>clearInterval</code>).
              </p>
            </div>

            {/* Demostración 1: Contador automático con setInterval + clearInterval */}
            <AutoRefreshCounter />

            {/* Demostración 2: Simulación asincrónica con setTimeout + clearTimeout */}
            <AsyncDataLoader />
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 3: CARACTERÍSTICAS (<Card /> y Props)              */}
        {/* ======================================================== */}
        {activeView === 'features' && (
          <div className="view-container">
            <h2 className="section-title">Todas las Tarjetas de SIDAN (Componente &lt;Card /&gt;)</h2>
            <p className="section-subtitle">
              Cada tarjeta es una instancia del mismo componente funcional reutilizable que recibe información mediante props.
            </p>
            <div className="cards-grid">
              {CARDS_DATA.map((card, idx) => (
                <Card
                  key={idx}
                  titulo={card.titulo}
                  descripcion={card.descripcion}
                  imagen={card.imagen}
                  categoria={card.categoria}
                />
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 4: INTERACCIONES CON USESTATE                      */}
        {/* ======================================================== */}
        {activeView === 'interacciones' && (
          <div className="view-container">
            <h2 className="section-title">Componentes con Estado Interno (useState)</h2>
            <p className="section-subtitle">
              Demostración del hook <code>useState</code> capturando eventos <code>onClick</code> y cambiando estilos dinámicamente.
            </p>
            <div className="interactions-grid">
              <Counter />
              <CurrencySelector />
            </div>

            <h2 className="section-title" style={{ marginTop: '2rem' }}>Interacciones en Tarjetas (Sistema de Likes)</h2>
            <div className="cards-grid">
              {CARDS_DATA.slice(0, 2).map((card, idx) => (
                <Card
                  key={idx}
                  titulo={card.titulo}
                  descripcion={card.descripcion}
                  imagen={card.imagen}
                  categoria={card.categoria}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="app-footer">
          <span>SIDAN Finanzas — Proyecto Evolucionado a React 19 + Vite</span>
          <span>Sesión 06: Componentes, Props, useState, useEffect y Funciones de Limpieza</span>
        </footer>
      </div>
    </div>
  )
}

export default App
