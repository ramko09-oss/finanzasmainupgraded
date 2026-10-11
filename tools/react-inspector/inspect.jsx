import React from 'react'
import { createRoot } from 'react-dom/client'
import { initialize as initializeBackend, activate } from 'react-devtools-inline/backend'
import { initialize as initializeFrontend } from 'react-devtools-inline/frontend'

// DevTools usa su runtime experimental exclusivamente en esta herramienta.
// La aplicación del iframe importa su propio React estable, sin alterar producción.
const frame = document.getElementById('application')
const loaded = new Promise(resolve => frame.addEventListener('load', resolve, { once: true }))
frame.srcdoc = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div></body></html>'
await loaded
initializeBackend(frame.contentWindow)
const DevTools = initializeFrontend(frame.contentWindow)
createRoot(document.getElementById('inspector')).render(<DevTools />)
activate(frame.contentWindow)
const script = frame.contentDocument.createElement('script')
script.type = 'module'
script.textContent = `import RefreshRuntime from 'http://127.0.0.1:5173/@react-refresh';
RefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => type => type;
window.__vite_plugin_react_preamble_installed__ = true;
await import('http://127.0.0.1:5173/src/main.jsx');`
frame.contentDocument.body.append(script)
