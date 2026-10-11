import { useCallback, useEffect, useRef, useState } from 'react'
import { auth, fetchAPI, getToken, normalizeTransactions } from '../api.js'

export default function useFinanceSession() {
  const [user, setUser] = useState(undefined)
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(null)
  const controller = useRef(null)
  const verifyController = useRef(null)
  const clear = useCallback(() => {
    controller.current?.abort(); verifyController.current?.abort()
    setUser(null); setRows([]); setError(''); setUpdatedAt(null); setLoading(false)
  }, [])
  const verify = useCallback(async () => {
    verifyController.current?.abort()
    if (!getToken()) { clear(); return }
    const request = new AbortController()
    verifyController.current = request
    setError('')
    try {
      const data = await fetchAPI('/api/auth/me', { signal: request.signal })
      if (!data.user?.id) throw new Error('No se pudo verificar la sesión.')
      setUser(data.user)
    } catch (e) {
      if (e.name === 'AbortError') return
      if (e.status === 401 || e.status === 403) clear()
      else setError(e.message)
    }
  }, [clear])
  const refresh = useCallback(async () => {
    if (!user) return
    controller.current?.abort()
    const request = new AbortController()
    controller.current = request
    setLoading(true)
    try {
      const data = await fetchAPI('/api/transactions', { signal: request.signal })
      const next = normalizeTransactions(data)
      if (request.signal.aborted) return
      setRows(next); setError(''); setUpdatedAt(new Date())
    } catch (e) { if (e.name !== 'AbortError') setError(e.message) }
    finally { if (!request.signal.aborted) setLoading(false) }
  }, [user])
  useEffect(() => {
    // Verificar el token es una sincronización inicial con la API externa.
    // eslint-disable-next-line react/set-state-in-effect
    verify()
    const sync = () => {
      if (!getToken()) clear()
      else { setUser(undefined); setRows([]); setUpdatedAt(null); verify() }
    }
    const storage = event => { if (!event.key || ['finanzas_jwt', 'finanzas_user'].includes(event.key)) { clear(); sync() } }
    window.addEventListener('finanzas:session', sync); window.addEventListener('storage', storage)
    return () => { verifyController.current?.abort(); controller.current?.abort(); window.removeEventListener('finanzas:session', sync); window.removeEventListener('storage', storage) }
  }, [clear, verify])
  useEffect(() => {
    // Cargar y mantener sincronizados los movimientos del usuario verificado.
    // eslint-disable-next-line react/set-state-in-effect
    refresh()
    const update = () => { if (!document.hidden) refresh() }
    const timer = setInterval(update, 30000)
    window.addEventListener('focus', update); document.addEventListener('visibilitychange', update)
    return () => { clearInterval(timer); controller.current?.abort(); window.removeEventListener('focus', update); document.removeEventListener('visibilitychange', update) }
  }, [refresh])
  return { user, rows, error, loading, updatedAt, refresh, verify, logout: () => auth.logout() }
}
