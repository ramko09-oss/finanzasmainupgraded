# GitHub y Render

Repositorio: https://github.com/ramko09-oss/finanzasmainupgraded
Web: https://finanzasmainupgraded.onrender.com

La carpeta ya tiene el historial de GitHub y `origin/main` como upstream.
No crear un historial independiente ni usar force push.
Autenticar Git mediante Git Credential Manager o SSH; nunca versionar tokens.

## Configuración verificada el 11 de octubre de 2026

- Servicio existente: `srv-daist77qj5pc73beopqg` (finanzasmainupgraded).
- Rama: `main`; Root Directory vacío (raíz del repositorio).
- Build Command: `npm run build`; Start Command: `npm start`.
- Auto-Deploy: Off, autorizado explícitamente por el usuario.
- `.github/workflows/deploy.yml` despliega con el secreto
  `RENDER_DEPLOY_HOOK_URL`, creado en GitHub Actions con autorización explícita.
- El build instala dependencias de desarrollo del frontend con `--include=dev`
  para disponer de Vite aunque Render tenga `NODE_ENV=production`.
- No disparar un hook local adicional; cada push debe generar un solo despliegue.

`render.yaml` es un blueprint alternativo que usa `backend` como raíz; no está
sincronizado con todos los ajustes del servicio existente. No crear ni recrear
el servicio desde ese archivo para publicar cambios. El servicio existente
usa los ajustes indicados arriba. Nunca guardar el deploy hook en código.

Después de validar cada solicitud y revisar el diff:

```powershell
npm run push -- --check
npm run push -- "fix: descripción" ruta/al/archivo ruta/al/otro
```

Sin rutas, solo se confirman los archivos ya preparados en el índice. El comando
también publica commits pendientes si no hay cambios locales. No dispara un hook
local: el despliegue corresponde a Render auto-deploy o GitHub Actions.

Confirmar en Render el SHA publicado en estado live y comprobar `/api/health`.
Un HTTP 200/202 del hook solo confirma aceptación de la solicitud. Una web
saludable tampoco demuestra por sí sola que el nuevo commit esté desplegado.

No usar `npm run auto-push` en este flujo: publica sin esperar validación de la tarea.

Referencias: https://render.com/docs/deploys y https://render.com/docs/deploy-hooks
