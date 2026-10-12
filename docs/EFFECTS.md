# Efectos y ciclo de vida de la interfaz

La aplicación sincroniza recursos externos a React mediante efectos pequeños,
con dependencias explícitas y una limpieza asociada a cada montaje.

| Efecto | Dependencias | Motivo y limpieza |
| --- | --- | --- |
| `Timer` | `[]` | El intervalo pertenece a una instancia del componente. Se crea al montar y se cancela con `clearInterval` al ocultarlo, cambiar de vista o cerrar sesión. No depende de `seconds`: incluirlo reiniciaría el intervalo cada segundo. |
| `useViewport` | `[]` | Se instala un único listener `resize` por instancia. El manejador consulta el tamaño actual de `window` y actualiza el estado; no lee un estado anterior de tamaño. La limpieza remueve exactamente ese mismo manejador. |
| `useDocumentTitle` | `[title, enabled]` | El documento solo se modifica cuando cambia el título derivado del estado o su activación. La limpieza restaura el título anterior. No se incluyen búsquedas u otros estados que no forman parte del título. |
| `UserList` | `[]` | La URL externa es una constante de módulo y se consulta una vez por montaje. Se utiliza `AbortController`; al desmontar se cancela la solicitud y se descartan respuestas o errores posteriores a la cancelación. |
| Preferencias visuales | `[theme]` | El atributo del documento se sincroniza cuando cambia el tema, sin volver a ejecutarse por cada cambio de una vista. |

## Uso en la aplicación

El botón **Mostrar tiempo** permite consultar los segundos transcurridos en la
vista actual. **Ocultar tiempo** desmonta `Timer`; al volver a mostrarlo comienza
desde cero. Su `key={view}` también provoca una instancia nueva al cambiar de
apartado. El título identifica el apartado y la cantidad de movimientos; en el
acceso distingue inicio de sesión y creación de cuenta. El ancho de pantalla se
guarda en estado y determina la variante compacta o amplia del contenedor.

`UserList` utiliza [JSONPlaceholder](https://jsonplaceholder.typicode.com/),
una API pública de referencia. Presenta carga, errores HTTP o de formato y los
usuarios recibidos. No envía credenciales de SIDAA. Como sus datos son ficticios,
se muestra únicamente en la herramienta local de inspección, no en la web de
producción ni como si se tratara de cuentas registradas.

## Verificación y evidencias

La comprobación automatizada monta los componentes reales con React y un DOM
de pruebas, incluyendo `StrictMode`:

- Un único intervalo activo de `Timer`, incluso después del montaje de comprobación de `StrictMode`; cero después del desmontaje y estado reiniciado al volver a mostrarlo.
- Actualización del tamaño y eliminación del mismo listener `resize`.
- Actualización del título y restauración al desmontar.
- Estados de carga, éxito y error HTTP de `UserList`, cancelación de solicitudes y descarte de respuestas tardías.

Las capturas muestran React DevTools oficial y un registro real de la consola y
los recursos de la ventana inspeccionada. Este registro captura `console.error`,
`console.warn`, errores globales y promesas rechazadas; no sustituye al panel
nativo de consola de Chrome. El inspector no suprime esos mensajes.
Los intervalos de infraestructura de Vite se muestran por separado de los
intervalos de un segundo del temporizador, para no confundirlos con una fuga.

- [Temporizador activo](evidence/useeffect/01-temporizador-activo.jpg).
- [Temporizador desmontado](evidence/useeffect/02-temporizador-desmontado.jpg).
- [Usuarios recibidos de la API externa](evidence/useeffect/03-usuarios-externos.jpg).
- [Tamaño y título sincronizados](evidence/useeffect/04-resize-titulo.jpg).
- [Vista desmontada y listener retirado](evidence/useeffect/05-limpieza-completa.jpg).
- [Registro de errores y advertencias de la aplicación principal](evidence/useeffect/browser-console.json): sin mensajes durante la comprobación de acceso, navegación y temporizador.

Estas comprobaciones acreditan la limpieza de los recursos probados; no son una
garantía de ausencia de cualquier fuga de memoria en todo el programa.

## Reproducir

Sigue la instalación y los tres servidores descritos en
[Componentes y estado](REACT-VERIFICATION.md). En el inspector abre
`http://127.0.0.1:5174/?effects=1`:

1. Muestra y oculta el temporizador. Observa su estado, los intervalos y los ticks.
2. Cambia el tamaño de la ventana; comprueba el tamaño y el título del documento.
3. Carga el directorio externo y observa `UserList` y sus estados en DevTools.
4. Oculta la vista sincronizada; el listener `resize` y el temporizador se retiran.
5. Para verificar la consola nativa, abre las herramientas del navegador y su pestaña Console, recarga y repite las acciones anteriores.

El entorno de pruebas utiliza respuestas simuladas para verificar fallos y
cancelaciones de forma reproducible. La captura del directorio corresponde a
una petición real a JSONPlaceholder. Para repetir las pruebas: `npm test`.
