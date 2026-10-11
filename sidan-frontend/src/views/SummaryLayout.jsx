// Estructura visual original; React controla datos, eventos y navegación.
export default function SummaryLayout({ bindings = {}, content = {} }) {
return (
<section id="view-resumen" className="view view-active" {...bindings["view-resumen"]}>
{content["view-resumen"] ?? <>
<div className="view-header">
<div >
<h2 >
{"Resumen Mensual"}
</h2>
<p className="view-subtitle">
{"Análisis detallado de distribución y balance del periodo"}
</p>
</div>
<div className="month-selector-wrapper">
<select id="resumen-month-selector" className="input-select" {...bindings["resumen-month-selector"]}>
{content["resumen-month-selector"] ?? <>

</>}
</select>
</div>
</div>
<div className="resumen-dashboard-grid">
<div className="resumen-left-col">
<div className="resumen-metrics-row">
<div className="metric-card metric-income">
<div className="metric-title">
{"Ingresos del Mes"}
</div>
<div className="metric-value" id="resumen-ingresos" {...bindings["resumen-ingresos"]}>
{content["resumen-ingresos"] ?? <>
{"--"}
</>}
</div>
</div>
<div className="metric-card metric-expense">
<div className="metric-title">
{"Gastos del Mes"}
</div>
<div className="metric-value" id="resumen-gastos" {...bindings["resumen-gastos"]}>
{content["resumen-gastos"] ?? <>
{"--"}
</>}
</div>
</div>
<div className="metric-card metric-primary">
<div className="metric-title">
{"Balance Neto"}
</div>
<div className="metric-value" id="resumen-balance" {...bindings["resumen-balance"]}>
{content["resumen-balance"] ?? <>
{"--"}
</>}
</div>
</div>
</div>
<div className="card diagnostic-card">
<div className="card-header-simple">
<h3 >
{"Diagnóstico Financiero"}
</h3>
<span id="resumen-health-pill" className="health-pill" {...bindings["resumen-health-pill"]}>
{content["resumen-health-pill"] ?? <>
{"--"}
</>}
</span>
</div>
<div className="savings-rate-block">
<div className="savings-rate-header">
<span >
{"Tasa de Ahorro"}
</span>
<strong id="resumen-savings-pct" {...bindings["resumen-savings-pct"]}>
{content["resumen-savings-pct"] ?? <>
{"--%"}
</>}
</strong>
</div>
<div className="progress-bar-track">
<div id="resumen-savings-bar" className="progress-bar-fill" style={{"width": "0%"}} {...bindings["resumen-savings-bar"]}>
{content["resumen-savings-bar"] ?? <>

</>}
</div>
</div>
</div>
<div className="diagnostic-advice-box" id="resumen-advice-box" {...bindings["resumen-advice-box"]}>
{content["resumen-advice-box"] ?? <>
<span className="advice-icon">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="12" cy="12" r="10">

</circle>
<line x1="12" y1="16" x2="12" y2="12">

</line>
<line x1="12" y1="8" x2="12.01" y2="8">

</line>
</svg>
</span>
<span className="advice-text" id="resumen-advice-text" {...bindings["resumen-advice-text"]}>
{content["resumen-advice-text"] ?? <>
{"Calculando métricas del mes seleccionado..."}
</>}
</span>
</>}
</div>
</div>
</div>
<div className="resumen-right-col">
<div className="card chart-donut-card">
<div className="card-header-simple">
<h3 >
{"Distribución de Gastos vs Ingresos"}
</h3>
</div>
<div className="chart-container" style={{"position": "relative", "height": "280px"}}>
<canvas id="chart-resumen-donut" {...bindings["chart-resumen-donut"]}>
{content["chart-resumen-donut"] ?? <>

</>}
</canvas>
</div>
<div className="donut-legend-breakdown" id="donut-legend-breakdown" {...bindings["donut-legend-breakdown"]}>
{content["donut-legend-breakdown"] ?? <>
<div className="breakdown-tag income-tag">
<span className="tag-dot">

</span>
<span className="tag-label">
{"Ingresos"}
</span>
<strong id="donut-income-pct" {...bindings["donut-income-pct"]}>
{content["donut-income-pct"] ?? <>
{"--%"}
</>}
</strong>
</div>
<div className="breakdown-tag expense-tag">
<span className="tag-dot">

</span>
<span className="tag-label">
{"Gastos"}
</span>
<strong id="donut-expense-pct" {...bindings["donut-expense-pct"]}>
{content["donut-expense-pct"] ?? <>
{"--%"}
</>}
</strong>
</div>
</>}
</div>
</div>
</div>
</div>
</>}
</section>
)
}
