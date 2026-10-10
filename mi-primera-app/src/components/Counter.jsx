import { useState } from 'react'

/**
 * Componente <Counter />
 * Implementa un contador de "Likes" interactivo con useState
 * El color del contador cambia según su valor (positivo/negativo/cero)
 * Esto demuestra el reto: condicionar estilos CSS basados en el estado
 */
function Counter() {
  const [count, setCount] = useState(0)

  // Reto: determinar clase CSS según el estado
  const getCountColor = () => {
    if (count > 0) return 'var(--income)'
    if (count < 0) return 'var(--expense)'
    return 'var(--primary)'
  }

  return (
    <div className="counter-card">
      <h3>🎯 Contador Interactivo</h3>
      <div className="counter-display" style={{ color: getCountColor() }}>
        {count}
      </div>
      <div className="counter-btns">
        <button
          className="counter-btn increment"
          onClick={() => setCount(count + 1)}
        >
          + Incrementar
        </button>
        <button
          className="counter-btn decrement"
          onClick={() => setCount(count - 1)}
        >
          − Decrementar
        </button>
        <button
          className="counter-btn reset"
          onClick={() => setCount(0)}
        >
          ↺ Reiniciar
        </button>
      </div>
    </div>
  )
}

export default Counter
