# Frontend de SIDAA Finanzas

Interfaz React + Vite de la aplicación financiera. Mantiene la navegación, tarjetas y temas del sistema, y obtiene los datos mediante la API de Express.

## Organización

- `src/components/`: componentes compartidos, como `Card`.
- `src/views/`: formularios, pantallas y sus estructuras visuales.
- `src/hooks/`: sesión, sincronización de datos y preferencias.
- `src/api.js`: peticiones HTTP, autenticación y cálculos financieros compartidos.
- `src/finance.js`: filtros, categorías y periodos.
- `src/charts.js`: gráficos y liberación de sus instancias.
- `src/styles.css` y `src/App.css`: sistema visual y ajustes de la aplicación.
- `public/img/`: logotipos e imágenes de acceso.

## Comandos

Desde esta carpeta:

```powershell
npm ci
npm run dev
npm run build
npm run lint
```

El servidor Vite usa normalmente el puerto 5173 y redirige `/api` al backend del puerto 3001. Para ejecutar la aplicación integrada, usa `npm run build` y `npm start` desde la raíz.

El build se genera en `dist/`, que está excluido de Git. Express lo sirve desde `/`; no existe una segunda aplicación pública.

Las instrucciones de configuración, pruebas y publicación están en el [README principal](../README.md) y en [DEPLOYMENT.md](../DEPLOYMENT.md).
