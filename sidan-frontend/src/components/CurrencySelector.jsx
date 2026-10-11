import { useCurrency } from '../hooks/usePreferences'

/**
 * Componente <CurrencySelector />
 * Selector de moneda interactivo con useState
 * Cambia dinámicamente el estilo del panel según la moneda seleccionada
 * Segunda interacción dinámica requerida por la práctica
 */
const CURRENCIES = {
  USD: { symbol: '$', name: 'Dólar Estadounidense', className: 'usd' },
  EUR: { symbol: '€', name: 'Euro', className: 'eur' },
  PEN: { symbol: 'S/', name: 'Sol Peruano', className: 'pen' },
  MXN: { symbol: '$', name: 'Peso Mexicano', className: 'mxn' },
}

function CurrencySelector() {
  const [currency, setCurrency] = useCurrency()

  const current = CURRENCIES[currency]

  return (
    <div className="currency-card">
      <h3>💱 Selector de Moneda</h3>
      <div className={`currency-display ${current.className}`}>
        <div className="currency-symbol">{current.symbol}</div>
        <div className="currency-name">{current.name}</div>
      </div>
      <div className="currency-select-wrapper">
        <label htmlFor="currency-select">Moneda activa</label>
        <select
          id="currency-select"
          className="input-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {Object.entries(CURRENCIES).map(([code, info]) => (
            <option key={code} value={code}>
              {info.symbol} {info.name} ({code})
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default CurrencySelector
