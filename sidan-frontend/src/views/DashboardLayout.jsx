// Estructura visual original; React controla datos, eventos y navegación.
import Card from '../components/Card.jsx'
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
<Card titulo="Saldo Total" descripcion={content['dash-saldo-delta'] ?? '--'} descriptionId="dash-saldo-delta" className="metric-card metric-primary">
<div className="metric-value" id="dash-saldo" {...bindings["dash-saldo"]}>
{content["dash-saldo"] ?? <>
{"--"}
</>}
</div>
</Card>
<Card titulo="Ingresos del Mes" descripcion={content['dash-ingresos-delta'] ?? '--'} descriptionId="dash-ingresos-delta" descriptionClassName="metric-delta delta-positive" className="metric-card metric-income">
<div className="metric-value" id="dash-ingresos" {...bindings["dash-ingresos"]}>
{content["dash-ingresos"] ?? <>
{"--"}
</>}
</div>
</Card>
<Card titulo="Gastos del Mes" descripcion={content['dash-gastos-delta'] ?? '--'} descriptionId="dash-gastos-delta" descriptionClassName="metric-delta delta-inverse" className="metric-card metric-expense">
<div className="metric-value" id="dash-gastos" {...bindings["dash-gastos"]}>
{content["dash-gastos"] ?? <>
{"--"}
</>}
</div>
</Card>
<Card titulo="Total Transacciones" descripcion={content['dash-transacciones-delta'] ?? '--'} descriptionId="dash-transacciones-delta" className="metric-card metric-neutral">
<div className="metric-value" id="dash-transacciones" {...bindings["dash-transacciones"]}>
{content["dash-transacciones"] ?? <>
{"--"}
</>}
</div>
</Card>
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
