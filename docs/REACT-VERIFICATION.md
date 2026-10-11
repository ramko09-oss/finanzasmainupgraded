# Componentes y estado de la interfaz

La aplicación usa React + Vite, JSX y componentes separados. `src/components/Card.jsx`
recibe `titulo`, `descripcion` e `imagen`, además de variantes visuales y contenido
mediante `children`. Se reutiliza en las cuatro métricas del dashboard y en su
bienvenida cuando todavía no hay movimientos. Conserva las clases y los importes
del sistema existente; una tarjeta sin imagen no reserva un espacio vacío.

## Evidencia de React DevTools

Las capturas se obtuvieron con **React DevTools oficial**, mediante su paquete
[`react-devtools-inline`](https://github.com/react/react/blob/main/packages/react-devtools-inline/README.md).
Muestran el código de la aplicación ejecutándose en desarrollo y cambios de
estado provocados con sus controles. No son una recreación del inspector.
Se utilizó el servidor local de prueba, sin consultar cuentas ni datos reales.

| Captura | Componente y evidencia |
| --- | --- |
| [Acceso](evidence/react-devtools/01-acceso.jpg) | `Auth`: primer hook State = `form-login`; solo está montado el acceso. |
| [Crear cuenta](evidence/react-devtools/02-crear-cuenta.jpg) | El mismo hook cambia a `form-register`; cambia el formulario y la clase de la pestaña. |
| [Tema oscuro](evidence/react-devtools/03-tema-oscuro.jpg) | `App → Theme → Preference`: State = `dark`. |
| [Tema claro](evidence/react-devtools/04-tema-claro.jpg) | El control de tema actualiza el mismo State a `light` y cambia la apariencia. |
| [Tarjeta de saldo](evidence/react-devtools/05-card-saldo.jpg) | `Card` recibe título y descripción mediante props; mantiene el saldo del servidor de prueba. |
| [Bienvenida](evidence/react-devtools/06-card-bienvenida.jpg) | `Card` recibe `titulo`, `descripcion` e `imagen`; se comprueba también el dashboard vacío. |

Los nombres y números que presenta DevTools pueden variar según su versión;
en el código, los estados anteriores corresponden a `tab` en `Auth` y a la
preferencia de tema gestionada con `useState` en `usePreferences`.

## Reproducir la inspección

Primero ejecuta `npm run build` desde la raíz. Abre tres terminales:

1. Raíz del repositorio: `npm run preview:integration` (API local de prueba en 3002).
2. `sidan-frontend`: `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`.
3. `tools/react-inspector`: `npm ci` y luego `npm run dev`.

Abre `http://127.0.0.1:5174`. Selecciona `Auth` en el árbol, cambia las pestañas
y observa el primer State. Selecciona `App`, expande `Theme → Preference`, cambia
el tema y observa su valor. Para inspeccionar `Card`, inicia sesión con un correo
y contraseña de prueba en este entorno local; el servidor de comprobación usa
datos ficticios y no verifica credenciales contra una base de datos.

El inspector tiene dependencias propias: el runtime experimental que exige
DevTools se utiliza en su panel, mientras la aplicación se carga desde su
servidor Vite habitual. No se instala en el frontend de producción, no se
importa desde la aplicación y no se incluye en el build ni en la web publicada.

## Comprobaciones

- Compilación con Vite y análisis con Oxlint.
- Pruebas de sesión, conversión de moneda, fechas, filtros y rutas de Express.
- Dashboard con saldo 750 USD, ingresos 1000 USD y gastos 250 USD en la prueba local.
- Exclusión entre acceso y registro, cambio de tema y props de las tarjetas en DevTools.
- Dashboard vacío: importes en cero, imagen de marca y enlace funcional para registrar.

Las capturas son evidencia estática de dos estados sucesivos. Para observar el
cambio en vivo, utiliza el inspector siguiendo los pasos anteriores.
