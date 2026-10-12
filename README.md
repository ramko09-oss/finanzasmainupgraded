# SIDAA Finanzas

Aplicación para registrar ingresos y gastos, consultar el historial y analizar las finanzas personales.

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

Para compilar el frontend, utiliza una versión de Node compatible con Vite: Node 20.19 o superior en la rama 20, o Node 22.12 o superior.

Configura las variables de `backend/.env.example` en un archivo `.env` en la raíz del repositorio cuando ejecutes los comandos de la aplicación integrada. No lo subas a Git. Para una base de datos nueva, instala las dependencias de backend y ejecuta `node backend/init_postgres_db.js` desde la raíz. La inicialización es un paso de configuración, no se ejecuta en cada despliegue.

Desde la raíz:

```powershell
npm run build
npm start
```

Abre `http://localhost:3001`. Para desarrollar con recarga de Vite, deja el backend iniciado y ejecuta `npm run dev:react` en otra terminal. Vite redirige las peticiones `/api` al puerto 3001.

## Funciones

- Registro de cuenta, acceso, sesión temporal o recordada y cierre de sesión.
- Registro de ingresos y gastos con fecha, descripción y categoría.
- Historial con búsqueda, filtro por tipo, selección y eliminación confirmada.
- Dashboard con saldo acumulado, comparación mensual, gráficos y salud financiera.
- Analítica por categorías con periodo, búsqueda, tipo e intervalos de importe.
- Resumen mensual y gráficas de evolución, ingresos, gastos y balance.
- Monedas USD, EUR, PEN y MXN; tema claro u oscuro y navegación móvil.

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
