# GitHub y Render

Repositorio: https://github.com/ramko09-oss/finanzasmainupgraded
Web: https://finanzasmainupgraded.onrender.com

La descarga ZIP inicialmente no tenía `.git`. Recuperar el historial existente
antes de publicar; no crear un historial independiente ni usar force push.
Autenticar Git mediante Git Credential Manager o SSH; nunca versionar tokens.

En el servicio existente de Render, confirmar repositorio, rama y auto-deploy.
`render.yaml` declara autoDeploy, pero no demuestra su configuración real.
Preferir On Commit, o After CI Checks Pass si hay CI configurado.

Alternativa: guardar el deploy hook en el secreto GitHub Actions
`RENDER_DEPLOY_HOOK_URL` y usar `.github/workflows/deploy.yml`. Desactivar
auto-deploy en Render en ese caso para evitar despliegues duplicados. Ajustar el
filtro del workflow si la rama desplegada no es main. No guardar el hook en código.

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
