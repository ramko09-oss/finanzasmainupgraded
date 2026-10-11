# 💰 Sistema de Gestión Financiera

Sistema web para gestión de finanzas personales con registro de ingresos y gastos, gráficos interactivos y análisis financiero.

## 🚀 Tecnologías

| Capa | Tecnología |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (ES Modules), Chart.js |
| **Backend** | Node.js, Express.js |
| **Base de datos** | PostgreSQL |
| **Autenticación** | JWT (JSON Web Tokens) + bcrypt |

## 📁 Estructura del Proyecto

```
finanzas-web/
├── frontend/                # Interfaz de usuario original (completa)
│   ├── index.html           # Página principal (SPA)
│   ├── css/styles.css       # Estilos con variables CSS
│   └── js/
│       ├── app.js           # Punto de entrada
│       ├── api.js           # Cliente API + utilidades
│       ├── ui.js            # Lógica de interfaz
│       └── charts.js        # Gráficos Chart.js
├── sidan-frontend/          # Panel financiero ampliado con React y Vite
│   ├── src/components/      # Componentes modulares (<Card />, <Counter />, etc.)
│   └── package.json         # Proyecto Vite (mi-primera-app)
├── backend/                 # Servidor API
│   ├── server.js            # Express server
│   ├── db.js                # Pool PostgreSQL
│   ├── package.json         # Dependencias
│   ├── init_postgres_db.js  # Inicializador para la nube (PostgreSQL)
│   ├── .env.example         # Template de variables
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── routes/
│       ├── auth.js          # /api/auth (login, register)
│       └── transactions.js  # /api/transactions (CRUD)
├── render.yaml              # Config de deploy en Render
├── .gitignore               # Archivos excluidos de Git
└── README.md                # Este archivo
```

## 🖥️ Ejecución Local

### Requisitos
- Node.js >= 18
- PostgreSQL

### Pasos para el Sistema Principal (Frontend Original + Backend):
```bash
# 1. Instalar dependencias
cd backend
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales PostgreSQL

# 3. Inicializar esquema
npm run init-db

# 4. Iniciar servidor
npm start
# → Abre http://localhost:3001
```

## ☁️ Despliegue en la Nube (Render + Aiven)

1. **Base de datos**: Crear servicio PostgreSQL gratuito en [Aiven](https://aiven.io)
2. **Inicializar schema**: `npm run init-db` con las credenciales de Aiven
3. **Deploy**: Conectar este repo a [Render](https://render.com) y configurar variables de entorno

## 📊 Funcionalidades del Sistema Principal

- ✅ Registro e inicio de sesión seguros (JWT)
- ✅ CRUD de transacciones (ingresos y gastos)
- ✅ Dashboard con métricas en tiempo real
- ✅ Gráficos: evolución del saldo, distribución mensual, barras comparativas
- ✅ Multi-moneda (USD, EUR, PEN, MXN)
- ✅ Análisis de salud financiera
- ✅ Diseño responsive y accesible

## Panel financiero integrado

La interfaz principal conserva sus gráficos, formularios, historial y análisis.
Su dashboard incorpora un panel React con el usuario autenticado, los últimos
movimientos y actualización manual o automática cada 30 segundos mientras la
página está visible. `/react/` ofrece el panel ampliado con métricas por mes,
selector de moneda y enlaces a las funciones existentes. Conserva el sistema visual original: utiliza su misma hoja de estilos, tarjetas, navegación y temas claro/oscuro.

Ambas interfaces comparten el cliente API, la sesión, los cálculos y las
preferencias de tema y moneda. Los importes proceden de la cuenta del usuario;
no se muestran saldos de ejemplo. La sesión expirada oculta los datos y ofrece
el acceso al sistema principal. Los errores de conexión conservan la última
actualización correcta y permiten reintentar.

Vite genera dos entradas y un manifiesto público en `/react/manifest.json`.
El cargador del dashboard original resuelve los bundles y estilos desde ese
manifiesto sin cargar los estilos globales del panel ampliado. Si el bundle
no está disponible, las funciones originales siguen accesibles.

```powershell
npm run build
npm test
npm run preview:integration
```

El último comando inicia un servidor local de comprobación en el puerto 3002
con datos de prueba, sin conexión a una base de datos. Para desarrollo con Vite:

```powershell
npm run dev:react
```

Las peticiones `/api` se redirigen al backend local del puerto 3001. Para probar
sesiones compartidas con la interfaz original, usar el servidor integrado.
El flujo de publicación a GitHub y Render se documenta en `DEPLOYMENT.md`.

## Licencia

MIT.