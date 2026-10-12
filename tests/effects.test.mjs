import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { JSDOM } from '../sidan-frontend/node_modules/jsdom/lib/api.js';
import { createServer } from '../sidan-frontend/node_modules/vite/dist/node/index.js';
import React, { act } from '../sidan-frontend/node_modules/react/index.js';
import { createRoot } from '../sidan-frontend/node_modules/react-dom/client.js';

let server, Timer, UserList, useViewport, useDocumentTitle, dom;
before(async () => {
  dom = new JSDOM('<!doctype html><title>SIDAA</title><body></body>', { url: 'http://localhost/' });
  globalThis.window = dom.window; globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  server = await createServer({ root: fileURLToPath(new URL('../sidan-frontend', import.meta.url)), server: { middlewareMode: true }, logLevel: 'error' });
  Timer = (await server.ssrLoadModule('/src/components/Timer.jsx')).default;
  UserList = (await server.ssrLoadModule('/src/components/UserList.jsx')).default;
  useViewport = (await server.ssrLoadModule('/src/hooks/useViewport.js')).default;
  useDocumentTitle = (await server.ssrLoadModule('/src/hooks/useDocumentTitle.js')).default;
});
after(async () => { await server?.close(); dom?.window.close(); delete globalThis.IS_REACT_ACT_ENVIRONMENT; });
function fixture() {
  const container = document.createElement('div'); document.body.append(container);
  const root = createRoot(container);
  return { root, container, render: component => act(() => root.render(React.createElement(React.StrictMode, null, component))), dispose: async () => { await act(() => root.unmount()); container.remove(); } };
}

test('Timer limpia cada intervalo de StrictMode y comienza desde cero al volver a montarse', async t => {
  let now = 0, id = 0;
  const intervals = new Map();
  t.mock.method(Date, 'now', () => now);
  t.mock.method(globalThis, 'setInterval', callback => { intervals.set(++id, callback); return id; });
  t.mock.method(globalThis, 'clearInterval', handle => intervals.delete(handle));
  const f = fixture();
  try {
    await f.render(React.createElement(Timer));
    assert.equal(intervals.size, 1);
    await act(() => { now = 3000; for (const callback of intervals.values()) callback(); });
    assert.match(f.container.textContent, /3 s/);
    await f.render(null);
    assert.equal(intervals.size, 0);
    await f.render(React.createElement(Timer));
    assert.match(f.container.textContent, /0 s/);
    assert.equal(intervals.size, 1);
  } finally { await f.dispose(); }
  assert.equal(intervals.size, 0);
});

test('resize sincroniza el estado y elimina el mismo listener al desmontarse', async t => {
  const listeners = new Set();
  const add = window.addEventListener.bind(window), remove = window.removeEventListener.bind(window);
  t.mock.method(window, 'addEventListener', (name, listener, options) => { if (name === 'resize') listeners.add(listener); add(name, listener, options); });
  t.mock.method(window, 'removeEventListener', (name, listener, options) => { if (name === 'resize') listeners.delete(listener); remove(name, listener, options); });
  function Probe() { const { width, height } = useViewport(); return React.createElement('p', null, `${width}x${height}`); }
  const f = fixture();
  try {
    await f.render(React.createElement(Probe)); assert.equal(listeners.size, 1);
    await act(() => { window.innerWidth = 640; window.innerHeight = 480; window.dispatchEvent(new window.Event('resize')); });
    assert.equal(f.container.textContent, '640x480');
  } finally { await f.dispose(); }
  assert.equal(listeners.size, 0);
});

test('el título responde a sus dependencias y restaura el documento al desmontarse', async () => {
  document.title = 'SIDAA';
  function Probe({ title }) { useDocumentTitle(title); return null; }
  const f = fixture();
  try {
    await f.render(React.createElement(Probe, { title: 'Dashboard' })); assert.equal(document.title, 'Dashboard');
    await f.render(React.createElement(Probe, { title: 'Historial' })); assert.equal(document.title, 'Historial');
  } finally { await f.dispose(); }
  assert.equal(document.title, 'SIDAA');
});

test('UserList muestra carga, datos externos y aborta las peticiones de sus montajes', async t => {
  const requests = [];
  t.mock.method(globalThis, 'fetch', (url, options) => new Promise(resolve => { requests.push({ url, options, resolve }); }));
  const f = fixture();
  try {
    await f.render(React.createElement(UserList));
    assert.match(f.container.textContent, /Cargando usuarios/);
    assert.equal(requests[0].options.signal.aborted, true);
    const request = requests.at(-1);
    assert.equal(request.url, 'https://jsonplaceholder.typicode.com/users');
    assert.equal(request.options.credentials, 'omit');
    await act(async () => request.resolve({ ok: true, json: async () => [{ id: 1, name: 'Referencia', email: 'test@example.invalid' }] }));
    assert.match(f.container.textContent, /Referencia/);
    assert.doesNotMatch(f.container.textContent, /Cargando usuarios/);
  } finally { await f.dispose(); }
  assert.ok(requests.every(request => request.options.signal.aborted));
});

test('UserList presenta errores HTTP y no actualiza una vista desmontada con una respuesta tardía', async t => {
  const requests = [];
  t.mock.method(globalThis, 'fetch', (url, options) => new Promise(resolve => requests.push({ options, resolve })));
  const f = fixture();
  await f.render(React.createElement(UserList));
  await act(async () => requests.at(-1).resolve({ ok: false, status: 503 }));
  assert.match(f.container.querySelector('[role="alert"]').textContent, /503/);
  await f.dispose();
  await act(async () => { for (const request of requests) request.resolve({ ok: true, json: async () => [{ id: 1, name: 'Tardío', email: 'test@example.invalid' }] }); });
  assert.ok(requests.every(request => request.options.signal.aborted));
  assert.equal(f.container.textContent, '');
});
