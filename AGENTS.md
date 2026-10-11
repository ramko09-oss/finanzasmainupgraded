# Publicación autorizada

El usuario autoriza commit, push a GitHub y despliegue en Render tras cada mejora,
implementación o cambio solicitado, incluidos los preparativos. No pedir otra
confirmación rutinaria para publicar el trabajo terminado.

- GitHub: https://github.com/ramko09-oss/finanzasmainupgraded
- Web: https://finanzasmainupgraded.onrender.com
- Confirmar la rama conectada al servicio antes de publicar.

## Flujo obligatorio

1. Revisar el estado Git y los cambios previos. Implementar y validar la solicitud.
2. Revisar el diff y agregar explícitamente solo archivos de la tarea; excluir
   secretos, dependencias, builds y cambios ajenos.
3. Crear un commit descriptivo y hacer push a la rama conectada a Render.
   Usar `npm run push -- "mensaje" ruta1 ruta2` o comandos Git equivalentes.
4. Render despliega desde GitHub. Usar auto-deploy o un único deploy hook,
   evitando dos despliegues por el mismo cambio. Seguir `DEPLOYMENT.md`.
5. Confirmar que el commit publicado esté `live` en Render y consultar `/api/health`.
   La aceptación de un hook o una web saludable no prueba por sí sola que el nuevo
   commit esté desplegado.
6. Informar por separado del commit, push y despliegue. Si falta acceso para
   verificar, indicar qué quedó pendiente; nunca anunciar éxito sin evidencia.

No usar force push ni descartar trabajo para resolver conflictos. No usar el
vigilante `auto-push` para publicar archivos mientras la tarea sigue en curso.
Estas instrucciones precisan la regla anterior de `.agents/rules/auto_push.md`:
la rama y el despliegue deben verificarse, y no se agrega todo indiscriminadamente.
