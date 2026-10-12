// Backend de DevTools exclusivo del inspector local. No se importa desde main.jsx.
import { initialize, activate } from 'react-devtools-inline/backend'
import RefreshRuntime from '/@react-refresh'

initialize(window)
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => type => type
window.__vite_plugin_react_preamble_installed__ = true
const start = async event => {
  if (event.source !== window.parent || event.origin !== window.location.origin || event.data?.type !== 'sidaa:activate-inspector') return
  window.removeEventListener('message', start)
  activate(window)
  if (event.data.effects) await import('./effects-preview.jsx')
  else await import('./main.jsx')
}
window.addEventListener('message', start)
