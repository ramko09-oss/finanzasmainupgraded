import { useEffect, useState } from 'react'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

/** Directorio externo, separado de las cuentas y transacciones de SIDAA. */
export default function UserList({ onStateChange }) {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const visible = users.filter(user => `${user.name} ${user.email}`.toLowerCase().includes(query.trim().toLowerCase()))
  useEffect(() => {
    const request = new AbortController()
    const timeout = setTimeout(() => {
      if (request.signal.aborted) return
      setError('La fuente externa está tardando demasiado. Puedes recargar para volver a intentarlo.')
      setStatus('error')
      request.abort()
    }, 20000)
    const load = async () => {
      try {
        const response = await fetch(USERS_URL, { signal: request.signal, credentials: 'omit', referrerPolicy: 'no-referrer' })
        if (!response.ok) throw new Error(`El directorio respondió con HTTP ${response.status}.`)
        const data = await response.json()
        if (!Array.isArray(data) || data.some(user => !user.id || typeof user.name !== 'string' || typeof user.email !== 'string')) throw new Error('La respuesta del directorio no tiene el formato esperado.')
        if (request.signal.aborted) return
        setUsers(data); setStatus('ready')
      } catch (e) {
        if (request.signal.aborted) return
        setError(e instanceof TypeError ? 'No se pudo conectar con la fuente externa. Revisa tu conexión y vuelve a intentarlo.' : e.message || 'No se pudo cargar el directorio.'); setStatus('error')
      } finally { clearTimeout(timeout) }
    }
    load()
    return () => { clearTimeout(timeout); request.abort() }
  }, [])
  useEffect(() => {
    onStateChange?.({ status, total: users.length, visible: visible.length })
  }, [onStateChange, status, users.length, visible.length])
  return <section aria-label="Usuarios de referencia" aria-busy={status === 'loading'}>
    <h3>Usuarios de referencia</h3>
    <p className="view-subtitle">Fuente: JSONPlaceholder. Datos ficticios ajenos a las cuentas de SIDAA.</p>
    {status === 'loading' && <p role="status"><span className="directory-spinner" aria-hidden="true" /> Cargando usuarios…</p>}
    {status === 'error' && <p role="alert">{error}</p>}
    {status === 'ready' && <>
      <label className="directory-search">Buscar en el directorio<input className="input-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Nombre o correo" /></label>
      <p role="status">{users.length} usuarios recibidos de la fuente externa. Mostrando {visible.length}.</p>
      <ul className="directory-users">{visible.map(user => <li className="card directory-user" key={user.id}><span className="user-avatar" aria-hidden="true">{user.name.slice(0, 1)}</span><div><strong>{user.name}</strong><p>{user.email}</p></div></li>)}</ul>
      {!visible.length && <p className="view-subtitle">No hay coincidencias. Prueba con otro nombre o correo.</p>}
    </>}
  </section>
}
