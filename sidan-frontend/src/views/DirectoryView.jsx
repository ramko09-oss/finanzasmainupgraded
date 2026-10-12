import { useState } from 'react'
import UserList from '../components/UserList.jsx'
import Timer from '../components/Timer.jsx'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

export default function DirectoryView({ width, height, signedIn = false }) {
  const [visible, setVisible] = useState(true)
  const [showTimer, setShowTimer] = useState(true)
  const [requestKey, setRequestKey] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [source, setSource] = useState({ status: 'loading', total: 0, visible: 0 })
  const stateLabel = !visible ? 'oculto' : source.status === 'loading' ? 'cargando' : source.status === 'error' ? 'sin conexión' : `${source.visible} de ${source.total} usuarios`
  useDocumentTitle(`Directorio · ${stateLabel} · ${showTimer ? `${seconds}s` : 'tiempo detenido'} · ${width}px | SIDAA Finanzas`)
  return <section className="view view-active directory-view" aria-label="Directorio externo">
    <div className="view-header"><div><h2>Directorio de referencia</h2><p className="view-subtitle">Consulta una fuente pública externa desde SIDAA.</p></div><a className="btn btn-sm" href={signedIn ? '#dashboard' : '#auth'}>{signedIn ? 'Volver al dashboard' : 'Iniciar sesión'}</a></div>
    <div className="card directory-controls">
      <div className="directory-toolbar"><button className="btn btn-primary" onClick={() => setVisible(value => !value)}>{visible ? 'Ocultar directorio' : 'Mostrar directorio'}</button><button className="btn" disabled={!visible || source.status === 'loading'} onClick={() => setRequestKey(value => value + 1)}>Recargar usuarios</button><button className="btn" onClick={() => setShowTimer(value => !value)}>{showTimer ? 'Ocultar tiempo' : 'Mostrar tiempo'}</button></div>
      <div className="directory-meta">{showTimer && <Timer onTick={setSeconds} />}<span>{width < 768 ? 'Vista compacta' : 'Vista amplia'} · {width} × {height} px</span></div>
    </div>
    <div className="card directory-content">{visible ? <UserList key={requestKey} onStateChange={setSource} /> : <p role="status">El directorio está oculto. Puedes volver a mostrarlo cuando lo necesites.</p>}</div>
  </section>
}
