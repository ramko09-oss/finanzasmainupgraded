import React from 'react'
import { createRoot } from 'react-dom/client'
import { initialize as initializeFrontend } from 'react-devtools-inline/frontend'
import monitorRuntime from './runtime-monitor.js'

// DevTools usa su runtime experimental exclusivamente en esta herramienta.
// La aplicación del iframe importa su propio React estable, sin alterar producción.
const frame = document.getElementById('application')
const loaded = new Promise(resolve => frame.addEventListener('load', resolve, { once: true }))
frame.src = '/frame.html'
await loaded
const DevTools = initializeFrontend(frame.contentWindow)
const inspectorRoot = import.meta.hot?.data.root ?? createRoot(document.getElementById('inspector'))
if (import.meta.hot) import.meta.hot.data.root = inspectorRoot
inspectorRoot.render(<DevTools />)
const stopMonitor = monitorRuntime(frame.contentWindow, document.getElementById('runtime-monitor'))
window.addEventListener('pagehide', stopMonitor, { once: true })
if (import.meta.hot) import.meta.hot.dispose(() => { window.removeEventListener('pagehide', stopMonitor); stopMonitor() })
frame.contentWindow.postMessage({ type: 'sidaa:activate-inspector', effects: new URLSearchParams(window.location.search).has('effects') }, window.location.origin)
