# Regla: Push automático tras cada cambio solicitado

Cada vez que el usuario solicite realizar modificaciones, correcciones, nuevas funcionalidades o cambios en el código de este proyecto:
1. Aplica los cambios requeridos en los archivos correspondientes.
2. Verifica que no haya errores de compilación o sintaxis.
3. Realiza el commit y el push inmediatamente al repositorio de GitHub:
   ```bash
   git add -A
   git commit -m "feat/fix: <descripción concisa del cambio realizado>"
   git push origin main
   ```
4. Informa al usuario sobre los cambios realizados y confirma que el push a GitHub (y el consecuente despliegue en Render) se completó con éxito.
