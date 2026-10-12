// Estructura visual original; React controla datos, eventos y navegación.
export default function AppLayout({ bindings = {}, content = {}, view, children }) {
return (
<div id="app-container" className="" {...bindings["app-container"]}>
{content["app-container"] ?? <>
<header className="mobile-header">
<div className="mobile-brand">
<img src="img/sidaa-logo.png" alt="SIDAA" className="mobile-logo-img" />
<span className="mobile-brand-title">
{"SIDAA"}
</span>
</div>
<div className="mobile-actions">
<a className="btn btn-sm" href="#directorio" aria-label="Directorio de referencia">Directorio</a>
<button type="button" id="theme-toggle-mobile" className="theme-toggle-btn-compact" title="Cambiar tema" aria-label="Cambiar tema" {...bindings["theme-toggle-mobile"]}>
{content["theme-toggle-mobile"] ?? <>
<span className="theme-icon-slot">
<svg className="theme-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z">

</path>
</svg>
</span>
</>}
</button>
<button type="button" id="btn-logout-mobile" className="btn-logout-compact" title="Cerrar sesión" aria-label="Cerrar sesión" {...bindings["btn-logout-mobile"]}>
{content["btn-logout-mobile"] ?? <>
<svg className="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4">

</path>
<polyline points="16 17 21 12 16 7">

</polyline>
<line x1="21" y1="12" x2="9" y2="12">

</line>
</svg>
</>}
</button>
</div>
</header>
<aside className="sidebar">
<div className="sidebar-brand-card">
<img src="img/sidaa-logo.png" alt="SIDAA" className="sidebar-brand-logo" />
<div className="sidebar-brand-meta">
<span className="sidebar-brand-name">
{"SIDAA"}
</span>
<span className="sidebar-brand-sub">
{"Finanzas"}
</span>
</div>
</div>
<div className="sidebar-user-card">
<div className="user-avatar" id="user-avatar" {...bindings["user-avatar"]}>
{content["user-avatar"] ?? <>
{"U"}
</>}
</div>
<div className="user-info">
<h3 id="user-greeting" {...bindings["user-greeting"]}>
{content["user-greeting"] ?? <>
{"Hola 👋"}
</>}
</h3>
<span className="user-status-pill">
{"● En línea"}
</span>
</div>
</div>
<nav className="sidebar-nav">
<div className="nav-section-title">
{"MENÚ PRINCIPAL"}
</div>
<a href="#dashboard" className={"nav-item" + (view === "dashboard" ? " active" : "")} data-view="dashboard">
<svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<rect x="3" y="3" width="7" height="9" rx="1">

</rect>
<rect x="14" y="3" width="7" height="5" rx="1">

</rect>
<rect x="14" y="12" width="7" height="9" rx="1">

</rect>
<rect x="3" y="16" width="7" height="5" rx="1">

</rect>
</svg>
<span className="nav-text">
{"Dashboard"}
</span>
</a>
<a href="#registrar" className={"nav-item" + (view === "registrar" ? " active" : "")} data-view="registrar">
<svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="12" cy="12" r="10">

</circle>
<line x1="12" y1="8" x2="12" y2="16">

</line>
<line x1="8" y1="12" x2="16" y2="12">

</line>
</svg>
<span className="nav-text">
{"Registrar"}
</span>
</a>
<a href="#historial" className={"nav-item" + (view === "historial" ? " active" : "")} data-view="historial">
<svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z">

</path>
<polyline points="14 2 14 8 20 8">

</polyline>
<line x1="16" y1="13" x2="8" y2="13">

</line>
<line x1="16" y1="17" x2="8" y2="17">

</line>
<polyline points="10 9 9 9 8 9">

</polyline>
</svg>
<span className="nav-text">
{"Historial"}
</span>
</a>
<a href="#analitica" className={"nav-item" + (view === "analitica" ? " active" : "")} data-view="analitica">
<svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<line x1="18" y1="20" x2="18" y2="10">

</line>
<line x1="12" y1="20" x2="12" y2="4">

</line>
<line x1="6" y1="20" x2="6" y2="14">

</line>
<line x1="2" y1="20" x2="22" y2="20">

</line>
</svg>
<span className="nav-text">
{"Analítica"}
</span>
</a>
<a href="#resumen" className={"nav-item" + (view === "resumen" ? " active" : "")} data-view="resumen">
<svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<rect x="3" y="4" width="18" height="18" rx="2" ry="2">

</rect>
<line x1="16" y1="2" x2="16" y2="6">

</line>
<line x1="8" y1="2" x2="8" y2="6">

</line>
<line x1="3" y1="10" x2="21" y2="10">

</line>
</svg>
<span className="nav-text">
{"Resumen Mensual"}
</span>
</a>
<a href="#graficas" className={"nav-item" + (view === "graficas" ? " active" : "")} data-view="graficas">
<svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<line x1="18" y1="20" x2="18" y2="10">

</line>
<line x1="12" y1="20" x2="12" y2="4">

</line>
<line x1="6" y1="20" x2="6" y2="14">

</line>
<line x1="2" y1="20" x2="22" y2="20">

</line>
</svg>
<span className="nav-text">
{"Gráficas"}
</span>
</a>

<a href="#directorio" className={'nav-item' + (view === 'directorio' ? ' active' : '')}><svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5h4M17 9h4M17 13h4" /></svg><span className="nav-text">Directorio</span></a>
</nav>
<div className="sidebar-footer-card">
<div className="sidebar-control-group">
<label htmlFor="currency-selector" className="control-label">
<svg className="control-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="12" cy="12" r="10">

</circle>
<line x1="2" y1="12" x2="22" y2="12">

</line>
<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">

</path>
</svg>
{"Moneda"}
</label>
<select id="currency-selector" className="input-select" {...bindings["currency-selector"]}>
{content["currency-selector"] ?? <>
<option value="USD">
{"Dólar (USD)"}
</option>
<option value="EUR">
{"Euro (EUR)"}
</option>
<option value="PEN">
{"Sol (PEN)"}
</option>
<option value="MXN">
{"Peso Mexicano (MXN)"}
</option>
</>}
</select>
</div>
<div className="sidebar-control-group">
<label className="control-label">
<svg className="control-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="12" cy="12" r="9">

</circle>
<path d="M12 3v18">

</path>
<path d="M12 3a9 9 0 0 1 0 18z">

</path>
</svg>
{"Apariencia"}
</label>
<button type="button" id="theme-toggle-sidebar" className="theme-toggle-btn" {...bindings["theme-toggle-sidebar"]}>
{content["theme-toggle-sidebar"] ?? <>
<span className="theme-icon-slot">
<svg className="theme-icon-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z">

</path>
</svg>
</span>
<span className="theme-text">
{"Modo Oscuro"}
</span>
</>}
</button>
</div>
<button id="btn-logout" className="btn btn-block btn-logout" {...bindings["btn-logout"]}>
{content["btn-logout"] ?? <>
<svg className="btn-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4">

</path>
<polyline points="16 17 21 12 16 7">

</polyline>
<line x1="21" y1="12" x2="9" y2="12">

</line>
</svg>
<span >
{"Cerrar Sesión"}
</span>
</>}
</button>
</div>
</aside>
<main className="main-content">
<header className="main-topbar">
<div className="topbar-left-area">
<div className="topbar-breadcrumb">
<span className="breadcrumb-prefix">
{"SIDAA"}
</span>
<span className="breadcrumb-divider">
{"/"}
</span>
<div className="breadcrumb-current-badge">
<span className="breadcrumb-icon" id="topbar-view-icon" {...bindings["topbar-view-icon"]}>
{content["topbar-view-icon"] ?? <>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<rect x="3" y="3" width="7" height="9" rx="1">

</rect>
<rect x="14" y="3" width="7" height="5" rx="1">

</rect>
<rect x="14" y="12" width="7" height="9" rx="1">

</rect>
<rect x="3" y="16" width="7" height="5" rx="1">

</rect>
</svg>
</>}
</span>
<span id="topbar-view-title" className="breadcrumb-title" {...bindings["topbar-view-title"]}>
{content["topbar-view-title"] ?? <>
{"Dashboard Principal"}
</>}
</span>
</div>
</div>
<div className="topbar-search-box" id="topbar-search-container" {...bindings["topbar-search-container"]}>
{content["topbar-search-container"] ?? <>
<svg className="search-box-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="11" cy="11" r="8">

</circle>
<line x1="21" y1="21" x2="16.65" y2="16.65">

</line>
</svg>
<input type="text" id="topbar-global-search" placeholder="Búsqueda rápida o apartados..." className="topbar-search-input" autoComplete="off" aria-label="Búsqueda rápida o apartados" {...bindings["topbar-global-search"]} />
<div id="topbar-search-dropdown" className="topbar-search-dropdown hidden" role="listbox" {...bindings["topbar-search-dropdown"]}>
{content["topbar-search-dropdown"] ?? <>

</>}
</div>
</>}
</div>
</div>
<div className="topbar-right-actions">
<a href="#registrar" className="btn-topbar-register" title="Registrar Transacción">
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
<line x1="12" y1="5" x2="12" y2="19">

</line>
<line x1="5" y1="12" x2="19" y2="12">

</line>
</svg>
<span >
{"+ Registro"}
</span>
</a>
<div className="topbar-profile-chip" title="Perfil de usuario">
<div className="topbar-avatar" id="topbar-avatar" {...bindings["topbar-avatar"]}>
{content["topbar-avatar"] ?? <>
{"U"}
</>}
</div>
<span className="topbar-username" id="topbar-username" {...bindings["topbar-username"]}>
{content["topbar-username"] ?? <>
{"Usuario"}
</>}
</span>
</div>
</div>
</header>
{children}





</main>
<nav className="mobile-bottom-nav" aria-label="Navegación Móvil">
<a href="#dashboard" className={"bottom-nav-item" + (view === "dashboard" ? " active" : "")} data-view="dashboard">
<svg className="bottom-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<rect x="3" y="3" width="7" height="9" rx="1">

</rect>
<rect x="14" y="3" width="7" height="5" rx="1">

</rect>
<rect x="14" y="12" width="7" height="9" rx="1">

</rect>
<rect x="3" y="16" width="7" height="5" rx="1">

</rect>
</svg>
<span className="bottom-nav-label">
{"Dashboard"}
</span>
</a>
<a href="#registrar" className={"bottom-nav-item" + (view === "registrar" ? " active" : "")} data-view="registrar">
<svg className="bottom-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="12" cy="12" r="10">

</circle>
<line x1="12" y1="8" x2="12" y2="16">

</line>
<line x1="8" y1="12" x2="16" y2="12">

</line>
</svg>
<span className="bottom-nav-label">
{"Registrar"}
</span>
</a>
<a href="#historial" className={"bottom-nav-item" + (view === "historial" ? " active" : "")} data-view="historial">
<svg className="bottom-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z">

</path>
<polyline points="14 2 14 8 20 8">

</polyline>
<line x1="16" y1="13" x2="8" y2="13">

</line>
<line x1="16" y1="17" x2="8" y2="17">

</line>
</svg>
<span className="bottom-nav-label">
{"Historial"}
</span>
</a>
<a href="#analitica" className={"bottom-nav-item" + (view === "analitica" ? " active" : "")} data-view="analitica">
<svg className="bottom-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<line x1="18" y1="20" x2="18" y2="10">

</line>
<line x1="12" y1="20" x2="12" y2="4">

</line>
<line x1="6" y1="20" x2="6" y2="14">

</line>
<line x1="2" y1="20" x2="22" y2="20">

</line>
</svg>
<span className="bottom-nav-label">
{"Analítica"}
</span>
</a>
<a href="#resumen" className={"bottom-nav-item" + (view === "resumen" ? " active" : "")} data-view="resumen">
<svg className="bottom-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<rect x="3" y="4" width="18" height="18" rx="2" ry="2">

</rect>
<line x1="16" y1="2" x2="16" y2="6">

</line>
<line x1="8" y1="2" x2="8" y2="6">

</line>
<line x1="3" y1="10" x2="21" y2="10">

</line>
</svg>
<span className="bottom-nav-label">
{"Resumen"}
</span>
</a>
<a href="#graficas" className={"bottom-nav-item" + (view === "graficas" ? " active" : "")} data-view="graficas">
<svg className="bottom-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<line x1="18" y1="20" x2="18" y2="10">

</line>
<line x1="12" y1="20" x2="12" y2="4">

</line>
<line x1="6" y1="20" x2="6" y2="14">

</line>
<line x1="2" y1="20" x2="22" y2="20">

</line>
</svg>
<span className="bottom-nav-label">
{"Gráficas"}
</span>
</a>
</nav>
</>}
</div>
)
}
