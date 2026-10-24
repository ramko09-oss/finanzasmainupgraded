# Entregables del examen de SIDAA Finanzas

## Acceso al producto y versión evaluada

- Aplicación React pública: https://finanzasmainupgraded.onrender.com/
- Repositorio: https://github.com/ramko09-oss/finanzasmainupgraded
- Rama: `main`.
- Commit de la aplicación evaluada y de las evidencias: [`f736e2eaf5acad9194d0135eb8b2261534ee3139`](https://github.com/ramko09-oss/finanzasmainupgraded/commit/f736e2eaf5acad9194d0135eb8b2261534ee3139).
- Las actualizaciones posteriores de esta entrega organizan la documentación; no cambian ese código de la aplicación.

## Documentos y exposición

1. [Informe técnico grupal completo](INFORME_TECNICO.pdf): problema, usuarios, alcance, arquitectura, React, responsive, accesibilidad, pruebas, métricas, despliegue, aportes y mejoras futuras.
2. [Video grupal](https://youtu.be/FHAjr41D-Qc), publicado por el equipo. La presentación inicial describe seis integrantes y sus aportes; la grabación expone capturas del producto, código y resultados.
3. [Instalación y ejecución local](INSTALACION.md), incluidos configuración de PostgreSQL, compilación, inicio y comprobación.

## Evidencias del producto y de las pruebas

Las evidencias siguientes corresponden a la ejecución documentada del 18 de octubre de 2026 sobre Render. Son resultados conservados de esa ejecución, no pruebas nuevas realizadas al actualizar la documentación.

- MVP: [dashboard](evidencias/vista-dashboard.png), [registro](evidencias/vista-registrar.png) e [historial](evidencias/vista-historial.png).
- Responsive: [móvil 390 × 844](evidencias/viewport-movil.png) y [tableta 768 × 1024](evidencias/viewport-tableta.png). Son tamaños emulados.
- Accesibilidad manual: [foco al usar Tab](evidencias/12-foco-teclado.png). Procedimiento: abrir el acceso y avanzar con Tab hasta el control anterior del carrusel. Resultado: borde de foco visible. Es una comprobación puntual; no acredita el recorrido completo ni una prueba con lector de pantalla.
- Persistencia: [nueva sesión](evidencias/persistencia.png) y [limpieza de movimientos de prueba](evidencias/limpieza.png).
- [Registro de los 18 casos funcionales de Render](evidencias/pruebas-render.json) y [salida de las 15 pruebas automatizadas locales](evidencias/pruebas-automatizadas.txt).
- Lighthouse: [reporte HTML de las categorías evaluadas](evidencias/lighthouse-publico-mobile.report.html), [JSON de las categorías evaluadas](evidencias/lighthouse-publico-mobile.report.json) y [resumen gráfico](evidencias/14-lighthouse.png). Descargue el HTML y ábralo en el navegador. El extracto contiene rendimiento, accesibilidad, buenas prácticas y SEO; conserva las puntuaciones y mediciones originales y no representa una nueva ejecución.

## Métricas y hallazgos con plan de mejora

Lighthouse evaluó el acceso público en móvil emulado: rendimiento **76**, accesibilidad **93**, buenas prácticas **100** y SEO **100**. FCP 2,8 s; LCP 4,6 s; TBT 0 ms; CLS 0. La medición no representa todas las vistas autenticadas.

| Hallazgo observado | Corrección planificada | Cómo comprobarla |
| --- | --- | --- |
| Texto secundario oscuro con contraste 3,72:1, inferior al 4,5:1 esperado | Ajustar los colores del texto conservando los temas | Repetir Lighthouse y revisar claro y oscuro |
| Imagen de 182 289 bytes con ahorro estimado de 169 109 bytes | Comprimir, adaptar dimensiones y usar WebP o AVIF | Comparar transferencia y LCP en una nueva medición |
| Recursos CSS y fuentes bloquean el renderizado | Revisar estilos críticos y carga de fuentes | Repetir la auditoría con el mismo perfil |
| Recorte del importe en Resumen a 1280 px | Ajustar el tamaño y la distribución de la tarjeta | Comprobar importes grandes y varios anchos |

Estas son mejoras pendientes, no correcciones de la aplicación realizadas con esta actualización documental. El requisito admite una corrección o un plan de mejora explicado.

## Arquitectura y código de referencia

Una sola aplicación React y Vite se sirve desde `/`; Express proporciona la API y accede a PostgreSQL. `App` coordina sesión, preferencias y navegación; `FinanceViews` reúne las vistas financieras y `Card` reutiliza su presentación. `Auth` usa estado para alternar formularios; los eventos actualizan selecciones y envían operaciones. Los efectos sincronizan solicitudes, intervalos, título y eventos de ventana, con su limpieza al desmontar.

- [Componentes, props y estado](../REACT-VERIFICATION.md).
- [Efectos y ciclo de vida](../EFFECTS.md).
- [Procedimiento de despliegue](../../DEPLOYMENT.md).

## Aportes descritos por el equipo

La fuente de esta distribución es la presentación inicial del video (00:03–00:51), que sustituye la asignación genérica del borrador.

| Integrante | Aporte declarado en la exposición |
| --- | --- |
| Franco Valentino Atencia Cabrera | Coordinación, revisión de documentación y seguimiento de actividades |
| Edward David Villanueva Martinez | Interfaz, accesibilidad y pruebas |
| Joseph Adrian Velasquez Rivas | Arquitectura y diseño de la interfaz |
| Kevin Isaac Ramirez Alayo | Backend, validaciones y pruebas del sistema |
| Diego Reydhel Gamarra de la Cruz | Funciones financieras y gestión de movimientos |
| Alexis Sandro Sanchez Ramos | Integración de componentes y funcionalidades |

Los presupuestos se mantienen como función futura en el alcance técnico, aunque se mencionen junto a la gestión financiera al presentar los aportes.
