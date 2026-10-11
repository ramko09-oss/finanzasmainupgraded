import { useEffect, useState } from 'react'
import { CURRENCIES } from '../api.js'

export function usePreference(key, fallback, valid) {
  const [value, setValue] = useState(() => readPreference(key, fallback, valid))
  useEffect(() => {
    const sync = () => setValue(readPreference(key, fallback, valid))
    window.addEventListener('storage', sync)
    window.addEventListener('finanzas:preferences', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('finanzas:preferences', sync)
    }
  }, [key, fallback, valid])
  const update = (next) => {
    if (!valid(next)) return
    localStorage.setItem(key, next)
    setValue(next)
    window.dispatchEvent(new Event('finanzas:preferences'))
  }
  return [value, update]
}

function readPreference(key, fallback, valid) {
  const value = localStorage.getItem(key)
  return valid(value) ? value : fallback
}

const validCurrency = value => Object.hasOwn(CURRENCIES, value)
const validTheme = value => value === 'light' || value === 'dark'
export const useCurrency = () => usePreference('finanzas_currency', 'USD', validCurrency)
export const useTheme = () => usePreference('finanzas_theme', window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light', validTheme)
