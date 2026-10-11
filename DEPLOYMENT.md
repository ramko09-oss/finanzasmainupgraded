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
- Auto-Deploy: Off; GitHub Actions es el único responsable de solicitar despliegues.
- `.github/workflows/deploy.yml` despliega con el secreto
  `RENDER_DEPLOY_HOOK_URL`, configurado en GitHub Actions.
- El build instala dependencias de desarrollo del frontend con `--include=dev`
  para disponer de Vite aunque Render tenga `NODE_ENV=production`.
- No disparar un hook local adicional; cada push debe generar un solo despliegue.
- Webhook directo de GitHub `678441791`: desactivado reversiblemente para evitar
  que duplique el despliegue de Actions. No reactivarlo mientras se use el workflow.

`render.yaml` documenta el build y arranque desde la raíz del repositorio,
con Auto-Deploy desactivado. Las credenciales se configuran en Render.
El servicio existente usa los ajustes indicados arriba; no debe recrearse
ni importarse el blueprint para publicar una actualización. Nunca guardar
el deploy hook en código ni ejecutar la inicialización de la base de datos
como parte de un despliegue habitual.

Después de validar cada solicitud y revisar el diff:

```powershell
npm run push -- --check
npm run push -- "fix: descripción" ruta/al/archivo ruta/al/otro
```

Sin rutas, solo se confirman los archivos ya preparados en el índice. El comando
también publica commits pendientes si no hay cambios locales. No dispara un hook
local: GitHub Actions solicita el despliegue mediante el hook de Render.

Confirmar en Render el SHA publicado en estado live y comprobar `/api/health`.
Un HTTP 200/202 del hook solo confirma aceptación de la solicitud. Una web
saludable tampoco demuestra por sí sola que el nuevo commit esté desplegado.

No usar `npm run auto-push` en este flujo: publica sin esperar validación de la tarea.

Referencias: https://render.com/docs/deploys y https://render.com/docs/deploy-hooks
