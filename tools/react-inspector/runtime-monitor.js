/** Captura real de consola y recursos de la ventana inspeccionada, solo en desarrollo. */
export default function monitorRuntime(target, output) {
  const intervals = new Map()
  const resizeListeners = new Set()
  const messages = []
  let ticks = 0
  let oneSecondTicks = 0
  let started = 0
  let cleared = 0
  const original = {
    setInterval: target.setInterval.bind(target), clearInterval: target.clearInterval.bind(target),
    add: target.addEventListener.bind(target), remove: target.removeEventListener.bind(target),
    error: target.console.error.bind(target.console), warn: target.console.warn.bind(target.console),
  }
  const update = () => {
    const errors = messages.filter(message => message.type === 'error').length
    const warnings = messages.filter(message => message.type === 'warn').length
    const oneSecondIntervals = [...intervals.values()].filter(delay => delay === 1000).length
    output.textContent = `Registro real de la ventana inspeccionada\nConsola: ${errors} errores · ${warnings} advertencias\nIntervalos de 1 s activos: ${oneSecondIntervals} · ticks de 1 s: ${oneSecondTicks}\nIntervalos totales: ${intervals.size} · iniciados: ${started} · cancelados: ${cleared} · ticks totales: ${ticks}\nListeners resize activos: ${resizeListeners.size}\nTítulo del documento: ${target.document.title}\n${messages.map(message => `${message.type}: ${message.text}`).join('\n')}`
  }
  target.setInterval = (callback, delay, ...args) => {
    const id = original.setInterval(typeof callback === 'function' ? (...values) => { ticks++; if (delay === 1000) oneSecondTicks++; callback(...values); update() } : callback, delay, ...args)
    intervals.set(id, delay); started++; update(); return id
  }
  target.clearInterval = id => { if (intervals.delete(id)) cleared++; original.clearInterval(id); update() }
  target.addEventListener = (name, listener, options) => { if (name === 'resize') resizeListeners.add(listener); original.add(name, listener, options); update() }
  target.removeEventListener = (name, listener, options) => { if (name === 'resize') resizeListeners.delete(listener); original.remove(name, listener, options); update() }
  const record = (type, values) => { messages.push({ type, text: values.map(value => value instanceof Error ? value.message : String(value)).join(' ') }); update() }
  target.console.error = (...values) => { record('error', values); original.error(...values) }
  target.console.warn = (...values) => { record('warn', values); original.warn(...values) }
  const onError = event => record('error', [event.message])
  const onRejection = event => record('error', [event.reason])
  original.add('error', onError); original.add('unhandledrejection', onRejection)
  const titleObserver = new target.MutationObserver(update)
  titleObserver.observe(target.document.head, { childList: true, subtree: true, characterData: true })
  update()
  return () => {
    titleObserver.disconnect(); original.remove('error', onError); original.remove('unhandledrejection', onRejection)
    target.setInterval = original.setInterval; target.clearInterval = original.clearInterval
    target.addEventListener = original.add; target.removeEventListener = original.remove
    target.console.error = original.error; target.console.warn = original.warn
  }
}
