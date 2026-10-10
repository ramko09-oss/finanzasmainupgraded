// ============================================================
// charts.js — Configuración y renderizado con Chart.js
// ============================================================

// Variables globales para mantener instancias y poder destruirlas
let donutChartInst = null;
let resumenDonutChartInst = null;
let evoChartInst = null;
let dashEvoChartInst = null;
let barsChartInst = null;
let balanceChartInst = null;

// Helper para obtener colores según el tema actual (Claro u Oscuro)
function getThemeColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    isDark,
    ingreso: isDark ? '#34d399' : '#10b981',
    gasto: isDark ? '#f87171' : '#ef4444',
    accent: isDark ? '#38bdf8' : '#2f6fab',
    accentAlpha: isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(47, 111, 171, 0.15)',
    bg: isDark ? '#111827' : '#ffffff',
    text: isDark ? '#cbd5e1' : '#475569',
    grid: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)',
    tooltipBg: isDark ? 'rgba(15, 23, 42, 0.96)' : 'rgba(30, 41, 59, 0.94)'
  };
}

// ─── Helper: Render Donut ───────────────────────────────────────────────────
function renderDonut(canvasId, instanceObj, ingresos, gastos, labelFn) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return instanceObj;

  if (instanceObj) { instanceObj.destroy(); }

  const colors = getThemeColors();

  if (ingresos === 0 && gastos === 0) {
    const context = ctx.getContext('2d');
    context.clearRect(0, 0, ctx.width, ctx.height);
    context.fillStyle = colors.accent;
    context.font = "14px Inter, sans-serif";
    context.textAlign = "center";
    context.fillText("Sin datos este mes", ctx.width / 2 || 150, ctx.height / 2 || 150);
    return null;
  }

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Ingresos', 'Gastos'],
      datasets: [{
        data: [ingresos, gastos],
        backgroundColor: [colors.ingreso, colors.gasto],
        borderColor: colors.bg,
        borderWidth: 2,
        cutout: '70%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: colors.text,
            padding: 16,
            font: { weight: '600', family: "'Inter', sans-serif" }
          }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: '#ffffff',
          bodyColor: '#f8fafc',
          cornerRadius: 8,
          padding: 10,
          callbacks: {
            label: function(context) {
              return ` ${context.label}: ${labelFn(context.raw)}`;
            }
          }
        }
      }
    }
  });
}

export function renderDashboardDonut(ingresos, gastos, formatFn) {
  donutChartInst = renderDonut('chart-donut', donutChartInst, ingresos, gastos, formatFn);
}

export function renderResumenDonut(ingresos, gastos, formatFn) {
  resumenDonutChartInst = renderDonut('chart-resumen-donut', resumenDonutChartInst, ingresos, gastos, formatFn);
}

// ─── Gráfico de Evolución para Dashboard ────────────────────────────────────
export function renderDashboardEvolution(monthlyData, formatFn, currencyRate) {
  const ctx = document.getElementById('chart-evolution');
  if (!ctx) return;

  if (dashEvoChartInst) dashEvoChartInst.destroy();

  const labels = monthlyData.map(d => d.mes);
  const colors = getThemeColors();
  const saldoArray = [];
  let currentSaldo = 0;
  monthlyData.forEach(d => {
    currentSaldo += (d.Ingreso - d.Gasto) * currencyRate;
    saldoArray.push(currentSaldo);
  });

  dashEvoChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Saldo Acumulado',
        data: saldoArray,
        borderColor: colors.accent,
        backgroundColor: colors.accentAlpha,
        borderWidth: 2.5,
        pointBackgroundColor: colors.accent,
        pointBorderColor: colors.bg,
        pointRadius: 4,
        fill: true,
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: colors.grid },
          ticks: { color: colors.text, font: { family: "'Inter', sans-serif" } }
        },
        y: { 
          grid: { color: colors.grid }, 
          ticks: { 
            color: colors.text,
            font: { family: "'Inter', sans-serif" },
            callback: function(value) { return formatFn(value / currencyRate); }
          } 
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: '#ffffff',
          bodyColor: '#f8fafc',
          cornerRadius: 8,
          padding: 10
        }
      }
    }
  });
}

// ─── Gráficos de Evolución ──────────────────────────────────────────────────
export function renderEvolutionCharts(monthlyData, formatFn, currencyRate) {
  const labels = monthlyData.map(d => d.mes);
  const colors = getThemeColors();
  
  const ingresos = monthlyData.map(d => d.Ingreso * currencyRate);
  const gastos = monthlyData.map(d => d.Gasto * currencyRate);
  
  const saldoArray = [];
  let currentSaldo = 0;
  monthlyData.forEach(d => {
    currentSaldo += (d.Ingreso - d.Gasto) * currencyRate;
    saldoArray.push(currentSaldo);
  });
  
  const balances = monthlyData.map(d => (d.Ingreso - d.Gasto) * currencyRate);

  // Opciones comunes para ejes X/Y adaptadas al tema
  const scalesOptions = {
    x: {
      grid: { color: colors.grid },
      ticks: { color: colors.text, font: { family: "'Inter', sans-serif" } }
    },
    y: { 
      grid: { color: colors.grid }, 
      ticks: { 
        color: colors.text,
        font: { family: "'Inter', sans-serif" },
        callback: function(value) { return formatFn(value / currencyRate); }
      } 
    }
  };

  const tooltipPluginOptions = {
    backgroundColor: colors.tooltipBg,
    titleColor: '#ffffff',
    bodyColor: '#f8fafc',
    cornerRadius: 8,
    padding: 10
  };

  // 1. Evolución de Saldo (Línea con Área)
  const ctxEvo = document.getElementById('chart-full-evolution');
  if (ctxEvo) {
    if (evoChartInst) evoChartInst.destroy();
    evoChartInst = new Chart(ctxEvo, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Saldo Acumulado',
          data: saldoArray,
          borderColor: colors.accent,
          backgroundColor: colors.accentAlpha,
          borderWidth: 3,
          pointBackgroundColor: colors.accent,
          pointBorderColor: colors.bg,
          pointRadius: 4,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: scalesOptions,
        plugins: {
          legend: { labels: { color: colors.text } },
          tooltip: tooltipPluginOptions
        }
      }
    });
  }

  // 2. Ingresos vs Gastos (Barras Agrupadas)
  const ctxBars = document.getElementById('chart-bars');
  if (ctxBars) {
    if (barsChartInst) barsChartInst.destroy();
    barsChartInst = new Chart(ctxBars, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Ingresos', data: ingresos, backgroundColor: colors.ingreso, borderRadius: 6 },
          { label: 'Gastos', data: gastos, backgroundColor: colors.gasto, borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: scalesOptions,
        plugins: {
          legend: { labels: { color: colors.text } },
          tooltip: tooltipPluginOptions
        }
      }
    });
  }

  // 3. Balance Mensual (Barras Colores Condicionales)
  const ctxBal = document.getElementById('chart-balance');
  if (ctxBal) {
    if (balanceChartInst) balanceChartInst.destroy();
    const bgColors = balances.map(b => b >= 0 ? colors.ingreso : colors.gasto);
    
    balanceChartInst = new Chart(ctxBal, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Balance',
          data: balances,
          backgroundColor: bgColors,
          borderRadius: 6
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        scales: scalesOptions,
        plugins: {
          legend: { display: false },
          tooltip: tooltipPluginOptions
        }
      }
    });
  }
}
