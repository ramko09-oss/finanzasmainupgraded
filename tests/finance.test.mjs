import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTransactions } from '../sidan-frontend/src/api.js';
import { period, filterHistory, filterAnalytics, getCategory, localDate } from '../sidan-frontend/src/finance.js';

const rows = normalizeTransactions([
  { id: 1, tipo: 'Ingreso', monto: '100', descripcion: 'Salario', fecha: '2026-01-01' },
  { id: 2, tipo: 'Gasto', monto: '10', descripcion: '[Transporte] Autobús', fecha: '2026-01-02' },
  { id: 3, tipo: 'Gasto', monto: '20', descripcion: 'Supermercado', fecha: '2025-12-31' },
]);

test('la comparación de enero usa diciembre del año anterior y conserva el saldo acumulado', () => {
  const data = period(rows, '2026-01');
  assert.equal(data.previousMonth, '2025-12');
  assert.equal(data.metrics.saldoTotal, 90);
  assert.equal(data.previous.saldoTotal, -20);
  assert.equal(localDate(rows[0].fecha), '2026-01-01');
});
test('la búsqueda del historial combina tipo, concepto y fecha sin modificar los registros', () => {
  assert.deepEqual(filterHistory(rows, 'autobús', 'Gasto').map(t => t.id), [2]);
  assert.deepEqual(filterHistory(rows, '2026-01-01', 'ALL').map(t => t.id), [1]);
  assert.equal(filterHistory(rows, 'salario', 'Gasto').length, 0);
  assert.equal(rows.length, 3);
});
test('los filtros analíticos comparan importes en la moneda seleccionada e interpretan categorías existentes', () => {
  const filters = { search: '', category: 'all', type: 'Gasto', min: '37', max: '38', preset: 'all' };
  assert.deepEqual(filterAnalytics(rows, filters, 3.72).map(t => t.id), [2]);
  assert.equal(getCategory(rows[1]), 'Transporte');
  assert.equal(getCategory(rows[2]), 'Comida y bebidas');
  assert.equal(filterAnalytics(rows, { ...filters, min: '', max: '0' }, 3.72).length, 0);
});
