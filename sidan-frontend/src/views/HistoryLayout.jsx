// Estructura visual original; React controla datos, eventos y navegación.
export default function HistoryLayout({ bindings = {}, content = {} }) {
return (
<section id="view-historial" className="view view-active" {...bindings["view-historial"]}>
{content["view-historial"] ?? <>
<div className="view-header">
<div >
<h2 >
{"Historial de Transacciones"}
</h2>
<p className="view-subtitle">
{"Consulta, filtra y administra todas tus operaciones registradas"}
</p>
</div>
</div>
<div className="historial-summary-grid">
<div className="mini-kpi-card">
<span className="mini-kpi-icon">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z">

</path>
<polyline points="14 2 14 8 20 8">

</polyline>
<line x1="16" y1="13" x2="8" y2="13">

</line>
<line x1="16" y1="17" x2="8" y2="17">

</line>
</svg>
</span>
<div >
<div className="mini-kpi-label">
{"Total Operaciones"}
</div>
<div className="mini-kpi-val" id="historial-kpi-count" {...bindings["historial-kpi-count"]}>
{content["historial-kpi-count"] ?? <>
{"0"}
</>}
</div>
</div>
</div>
<div className="mini-kpi-card mini-kpi-income">
<span className="mini-kpi-icon text-income">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M23 6l-9.5 9.5-5-5L1 18">

</path>
<path d="M17 6h6v6">

</path>
</svg>
</span>
<div >
<div className="mini-kpi-label">
{"Total Ingresos"}
</div>
<div className="mini-kpi-val text-income" id="historial-kpi-ingresos" {...bindings["historial-kpi-ingresos"]}>
{content["historial-kpi-ingresos"] ?? <>
{"--"}
</>}
</div>
</div>
</div>
<div className="mini-kpi-card mini-kpi-expense">
<span className="mini-kpi-icon text-expense">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M23 18l-9.5-9.5-5 5L1 6">

</path>
<path d="M17 18h6v-6">

</path>
</svg>
</span>
<div >
<div className="mini-kpi-label">
{"Total Gastos"}
</div>
<div className="mini-kpi-val text-expense" id="historial-kpi-gastos" {...bindings["historial-kpi-gastos"]}>
{content["historial-kpi-gastos"] ?? <>
{"--"}
</>}
</div>
</div>
</div>
<div className="mini-kpi-card mini-kpi-balance">
<span className="mini-kpi-icon">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="12" cy="12" r="10">

</circle>
<path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8">

</path>
<line x1="12" y1="6" x2="12" y2="8">

</line>
<line x1="12" y1="16" x2="12" y2="18">

</line>
</svg>
</span>
<div >
<div className="mini-kpi-label">
{"Balance Neto"}
</div>
<div className="mini-kpi-val" id="historial-kpi-balance" {...bindings["historial-kpi-balance"]}>
{content["historial-kpi-balance"] ?? <>
{"--"}
</>}
</div>
</div>
</div>
</div>
<div className="card table-card">
<div className="table-toolbar">
<div className="search-box">
<input type="text" id="historial-search" placeholder="Buscar por concepto, monto o fecha..." className="input-search" {...bindings["historial-search"]} />
</div>
<div className="filter-box">
<select id="historial-filter-type" className="input-select-compact" {...bindings["historial-filter-type"]}>
{content["historial-filter-type"] ?? <>
<option value="ALL">
{"Todas las operaciones"}
</option>
<option value="Ingreso">
{"Solo Ingresos"}
</option>
<option value="Gasto">
{"Solo Gastos"}
</option>
</>}
</select>
</div>
<div className="toolbar-actions">
<button id="btn-delete-selected" className="btn btn-danger btn-compact" disabled title="Selecciona al menos una casilla para eliminar" {...bindings["btn-delete-selected"]}>
{content["btn-delete-selected"] ?? <>
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{"verticalAlign": "-2px", "marginRight": "4px"}}>
<polyline points="3 6 5 6 21 6">

</polyline>
<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">

</path>
<line x1="10" y1="11" x2="10" y2="17">

</line>
<line x1="14" y1="11" x2="14" y2="17">

</line>
</svg>
{"Eliminar Seleccionados ("}
<span id="delete-count" {...bindings["delete-count"]}>
{content["delete-count"] ?? <>
{"0"}
</>}
</span>
{")"}
</>}
</button>
</div>
</div>
<div className="table-container">
<table className="data-table">
<thead >
<tr >
<th style={{"width": "44px", "textAlign": "center"}}>
<input type="checkbox" id="select-all-tx" title="Seleccionar todos" {...bindings["select-all-tx"]} />
</th>
<th style={{"width": "120px"}}>
{"Fecha"}
</th>
<th >
{"Descripción"}
</th>
<th style={{"width": "120px", "textAlign": "center"}}>
{"Tipo"}
</th>
<th style={{"width": "140px", "textAlign": "right"}}>
{"Monto"}
</th>
</tr>
</thead>
<tbody id="historial-tbody" {...bindings["historial-tbody"]}>
{content["historial-tbody"] ?? <>

</>}
</tbody>
</table>
</div>
<div className="table-footer">
<span id="historial-footer-info" {...bindings["historial-footer-info"]}>
{content["historial-footer-info"] ?? <>
{"Cargando transacciones..."}
</>}
</span>
<span id="historial-footer-balance" className="footer-balance-badge" {...bindings["historial-footer-balance"]}>
{content["historial-footer-balance"] ?? <>

</>}
</span>
</div>
</div>
</>}
</section>
)
}
