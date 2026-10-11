// Estructura visual original; React controla datos, eventos y navegación.
export default function ChartsLayout({ bindings = {}, content = {} }) {
return (
<section id="view-graficas" className="view view-active" {...bindings["view-graficas"]}>
{content["view-graficas"] ?? <>
<div className="view-header">
<div >
<h2 >
{"Gráficas y Tendencias"}
</h2>
<p className="view-subtitle">
{"Visualización analítica de evolución, gastos y balance"}
</p>
</div>
</div>
<div className="card chart-card mb-4">
<div className="card-header-simple">
<h3 >
{"Evolución Histórica del Saldo"}
</h3>
</div>
<div className="chart-container" style={{"position": "relative", "height": "320px"}}>
<canvas id="chart-full-evolution" {...bindings["chart-full-evolution"]}>
{content["chart-full-evolution"] ?? <>

</>}
</canvas>
</div>
</div>
<div className="graficas-grid">
<div className="card chart-card">
<div className="card-header-simple">
<h3 >
{"Ingresos vs Gastos por Mes"}
</h3>
</div>
<div className="chart-container" style={{"position": "relative", "height": "290px"}}>
<canvas id="chart-bars" {...bindings["chart-bars"]}>
{content["chart-bars"] ?? <>

</>}
</canvas>
</div>
</div>
<div className="card chart-card">
<div className="card-header-simple">
<h3 >
{"Balance Mensual Neto"}
</h3>
</div>
<div className="chart-container" style={{"position": "relative", "height": "290px"}}>
<canvas id="chart-balance" {...bindings["chart-balance"]}>
{content["chart-balance"] ?? <>

</>}
</canvas>
</div>
</div>
</div>
</>}
</section>
)
}
