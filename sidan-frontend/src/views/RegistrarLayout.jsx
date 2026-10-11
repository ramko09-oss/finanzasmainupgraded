// Estructura visual original; React controla datos, eventos y navegación.
export default function RegistrarLayout({ bindings = {}, content = {} }) {
return (
<section id="view-registrar" className="view view-active" {...bindings["view-registrar"]}>
{content["view-registrar"] ?? <>
<div className="view-header">
<div >
<h2 >
{"Registrar Transacción"}
</h2>
<p className="view-subtitle">
{"Añade un ingreso o gasto a tu registro contable"}
</p>
</div>
</div>
<div className="registrar-container">
<div className="card registrar-card">
<form id="form-transaction" {...bindings["form-transaction"]}>
{content["form-transaction"] ?? <>
<div className="form-group">
<label className="label-heading">
{"Tipo de Operación"}
</label>
<div className="type-selector-segmented">
<button type="button" className="type-btn active" data-type="Ingreso" id="btn-type-ingreso" {...bindings["btn-type-ingreso"]}>
{content["btn-type-ingreso"] ?? <>
<span className="type-icon">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
<path d="M23 6l-9.5 9.5-5-5L1 18">

</path>
<path d="M17 6h6v6">

</path>
</svg>
</span>
<span className="type-name">
{"Ingreso"}
</span>
</>}
</button>
<button type="button" className="type-btn" data-type="Gasto" id="btn-type-gasto" {...bindings["btn-type-gasto"]}>
{content["btn-type-gasto"] ?? <>
<span className="type-icon">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
<path d="M23 18l-9.5-9.5-5 5L1 6">

</path>
<path d="M17 18h6v-6">

</path>
</svg>
</span>
<span className="type-name">
{"Gasto"}
</span>
</>}
</button>
<input type="hidden" id="tx-tipo" value="Ingreso" {...bindings["tx-tipo"]} />
</div>
</div>
<div className="form-row">
<div className="form-group flex-1">
<label htmlFor="tx-monto">
{"Monto ("}
<span id="tx-currency-symbol" {...bindings["tx-currency-symbol"]}>
{content["tx-currency-symbol"] ?? <>
{"$"}
</>}
</span>
{")"}
</label>
<div className="input-currency-wrapper">
<input type="number" id="tx-monto" min="0.01" step="0.01" placeholder="0.00" required className="input-lg" {...bindings["tx-monto"]} />
</div>
</div>
<div className="form-group flex-1">
<label htmlFor="tx-fecha">
{"Fecha"}
</label>
<input type="date" id="tx-fecha" required className="input-lg" {...bindings["tx-fecha"]} />
</div>
</div>
<div className="form-group">
<label htmlFor="tx-categoria">
{"Categoría"}
</label>
<select id="tx-categoria" className="input-lg input-select" {...bindings["tx-categoria"]}>
{content["tx-categoria"] ?? <>
<option value="Comida y bebidas">
{"🍽️ Comida y bebidas"}
</option>
<option value="Compras">
{"🛍️ Compras"}
</option>
<option value="Vivienda">
{"🏠 Vivienda"}
</option>
<option value="Transporte">
{"🚆 Transporte"}
</option>
<option value="Vehículo">
{"🚗 Vehículo"}
</option>
<option value="Vida y entretenimiento">
{"🚶 Vida y entretenimiento"}
</option>
<option value="Comunicación, PC">
{"💻 Comunicación, PC"}
</option>
<option value="Gastos financieros">
{"💳 Gastos financieros"}
</option>
<option value="Inversiones">
{"📈 Inversiones"}
</option>
<option value="Ingresos">
{"💰 Salario / Ingresos"}
</option>
<option value="Otros">
{"📄 Otros"}
</option>
</>}
</select>
</div>
<div className="form-group">
<label htmlFor="tx-desc">
{"Descripción o Concepto"}
</label>
<input type="text" id="tx-desc" placeholder="Ej. Almuerzo ejecutivo, Pago de alquiler, Combustible" required className="input-lg" {...bindings["tx-desc"]} />
</div>
<button type="submit" className="btn btn-primary btn-block btn-lg mt-2" disabled={bindings["form-transaction"]?.["aria-busy"]}>
{"Guardar Transacción"}
</button>
</>}
</form>
</div>
</div>
</>}
</section>
)
}
