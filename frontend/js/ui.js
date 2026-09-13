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

const SUN_SVG = `<svg class="theme-icon-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

const MOON_SVG = `<svg class="theme-icon-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

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

  const topbarUser = document.getElementById('topbar-username');
  if (topbarUser) topbarUser.textContent = username;

  const topbarAvatar = document.getElementById('topbar-avatar');
  if (topbarAvatar) {
    const initial = username.trim().charAt(0).toUpperCase() || '👤';
    topbarAvatar.textContent = initial;
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

  // Controles de filtros en Analítica
  const analiticaSearch = document.getElementById('analitica-search');
  if (analiticaSearch) analiticaSearch.oninput = () => renderAnalitica(allTransactions);

  const analiticaCat = document.getElementById('analitica-filter-category');
  if (analiticaCat) analiticaCat.onchange = () => renderAnalitica(allTransactions);

  const analiticaType = document.getElementById('analitica-filter-type');
  if (analiticaType) analiticaType.onchange = () => renderAnalitica(allTransactions);

  const analiticaMin = document.getElementById('analitica-min-amount');
  if (analiticaMin) analiticaMin.oninput = () => renderAnalitica(allTransactions);

  const analiticaMax = document.getElementById('analitica-max-amount');
  if (analiticaMax) analiticaMax.oninput = () => renderAnalitica(allTransactions);

  const analiticaCur = document.getElementById('analitica-filter-currency');
  if (analiticaCur) {
    analiticaCur.value = currentCurrency;
    analiticaCur.onchange = (e) => {
      currentCurrency = e.target.value;
      currencySelector.value = currentCurrency;
      localStorage.setItem('finanzas_currency', currentCurrency);
      renderActiveView();
    };
  }

  const btnResetAnalitica = document.getElementById('btn-analitica-reset');
  if (btnResetAnalitica) {
    btnResetAnalitica.onclick = () => {
      if (analiticaSearch) analiticaSearch.value = '';
      if (analiticaCat) analiticaCat.value = 'all';
      if (analiticaType) analiticaType.value = 'all';
      if (analiticaMin) analiticaMin.value = '';
      if (analiticaMax) analiticaMax.value = '';
      renderAnalitica(allTransactions);
    };
  }

  const topbarSearch = document.getElementById('topbar-global-search');
  if (topbarSearch) {
    topbarSearch.oninput = (e) => {
      const val = e.target.value;
      const currentHash = window.location.hash || '#dashboard';
      if (currentHash === '#historial') {
        const filtroBusqueda = document.getElementById('filtro-busqueda');
        if (filtroBusqueda) {
          filtroBusqueda.value = val;
          renderHistorial(allTransactions);
        }
      } else if (currentHash === '#analitica') {
        if (analiticaSearch) {
          analiticaSearch.value = val;
          renderAnalitica(allTransactions);
        }
      }
    };

    topbarSearch.onkeydown = (e) => {
      if (e.key === 'Enter') {
        const currentHash = window.location.hash || '#dashboard';
        if (currentHash !== '#historial' && currentHash !== '#analitica') {
          window.location.hash = '#historial';
          setTimeout(() => {
            const filtroBusqueda = document.getElementById('filtro-busqueda');
            if (filtroBusqueda) {
              filtroBusqueda.value = topbarSearch.value;
              renderHistorial(allTransactions);
            }
          }, 60);
        }
      }
    };
  }

  // Ocultar Auth, Mostrar App
  viewAuth.classList.add('hidden');
  viewAuth.classList.remove('view-active');
  viewAuth.style.display = 'none';
  appContainer.classList.remove('hidden');
  appContainer.style.display = 'flex';

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
  appContainer.style.display = 'none';
  viewAuth.classList.remove('hidden');
  viewAuth.classList.add('view-active');
  viewAuth.style.display = 'flex';
  window.location.hash = '#auth';
}

// ─── Actualizador de Breadcrumbs de la Barra Superior ────────────────────────
function updateTopbarBreadcrumb(viewName) {
  const topbarTitle = document.getElementById('topbar-view-title');
  const topbarIcon = document.getElementById('topbar-view-icon');
  if (!topbarTitle) return;

  const viewData = {
    dashboard: {
      title: 'Dashboard Principal',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>'
    },
    registrar: {
      title: 'Registrar Transacción',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
    },
    historial: {
      title: 'Historial de Registros',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
    },
    analitica: {
      title: 'Analítica Comparativa',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>'
    },
    resumen: {
      title: 'Resumen Mensual',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
    },
    graficas: {
      title: 'Gráficas y Tendencias',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>'
    }
  };

  const current = viewData[viewName] || { title: 'Panel Principal', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/></svg>' };
  topbarTitle.textContent = current.title;
  if (topbarIcon) topbarIcon.innerHTML = current.icon;
}

// ─── Router (Hash Change) ───────────────────────────────────────────────────
function handleHashChange() {
  const hash = window.location.hash || '#dashboard';
  if (hash === '#auth') return; // Manejado por app.js

  const viewName = hash.replace('#', '');
  
  // Ocultar todas las vistas del main-content
  document.querySelectorAll('.view').forEach(v => {
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

  // Actualizar menú activo en sidebar y barra móvil
  document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(nav => {
    nav.classList.remove('active');
    if (nav.dataset.view === viewName) {
      nav.classList.add('active');
    }
  });

  // Actualizar breadcrumb en la barra superior
  updateTopbarBreadcrumb(viewName);

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
      case '#analitica': renderAnalitica(allTransactions); break;
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
      <div class="sidaa-welcome-card">
        <div class="sidaa-welcome-header">
          <div class="sidaa-welcome-logo-wrap">
            <img src="img/sidaa-logo.png" alt="SIDAA" class="sidaa-welcome-logo">
          </div>
          <div class="sidaa-welcome-titles">
            <h4 class="sidaa-welcome-title">Bienvenido a SIDAA</h4>
            <span class="sidaa-welcome-badge">Sistema de Administración &amp; Ahorro</span>
          </div>
        </div>

        <div class="sidaa-slogan-banner">
          <p class="sidaa-slogan-text">
            “Te demostramos que con una buena gestión de tus finanzas, tus ahorros <span class="sidaa-slogan-punchline">SI DAN!</span>”
          </p>
        </div>

        <div class="sidaa-welcome-cta-row">
          <p class="sidaa-welcome-desc">
            Aún no tienes transacciones registradas. Ve a "Registrar" para comenzar y activar tu salud financiera en tiempo real.
          </p>
          <a href="#registrar" class="btn btn-primary btn-sm sidaa-welcome-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Registrar Transacción
          </a>
        </div>

        <div class="sidaa-welcome-footer">
          <span class="sidaa-health-chip">
            🔵 <strong>Salud financiera:</strong> Pendiente de tu primer registro
          </span>
          <span>SIDAA Finanzas</span>
        </div>
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
  const categoria = el('tx-categoria')?.value;
  let descripcion = (el('tx-desc').value || '').trim();
  const fecha = el('tx-fecha').value;

  if (montoLocal <= 0 || !descripcion || !fecha) {
    showToast('Campos inválidos', 'error');
    return;
  }

  if (categoria && categoria !== 'Otros' && !descripcion.startsWith(`[${categoria}]`)) {
    descripcion = `[${categoria}] ${descripcion}`;
  }

  try {
    await db.addTransaction({
      tipo, montoLocal, descripcion, fecha, currencyCode: currentCurrency
    });
    showToast('¡Transacción registrada!');
    el('form-transaction').reset();
    renderRegistrar(); // reset date
    window.location.hash = '#analitica';
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

// ─── Categorías y Lógica de Analítica ───────────────────────────────────────
const EXPENSE_CATEGORIES = [
  { id: 'comida', name: 'Comida y bebidas', icon: '🍽️', badgeClass: 'cat-badge-food' },
  { id: 'compras', name: 'Compras', icon: '🛍️', badgeClass: 'cat-badge-shopping' },
  { id: 'vivienda', name: 'Vivienda', icon: '🏠', badgeClass: 'cat-badge-housing' },
  { id: 'transporte', name: 'Transporte', icon: '🚆', badgeClass: 'cat-badge-transport' },
  { id: 'vehiculo', name: 'Vehículo', icon: '🚗', badgeClass: 'cat-badge-vehicle' },
  { id: 'vida', name: 'Vida y entretenimiento', icon: '🚶', badgeClass: 'cat-badge-life' },
  { id: 'pc', name: 'Comunicación, PC', icon: '💻', badgeClass: 'cat-badge-pc' },
  { id: 'financiero', name: 'Gastos financieros', icon: '💳', badgeClass: 'cat-badge-finance' },
  { id: 'inversiones', name: 'Inversiones', icon: '📈', badgeClass: 'cat-badge-investment' },
  { id: 'otros', name: 'Otros', icon: '📄', badgeClass: 'cat-badge-others' },
  { id: 'desconocido', name: 'Desconocido', icon: '❓', badgeClass: 'cat-badge-others' }
];

const INCOME_CATEGORIES = [
  { id: 'ingresos', name: 'Ingresos', icon: '💰', badgeClass: 'cat-badge-income' }
];

export function getCategory(tx) {
  if (tx.tipo === 'Ingreso') return 'Ingresos';
  const raw = tx.descripcion || '';
  const match = raw.match(/^\[(.*?)\]/);
  if (match && match[1]) return match[1];

  const desc = raw.toLowerCase();
  if (desc.includes('comida') || desc.includes('almuerzo') || desc.includes('cena') || desc.includes('desayuno') || desc.includes('restaurante') || desc.includes('cafe') || desc.includes('supermercado') || desc.includes('mercado') || desc.includes('snack') || desc.includes('bebida')) return 'Comida y bebidas';
  if (desc.includes('compra') || desc.includes('ropa') || desc.includes('tienda') || desc.includes('zapatillas') || desc.includes('amazon') || desc.includes('regalo') || desc.includes('mall')) return 'Compras';
  if (desc.includes('vivienda') || desc.includes('alquiler') || desc.includes('luz') || desc.includes('agua') || desc.includes('gas') || desc.includes('departamento') || desc.includes('casa') || desc.includes('mantenimiento')) return 'Vivienda';
  if (desc.includes('transporte') || desc.includes('bus') || desc.includes('metro') || desc.includes('pasaje') || desc.includes('uber') || desc.includes('taxi') || desc.includes('tren')) return 'Transporte';
  if (desc.includes('vehiculo') || desc.includes('auto') || desc.includes('carro') || desc.includes('gasolina') || desc.includes('combustible') || desc.includes('taller') || desc.includes('peaje') || desc.includes('mecanico')) return 'Vehículo';
  if (desc.includes('entretenimiento') || desc.includes('cine') || desc.includes('salida') || desc.includes('fiesta') || desc.includes('bar') || desc.includes('gym') || desc.includes('gimnasio') || desc.includes('juego') || desc.includes('viaje')) return 'Vida y entretenimiento';
  if (desc.includes('internet') || desc.includes('celular') || desc.includes('telefono') || desc.includes('pc') || desc.includes('computadora') || desc.includes('laptop') || desc.includes('software') || desc.includes('wifi')) return 'Comunicación, PC';
  if (desc.includes('banco') || desc.includes('comision') || desc.includes('tarjeta') || desc.includes('interes') || desc.includes('seguro') || desc.includes('prestamo')) return 'Gastos financieros';
  if (desc.includes('inversion') || desc.includes('acciones') || desc.includes('cripto') || desc.includes('fondo') || desc.includes('deposito') || desc.includes('bitcoin')) return 'Inversiones';
  return 'Otros';
}

// ─── Render: Analítica ──────────────────────────────────────────────────────
function renderAnalitica(transactions) {
  const rate = CURRENCIES[currentCurrency].rate;
  const fmt = (val) => formatCurrency(val, currentCurrency);

  // Determinar meses para la comparativa (Mes actual y Mes anterior)
  const now = new Date();
  let currYear = now.getFullYear();
  let currMonth = now.getMonth();

  if (transactions.length > 0) {
    const dates = transactions.map(t => new Date(t.fecha)).filter(d => !isNaN(d.getTime()));
    if (dates.length > 0) {
      const maxDate = new Date(Math.max(...dates));
      currYear = maxDate.getFullYear();
      currMonth = maxDate.getMonth();
    }
  }

  let prevYear = currYear;
  let prevMonth = currMonth - 1;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currMonthLabel = `${monthNames[currMonth]} ${currYear}`;
  const prevMonthLabel = `${monthNames[prevMonth]} ${prevYear}`;

  const colCurrEl = document.getElementById('analitica-col-current');
  const colPrevEl = document.getElementById('analitica-col-prev');
  if (colCurrEl) colCurrEl.textContent = currMonthLabel;
  if (colPrevEl) colPrevEl.textContent = prevMonthLabel;

  const currTxs = filterByMonth(transactions, currYear, currMonth);
  const prevTxs = filterByMonth(transactions, prevYear, prevMonth);

  // Leer valores de filtros
  const searchVal = (document.getElementById('analitica-search')?.value || '').trim().toLowerCase();
  const catFilter = document.getElementById('analitica-filter-category')?.value || 'all';
  const typeFilter = document.getElementById('analitica-filter-type')?.value || 'all';
  const minAmount = parseFloat(document.getElementById('analitica-min-amount')?.value) || 0;
  const maxAmount = parseFloat(document.getElementById('analitica-max-amount')?.value) || Infinity;

  const applyTxFilter = (tx) => {
    const desc = (tx.descripcion || '').toLowerCase();
    const cat = getCategory(tx).toLowerCase();
    if (searchVal && !desc.includes(searchVal) && !cat.includes(searchVal)) return false;
    if (catFilter !== 'all' && getCategory(tx) !== catFilter) return false;
    if (typeFilter !== 'all' && tx.tipo !== typeFilter) return false;
    const amountInCurr = tx.monto * rate;
    if (amountInCurr < minAmount || amountInCurr > maxAmount) return false;
    return true;
  };

  const filteredCurr = currTxs.filter(applyTxFilter);
  const filteredPrev = prevTxs.filter(applyTxFilter);

  const totalIngresosCurr = filteredCurr.filter(t => t.tipo === 'Ingreso').reduce((acc, t) => acc + t.monto, 0);
  const totalIngresosPrev = filteredPrev.filter(t => t.tipo === 'Ingreso').reduce((acc, t) => acc + t.monto, 0);

  const totalGastosCurr = filteredCurr.filter(t => t.tipo === 'Gasto').reduce((acc, t) => acc + t.monto, 0);
  const totalGastosPrev = filteredPrev.filter(t => t.tipo === 'Gasto').reduce((acc, t) => acc + t.monto, 0);

  const getCategoryTotal = (txList, catName, tipo) => {
    return txList
      .filter(t => t.tipo === tipo && getCategory(t) === catName)
      .reduce((acc, t) => acc + t.monto, 0);
  };

  let rowsHTML = '';

  // Bloque: Ingreso total
  if (typeFilter === 'all' || typeFilter === 'Ingreso') {
    rowsHTML += `
      <tr class="row-total-group">
        <td><strong>Ingreso total</strong></td>
        <td class="td-amount"><strong>${fmt(totalIngresosCurr)}</strong></td>
        <td class="td-amount"><strong>${fmt(totalIngresosPrev)}</strong></td>
      </tr>
    `;

    INCOME_CATEGORIES.forEach(cat => {
      if (catFilter !== 'all' && catFilter !== cat.name) return;
      const cVal = getCategoryTotal(filteredCurr, cat.name, 'Ingreso');
      const pVal = getCategoryTotal(filteredPrev, cat.name, 'Ingreso');
      rowsHTML += `
        <tr class="row-cat-item">
          <td>
            <div class="cat-item-content">
              <span class="cat-badge ${cat.badgeClass}">${cat.icon}</span>
              <span class="cat-label-text">${cat.name}</span>
            </div>
          </td>
          <td class="td-amount">${fmt(cVal)}</td>
          <td class="td-amount">${fmt(pVal)}</td>
        </tr>
      `;
    });
  }

  // Bloque: Gasto total
  if (typeFilter === 'all' || typeFilter === 'Gasto') {
    rowsHTML += `
      <tr class="row-total-group">
        <td><strong>Gasto total</strong></td>
        <td class="td-amount"><strong>${fmt(totalGastosCurr)}</strong></td>
        <td class="td-amount"><strong>${fmt(totalGastosPrev)}</strong></td>
      </tr>
    `;

    EXPENSE_CATEGORIES.forEach(cat => {
      if (catFilter !== 'all' && catFilter !== cat.name) return;
      const cVal = getCategoryTotal(filteredCurr, cat.name, 'Gasto');
      const pVal = getCategoryTotal(filteredPrev, cat.name, 'Gasto');
      rowsHTML += `
        <tr class="row-cat-item">
          <td>
            <div class="cat-item-content">
              <span class="cat-badge ${cat.badgeClass}">${cat.icon}</span>
              <span class="cat-label-text">${cat.name}</span>
            </div>
          </td>
          <td class="td-amount">${fmt(cVal)}</td>
          <td class="td-amount">${fmt(pVal)}</td>
        </tr>
      `;
    });
  }

  const tbody = document.getElementById('analitica-table-body');
  if (tbody) tbody.innerHTML = rowsHTML;

  const currLabel = document.getElementById('analitica-currency-label');
  if (currLabel) currLabel.textContent = currentCurrency;

  const currencyFilterEl = document.getElementById('analitica-filter-currency');
  if (currencyFilterEl) currencyFilterEl.value = currentCurrency;
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
