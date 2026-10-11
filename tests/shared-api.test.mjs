import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { auth, fetchAPI, normalizeTransactions, calcMetrics, filterByMonth, formatCurrency } from '../frontend/js/api.js';

function storage() {
  const items = new Map();
  return { getItem: key => items.get(key) ?? null, setItem: (key, value) => items.set(key, String(value)), removeItem: key => items.delete(key) };
}
beforeEach(() => {
  globalThis.localStorage = storage();
  globalThis.sessionStorage = storage();
  globalThis.window = new EventTarget();
  window.location = { hash: '#dashboard' };
});

test('la sesión original se comparte sin convertir una sesión temporal en permanente', async () => {
  let events = 0;
  window.addEventListener('finanzas:session', () => events++);
  globalThis.fetch = async () => new Response(JSON.stringify({ token: 'test-only', user: { id: 1, username: 'Prueba' } }));
  await auth.login('test@example.invalid', 'test-only', false);
  assert.equal(sessionStorage.getItem('finanzas_jwt'), 'test-only');
  assert.equal(localStorage.getItem('finanzas_jwt'), null);
  assert.equal(events, 1);
  auth.logout();
  assert.equal(auth.getCurrentUser(), null);
  assert.equal(events, 2);
});

test('un token expirado limpia ambas sesiones y permite a React mostrar su acceso sin cambiar la ruta', async () => {
  sessionStorage.setItem('finanzas_jwt', 'expired');
  localStorage.setItem('finanzas_user', '{}');
  globalThis.fetch = async () => new Response(JSON.stringify({ error: 'Sesión expirada' }), { status: 401 });
  await assert.rejects(fetchAPI('/api/auth/me', { redirectOnAuthError: false }), error => error.status === 401);
  assert.equal(sessionStorage.getItem('finanzas_jwt'), null);
  assert.equal(localStorage.getItem('finanzas_user'), null);
  assert.equal(window.location.hash, '#dashboard');
});

test('un error transitorio conserva la sesión y se propaga con su estado HTTP', async () => {
  sessionStorage.setItem('finanzas_jwt', 'valid');
  const controller = new AbortController();
  globalThis.fetch = async (url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer valid');
    assert.equal(options.signal, controller.signal);
    assert.equal('redirectOnAuthError' in options, false);
    return new Response(JSON.stringify({ error: 'Servidor no disponible' }), { status: 503 });
  };
  await assert.rejects(fetchAPI('/api/transactions', { signal: controller.signal }), error => error.status === 503);
  assert.equal(sessionStorage.getItem('finanzas_jwt'), 'valid');
});

test('las fechas del primer día permanecen en el mes correcto y los importes usan los cálculos originales', () => {
  const rows = normalizeTransactions([
    { id: 1, fecha: '2026-10-01', monto: '100.50', tipo: 'Ingreso' },
    { id: 2, fecha: '2026-10-02', monto: '25.25', tipo: 'Gasto' },
    { id: 3, fecha: '2026-09-30', monto: '50.00', tipo: 'Ingreso' },
  ]);
  const october = filterByMonth(rows, 2026, 9);
  assert.equal(october.length, 2);
  assert.equal(october[0].fecha.getDate(), 1);
  assert.equal(calcMetrics(october).saldoTotal, 75.25);
  assert.equal(formatCurrency(100, 'PEN'), 'S/372.00');
  assert.throws(() => normalizeTransactions({ error: 'bad response' }));
  assert.throws(() => normalizeTransactions([{ fecha: 'invalid', monto: '100' }]));
  assert.throws(() => normalizeTransactions([{ fecha: '2026-02-30', monto: '100' }]));
});
