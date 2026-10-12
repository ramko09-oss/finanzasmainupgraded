import { useEffect, useState } from 'react'
import { auth } from '../api.js'
import AuthLayout from './AuthLayout.jsx'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

export default function Auth({ toggleTheme, notify }) {
  const [tab, setTab] = useState('form-login')
  const [busy, setBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  useDocumentTitle(`${tab === 'form-login' ? 'Iniciar sesión' : 'Crear cuenta'} | SIDAA Finanzas`)
  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => setSlide(index => (index + 1) % 5), 5000)
    return () => clearInterval(timer)
  }, [paused])
  useEffect(() => {
    const navigate = e => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === 'ArrowRight') setSlide(index => (index + 1) % 5)
      if (e.key === 'ArrowLeft') setSlide(index => (index + 4) % 5)
    }
    window.addEventListener('keydown', navigate)
    return () => window.removeEventListener('keydown', navigate)
  }, [])
  const submit = async e => {
    e.preventDefault()
    if (busy) return
    const form = e.currentTarget
    const field = id => form.elements.namedItem(id).value
    setBusy(true)
    try {
      if (tab === 'form-login') {
        await auth.login(email, field('login-password'), form.elements.namedItem('login-remember').checked)
        window.location.hash = '#dashboard'; notify('Sesión iniciada')
      } else {
        const registeredEmail = field('reg-email').trim().toLowerCase()
        await auth.register(registeredEmail, field('reg-password'), field('reg-name'))
        form.reset(); setEmail(registeredEmail); setTab('form-login'); notify('Cuenta creada. Inicia sesión para continuar.')
      }
    } catch (e) { notify(e.message, 'error') }
    finally { setBusy(false) }
  }
  const tabs = Object.fromEntries(['form-login', 'form-register'].map(id => [id, { className: `auth-tab auth-tab-pill ${tab === id ? 'active' : ''}`, onClick: () => setTab(id), disabled: busy }]))
  return <AuthLayout activeForm={tab} tabs={tabs} dots={Array.from({ length: 5 }, (_, index) => ({ className: `carousel-dot ${slide === index ? 'active' : ''}`, onClick: () => setSlide(index) }))} bindings={{
    'form-login': { onSubmit: submit, 'aria-busy': busy },
    'form-register': { onSubmit: submit, 'aria-busy': busy },
    'login-email': { value: email, onChange: e => setEmail(e.target.value) },
    'theme-toggle-auth': { onClick: toggleTheme },
    'auth-carousel': { onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false) },
    'carousel-track': { style: { transform: `translateX(-${slide * 100}%)` }, onTouchStart: e => { e.currentTarget.dataset.touch = e.changedTouches[0].screenX }, onTouchEnd: e => { const delta = Number(e.currentTarget.dataset.touch) - e.changedTouches[0].screenX; if (Math.abs(delta) > 50) setSlide(index => (index + (delta > 0 ? 1 : 4)) % 5) } },
    'carousel-prev': { onClick: () => setSlide(index => (index + 4) % 5) }, 'carousel-next': { onClick: () => setSlide(index => (index + 1) % 5) },
  }} content={{ 'auth-title-text': tab === 'form-login' ? 'Iniciar sesión' : 'Crear cuenta', subtitle: tab === 'form-login' ? 'Ingresa a tu panel financiero en SIDAN' : 'Comienza a gestionar tus finanzas con SIDAN' }} />
}
