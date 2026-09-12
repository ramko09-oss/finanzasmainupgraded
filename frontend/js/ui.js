// ============================================================
// ui.js — Gestión del DOM, Router SPA y Renderizado de Vistas
// ============================================================

import { 
  db, 
  calcMetrics, 
  filterByMonth, 
  groupByMonth, 
  getAvailableMonths, 
  calcHealthStatus, 
  formatCurrency, 
  CURRENCIES 
} from './api.js';

import { 
  renderDashboardDonut, 
  renderResumenDonut, 
  renderEvolutionCharts 
} from './charts.js';

// ─── Referencias DOM ────────────────────────────────────────────────────────
const appContainer = document.getElementById('app-container');
const viewAuth = document.getElementById('view-auth');
const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item');
const currencySelector = document.getElementById('currency-selector');
const toastContainer = document.getElementById('toast-container');

// Selectores de mes
const dashMonthSelector = document.getElementById('dashboard-month-selector');
const resumenMonthSelector = document.getElementById('resumen-month-selector');

// Estado local de la UI
let currentCurrency = localStorage.getItem('finanzas_currency') || 'USD';
let allTransactions = [];

// ─── Toasts ────────────────────────────────────────────────────────────────
export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ─── Inicialización UI Principal ────────────────────────────────────────────
export function initUI(user, logoutCb) {
  // Configurar usuario
  document.getElementById('user-greeting').textContent = `Hola, ${user.username || 'Usuario'} 👋`;
  
  // Configurar Moneda
  currencySelector.value = currentCurrency;
  currencySelector.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    localStorage.setItem('finanzas_currency', currentCurrency);
    renderActiveView(); // Re-renderizar todo
  });

  // Botón Logout
  document.getElementById('btn-logout').addEventListener('click', logoutCb);

  // Router basado en Hash
  window.addEventListener('hashchange', handleHashChange);
  
  // Selectores de mes eventos
  dashMonthSelector.addEventListener('change', () => renderDashboard(allTransactions));
  resumenMonthSelector.addEventListener('change', () => renderResumen(allTransactions));

  // Ocultar Auth, Mostrar App
  viewAuth.classList.add('hidden');
  viewAuth.classList.remove('view-active');
  appContainer.classList.remove('hidden');

  // Trigger inicial
  if (!window.location.hash || window.location.hash === '#auth') {
    window.location.hash = '#dashboard';
  } else {
    handleHashChange();
  }
}

export function showAuthView() {
  appContainer.classList.add('hidden');
  viewAuth.classList.remove('hidden');
  viewAuth.classList.add('view-active');
  window.location.hash = '#auth';
}

// ─── Router (Hash Change) ───────────────────────────────────────────────────
function handleHashChange() {
  const hash = window.location.hash || '#dashboard';
  if (hash === '#auth') return; // Manejado por app.js

  const viewName = hash.replace('#', '');
  
  // Ocultar todas las vistas del main-content
  views.forEach(v => {
    if (v.id !== 'view-auth') {
      v.classList.add('hidden');
      v.classList.remove('view-active');
    }
  });

  // Mostrar vista activa
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.remove('hidden');
    targetView.classList.add('view-active');
  }

  // Actualizar menú activo
  navItems.forEach(nav => {
    nav.classList.remove('active');
    if (nav.dataset.view === viewName) {
      nav.classList.add('active');
    }
  });

  renderActiveView();
}

// ─── Orquestador de Renderizado ──────────────────────────────────────────────
export async function renderActiveView() {
  try {
    // Siempre obtener data fresca al cambiar de vista o moneda
    allTransactions = await db.getTransactions();
    
    // Poblar selectores de mes si cambiaron las transacciones
    populateMonthSelectors(allTransactions);

    const hash = window.location.hash || '#dashboard';
    
    switch(hash) {
      case '#dashboard': renderDashboard(allTransactions); break;
      case '#registrar': renderRegistrar(); break;
      case '#historial': renderHistorial(allTransactions); break;
      case '#resumen':   renderResumen(allTransactions); break;
      case '#graficas':  renderGraficas(allTransactions); break;
    }
  } catch (err) {
    showToast('Error cargando datos: ' + err.message, 'error');
  }
}

// ─── Utils DOM ─────────────────────────────────────────────────────────────
function populateMonthSelectors(transactions) {
  const months = getAvailableMonths(transactions);
  const optionsHTML = months.map(m => `<option value="${m}">${m}</option>`).join('');
  
  // Solo actualizar si no hay valor seleccionado o si la lista cambió
  if (dashMonthSelector.options.length === 0 || dashMonthSelector.innerHTML !== optionsHTML) {
    const currentDash = dashMonthSelector.value;
    dashMonthSelector.innerHTML = optionsHTML;
    if (currentDash && months.includes(currentDash)) dashMonthSelector.value = currentDash;
  }
  
  if (resumenMonthSelector.options.length === 0 || resumenMonthSelector.innerHTML !== optionsHTML) {
    const currentRes = resumenMonthSelector.value;
    resumenMonthSelector.innerHTML = optionsHTML;
    if (currentRes && months.includes(currentRes)) resumenMonthSelector.value = currentRes;
  }
}

function el(id) { return document.getElementById(id); }

// ─── Render: Dashboard ──────────────────────────────────────────────────────
function renderDashboard(transactions) {
  const selectedMonth = dashMonthSelector.value; // "YYYY-MM"
  if (!selectedMonth) return;

  const [y, m] = selectedMonth.split('-');
  const year = parseInt(y);
  const month = parseInt(m) - 1; // JS months 0-11

  // Calcular periodo anterior
  let prevYear = year;
  let prevMonth = month - 1;
  if (prevMonth < 0) { prevMonth = 11; prevYear--; }

  const currentTxs = filterByMonth(transactions, year, month);
  const prevTxs = filterByMonth(transactions, prevYear, prevMonth);

  const metricsAll = calcMetrics(transactions);
  const metricsCurr = calcMetrics(currentTxs);
  const metricsPrev = calcMetrics(prevTxs);

  // Función currificada para formatear con la moneda actual
  const fmt = (val) => formatCurrency(val, currentCurrency);

  // Actualizar DOM Métricas
  el('dash-saldo').textContent = fmt(metricsAll.saldoTotal);
  
  const saldoDelta = (metricsCurr.totalIngresos - metricsPrev.totalIngresos) - (metricsCurr.totalGastos - metricsPrev.totalGastos);
  el('dash-saldo-delta').textContent = saldoDelta >= 0 ? `↑ ${fmt(saldoDelta)}` : `↓ ${fmt(Math.abs(saldoDelta))}`;

  el('dash-ingresos').textContent = fmt(metricsCurr.totalIngresos);
  const ingDelta = metricsCurr.totalIngresos - metricsPrev.totalIngresos;
  el('dash-ingresos-delta').textContent = ingDelta === 0 ? 'Sin cambio' : (ingDelta > 0 ? `↑ ${fmt(ingDelta)}` : `↓ ${fmt(Math.abs(ingDelta))}`);

  el('dash-gastos').textContent = fmt(metricsCurr.totalGastos);
  const gasDelta = metricsCurr.totalGastos - metricsPrev.totalGastos;
  el('dash-gastos-delta').textContent = gasDelta === 0 ? 'Sin cambio' : (gasDelta > 0 ? `↑ ${fmt(gasDelta)}` : `↓ ${fmt(Math.abs(gasDelta))}`);

  el('dash-transacciones').textContent = metricsAll.totalTransacciones;
  const txDelta = metricsCurr.totalTransacciones - metricsPrev.totalTransacciones;
  el('dash-transacciones-delta').textContent = txDelta >= 0 ? `+${metricsCurr.totalTransacciones} este mes` : `${txDelta} vs mes ant.`;

  // Gráficos
  const monthlyData = groupByMonth(transactions);
  const currencyRate = CURRENCIES[currentCurrency].rate;
  renderEvolutionCharts(monthlyData, fmt, currencyRate); // Usa el canvas de full-evolution temporalmente o lo ignora
  renderDashboardDonut(metricsCurr.totalIngresos * currencyRate, metricsCurr.totalGastos * currencyRate, fmt);

  // Análisis Salud Financiera
  const health = calcHealthStatus(metricsCurr.totalIngresos, metricsCurr.totalGastos);
  const noData = transactions.length === 0;

  let analysisHTML = '';
  if (noData) {
    analysisHTML = `
      <div style="margin-bottom: 15px;">📌 <strong>¡Bienvenido al Sistema!</strong><br>Aún no tienes transacciones. Ve a "Registrar" para comenzar.</div>
      <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:15px; color:#aab5c9;">
        <strong>🔵 Salud financiera:</strong> Sin datos
      </div>
    `;
  } else {
    analysisHTML = `
      <div class="analysis-item">
        <div class="analysis-icon">💰</div>
        <div class="analysis-text">Ingresos: <strong>${fmt(metricsCurr.totalIngresos)}</strong></div>
      </div>
      <div class="analysis-item">
        <div class="analysis-icon">💸</div>
        <div class="analysis-text">Gastos: <strong>${fmt(metricsCurr.totalGastos)}</strong></div>
      </div>
      <div class="analysis-item" style="border:none;">
        <div class="analysis-icon">📈</div>
        <div class="analysis-text">Tasa de ahorro: <strong>${health.savingsRate.toFixed(1)}%</strong></div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:15px;" class="health-${health.color}">
        <strong>${health.icon} Salud financiera: ${health.text}</strong><br>
        <span style="font-size:0.9rem; color:var(--text-main); opacity:0.8;">${health.msg}</span>
      </div>
    `;
  }
  el('analysis-content').innerHTML = analysisHTML;
}

// ─── Render: Registrar ──────────────────────────────────────────────────────
function renderRegistrar() {
  const sym = CURRENCIES[currentCurrency].symbol;
  el('tx-currency-symbol').textContent = sym;
  
  // Establecer fecha de hoy por defecto
  if (!el('tx-fecha').value) {
    el('tx-fecha').value = new Date().toISOString().split('T')[0];
  }
}

// Lógica de submit expuesta a app.js
export async function handleTransactionSubmit(e) {
  e.preventDefault();
  const tipo = el('tx-tipo').value;
  const montoLocal = parseFloat(el('tx-monto').value);
  const descripcion = el('tx-desc').value;
  const fecha = el('tx-fecha').value;

  if (montoLocal <= 0 || !descripcion || !fecha) {
    showToast('Campos inválidos', 'error');
    return;
  }

  try {
    await db.addTransaction({
      tipo, montoLocal, descripcion, fecha, currencyCode: currentCurrency
    });
    showToast('¡Transacción registrada!');
    el('form-transaction').reset();
    renderRegistrar(); // reset date
  } catch(err) {
    showToast('Error al guardar: ' + err.message, 'error');
  }
}

// ─── Render: Historial ──────────────────────────────────────────────────────
function renderHistorial(transactions) {
  const tbody = el('historial-tbody');
  
  if (transactions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay transacciones para mostrar.</td></tr>';
    return;
  }

  const fmt = (val) => formatCurrency(val, currentCurrency);

  tbody.innerHTML = transactions.map(t => {
    // Formatear fecha local
    const dateStr = t.fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `
      <tr>
        <td><input type="checkbox" class="tx-checkbox" data-id="${t.id}"></td>
        <td>${dateStr}</td>
        <td>${t.descripcion}</td>
        <td><span style="color: ${t.tipo === 'Ingreso' ? 'var(--color-income)' : 'var(--color-expense)'}">${t.tipo}</span></td>
        <td>${fmt(t.monto)}</td>
      </tr>
    `;
  }).join('');
}

export async function handleDeleteSelected() {
  const checkboxes = document.querySelectorAll('.tx-checkbox:checked');
  if (checkboxes.length === 0) {
    showToast('No has seleccionado ninguna transacción.', 'error');
    return;
  }

  try {
    for (let cb of checkboxes) {
      await db.deleteTransaction(cb.dataset.id);
    }
    showToast(`${checkboxes.length} transacciones eliminadas.`);
    renderActiveView(); // Refrescar tabla
  } catch(err) {
    showToast('Error al eliminar: ' + err.message, 'error');
  }
}

// ─── Render: Resumen ────────────────────────────────────────────────────────
function renderResumen(transactions) {
  const selectedMonth = resumenMonthSelector.value;
  if (!selectedMonth) return;

  const [y, m] = selectedMonth.split('-');
  const currentTxs = filterByMonth(transactions, parseInt(y), parseInt(m) - 1);
  const metrics = calcMetrics(currentTxs);
  const fmt = (val) => formatCurrency(val, currentCurrency);

  el('resumen-ingresos').textContent = fmt(metrics.totalIngresos);
  el('resumen-gastos').textContent = fmt(metrics.totalGastos);
  el('resumen-balance').textContent = fmt(metrics.saldoTotal);

  const currencyRate = CURRENCIES[currentCurrency].rate;
  renderResumenDonut(metrics.totalIngresos * currencyRate, metrics.totalGastos * currencyRate, fmt);
}

// ─── Render: Gráficas ───────────────────────────────────────────────────────
function renderGraficas(transactions) {
  const monthlyData = groupByMonth(transactions);
  const fmt = (val) => formatCurrency(val, currentCurrency);
  const currencyRate = CURRENCIES[currentCurrency].rate;
  
  if (monthlyData.length === 0) {
    // Limpiar canvas si no hay datos
    return;
  }

  renderEvolutionCharts(monthlyData, fmt, currencyRate);
}
