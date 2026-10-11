# Publicación autorizada

Conservar el estilo visual previo a la migración: reutilizar
`frontend/css/styles.css`, sus tokens, tarjetas, navegación y temas claro/oscuro.
Presentar las mejoras como funciones del producto, con datos reales y textos
orientados a la gestión financiera. Evitar contenido de demostración en la interfaz.

El usuario autoriza commit, push a GitHub y despliegue en Render tras cada mejora,
implementación o cambio solicitado, incluidos los preparativos. No pedir otra
confirmación rutinaria para publicar el trabajo terminado.

- GitHub: https://github.com/ramko09-oss/finanzasmainupgraded
- Web: https://finanzasmainupgraded.onrender.com
- Rama de producción verificada: `main`.
- Servicio Render: `srv-daist77qj5pc73beopqg`.
- Publicación: GitHub Actions llama al deploy hook; Auto-Deploy está Off.
- Render usa la raíz del repositorio, build `npm run build` y start `npm start`.

## Flujo obligatorio

1. Revisar el estado Git y los cambios previos. Implementar y validar la solicitud.
2. Revisar el diff y agregar explícitamente solo archivos de la tarea; excluir
   secretos, dependencias, builds y cambios ajenos.
3. Crear un commit descriptivo y hacer push a la rama conectada a Render.
   Usar `npm run push -- "mensaje" ruta1 ruta2` o comandos Git equivalentes.
4. Render despliega desde GitHub mediante `.github/workflows/deploy.yml` y el
   secreto `RENDER_DEPLOY_HOOK_URL`. No disparar otro hook local ni reactivar
   Auto-Deploy: el usuario autorizó el mecanismo único. Seguir `DEPLOYMENT.md`.
5. Confirmar que el commit publicado esté `live` en Render y consultar `/api/health`.
   La aceptación de un hook o una web saludable no prueba por sí sola que el nuevo
   commit esté desplegado.
6. Informar por separado del commit, push y despliegue. Si falta acceso para
   verificar, indicar qué quedó pendiente; nunca anunciar éxito sin evidencia.

No usar force push ni descartar trabajo para resolver conflictos. No usar el
vigilante `auto-push` para publicar archivos mientras la tarea sigue en curso.
Estas instrucciones precisan la regla anterior de `.agents/rules/auto_push.md`:
la rama y el despliegue deben verificarse, y no se agrega todo indiscriminadamente.
