// Estructura visual original; React controla datos, eventos y navegación.
export default function AnalyticsLayout({ bindings = {}, content = {}, monthControl }) {
return (
<section id="view-analitica" className="view view-active" {...bindings["view-analitica"]}>
{content["view-analitica"] ?? <>
<div className="view-header">
<div >
<h2 >
{"Analítica y Desglose de Gastos"}
</h2>
<p className="view-subtitle">
{"Desglose comparativo por categorías y comportamiento de tus finanzas"}
</p>
</div>
<div className="analitica-header-controls">
{monthControl}
<span className="analitica-status-pill">
<span className="status-live-dot">

</span>
{"Comparativa Mensual Activa"}
</span>
</div>
</div>
<div className="analitica-container-grid">
<aside className="analitica-filters-sidebar">
<div className="filters-sidebar-header">
<h3 >
{"Analítica"}
</h3>

</div>
<div className="filter-field-block">
<label className="filter-field-label">
{"Mi filtro"}
</label>
<select id="analitica-filter-preset" className="analitica-select" {...bindings["analitica-filter-preset"]}>
{content["analitica-filter-preset"] ?? <>
<option value="all">
{"Seleccionar filtro"}
</option>
<option value="current">
{"Mes en curso"}
</option>
<option value="fijos">
{"Gastos esenciales"}
</option>
</>}
</select>
</div>
<div className="filter-field-block">
<label className="filter-field-label">
{"Buscar"}
</label>
<div className="filter-search-wrapper">
<svg className="filter-search-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
<circle cx="11" cy="11" r="8">

</circle>
<line x1="21" y1="21" x2="16.65" y2="16.65">

</line>
</svg>
<input type="text" id="analitica-search" placeholder="Buscar concepto..." className="analitica-search-input" {...bindings["analitica-search"]} />
</div>
</div>

<div className="filter-field-block">
<label className="filter-field-label">
{"Categorías"}
</label>
<select id="analitica-filter-category" className="analitica-select" {...bindings["analitica-filter-category"]}>
{content["analitica-filter-category"] ?? <>
<option value="all">
{"Todas las categorías"}
</option>
<option value="Comida y bebidas">
{"Comida y bebidas"}
</option>
<option value="Compras">
{"Compras"}
</option>
<option value="Vivienda">
{"Vivienda"}
</option>
<option value="Transporte">
{"Transporte"}
</option>
<option value="Vehículo">
{"Vehículo"}
</option>
<option value="Vida y entretenimiento">
{"Vida y entretenimiento"}
</option>
<option value="Comunicación, PC">
{"Comunicación, PC"}
</option>
<option value="Gastos financieros">
{"Gastos financieros"}
</option>
<option value="Inversiones">
{"Inversiones"}
</option>
<option value="Otros">
{"Otros"}
</option>
</>}
</select>
</div>

<div className="filter-field-block">
<label className="filter-field-label">
{"Monedas"}
</label>
<select id="analitica-filter-currency" className="analitica-select" {...bindings["analitica-filter-currency"]}>
{content["analitica-filter-currency"] ?? <>
<option value="PEN">
{"Sol (PEN)"}
</option>
<option value="USD">
{"Dólar (USD)"}
</option>
<option value="EUR">
{"Euro (EUR)"}
</option>
<option value="MXN">
{"Peso Mexicano (MXN)"}
</option>
</>}
</select>
</div>
<div className="filter-field-block">
<label className="filter-field-label">
{"Tipos de registro"}
</label>
<select id="analitica-filter-type" className="analitica-select" {...bindings["analitica-filter-type"]}>
{content["analitica-filter-type"] ?? <>
<option value="all">
{"Todos los tipos de registro"}
</option>
<option value="Gasto">
{"Solo Gastos"}
</option>
<option value="Ingreso">
{"Solo Ingresos"}
</option>
</>}
</select>
</div>
<div className="filter-field-block">
<div className="filter-label-flex">
<span className="filter-field-label">
{"Rango de cantidad"}
</span>
<span className="filter-currency-tag" id="analitica-currency-label" {...bindings["analitica-currency-label"]}>
{content["analitica-currency-label"] ?? <>
{"PEN"}
</>}
</span>
</div>
<div className="range-inputs-container">
<input type="number" id="analitica-min-amount" placeholder="0" min="0" className="analitica-range-input" {...bindings["analitica-min-amount"]} />
<span className="range-separator">
{"-"}
</span>
<input type="number" id="analitica-max-amount" placeholder="Sin límite" min="0" className="analitica-range-input" {...bindings["analitica-max-amount"]} />
</div>
</div>

<button type="button" id="btn-analitica-reset" className="btn btn-block btn-reset-filters-analitica" {...bindings["btn-analitica-reset"]}>
{content["btn-analitica-reset"] ?? <>
{"Restablecer filtro"}
</>}
</button>
</aside>
<div className="analitica-table-container">
<div className="analitica-table-card">
<div className="analitica-table-header-bar">
<div className="table-bar-title">
{"Desglose Analítico por Periodos"}
</div>

</div>
<div className="analitica-table-wrapper">
<table className="analitica-table">
<thead >
<tr >
<th className="th-concept">
{"Concepto / Categoría"}
</th>
<th className="th-amount" id="analitica-col-current" {...bindings["analitica-col-current"]}>
{content["analitica-col-current"] ?? <>
{"Septiembre 2026"}
</>}
</th>
<th className="th-amount" id="analitica-col-prev" {...bindings["analitica-col-prev"]}>
{content["analitica-col-prev"] ?? <>
{"Agosto 2026"}
</>}
</th>
</tr>
</thead>
<tbody id="analitica-table-body" {...bindings["analitica-table-body"]}>
{content["analitica-table-body"] ?? <>

</>}
</tbody>
</table>
</div>
</div>
</div>
</div>
</>}
</section>
)
}
