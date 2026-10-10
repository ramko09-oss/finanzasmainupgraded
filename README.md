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
├── sidan-frontend/          # Complemento: Laboratorio React con Vite (Actividades 1, 2 y 3)
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

## ⚛️ Módulo React Integrado (Sesión 05 y Sesión 06)

El proyecto evoluciona incorporando React 19 y Vite de manera integrada en el proyecto existente (sin reemplazar el sistema original, accesible en `/react/` o de forma independiente en `sidan-frontend/`):

### 📋 Requisitos Implementados de la Sesión 06:
1. **Componente funcional reutilizable:** `<Card />` y `<MetricCard />` estructurados en `src/components/`.
2. **Componente `Saludo` con `props`:** `<Saludo />` recibe `nombre`, `rol`, `mensaje` y `ultimoAcceso`.
3. **Estado interno con `useState`:**
   - `<Counter />`: Conteo interactivo con condicionado dinámico de color.
   - `<Card />`: Sistema de likes por cada tarjeta.
   - `<AsyncDataLoader />`: Gestión de estados de carga, datos recibidos y errores.
   - `<AutoRefreshCounter />`: Estado de segundos transcurridos y estado activo/pausado.
4. **Eventos de usuario (`onClick`):** Botones de recarga asincrónica, pausar/reanudar temporizador, reiniciar segundero, dar likes y cambio de tema.
5. **Composición de componentes:** El dashboard principal compone armónicamente `<Saludo />`, `<AutoRefreshCounter />`, `<AsyncDataLoader />`, `<MetricCard />` y la cuadrícula de `<Card />`.
6. **Efecto con `useEffect` y `setTimeout`:** `<AsyncDataLoader />` simula una petición de red con retraso de 1.8 segundos.
7. **Contador automático con `setInterval`:** `<AutoRefreshCounter />` actualiza los segundos de sesión activa cada 1000ms.
8. **Funciones de limpieza implementadas:**
   - `clearTimeout(timerId)` en `<AsyncDataLoader />` para prevenir fugas si el componente se desmonta antes de finalizar la carga.
   - `clearInterval(intervalId)` en `<AutoRefreshCounter />` para cancelar el intervalo al pausar o desmontar.
9. **Presentación visual coherente:** Utiliza la misma paleta y tokens de diseño de SIDAN Finanzas (modo claro y oscuro, soporte 2K).

### 💻 Cómo ejecutar:
```bash
# 1. Sistema Completo Integrado (Backend + Frontend Original en / + Módulo React en /react):
npm start
# → Abre http://localhost:3001/ para el sistema principal
# → Abre http://localhost:3001/react/ para el módulo React

# 2. Entorno de Desarrollo Exclusivo de React (Vite con React DevTools):
cd sidan-frontend
npm install
npm run dev
# → Abre http://localhost:5173/
```

## 📄 Licencia

Proyecto académico — Universidad Autónoma del Perú.
