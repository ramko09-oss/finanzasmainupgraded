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
  renderDashboardEvolution,
  renderEvolutionCharts 
} from './charts.js';

// ─── Referencias DOM ────────────────────────────────────────────────────────
const appContainer = document.getElementById('app-container');
const viewAuth = document.getElementById('view-auth');
const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item, .bottom-nav-item');
const currencySelector = document.getElementById('currency-selector');
const toastContainer = document.getElementById('toast-container');

// Selectores de mes
const dashMonthSelector = document.getElementById('dashboard-month-selector');
const resumenMonthSelector = document.getElementById('resumen-month-selector');

// Estado local de la UI
let currentCurrency = localStorage.getItem('finanzas_currency') || 'USD';
let allTransactions = [];

// ─── Modo Oscuro / Tema ─────────────────────────────────────────────────────
export function initTheme() {
  const savedTheme = localStorage.getItem('finanzas_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  document.querySelectorAll('.theme-toggle-btn, .theme-toggle-btn-compact').forEach(btn => {
    btn.removeEventListener('click', toggleTheme);
    btn.addEventListener('click', toggleTheme);
  });
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('finanzas_theme', newTheme);
  
  // Si estamos en vistas con gráficos, redibujar con los colores del tema
  const hash = window.location.hash || '#dashboard';
  if (hash === '#dashboard' || hash === '#graficas' || hash === '#resumen') {
    renderActiveView();
  }
}

const SUN_SVG = `<svg class="theme-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

const MOON_SVG = `<svg class="theme-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  document.querySelectorAll('.theme-toggle-btn, .theme-toggle-btn-compact').forEach(btn => {
    const slot = btn.querySelector('.theme-icon-slot') || btn.querySelector('.theme-icon');
    const text = btn.querySelector('.theme-text');
    if (slot) {
      slot.innerHTML = isDark ? SUN_SVG : MOON_SVG;
    } else {
      btn.innerHTML = `<span class="theme-icon-slot">${isDark ? SUN_SVG : MOON_SVG}</span>`;
    }
    if (text) text.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
    btn.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  });
}

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
  // Configurar usuario y avatar
  const username = user.username || 'Usuario';
  const greetingEl = document.getElementById('user-greeting');
  if (greetingEl) greetingEl.textContent = `Hola, ${username} 👋`;

  const avatarEl = document.getElementById('user-avatar');
  if (avatarEl) {
    const initial = username.trim().charAt(0).toUpperCase() || '👤';
    avatarEl.textContent = initial;
  }
  
  // Configurar Moneda
  currencySelector.value = currentCurrency;
  currencySelector.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    localStorage.setItem('finanzas_currency', currentCurrency);
    renderActiveView(); // Re-renderizar todo
  });

  // Botones Logout (Desktop y Móvil)
  document.getElementById('btn-logout')?.addEventListener('click', logoutCb);
  document.getElementById('btn-logout-mobile')?.addEventListener('click', logoutCb);

  // Router basado en Hash
  window.addEventListener('hashchange', handleHashChange);
  
  // Selectores de mes eventos
  dashMonthSelector.addEventListener('change', () => renderDashboard(allTransactions));
  resumenMonthSelector.addEventListener('change', () => renderResumen(allTransactions));

  // Botones segmentados de Registrar (Ingreso / Gasto)
  const btnIngreso = document.getElementById('btn-type-ingreso');
  const btnGasto = document.getElementById('btn-type-gasto');
  const inputTipo = document.getElementById('tx-tipo');

  if (btnIngreso && btnGasto && inputTipo) {
    btnIngreso.onclick = () => {
      btnIngreso.classList.add('active');
      btnGasto.classList.remove('active');
      inputTipo.value = 'Ingreso';
    };
    btnGasto.onclick = () => {
      btnGasto.classList.add('active');
      btnIngreso.classList.remove('active');
      inputTipo.value = 'Gasto';
    };
  }

  // Controles de búsqueda y filtros en Historial
  const searchInput = document.getElementById('historial-search');
  if (searchInput) {
    searchInput.oninput = () => filterAndRenderHistorialTable();
  }

  const typeFilter = document.getElementById('historial-filter-type');
  if (typeFilter) {
    typeFilter.onchange = () => filterAndRenderHistorialTable();
  }

  const selectAllCb = document.getElementById('select-all-tx');
  if (selectAllCb) {
    selectAllCb.onchange = (e) => {
      const checkboxes = document.querySelectorAll('.tx-checkbox');
      checkboxes.forEach(cb => { cb.checked = e.target.checked; });
      updateDeleteButtonState();
    };
  }

  // Ocultar Auth, Mostrar App
  viewAuth.classList.add('hidden');
  viewAuth.classList.remove('view-active');
  appContainer.classList.remove('hidden');

  // Asegurar listeners de tema activos
  initTheme();

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
  renderDashboardEvolution(monthlyData, fmt, currencyRate);
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

// ─── Helpers para Historial ────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function updateDeleteButtonState() {
  const selected = document.querySelectorAll('.tx-checkbox:checked');
  const countSpan = el('delete-count');
  const deleteBtn = el('btn-delete-selected');
  const count = selected.length;

  if (countSpan) countSpan.textContent = count;
  if (deleteBtn) {
    deleteBtn.disabled = count === 0;
    if (count > 0) {
      deleteBtn.removeAttribute('disabled');
      deleteBtn.title = `Eliminar ${count} transacción(es) seleccionada(s)`;
    } else {
      deleteBtn.setAttribute('disabled', 'true');
      deleteBtn.title = 'Selecciona al menos una casilla para eliminar';
    }
  }

  const allCbs = document.querySelectorAll('.tx-checkbox');
  const selectAllCb = el('select-all-tx');
  if (selectAllCb && allCbs.length > 0) {
    selectAllCb.checked = count === allCbs.length;
  }
}

function filterAndRenderHistorialTable() {
  const tbody = el('historial-tbody');
  if (!tbody) return;

  const searchTerm = (el('historial-search')?.value || '').trim().toLowerCase();
  const filterType = el('historial-filter-type')?.value || 'ALL';
  const fmt = (val) => formatCurrency(val, currentCurrency);

  const filtered = allTransactions.filter(t => {
    if (filterType !== 'ALL' && t.tipo !== filterType) return false;
    if (!searchTerm) return true;

    const dateStr = t.fecha ? t.fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
    const desc = (t.descripcion || '').toLowerCase();
    const amountStr = String(t.monto);
    const tipo = (t.tipo || '').toLowerCase();
    return desc.includes(searchTerm) || amountStr.includes(searchTerm) || tipo.includes(searchTerm) || dateStr.includes(searchTerm);
  });

  if (filtered.length === 0) {
    if (allTransactions.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding: 48px 16px; color: var(--text-muted);">
            <div style="font-size: 2.2rem; margin-bottom: 8px;">📝</div>
            <strong style="font-size: 1rem; color: var(--text-color);">No hay transacciones registradas aún</strong>
            <p style="font-size: 0.85rem; margin-top: 6px;">Comienza registrando tu primer ingreso o gasto en el menú "Registrar".</p>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding: 40px 16px; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
            <strong style="font-size: 0.95rem; color: var(--text-color);">No se encontraron coincidencias</strong>
            <p style="font-size: 0.85rem; margin-top: 4px;">Intenta con otro término de búsqueda o cambia el filtro de tipo.</p>
          </td>
        </tr>
      `;
    }
  } else {
    tbody.innerHTML = filtered.map(t => {
      const dateStr = t.fecha ? t.fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '--';
      const isIngreso = t.tipo === 'Ingreso';
      const badgeClass = isIngreso ? 'badge-income' : 'badge-expense';
      const badgeIcon = isIngreso ? '📈 Ingreso' : '📉 Gasto';
      const amountSign = isIngreso ? '+' : '-';
      const amountColor = isIngreso ? 'var(--color-income)' : 'var(--color-expense)';

      return `
        <tr>
          <td style="text-align: center;">
            <input type="checkbox" class="tx-checkbox" data-id="${t.id}">
          </td>
          <td style="font-weight: 500;">${dateStr}</td>
          <td style="font-weight: 600; color: var(--text-color);">${escapeHtml(t.descripcion)}</td>
          <td style="text-align: center;">
            <span class="badge ${badgeClass}">${badgeIcon}</span>
          </td>
          <td style="text-align: right; font-weight: 700; color: ${amountColor};">
            ${amountSign} ${fmt(t.monto)}
          </td>
        </tr>
      `;
    }).join('');
  }

  // Listener para cada casilla
  const checkboxes = tbody.querySelectorAll('.tx-checkbox');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateDeleteButtonState);
  });

  const selectAllCb = el('select-all-tx');
  if (selectAllCb) selectAllCb.checked = false;
  updateDeleteButtonState();

  // Footer totales
  let visibleIncome = 0;
  let visibleExpense = 0;
  filtered.forEach(t => {
    if (t.tipo === 'Ingreso') visibleIncome += t.monto;
    else visibleExpense += t.monto;
  });
  const visibleBalance = visibleIncome - visibleExpense;

  if (el('historial-footer-info')) {
    el('historial-footer-info').textContent = `Mostrando ${filtered.length} de ${allTransactions.length} operaciones`;
  }
  if (el('historial-footer-balance')) {
    el('historial-footer-balance').textContent = `Balance de lista: ${fmt(visibleBalance)}`;
    el('historial-footer-balance').style.color = visibleBalance >= 0 ? 'var(--color-income)' : 'var(--color-expense)';
  }
}

// ─── Render: Historial ──────────────────────────────────────────────────────
function renderHistorial(transactions) {
  const fmt = (val) => formatCurrency(val, currentCurrency);
  
  // Calcular los 4 KPIs del historial completo
  const count = transactions.length;
  let totalIngresos = 0;
  let totalGastos = 0;
  transactions.forEach(t => {
    if (t.tipo === 'Ingreso') totalIngresos += t.monto;
    else totalGastos += t.monto;
  });
  const netBalance = totalIngresos - totalGastos;

  if (el('historial-kpi-count')) el('historial-kpi-count').textContent = count;
  if (el('historial-kpi-ingresos')) el('historial-kpi-ingresos').textContent = fmt(totalIngresos);
  if (el('historial-kpi-gastos')) el('historial-kpi-gastos').textContent = fmt(totalGastos);
  if (el('historial-kpi-balance')) {
    el('historial-kpi-balance').textContent = fmt(netBalance);
    el('historial-kpi-balance').style.color = netBalance >= 0 ? 'var(--color-income)' : 'var(--color-expense)';
  }

  filterAndRenderHistorialTable();
}

export async function handleDeleteSelected() {
  const checkboxes = document.querySelectorAll('.tx-checkbox:checked');
  if (checkboxes.length === 0) {
    showToast('No has seleccionado ninguna transacción.', 'error');
    return;
  }

  const confirmMsg = `¿Deseas eliminar las ${checkboxes.length} transacciones seleccionadas?`;
  if (!confirm(confirmMsg)) return;

  try {
    for (let cb of checkboxes) {
      await db.deleteTransaction(cb.dataset.id);
    }
    showToast(`✅ ${checkboxes.length} transacciones eliminadas con éxito.`);
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
  const currencyRate = CURRENCIES[currentCurrency].rate;

  el('resumen-ingresos').textContent = fmt(metrics.totalIngresos);
  el('resumen-gastos').textContent = fmt(metrics.totalGastos);
  el('resumen-balance').textContent = fmt(metrics.saldoTotal);
  el('resumen-balance').style.color = metrics.saldoTotal >= 0 ? 'var(--color-income)' : 'var(--color-expense)';

  // Diagnóstico y salud financiera
  const health = calcHealthStatus(metrics.totalIngresos, metrics.totalGastos);
  const healthPill = el('resumen-health-pill');
  if (healthPill) {
    healthPill.textContent = `${health.icon} ${health.text}`;
    healthPill.className = `health-pill badge-${health.color === 'income' ? 'income' : (health.color === 'expense' ? 'expense' : 'warning')}`;
  }

  const savingsPct = el('resumen-savings-pct');
  if (savingsPct) {
    savingsPct.textContent = `${health.savingsRate.toFixed(1)}%`;
  }

  const savingsBar = el('resumen-savings-bar');
  if (savingsBar) {
    const clampedRate = Math.max(0, Math.min(100, health.savingsRate));
    savingsBar.style.width = `${clampedRate}%`;
  }

  const adviceText = el('resumen-advice-text');
  if (adviceText) {
    adviceText.textContent = health.msg;
  }

  // Tags breakdown del Donut
  const totalPeriodo = metrics.totalIngresos + metrics.totalGastos;
  const incomePctEl = el('donut-income-pct');
  const expensePctEl = el('donut-expense-pct');

  if (totalPeriodo > 0) {
    const ingPct = ((metrics.totalIngresos / totalPeriodo) * 100).toFixed(1);
    const gasPct = ((metrics.totalGastos / totalPeriodo) * 100).toFixed(1);
    if (incomePctEl) incomePctEl.textContent = `${ingPct}%`;
    if (expensePctEl) expensePctEl.textContent = `${gasPct}%`;
  } else {
    if (incomePctEl) incomePctEl.textContent = '0%';
    if (expensePctEl) expensePctEl.textContent = '0%';
  }

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
