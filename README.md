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
├── frontend/                # Interfaz de usuario
│   ├── index.html           # Página principal (SPA)
│   ├── css/styles.css       # Estilos con variables CSS
│   └── js/
│       ├── app.js           # Punto de entrada
│       ├── api.js           # Cliente API + utilidades
│       ├── ui.js            # Lógica de interfaz
│       └── charts.js        # Gráficos Chart.js
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

### Pasos
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

## 📊 Funcionalidades

- ✅ Registro e inicio de sesión seguros (JWT)
- ✅ CRUD de transacciones (ingresos y gastos)
- ✅ Dashboard con métricas en tiempo real
- ✅ Gráficos: evolución del saldo, distribución mensual, barras comparativas
- ✅ Multi-moneda (USD, EUR, PEN, MXN)
- ✅ Análisis de salud financiera
- ✅ Diseño responsive y accesible

## ⚛️ Migración a React con Vite (Laboratorio Sesión 05)

Se ha migrado la interfaz estática original hacia una arquitectura modular basada en componentes funcionales utilizando React 19 y Vite dentro de `sidan-frontend/` (configurado internamente como `mi-primera-app`).

### Actividades implementadas:
- **Actividad 1 (Inicio con Vite):** Proyecto Vite con template React, dependencias configuradas y servidor de desarrollo.
- **Actividad 2 (Arquitectura de Componentes):** Componentes funcionales modulares en `sidan-frontend/src/components/`:
  - `<Card />`: Componente reutilizable con `props` (`titulo`, `descripcion`, `imagen`, `categoria`).
  - `<MetricCard />`: Tarjeta de métricas con `props` de variante y valor.
  - `<Sidebar />`: Navegación principal con `props` de callback `onNavigate`.
- **Actividad 3 (Interactividad con `useState`):**
  - `<Card />`: Sistema de "Likes" interactivo con cambio visual de estado.
  - `<Counter />`: Contador dinámico (+, -, reset) con estilo condicional dinámico (verde en positivo, rojo en negativo).
  - `<ThemeToggle />`: Alternancia entre modo claro y modo oscuro en tiempo real.
  - `<CurrencySelector />`: Selector de moneda (USD, EUR, PEN, MXN) con actualización visual instantánea.

### 💻 Cómo ejecutar localmente:
```bash
# Opción directa desde la raíz:
npm install
npm run dev      # Inicia el entorno React + Vite en http://localhost:5173

# O entrando a la carpeta de React:
cd sidan-frontend
npm install
npm run dev
```

### 🌐 Despliegue en Producción (Render):
El proyecto compila el frontend React a `backend/public/` para que Express lo sirva de forma unificada:
```bash
npm run build    # Compila React y prepara el backend
npm start        # Inicia el servidor de producción en el puerto 3001
```

## 📄 Licencia y Entrega
- **Repositorio:** [https://github.com/ramko09-oss/finanzasmainupgraded](https://github.com/ramko09-oss/finanzasmainupgraded)
- **Proyecto académico — Universidad Autónoma del Perú.**
