// Entrada exclusiva del servidor Vite de desarrollo; no se importa en producción.
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Timer from './components/Timer.jsx'
import UserList from './components/UserList.jsx'
import useViewport from './hooks/useViewport.js'
import useDocumentTitle from './hooks/useDocumentTitle.js'
import './styles.css'
import './App.css'

export default function EffectsPreview() {
  const [showTimer, setShowTimer] = useState(false)
  const [showUsers, setShowUsers] = useState(false)
  const [requestKey, setRequestKey] = useState(0)
  const { width, height } = useViewport()
  useDocumentTitle(`${showTimer ? 'Temporizador activo' : 'Temporizador detenido'} · ${width} px | SIDAA Finanzas`)
  return <main style={{ padding: 24 }}>
    <h2>Sincronización de la interfaz</h2>
    <p className="view-subtitle">Vista local para comprobar componentes y efectos con datos de referencia.</p>
    <div className="card" style={{ padding: 20, marginTop: 16 }}>
      <h3>Tiempo de la vista</h3>
      <button className="btn btn-primary" aria-pressed={showTimer} onClick={() => setShowTimer(value => !value)}>{showTimer ? 'Ocultar temporizador' : 'Mostrar temporizador'}</button>
      {showTimer && <p><Timer /></p>}
    </div>
    <div className="card" style={{ padding: 20, marginTop: 16 }}>
      <h3>Adaptación de pantalla</h3>
      <p role="status">Tamaño actual: {width} × {height} px</p>
      <p>El título del documento cambia con el temporizador y el ancho de pantalla.</p>
    </div>
    <div className="card" style={{ padding: 20, marginTop: 16 }}>
      <button className="btn btn-primary" aria-pressed={showUsers} onClick={() => setShowUsers(value => !value)}>{showUsers ? 'Ocultar directorio' : 'Cargar directorio externo'}</button>
      {showUsers && <><button className="btn btn-sm" onClick={() => setRequestKey(value => value + 1)}>Volver a cargar</button><UserList key={requestKey} /></>}
    </div>
  </main>
}

function EffectsHarness() {
  const [mounted, setMounted] = useState(true)
  return <><div style={{ padding: '12px 24px' }}><button className="btn btn-sm" onClick={() => setMounted(value => !value)}>{mounted ? 'Ocultar vista sincronizada' : 'Mostrar vista sincronizada'}</button></div>{mounted ? <EffectsPreview /> : <p style={{ padding: 24 }}>Vista sincronizada oculta.</p>}</>
}

const root = import.meta.hot?.data.root ?? createRoot(document.getElementById('root'))
if (import.meta.hot) import.meta.hot.data.root = root
root.render(<StrictMode><EffectsHarness /></StrictMode>)
