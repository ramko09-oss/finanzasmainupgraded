import { useEffect, useState } from 'react'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

/** Directorio de referencia para la herramienta local de verificación. */
export default function UserList() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  useEffect(() => {
    const request = new AbortController()
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
        setError(e.message || 'No se pudo cargar el directorio.'); setStatus('error')
      }
    }
    load()
    return () => request.abort()
  }, [])
  return <section aria-label="Usuarios de referencia" aria-busy={status === 'loading'}>
    <h3>Usuarios de referencia</h3>
    <p className="view-subtitle">Fuente: JSONPlaceholder. Datos ficticios ajenos a las cuentas de SIDAA.</p>
    {status === 'loading' && <p role="status">Cargando usuarios…</p>}
    {status === 'error' && <p role="alert">{error}</p>}
    {status === 'ready' && <><p role="status">{users.length} usuarios recibidos de la fuente externa.</p><ul>{users.map(user => <li key={user.id}><strong>{user.name}</strong> — {user.email}</li>)}</ul></>}
  </section>
}
