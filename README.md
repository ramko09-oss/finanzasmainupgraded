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

## ⚛️ Complemento: Laboratorio de React con Vite (Actividades 1, 2 y 3)

Como complemento procedimental al sistema financiero, se implementó en `sidan-frontend/` la arquitectura de componentes y estado en React:

### Actividades implementadas:
- **Actividad 1:** Inicialización del proyecto React con Vite (`mi-primera-app`), dependencias y entorno.
- **Actividad 2:** Arquitectura en `src/components/` con componente funcional `<Card />` que recibe `props` (título, descripción, imagen, categoría).
- **Actividad 3:** Interactividad con el hook `useState`:
  - `<Counter />`: Contador interactivo con color condicionado según el estado (reto completado).
  - `<ThemeToggle />`: Alternancia entre modo claro y oscuro.
  - `<CurrencySelector />`: Selector interactivo de monedas.

Para correr el entorno del laboratorio React:
```bash
cd sidan-frontend
npm install
npm run dev
```

## 📄 Licencia

Proyecto académico — Universidad.
