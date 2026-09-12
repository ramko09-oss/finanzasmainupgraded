// ============================================================
// charts.js — Configuración y renderizado con Chart.js
// ============================================================

// Variables globales para mantener instancias y poder destruirlas
let donutChartInst = null;
let resumenDonutChartInst = null;
let evoChartInst = null;
let barsChartInst = null;
let balanceChartInst = null;

// Configuración global tema armónico Chart.js
Chart.defaults.color = '#475569';
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(30, 41, 59, 0.92)';
Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
Chart.defaults.plugins.tooltip.bodyColor = '#f8fafc';
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;

const COLORS = {
  ingreso: '#10b981',
  gasto: '#ef4444',
  accent: '#2f6fab',
  accentAlpha: 'rgba(47, 111, 171, 0.15)',
  bg: '#ffffff',
  grid: 'rgba(226, 232, 240, 0.8)'
};

// ─── Helper: Render Donut ───────────────────────────────────────────────────
function renderDonut(canvasId, instanceObj, ingresos, gastos, labelFn) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return instanceObj;

  if (instanceObj) { instanceObj.destroy(); }

  if (ingresos === 0 && gastos === 0) {
    // Dibujar texto "Sin datos" manual
    const context = ctx.getContext('2d');
    context.clearRect(0,0, ctx.width, ctx.height);
    context.fillStyle = COLORS.accent;
    context.font = "14px Inter";
    context.textAlign = "center";
    context.fillText("Sin datos este mes", ctx.width/2 || 150, ctx.height/2 || 150);
    return null;
  }

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Ingresos', 'Gastos'],
      datasets: [{
        data: [ingresos, gastos],
        backgroundColor: [COLORS.ingreso, COLORS.gasto],
        borderColor: COLORS.bg,
        borderWidth: 2,
        cutout: '70%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#334155', padding: 16, font: { weight: '500' } } },
        tooltip: {
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

// ─── Gráficos de Evolución ──────────────────────────────────────────────────
export function renderEvolutionCharts(monthlyData, formatFn, currencyRate) {
  const labels = monthlyData.map(d => d.mes);
  
  const ingresos = monthlyData.map(d => d.Ingreso * currencyRate);
  const gastos = monthlyData.map(d => d.Gasto * currencyRate);
  
  const saldoArray = [];
  let currentSaldo = 0;
  monthlyData.forEach(d => {
    currentSaldo += (d.Ingreso - d.Gasto) * currencyRate;
    saldoArray.push(currentSaldo);
  });
  
  const balances = monthlyData.map(d => (d.Ingreso - d.Gasto) * currencyRate);

  // Opciones comunes para ejes X/Y
  const scalesOptions = {
    x: { grid: { color: COLORS.grid }, ticks: { color: '#64748b' } },
    y: { 
      grid: { color: COLORS.grid }, 
      ticks: { 
        color: '#64748b',
        callback: function(value) { return formatFn(value / currencyRate); }
      } 
    }
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
          borderColor: COLORS.accent,
          backgroundColor: COLORS.accentAlpha,
          borderWidth: 3,
          pointBackgroundColor: COLORS.accent,
          pointRadius: 4,
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: scalesOptions }
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
          { label: 'Ingresos', data: ingresos, backgroundColor: COLORS.ingreso, borderRadius: 6 },
          { label: 'Gastos', data: gastos, backgroundColor: COLORS.gasto, borderRadius: 6 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: scalesOptions }
    });
  }

  // 3. Balance Mensual (Barras Colores Condicionales)
  const ctxBal = document.getElementById('chart-balance');
  if (ctxBal) {
    if (balanceChartInst) balanceChartInst.destroy();
    const bgColors = balances.map(b => b >= 0 ? COLORS.ingreso : COLORS.gasto);
    
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
        plugins: { legend: { display: false } }
      }
    });
  }
}
