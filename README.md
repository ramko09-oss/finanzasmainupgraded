# 💰 Sistema de Gestión Financiera

Sistema web para gestión de finanzas personales con registro de ingresos y gastos, gráficos interactivos y análisis financiero.

## 🚀 Tecnologías

| Capa | Tecnología |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (ES Modules), Chart.js |
| **Backend** | Node.js, Express.js |
| **Base de datos** | MySQL 8.0+ |
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
│   ├── db.js                # Pool MySQL (local/cloud)
│   ├── package.json         # Dependencias
│   ├── init_cloud_db.js     # Inicializador para la nube
│   ├── schema_completo.sql  # Schema SQL completo
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
- MySQL 8.0+

### Pasos
```bash
# 1. Instalar dependencias
cd backend
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales MySQL locales

# 3. Crear base de datos
mysql -u root -p < schema_completo.sql

# 4. Iniciar servidor
npm start
# → Abre http://localhost:3001
```

## ☁️ Despliegue en la Nube (Render + Aiven)

1. **Base de datos**: Crear servicio MySQL gratuito en [Aiven](https://aiven.io)
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

## ⚛️ Migración a React con Vite (Actividades 1, 2 y 3)

Se ha iniciado un proceso de migración de la interfaz estática original hacia una arquitectura moderna basada en componentes utilizando React y Vite en el directorio `mi-primera-app/`.

### Actividades implementadas:
- **Actividad 1:** Inicialización del proyecto React con Vite (template react), instalación de dependencias y configuración del entorno de desarrollo.
- **Actividad 2:** Definición de una arquitectura de componentes en `src/components`. Migración del diseño HTML a componentes funcionales como `<Card />`, pasando información estructurada mediante `props` (título, descripción, imagen, categoría).
- **Actividad 3:** Implementación de interactividad local utilizando el hook `useState`. Se crearon componentes dinámicos con renderizado condicional:
  - `<Counter />`: Sistema de "Likes" con condicionamiento de estilos según el estado.
  - `<ThemeToggle />`: Alternancia entre modo claro y oscuro interactivo.
  - `<CurrencySelector />`: Simulador de selector de monedas con cambio visual según el estado.

Para correr el entorno de desarrollo en React:
```bash
cd mi-primera-app
npm install
npm run dev
```

## 📄 Licencia

Proyecto académico — Universidad.
