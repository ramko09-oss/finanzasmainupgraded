// Estructura visual original; React controla datos, eventos y navegación.
export default function DashboardLayout({ bindings = {}, content = {} }) {
return (
<section id="view-dashboard" className="view view-active" {...bindings["view-dashboard"]}>
{content["view-dashboard"] ?? <>
<div className="view-header">
<div >
<h2 >
{"Dashboard Principal"}
</h2>
<p className="view-subtitle">
{"Resumen global y métricas clave de tus finanzas"}
</p>
</div>
<div className="month-selector-wrapper">
<select id="dashboard-month-selector" className="input-select" {...bindings["dashboard-month-selector"]}>
{content["dashboard-month-selector"] ?? <>

</>}
</select>
</div>
</div>
<div className="metrics-grid">
<div className="metric-card metric-primary">
<div className="metric-title">
{"Saldo Total"}
</div>
<div className="metric-value" id="dash-saldo" {...bindings["dash-saldo"]}>
{content["dash-saldo"] ?? <>
{"--"}
</>}
</div>
<div className="metric-delta" id="dash-saldo-delta" {...bindings["dash-saldo-delta"]}>
{content["dash-saldo-delta"] ?? <>
{"--"}
</>}
</div>
</div>
<div className="metric-card metric-income">
<div className="metric-title">
{"Ingresos del Mes"}
</div>
<div className="metric-value" id="dash-ingresos" {...bindings["dash-ingresos"]}>
{content["dash-ingresos"] ?? <>
{"--"}
</>}
</div>
<div className="metric-delta delta-positive" id="dash-ingresos-delta" {...bindings["dash-ingresos-delta"]}>
{content["dash-ingresos-delta"] ?? <>
{"--"}
</>}
</div>
</div>
<div className="metric-card metric-expense">
<div className="metric-title">
{"Gastos del Mes"}
</div>
<div className="metric-value" id="dash-gastos" {...bindings["dash-gastos"]}>
{content["dash-gastos"] ?? <>
{"--"}
</>}
</div>
<div className="metric-delta delta-inverse" id="dash-gastos-delta" {...bindings["dash-gastos-delta"]}>
{content["dash-gastos-delta"] ?? <>
{"--"}
</>}
</div>
</div>
<div className="metric-card metric-neutral">
<div className="metric-title">
{"Total Transacciones"}
</div>
<div className="metric-value" id="dash-transacciones" {...bindings["dash-transacciones"]}>
{content["dash-transacciones"] ?? <>
{"--"}
</>}
</div>
<div className="metric-delta" id="dash-transacciones-delta" {...bindings["dash-transacciones-delta"]}>
{content["dash-transacciones-delta"] ?? <>
{"--"}
</>}
</div>
</div>
</div>
<div className="dashboard-grid">
<div className="chart-card">
<h3 >
{"Evolución del Saldo"}
</h3>
<div className="chart-container" style={{"position": "relative", "height": "290px"}}>
<canvas id="chart-evolution" {...bindings["chart-evolution"]}>
{content["chart-evolution"] ?? <>

</>}
</canvas>
</div>
</div>
<div className="chart-card donut-card">
<h3 >
{"Distribución del Mes"}
</h3>
<div className="chart-container" style={{"position": "relative", "height": "290px"}}>
<canvas id="chart-donut" {...bindings["chart-donut"]}>
{content["chart-donut"] ?? <>

</>}
</canvas>
</div>
</div>
</div>
<div className="chart-card">
<h3 >
{"Análisis Financiero"}
</h3>
<div id="analysis-content" className="analysis-card" {...bindings["analysis-content"]}>
{content["analysis-content"] ?? <>

</>}
</div>
</div>

</>}
</section>
)
}
