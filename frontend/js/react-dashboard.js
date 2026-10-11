// Vite produce un manifiesto: no se codifican nombres de bundles con hash.
export async function mountReactDashboard() {
  const element = document.getElementById('react-dashboard-root')
  if (!element || element.dataset.mounted) return
  element.dataset.mounted = 'loading'
  try {
    const response = await fetch('/react/manifest.json', { cache: 'no-cache' })
    if (!response.ok) throw new Error('Build React no disponible')
    const manifest = await response.json()
    const entry = manifest['src/dashboard.jsx']
    if (!entry) throw new Error('Entrada del dashboard no disponible')
    const files = new Set()
    function collect(chunk) {
      if (!chunk || files.has(chunk.file)) return
      files.add(chunk.file)
      for (const css of chunk.css || []) {
        const href = `/react/${css}`
        if (![...document.querySelectorAll('link[rel="stylesheet"]')].some(link => link.getAttribute('href') === href)) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = href
          document.head.appendChild(link)
        }
      }
      for (const imported of chunk.imports || []) collect(manifest[imported])
    }
    collect(entry)
    const module = await import(`/react/${entry.file}`)
    module.mountDashboard(element)
    element.dataset.mounted = 'true'
  } catch {
    delete element.dataset.mounted
    element.textContent = 'El panel ampliado no está disponible. Puedes seguir usando las métricas y gráficos del dashboard.'
  }
}
