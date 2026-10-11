import { createRoot } from 'react-dom/client'
import FinancialDashboard from './components/FinancialDashboard'

export function mountDashboard(element) {
  const root = createRoot(element)
  root.render(<FinancialDashboard embedded />)
  return () => root.unmount()
}
