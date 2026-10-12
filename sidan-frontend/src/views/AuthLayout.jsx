// Estructura visual original; React controla datos, eventos y navegación.
export default function AuthLayout({ activeForm = 'form-login', bindings = {}, content = {}, tabs = {}, dots = [] }) {
return (
<div id="view-auth" className="view view-active auth-split-layout" {...bindings["view-auth"]}>
{content["view-auth"] ?? <>
<div className="auth-hero-panel">
<div className="auth-carousel" id="auth-carousel" {...bindings["auth-carousel"]}>
{content["auth-carousel"] ?? <>
<div className="carousel-track" id="carousel-track" {...bindings["carousel-track"]}>
{content["carousel-track"] ?? <>
<div className="carousel-slide">
<div className="carousel-slide-bg" style={{"backgroundImage": "url('img/slide-1-bienvenido.jpg')"}}>

</div>
<img src="img/slide-1-bienvenido.jpg" alt="Bienvenido a SIDAN" className="carousel-img" draggable="false" />
</div>
<div className="carousel-slide">
<div className="carousel-slide-bg" style={{"backgroundImage": "url('img/slide-2-desorden.jpg')"}}>

</div>
<img src="img/slide-2-desorden.jpg" alt="¿Tus finanzas son un desorden?" className="carousel-img" draggable="false" />
</div>
<div className="carousel-slide">
<div className="carousel-slide-bg" style={{"backgroundImage": "url('img/slide-3-simplifica.jpg')"}}>

</div>
<img src="img/slide-3-simplifica.jpg" alt="SIDAN simplifica. Todo en un solo lugar" className="carousel-img" draggable="false" />
</div>
<div className="carousel-slide">
<div className="carousel-slide-bg" style={{"backgroundImage": "url('img/slide-4-crecimiento.jpg')"}}>

</div>
<img src="img/slide-4-crecimiento.jpg" alt="Mira cómo tus números crecen y SIDAN" className="carousel-img" draggable="false" />
</div>
<div className="carousel-slide">
<div className="carousel-slide-bg" style={{"backgroundImage": "url('img/slide-5-conectalo.jpg')"}}>

</div>
<img src="img/slide-5-conectalo.jpg" alt="¡Conéctalo ya y empieza a crecer!" className="carousel-img" draggable="false" />
</div>
</>}
</div>
<button type="button" className="carousel-arrow carousel-arrow-prev" id="carousel-prev" aria-label="Slide anterior" {...bindings["carousel-prev"]}>
{content["carousel-prev"] ?? <>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
<polyline points="15 18 9 12 15 6">

</polyline>
</svg>
</>}
</button>
<button type="button" className="carousel-arrow carousel-arrow-next" id="carousel-next" aria-label="Slide siguiente" {...bindings["carousel-next"]}>
{content["carousel-next"] ?? <>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
<polyline points="9 6 15 12 9 18">

</polyline>
</svg>
</>}
</button>
<div className="carousel-dots" id="carousel-dots" {...bindings["carousel-dots"]}>
{content["carousel-dots"] ?? <>
<button type="button" className="carousel-dot active" data-slide="0" aria-label="Slide 1" {...dots[0]}>

</button>
<button type="button" className="carousel-dot" data-slide="1" aria-label="Slide 2" {...dots[1]}>

</button>
<button type="button" className="carousel-dot" data-slide="2" aria-label="Slide 3" {...dots[2]}>

</button>
<button type="button" className="carousel-dot" data-slide="3" aria-label="Slide 4" {...dots[3]}>

</button>
<button type="button" className="carousel-dot" data-slide="4" aria-label="Slide 5" {...dots[4]}>

</button>
</>}
</div>
</>}
</div>
</div>
<div className="auth-form-panel">
<div className="auth-form-top-bar">
<button type="button" id="theme-toggle-auth" className="theme-toggle-btn-compact" title="Cambiar tema visual" aria-label="Cambiar tema" {...bindings["theme-toggle-auth"]}>
{content["theme-toggle-auth"] ?? <>
<span className="theme-icon-slot">
<svg className="theme-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z">

</path>
</svg>
</span>
</>}
</button>
</div>
<div className="auth-form-box">
<div className="auth-mobile-banner">
<img src="img/sidan-logo.png" alt="SIDAN" className="sidaa-banner-image-mobile" />
</div>
<div className="auth-form-header">
<h2 id="auth-title-text" {...bindings["auth-title-text"]}>
{content["auth-title-text"] ?? <>
{"Iniciar sesión"}
</>}
</h2>
<p className="auth-subtitle-text">
{content.subtitle}
</p>
</div>
<div className="auth-tabs-segmented">
<button type="button" className="auth-tab auth-tab-pill active" data-target="form-login" {...tabs["form-login"]}>
{"Iniciar Sesión"}
</button>
<button type="button" className="auth-tab auth-tab-pill" data-target="form-register" {...tabs["form-register"]}>
{"Crear Cuenta"}
</button>
</div>
{activeForm === 'form-login' && <form id="form-login" className="auth-form active" {...bindings["form-login"]}>
{content["form-login"] ?? <>
<div className="form-group">
<label htmlFor="login-email">
{"Correo electrónico"}
</label>
<input type="email" id="login-email" placeholder="tu@email.com" required autoComplete="email" autoCapitalize="none" spellCheck={false} className="input-auth" {...bindings["login-email"]} />
</div>
<div className="form-group">
<label htmlFor="login-password">
{"Contraseña"}
</label>
<input type="password" id="login-password" placeholder="••••••••" required autoComplete="current-password" className="input-auth" {...bindings["login-password"]} />
</div>
<div className="form-group-remember">
<label className="remember-checkbox-label" htmlFor="login-remember">
<input type="checkbox" id="login-remember" className="remember-checkbox" {...bindings["login-remember"]} />
<span className="remember-text">
{"Recordar sesión en este dispositivo"}
</span>
</label>
</div>
<button type="submit" className="btn btn-auth-primary btn-block" disabled={bindings["form-login"]?.["aria-busy"]}>
{"Iniciar sesión"}
</button>
</>}
</form>}
{activeForm === 'form-register' && <form id="form-register" className="auth-form active" {...bindings["form-register"]}>
{content["form-register"] ?? <>
<div className="form-group">
<label htmlFor="reg-name">
{"Nombre de usuario"}
</label>
<input type="text" id="reg-name" placeholder="Tu nombre" required autoComplete="name" className="input-auth" {...bindings["reg-name"]} />
</div>
<div className="form-group">
<label htmlFor="reg-email">
{"Correo electrónico"}
</label>
<input type="email" id="reg-email" placeholder="tu@email.com" required autoComplete="email" autoCapitalize="none" spellCheck={false} className="input-auth" {...bindings["reg-email"]} />
</div>
<div className="form-group">
<label htmlFor="reg-password">
{"Contraseña (mín. 6 caracteres)"}
</label>
<input type="password" id="reg-password" placeholder="Mínimo 6 caracteres" minLength="6" required autoComplete="new-password" className="input-auth" {...bindings["reg-password"]} />
</div>
<button type="submit" className="btn btn-auth-primary btn-block" disabled={bindings["form-register"]?.["aria-busy"]}>
{"Crear cuenta en SIDAN"}
</button>
</>}
</form>}
<p className="auth-legal-notice">
<a href="#directorio">Consultar directorio de referencia</a><br />
{"Al registrarte o iniciar sesión aceptas nuestros Términos de servicio y reconoces nuestra Política de privacidad para el manejo seguro de tus datos financieros."}
</p>
</div>
</div>
</>}
</div>
)
}
