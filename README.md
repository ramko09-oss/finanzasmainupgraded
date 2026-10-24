# SIDAA Finanzas

Aplicación para registrar ingresos y gastos, consultar el historial y analizar las finanzas personales.

## Entrega del examen

- **Aplicación desplegada:** https://finanzasmainupgraded.onrender.com/
- **Rama:** `main`. **Commit de la aplicación evaluada:** `f736e2eaf5acad9194d0135eb8b2261534ee3139`.
- **[Informe técnico y evidencias organizadas](docs/examen/README.md)**: informe grupal, capturas, accesibilidad manual, pruebas y reporte Lighthouse completo.
- **[Video grupal de exposición](https://youtu.be/FHAjr41D-Qc)**.
- **[Instrucciones de instalación y ejecución local](docs/examen/INSTALACION.md)**.

## Tecnologías y estructura

La interfaz completa utiliza React + Vite y Chart.js. Express proporciona la API, con PostgreSQL y autenticación JWT.

```text
finanzasmainupgraded/
├── backend/               API, autenticación y acceso a la base de datos
├── sidan-frontend/        Aplicación React + Vite y recursos visuales
├── tests/                 Pruebas de regresión
├── scripts/               Publicación, configuración y comprobación local
├── tools/react-inspector/ Inspector local de componentes
├── docs/                  Documentación y evidencias técnicas
├── .github/workflows/     Despliegue automático en Render
├── package.json           Comandos de la aplicación integrada
├── render.yaml            Configuración de referencia para Render
└── DEPLOYMENT.md           Procedimiento de publicación
```

- `sidan-frontend/src/views/`: acceso, navegación, dashboard, registro, historial, analítica, resumen mensual y gráficas.
- `sidan-frontend/src/components/`: elementos reutilizables, como `Card`.
- `sidan-frontend/src/api.js`: sesión, cliente API, conversión de moneda y cálculos financieros.
- `sidan-frontend/src/styles.css`: diseño original, tarjetas, navegación responsive y temas.
- `sidan-frontend/public/img/`: identidad visual y carrusel de acceso.
- `backend/`: API y acceso a la base de datos.
- `tests/`: comprobaciones de sesión, fechas, cálculos y filtros.

## Ejecutar localmente

Sigue la [guía de instalación](docs/examen/INSTALACION.md). Requiere Git, Node.js 22.12+ de la rama 22 o Node.js 24, npm y una base PostgreSQL de pruebas accesible con SSL. El archivo `.env` se configura en la **raíz** del repositorio. `backend/.env.example` contiene valores heredados de MySQL: utiliza los valores PostgreSQL de la guía para reproducir la configuración evaluada.

```powershell
npm run build
node backend/init_postgres_db.js
npm start
```

La inicialización se necesita para preparar las tablas de una base nueva; no se ejecuta como parte de cada despliegue. Abre `http://localhost:3001`. Para desarrollar la interfaz, deja el backend iniciado y ejecuta `npm run dev:react` en otra terminal.

## Funciones

- Registro de cuenta, acceso, sesión temporal o recordada y cierre de sesión.
- Registro de ingresos y gastos con fecha, descripción y categoría.
- Historial con búsqueda, filtro por tipo, selección y eliminación confirmada.
- Dashboard con saldo acumulado, comparación mensual, gráficos y salud financiera.
- Analítica por categorías con periodo, búsqueda, tipo e intervalos de importe.
- Resumen mensual y gráficas de evolución, ingresos, gastos y balance.
- Monedas USD, EUR, PEN y MXN; tema claro u oscuro y navegación móvil.
- [Directorio de referencia](https://finanzasmainupgraded.onrender.com/#directorio) con fuente externa, búsqueda, recarga, temporizador y adaptación de pantalla; accesible también sin iniciar sesión.

Hay una sola aplicación, servida desde `/`. Los enlaces antiguos `/react/` redirigen a esa misma aplicación. No se carga ninguna interfaz paralela ni se necesita un script externo de Chart.js.

Los movimientos se actualizan manualmente y cada 30 segundos mientras la página está visible. Los errores de conexión conservan los últimos datos cargados y permiten reintentar. Una sesión inválida oculta los datos y vuelve al acceso. Los tipos de cambio son las referencias configuradas del sistema, no cotizaciones en tiempo real; los importes se almacenan en USD como antes.

## Comprobación y publicación

```powershell
npm test
npm run preview:integration
```

El servidor de comprobación abre `http://127.0.0.1:3002` con datos locales de prueba y sin acceso a la base de datos. Permite probar acceso, registro de cuenta, alta y borrado de movimientos y estados vacíos o de error.

El flujo de commit, push a GitHub y despliegue único en Render está descrito en `DEPLOYMENT.md`.

El componente reutilizable `Card` y las capturas reales de React DevTools se
documentan en [Componentes y estado de la interfaz](docs/REACT-VERIFICATION.md).
La gestión de temporizadores, eventos, título y solicitudes asíncronas se explica
en [Efectos y ciclo de vida](docs/EFFECTS.md), con dependencias, limpieza y evidencias.
El inspector y el servidor con datos ficticios son herramientas de desarrollo;
no forman parte de la interfaz ni de los servicios publicados en producción.
El repositorio conserva código fuente, pruebas, documentación y configuración.
Dependencias instaladas, builds, archivos privados y paquetes ZIP quedan fuera de Git.

## Licencia

MIT.
